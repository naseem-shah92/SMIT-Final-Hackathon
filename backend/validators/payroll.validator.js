export function validatePayrollDraft(req, res, next) {
  const { month, year } = req.body;

  const m = Number(month);
  const y = Number(year);

  if (!m || m < 1 || m > 12) {
    return res.status(400).json({
      success: false,
      error: 'Valid month (1-12) is required.'
    });
  }

  if (!y || y < 2020 || y > 2100) {
    return res.status(400).json({
      success: false,
      error: 'Valid 4-digit year (e.g. 2026) is required.'
    });
  }

  next();
}
