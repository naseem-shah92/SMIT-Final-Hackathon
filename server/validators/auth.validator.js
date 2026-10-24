export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required fields.'
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid work email address format.'
    });
  }
  next();
}

export function validateChangePassword(req, res, next) {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 4 characters long.'
    });
  }
  next();
}

export function validateCreateHR(req, res, next) {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and password are required to create an HR user.'
    });
  }
  next();
}
