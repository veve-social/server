import { Express } from 'express';

import { refreshToken } from './handlers/refresh-token';

export const routes = (app: Express): void => {
  app.post('/refresh_token', refreshToken);
};
