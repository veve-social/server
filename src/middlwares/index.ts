import { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { sessionMiddleware } from './session';
import { jwtMiddleware } from './jwt';
import { constants } from '../config/constants';

export const middlewares = (app: Express): void => {
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  );

  if (constants.isProd) {
    app.use(helmet());
  }

  app.use(sessionMiddleware);

  app.use(jwtMiddleware);
};
