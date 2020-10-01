import {
  mutationField,
  objectType,
  queryField,
  stringArg,
} from '@nexus/schema';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';

import { sendRefreshToken, createJwtToken } from '../utils/jwtToken';
import { sendEmail } from '../utils/mail';
import { User } from './user';
import { constants } from '../config/constants';
import { mjmlParser } from '../utils/mjmlParser';

const VerifyResponse = objectType({
  name: 'LoginResponse',
  definition(t) {
    t.string('jwtToken', { nullable: false });
  },
});

export const LoginMutation = mutationField('login', {
  type: 'Boolean',

  description: 'register new user',

  args: {
    email: stringArg({ required: true }),
  },

  async resolve(_root, { email }, { redis }) {
    try {
      const token = uuidv4();

      await redis.set(
        constants.REGISTER_LOGIN_PREFIX + token,
        email,
        'PX',
        1000 * 60 * 15 // the token is expired after 15 min
      );

      const html = await mjmlParser('activation', {
        verifyUrl: `http://localhost:3000/login/verify/${token}`,
      });

      await sendEmail({
        to: email,
        html,
        from: '"veve-social" <no-reply@veve.social>',
        subject: 'Sign in to veve-social ✨',
      });

      return true;
    } catch (error) {
      throw error;
    }
  },
});

export const VerifyMutation = mutationField('verify', {
  type: VerifyResponse,

  args: {
    token: stringArg({ required: true }),
  },

  async resolve(_root, { token }, { prisma, redis, req }) {
    try {
      const key = constants.REGISTER_LOGIN_PREFIX + token;
      const email = await redis.get(key);

      if (!email) {
        throw new ApolloError('Invalid Token!');
      }

      const user = await prisma.user.upsert({
        where: { email },
        create: { email },
        update: { email },
      });

      const jwtToken = createJwtToken({ uid: user.id });

      sendRefreshToken({ uid: user.id }, req);

      await redis.del(key);

      return {
        jwtToken,
      };
    } catch (error) {
      throw error;
    }
  },
});

export const MeQuery = queryField('me', {
  type: User,

  async resolve(_root, _args, { prisma, req }) {
    const userId = req.user?.uid;

    if (!userId) {
      throw new AuthenticationError('must authenticate');
    }

    const user = await prisma.user.findOne({ where: { id: userId } });

    if (!user) {
      throw new AuthenticationError('must authenticate');
    }

    return user;
  },
});
