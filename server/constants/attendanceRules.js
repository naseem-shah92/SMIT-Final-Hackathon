export const ATTENDANCE_CONSTANTS = {
  OFFICE_START: '09:00',
  GRACE_MINUTES: 15,
  LATE_CUTOFF: '09:15',
  MIN_HALF_DAY_HOURS: 5,
  DEFAULT_RADIUS_METERS: 150,
  WEEKEND_DAYS: [0, 6], // Sunday=0, Saturday=6
  STATUS: {
    PRESENT: 'present',
    LATE: 'late',
    HALF_DAY: 'half_day',
    ABSENT: 'absent',
    MISSING_CHECKOUT: 'missing_checkout',
    ON_LEAVE: 'on_leave'
  }
};
