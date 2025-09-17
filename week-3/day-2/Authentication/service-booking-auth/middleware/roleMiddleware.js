function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(500).json({ message: 'No user found on request' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = { authorizeRoles };
