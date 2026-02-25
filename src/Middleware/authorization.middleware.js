// ========== authorization middleware ============
export const authorization = (roles = []) => {
  // roles param can be a single role string (e.g. 'user') or an array of roles (e.g. ['user', 'admin'])
  return (req, res, next) => {
    // check if user is authenticated
    if (!req.user) return next({ message: "Unauthorized", cause: 401 });
    // check if user has required role
    if (!roles.includes(req.user.roleType)) {
      // return next({ message: "Forbidden: You don't have access", cause: 403 });
      return next({ message: "Forbidden: You don't have access", cause: 403 });
    }
    // if user has required role, proceed to next middleware
    return next();
  }
  };