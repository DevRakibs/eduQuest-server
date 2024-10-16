export const isInstructorOrAdmin = (req, res, next) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).send('Access denied. You must be an instructor or admin.');
  }
  next();
}
