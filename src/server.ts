import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import jwt from 'jsonwebtoken';
import expressJWT from 'express-jwt';

import { schema } from './schema';
import { createContext, prisma } from './context';
import { sendRefreshToken, createJwtToken } from './utils/jwtToken';
import { constants } from './config/constants';

const isProd = process.env.NODE_ENV === 'production';

const app = express();

const RedisStore = connectRedis(session);
const redis = new Redis('127.0.0.1:6379');

const invalidToken = {
  error: {
    message: 'Invalid refresh token',
  },
};

app.set('trust proxy', 1);

app.use(
  session({
    name: 'qid',
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
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

app.use(
  expressJWT({
    secret: constants.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
);

app.get('/refersh-token', async (req, res) => {
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

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at: http://localhost:4000 ⭐️ `);
});
