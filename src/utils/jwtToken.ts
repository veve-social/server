import jwt from 'jsonwebtoken';

import { constants } from '../config/constants';

type Data = {
  [key: string]: string | number;
};

export const createJwtToken = (data: Data): string => {
  return jwt.sign(data, constants.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${constants.JWT_TOKEN_EXPIRE}m`,
  });
};

export const createRefreshToken = (data: Data): string => {
  return jwt.sign(data, constants.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: constants.REFRESH_TOKEN_EXPIRE,
  });
};

export const sendRefreshToken = (data: Data, req: Express.Request): void => {
  const refreshToken = createRefreshToken(data);

  if (req.session) {
    req.session.refreshToken = refreshToken;
  }
};
