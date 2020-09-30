import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { DecodedUser } from '../types';
import { constants } from '../config/constants';

export const jwtMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
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
};
