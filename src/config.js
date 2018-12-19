const config = {
  port: process.env.PORT || 8080,
  bodyLimit: '100mb',
  corsHeaders: ['Link', 'Jwt'],
  dbName: process.env.DB_NAME || 'papu',
  dbHost: process.env.DB_HOST || 'localhost:27017',
  password: process.env.ADMIN_PASSWORD,
};

export default config;
