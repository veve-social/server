import session from 'express-session';
import connectRedis from 'connect-redis';

import { redis } from '../config/redis';
import { constants } from '../config/constants';

const RedisStore = connectRedis(session);
const isProd = process.env.NODE_ENV === 'production';

const redisStore = new RedisStore({
  client: redis,
  disableTouch: true,
});

export const sessionMiddleware = session({
  name: 'qid',
  store: redisStore,
  cookie: {
    maxAge: constants.REFRESH_TOKEN_EXPIRE,
    httpOnly: true,
    sameSite: 'lax', // csrf
    secure: isProd,
    domain: isProd ? '.veve.social' : undefined,
  },
  saveUninitialized: false,
  secret: constants.SESSION_SECRET,
  resave: false,
});
