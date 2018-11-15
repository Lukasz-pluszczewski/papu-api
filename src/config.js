const config = {
  port: process.env.PORT || 8080,
  bodyLimit: '100kb',
  corsHeaders: ['Link', 'Jwt'],
  db: {
    fileName: 'db.json',
  },
  errors: {
    notFound: 'Not found',
    authentication: {
      noAuthHeader: 'Authentication header not provided',
      unauthenticated: 'User not found',
      wrongUser: 'Wrong user and password',
      wrongPassword: 'Wrong password',
    },
  },
};

export default config;
