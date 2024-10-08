export const isInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).send('Unauthorized');
  }
  next();
}
