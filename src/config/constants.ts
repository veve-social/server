import dotEnv from 'dotenv';

dotEnv.config();

export const constants = {
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  SESSION_SECRET: process.env.SESSION_SECRET || 'supersecret',

  JWT_TOKEN_EXPIRE: Number(process.env.JWT_TOKEN_EXPIRE) || 15,
  REFRESH_TOKEN_EXPIRE:
    Number(process.env.REFRESH_TOKEN_EXPIRE) || 60 * 1000 * 60 * 60 * 24,

  isProd: process.env.NODE_ENV === 'production',

  // redis
  REGISTER_LOGIN_PREFIX: 'reg-login:',

  // email config
  STMP_HOST: process.env.STMP_HOST,
  STMP_PORT: process.env.STMP_PORT,
  STMP_USER: process.env.STMP_USER,
  STMP_PASSWORD: process.env.STMP_PASSWORD,
};
