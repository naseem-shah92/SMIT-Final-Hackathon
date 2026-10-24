export function validateCorrectionRequest(req, res, next) {
  const { date, proposed_check_in, reason } = req.body;
  if (!date || !proposed_check_in || !reason) {
    return res.status(400).json({
      success: false,
      error: 'Date, proposed check-in time, and explanation reason are required for correction requests.'
    });
  }
  next();
}

export function validateCorrectionDecision(req, res, next) {
  const { status, hr_comment } = req.body;
  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Status must be either 'approved' or 'rejected'."
    });
  }
  next();
}
