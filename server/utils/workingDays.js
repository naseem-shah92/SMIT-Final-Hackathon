/**
 * Computes the number of official working days between two dates inclusive.
 * Automatically skips weekends (Saturday & Sunday) and defined public holidays.
 */
export function calculateWorkingDays(startDateStr, endDateStr, holidays = []) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return 0;
  }

  const holidayDateSet = new Set(
    holidays.map(h => (typeof h === 'string' ? h : h.date))
  );

  let workingDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday
    const dateStr = current.toISOString().split('T')[0];

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayDateSet.has(dateStr);

    if (!isWeekend && !isHoliday) {
      workingDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Returns total working days in a given calendar month (YYYY-MM).
 */
export function getWorkingDaysInMonth(year, month, holidays = []) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // last day of month
  return calculateWorkingDays(
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0],
    holidays
  );
}
