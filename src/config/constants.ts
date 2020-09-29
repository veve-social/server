import dotEnv from 'dotenv';

dotEnv.config();

export const constants = {
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  SESSION_SECRET: process.env.SESSION_SECRET || 'supersecret',

  JWT_TOKEN_EXPIRE: Number(process.env.JWT_TOKEN_EXPIRE) || 15,
  REFRESH_TOKEN_EXPIRE:
    Number(process.env.REFRESH_TOKEN_EXPIRE) || 60 * 1000 * 60 * 60 * 24,

  isProd: process.env.NODE_ENV === 'production',
};
