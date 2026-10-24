/**
 * Role-Based Access Control (RBAC) Guard
 * Strictly verifies user roles on the server side for every protected endpoint.
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User authentication context missing'
      });
    }

    const userRole = req.user.role.toLowerCase();
    const authorized = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

    if (!authorized) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
}
