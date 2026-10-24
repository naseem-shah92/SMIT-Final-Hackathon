export function validateOrgSettings(req, res, next) {
  const { company_name, office_start, grace_minutes } = req.body;

  if (company_name && typeof company_name !== 'string') {
    return res.status(400).json({ success: false, error: 'company_name must be a string' });
  }

  if (office_start && !/^\d{2}:\d{2}$/.test(office_start)) {
    return res.status(400).json({ success: false, error: 'office_start must be in HH:MM format (e.g. 09:00)' });
  }

  if (grace_minutes !== undefined && (isNaN(Number(grace_minutes)) || Number(grace_minutes) < 0)) {
    return res.status(400).json({ success: false, error: 'grace_minutes must be a non-negative number' });
  }

  next();
}
