export function validateEmployeeCreate(req, res, next) {
  const { code, name, email, department, designation, basic_salary, joining_date } = req.body;

  if (!code || !name || !email || !department || !designation || !joining_date) {
    return res.status(400).json({
      success: false,
      error: 'Missing mandatory employee fields (code, name, email, department, designation, joining_date).'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid employee email format.'
    });
  }

  const salaryNum = Number(basic_salary);
  if (isNaN(salaryNum) || salaryNum <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Basic salary must be a positive number greater than 0.'
    });
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(joining_date)) {
    return res.status(400).json({
      success: false,
      error: 'Joining date must be in ISO format YYYY-MM-DD.'
    });
  }

  next();
}

export function validateEmployeeSelfUpdate(req, res, next) {
  const allowedKeys = ['phone', 'address'];
  const keys = Object.keys(req.body);
  const invalidKeys = keys.filter(k => !allowedKeys.includes(k));

  if (invalidKeys.length > 0) {
    return res.status(403).json({
      success: false,
      error: `Self-service restriction: Employees are only permitted to edit phone and address. Modifying (${invalidKeys.join(', ')}) is forbidden.`
    });
  }

  next();
}
