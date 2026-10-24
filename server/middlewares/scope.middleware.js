import { ROLES } from '../constants/roles.js';

/**
 * Data Scope Guard:
 * Admin & HR: Can access organization-wide scope.
 * Employee: Strictly scoped to their own employee_id. Any attempt to inspect or mutate another employee's records is rejected with 403 Forbidden.
 */
export function scopeGuard(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  // Admin and HR have global organizational scope
  if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.HR) {
    req.dataScope = { isRestricted: false };
    return next();
  }

  // Employee role is strictly restricted to self
  const targetEmployeeId = req.params.employeeId || req.query.employeeId || req.body?.employee_id;
  
  if (targetEmployeeId && String(targetEmployeeId) !== String(req.user.employee_id)) {
    return res.status(403).json({
      success: false,
      error: 'Data Scope Violation: Employees are strictly forbidden from viewing or modifying records of other employees'
    });
  }

  req.dataScope = {
    isRestricted: true,
    employeeId: req.user.employee_id
  };

  next();
}
