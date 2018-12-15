const checkPassword = password => (req, res, next) => {
  if (req.get('authentication') === password) {
    return next();
  }
  res.status(401).json({ message: 'Password incorrect' });
};

export default checkPassword;
