const checkPassword = password => ({ get, next }) => {
  if (get('authentication') === password) {
    return next();
  }

  return {
    status: 401,
    body: { message: 'Password incorrect' },
  };
};

export default checkPassword;
