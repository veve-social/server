import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { DecodedUser } from '../types';
import { constants } from '../config/constants';

export const jwtMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const [, token] = authorization
        .match(/^Bearer /)
        ?.['input']?.split('Bearer ') as string[];

      const decoded = jwt.verify(token, constants.JWT_SECRET) as DecodedUser;
      req.user = decoded;
    }
  } catch (error) {
    // do nothing
  } finally {
    return next();
  }
};
