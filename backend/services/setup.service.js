import { memoryStore, supabase } from '../config/database.js';
import { AuditService } from './audit.service.js';

export class SetupService {
  /**
   * Retrieves organization settings
   */
  static async getSettings() {
    return memoryStore.org_settings;
  }

  /**
   * Updates company settings (Admin only)
   */
  static async updateSettings(updates, adminUser) {
    const beforeState = { ...memoryStore.org_settings };
    
    memoryStore.org_settings = {
      ...memoryStore.org_settings,
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from('org_settings').upsert([memoryStore.org_settings]);
      } catch (err) {
        console.warn('[SetupService] Supabase settings sync warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'UPDATE_COMPANY_SETTINGS',
      entityType: 'ORG_SETTINGS',
      entityId: memoryStore.org_settings.id,
      beforeState,
      afterState: memoryStore.org_settings
    });

    return memoryStore.org_settings;
  }

  /**
   * Department operations
   */
  static async getDepartments() {
    return memoryStore.departments;
  }

  static async createDepartment({ name, code }, adminUser) {
    const existing = memoryStore.departments.find(
      d => d.name.toLowerCase() === name.toLowerCase() || (code && d.code.toLowerCase() === code.toLowerCase())
    );
    if (existing) {
      const err = new Error(`Department with name '${name}' or code '${code}' already exists`);
      err.statusCode = 409;
      throw err;
    }

    const newDept = {
      id: `dept-${Date.now()}`,
      name,
      code: (code || name.substring(0, 3)).toUpperCase(),
      created_at: new Date().toISOString()
    };

    memoryStore.departments.push(newDept);

    await AuditService.log({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'CREATE_DEPARTMENT',
      entityType: 'DEPARTMENT',
      entityId: newDept.id,
      afterState: newDept
    });

    return newDept;
  }

  /**
   * Designation operations
   */
  static async getDesignations(departmentId = null) {
    if (departmentId) {
      return memoryStore.designations.filter(d => d.department_id === departmentId);
    }
    return memoryStore.designations;
  }

  static async createDesignation({ name, department_id }, adminUser) {
    const newDesig = {
      id: `desig-${Date.now()}`,
      name,
      department_id: department_id || null,
      created_at: new Date().toISOString()
    };

    memoryStore.designations.push(newDesig);

    await AuditService.log({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'CREATE_DESIGNATION',
      entityType: 'DESIGNATION',
      entityId: newDesig.id,
      afterState: newDesig
    });

    return newDesig;
  }

  /**
   * Public Holidays operations
   */
  static async getHolidays() {
    return memoryStore.holidays;
  }

  static async createHoliday({ name, date }, adminUser) {
    const existing = memoryStore.holidays.find(h => h.date === date);
    if (existing) {
      const err = new Error(`A holiday is already recorded for date ${date}`);
      err.statusCode = 409;
      throw err;
    }

    const newHoliday = {
      id: `h-${Date.now()}`,
      name,
      date,
      created_at: new Date().toISOString()
    };

    memoryStore.holidays.push(newHoliday);

    await AuditService.log({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'CREATE_HOLIDAY',
      entityType: 'HOLIDAY',
      entityId: newHoliday.id,
      afterState: newHoliday
    });

    return newHoliday;
  }
}
