import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';

import { prisma } from '../context';
import { sendRefreshToken, createJwtToken } from '../utils/jwtToken';
import { constants } from '../config/constants';

const invalidToken = {
  error: {
    message: 'Invalid refresh token',
  },
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<unknown> => {
  try {
    const refreshToken = req.session?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json(invalidToken);
    }

    const data = jwt.verify(refreshToken, constants.JWT_SECRET) as {
      uid: number;
    };

    if (!data.uid) {
      return res.status(401).json(invalidToken);
    }

    const user = await prisma.user.findOne({
      where: {
        id: data.uid,
      },
      select: { id: true },
    });

    if (!user) {
      return res.status(401).json(invalidToken);
    }

    sendRefreshToken({ uid: Number(user?.id) }, req);

    const jwtToken = createJwtToken({ uid: Number(user?.id) });

    return res.status(200).json({ jwtToken });
  } catch (error) {
    console.log(error);
    return res.status(401).json(invalidToken);
  }
};
