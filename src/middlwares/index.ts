import { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { sessionMiddleware } from './session';
import { jwtMiddleware } from './jwt';

export const middlewares = (app: Express): void => {
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  );

  app.use(helmet());

  app.use(sessionMiddleware);

  app.use(jwtMiddleware);
};
