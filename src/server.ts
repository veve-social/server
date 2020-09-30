import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import { schema } from './schema';
import type { DecodedUser } from './types';
import { createContext, prisma } from './context';
import { sendRefreshToken, createJwtToken } from './utils/jwtToken';
import { constants } from './config/constants';

const isProd = process.env.NODE_ENV === 'production';

const app = express();

const RedisStore = connectRedis(session);
const redis = new Redis('127.0.0.1:6379');

const redisStore = new RedisStore({
  client: redis,
  disableTouch: true,
});

const invalidToken = {
  error: {
    message: 'Invalid refresh token',
  },
};

app.set('trust proxy', 1);

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(
  session({
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
  })
);

app.use((req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [prefix, token] = authorization.split('Bearer ');

  if (prefix.length !== 0) {
    return next();
  }

  let decoded: DecodedUser | null;

  try {
    decoded = jwt.verify(token, constants.JWT_SECRET) as DecodedUser;
  } catch (error) {
    return next();
  }

  req.user = decoded;

  return next();
});

app.post('/refersh-token', async (req, res) => {
  try {
    const refreshToken = req.session?.refreshToken;

    if (!refreshToken) {
      res.status(401).json(invalidToken);

      return;
    }

    const data = jwt.verify(refreshToken, constants.JWT_SECRET) as {
      uid: number;
    };

    if (!data.uid) {
      res.status(401).json(invalidToken);

      return;
    }

    const user = await prisma.user.findOne({
      where: {
        id: data.uid,
      },
      select: { id: true },
    });

    if (!user) {
      res.status(401).json(invalidToken);

      return;
    }

    sendRefreshToken({ uid: user.id }, req);

    const jwtToken = createJwtToken({ uid: user.id });

    res.json({ jwtToken });
  } catch (error) {
    console.log(error);
    res.status(401).json(invalidToken);
  }
});

const server = new ApolloServer({ schema, context: createContext });

server.applyMiddleware({ app, path: '/graphql', cors: false });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at: http://localhost:4000 ⭐️ `);
});
