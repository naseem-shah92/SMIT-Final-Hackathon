import { calculateIncomeTax } from './taxCalculator.js';
import { getWorkingDaysInMonth } from './workingDays.js';

/**
 * Calculates complete salary breakdown for an employee in a given month.
 * Gross = 1.5 * basic (HRA 40%, Medical 10%).
 * Per day = gross / working days.
 * Deductions = absent + unpaid + 0.5 * half days.
 * Prorate joiners/leavers.
 */
export function calculateEmployeeSalary({
  basicSalary,
  year,
  month,
  absentDays = 0,
  unpaidLeaveDays = 0,
  halfDays = 0,
  joiningDate = null,
  holidays = []
}) {
  const basic = Number(basicSalary) || 0;
  const hra = Math.round(basic * 0.40);
  const medical = Math.round(basic * 0.10);
  const gross = basic + hra + medical; // Exactly 1.5 * basic

  const totalWorkingDays = getWorkingDaysInMonth(year, month, holidays) || 22;
  const perDayRate = totalWorkingDays > 0 ? gross / totalWorkingDays : 0;

  // Proration for joiners during the month
  let joinerDeduction = 0;
  if (joiningDate) {
    const jDate = new Date(joiningDate);
    if (jDate.getFullYear() === year && jDate.getMonth() + 1 === month) {
      const monthStart = new Date(year, month - 1, 1);
      const preJoinEnd = new Date(year, month - 1, jDate.getDate() - 1);
      if (preJoinEnd >= monthStart) {
        const missedWorkingDays = getWorkingDaysInMonth(year, month, holidays);
        // Prorated days calculation
        const workedFromJoin = Math.max(1, totalWorkingDays - jDate.getDate() + 1);
        joinerDeduction = Math.max(0, Math.round((totalWorkingDays - workedFromJoin) * perDayRate));
      }
    }
  }

  // Attendance deductions
  const penaltyDays = absentDays + unpaidLeaveDays + (0.5 * halfDays);
  const attendanceDeduction = Math.round(penaltyDays * perDayRate);
  const totalDeductions = attendanceDeduction + joinerDeduction;

  // Income Tax calculation
  const annualGross = gross * 12;
  const { monthlyTax, effectiveRate, slabTier } = calculateIncomeTax(annualGross);

  const netPay = Math.max(0, Math.round(gross - totalDeductions - monthlyTax));

  return {
    basicSalary: basic,
    allowances: {
      hra,
      medical
    },
    grossSalary: gross,
    perDayRate: Math.round(perDayRate),
    workingDays: totalWorkingDays,
    deductions: {
      absentDays,
      unpaidLeaveDays,
      halfDays,
      attendanceDeduction,
      joinerDeduction,
      totalDeductions
    },
    tax: {
      annualGross,
      monthlyTax,
      effectiveRate,
      slabTier
    },
    netPay
  };
}
