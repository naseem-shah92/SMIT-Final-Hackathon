import { memoryStore, supabase } from '../config/database.js';
import { calculateHaversineDistance } from '../utils/haversine.js';
import { AuditService } from './audit.service.js';

export class AttendanceService {
  /**
   * Records employee check-in.
   * Server stamps the time!
   * Enforces 1 record per employee per day (second check-in returns 409 Conflict).
   * Validates geofence if lat/lng are submitted.
   */
  static async checkIn(employeeId, { latitude, longitude, accuracy, face_verified = false, source = 'web' } = {}, currentUser) {
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if employee exists
    const employee = memoryStore.employees.find(e => e.id === employeeId || e.code === employeeId);
    if (!employee) {
      const err = new Error('Employee record not found');
      err.statusCode = 404;
      throw err;
    }

    // 1. One record per employee per day rule (second check-in = 409)
    const existing = memoryStore.attendance.find(
      a => a.employee_id === employee.id && a.date === todayStr
    );
    if (existing) {
      const err = new Error(`Attendance already marked for today (${todayStr}) at ${existing.check_in}. Second check-in is not permitted.`);
      err.statusCode = 409;
      throw err;
    }

    // 2. Geofence verification
    const settings = memoryStore.org_settings;
    let distanceToOffice = null;
    let locationVerified = false;

    if (latitude !== undefined && longitude !== undefined && settings.office_lat && settings.office_lng) {
      distanceToOffice = calculateHaversineDistance(
        Number(latitude),
        Number(longitude),
        Number(settings.office_lat),
        Number(settings.office_lng)
      );

      const allowedRadius = settings.office_radius_meters || 150;
      if (distanceToOffice > allowedRadius) {
        const err = new Error(`Location check failed: You are ${distanceToOffice}m away from the office. Maximum allowed radius is ${allowedRadius}m.`);
        err.statusCode = 422;
        throw err;
      }
      locationVerified = true;
    }

    // 3. Status determination based on server time
    const now = new Date();
    const serverTimeStr = now.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"
    const lateCutoff = settings.office_start ? '09:15' : '09:15';

    // If check-in is after 09:15 -> status = 'late', else 'present'
    const status = serverTimeStr > lateCutoff ? 'late' : 'present';

    const attendanceRecord = {
      id: `att-${Date.now()}`,
      employee_id: employee.id,
      employee_name: employee.name,
      employee_code: employee.code,
      department: employee.department,
      date: todayStr,
      check_in: serverTimeStr,
      check_out: null,
      work_hours: 0,
      status, // 'present' | 'late' | 'missing_checkout'
      source: source || (face_verified ? 'camera' : 'web'),
      face_verified: Boolean(face_verified),
      location_verified: locationVerified,
      distance_meters: distanceToOffice,
      created_at: now.toISOString()
    };

    memoryStore.attendance.push(attendanceRecord);

    if (supabase) {
      try {
        await supabase.from('attendance').insert([attendanceRecord]);
      } catch (err) {
        console.warn('[AttendanceService] Supabase attendance sync warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'CHECK_IN',
      entityType: 'ATTENDANCE',
      entityId: attendanceRecord.id,
      afterState: attendanceRecord
    });

    return attendanceRecord;
  }

  /**
   * Records employee check-out.
   * Stamped by server. Evaluates total work hours.
   * If work hours < 5h -> status marked as 'half_day'.
   */
  static async checkOut(employeeId, currentUser) {
    const todayStr = new Date().toISOString().split('T')[0];

    const record = memoryStore.attendance.find(
      a => (a.employee_id === employeeId || a.employee_code === employeeId) && a.date === todayStr
    );

    if (!record) {
      const err = new Error('No check-in record found for today. Please check in first.');
      err.statusCode = 404;
      throw err;
    }

    if (record.check_out) {
      const err = new Error(`Already checked out today at ${record.check_out}`);
      err.statusCode = 409;
      throw err;
    }

    const now = new Date();
    const checkOutTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    record.check_out = checkOutTimeStr;

    // Calculate work hours
    const [inHours, inMins] = record.check_in.split(':').map(Number);
    const [outHours, outMins] = checkOutTimeStr.split(':').map(Number);
    const inTotalMins = inHours * 60 + inMins;
    const outTotalMins = outHours * 60 + outMins;
    const diffMinutes = Math.max(0, outTotalMins - inTotalMins);
    const workHours = Number((diffMinutes / 60).toFixed(2));
    record.work_hours = workHours;

    // Rule: Half day if under 5 hours
    const minHours = memoryStore.org_settings.half_day_hours || 5;
    if (workHours < minHours) {
      record.status = 'half_day';
    }

    if (supabase) {
      try {
        await supabase.from('attendance').update(record).eq('id', record.id);
      } catch (err) {
        console.warn('[AttendanceService] Supabase checkout update warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'CHECK_OUT',
      entityType: 'ATTENDANCE',
      entityId: record.id,
      afterState: record
    });

    return record;
  }

  /**
   * Retrieves attendance records with scope filtering
   */
  static async getAttendance({ employeeId = null, date = null, department = null, page = 1, limit = 50 } = {}) {
    let records = [...memoryStore.attendance];

    if (employeeId) {
      records = records.filter(a => a.employee_id === employeeId || a.employee_code === employeeId);
    }

    if (date) {
      records = records.filter(a => a.date === date);
    }

    if (department && department !== 'all') {
      records = records.filter(a => (a.department || '').toLowerCase() === department.toLowerCase());
    }

    records.sort((a, b) => new Date(b.date + ' ' + (b.check_in || '00:00')) - new Date(a.date + ' ' + (a.check_in || '00:00')));

    const total = records.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = records.slice(startIndex, startIndex + Number(limit));

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      attendance: paginated
    };
  }

  /**
   * Requests an attendance correction (Employee)
   */
  static async requestCorrection({ employeeId, date, proposed_check_in, proposed_check_out, reason }, currentUser) {
    const correction = {
      id: `corr-${Date.now()}`,
      employee_id: employeeId,
      employee_name: currentUser.name,
      date,
      proposed_check_in,
      proposed_check_out: proposed_check_out || null,
      reason,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    memoryStore.attendance_corrections.push(correction);

    return correction;
  }

  /**
   * Approves or rejects an attendance correction (HR)
   */
  static async decideCorrection(correctionId, { status, hr_comment }, currentUser) {
    const correction = memoryStore.attendance_corrections.find(c => c.id === correctionId);
    if (!correction) {
      const err = new Error('Correction request not found');
      err.statusCode = 404;
      throw err;
    }

    correction.status = status; // 'approved' or 'rejected'
    correction.hr_comment = hr_comment || '';
    correction.decided_by = currentUser.name;
    correction.decided_at = new Date().toISOString();

    // If approved, update or create the attendance record
    if (status === 'approved') {
      let att = memoryStore.attendance.find(
        a => a.employee_id === correction.employee_id && a.date === correction.date
      );

      if (att) {
        att.check_in = correction.proposed_check_in;
        if (correction.proposed_check_out) att.check_out = correction.proposed_check_out;
        att.status = att.check_in > '09:15' ? 'late' : 'present';
        att.corrected = true;
      } else {
        const emp = memoryStore.employees.find(e => e.id === correction.employee_id);
        att = {
          id: `att-${Date.now()}`,
          employee_id: correction.employee_id,
          employee_name: emp ? emp.name : correction.employee_name,
          employee_code: emp ? emp.code : '',
          department: emp ? emp.department : '',
          date: correction.date,
          check_in: correction.proposed_check_in,
          check_out: correction.proposed_check_out || null,
          status: correction.proposed_check_in > '09:15' ? 'late' : 'present',
          source: 'correction',
          corrected: true,
          created_at: new Date().toISOString()
        };
        memoryStore.attendance.push(att);
      }
    }

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `CORRECTION_${status.toUpperCase()}`,
      entityType: 'ATTENDANCE_CORRECTION',
      entityId: correctionId,
      afterState: correction
    });

    return correction;
  }

  static async getCorrections({ employeeId = null, status = null } = {}) {
    let list = [...memoryStore.attendance_corrections];
    if (employeeId) {
      list = list.filter(c => c.employee_id === employeeId);
    }
    if (status && status !== 'all') {
      list = list.filter(c => c.status === status);
    }
    return list;
  }
}
