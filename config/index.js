require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  tempTokenSecret: process.env.TEMP_TOKEN_SECRET,
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '24h',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};