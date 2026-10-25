export function validateLeaveApply(req, res, next) {
  const { leave_type, start_date, end_date, reason } = req.body;

  if (!leave_type || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      error: 'Leave type, start date, and end date are mandatory.'
    });
  }

  const validTypes = ['annual', 'sick', 'casual', 'unpaid'];
  if (!validTypes.includes(leave_type.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `Invalid leave type '${leave_type}'. Permitted types: ${validTypes.join(', ')}.`
    });
  }

  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({
      success: false,
      error: 'Start date cannot be after end date.'
    });
  }

  next();
}

export function validateLeaveDecision(req, res, next) {
  const { status, hr_comment } = req.body;
  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Status must be either 'approved' or 'rejected'."
    });
  }
  next();
}
