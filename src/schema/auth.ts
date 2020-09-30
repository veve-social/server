import {
  mutationField,
  inputObjectType,
  arg,
  objectType,
  queryField,
} from '@nexus/schema';
import bcrypt from 'bcrypt';

import { sendRefreshToken, createJwtToken } from '../utils/jwtToken';
import { User } from './user';

const AuthInput = inputObjectType({
  name: 'AuthInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('passowrd', { required: true });
  },
});

const LoginResponse = objectType({
  name: 'LoginResponse',
  definition(t) {
    t.string('jwtToken', { nullable: false });
  },
});

export const SignupMutation = mutationField('signup', {
  type: 'String',

  description: 'register new user',

  args: {
    data: arg({
      type: AuthInput,
      required: true,
    }),
  },

  async resolve(_root, { data }, ctx) {
    const hashedPassword = await bcrypt.hash(data.passowrd, 10);

    await ctx.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    return 'done';
  },
});

export const LoginMutation = mutationField('login', {
  type: LoginResponse,

  args: {
    data: arg({
      type: AuthInput,
      required: true,
    }),
  },

  async resolve(_root, { data }, ctx) {
    try {
      const user = await ctx.prisma.user.findOne({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        throw new Error('invalid email');
      }

      const match = await bcrypt.compare(data.passowrd, user.password);

      if (!match) {
        throw new Error('bad password!');
      }

      const jwtToken = createJwtToken({ uid: user.id });

      sendRefreshToken({ uid: user.id }, ctx.req);

      return {
        jwtToken,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
});

export const SimpleError = objectType({
  name: 'SimpleError',
  definition(t) {
    t.string('message');
  },
});

export const MeResponse = objectType({
  name: 'MeResponse',
  definition(t) {
    t.field('user', { type: User, nullable: true });
    t.field('error', { type: SimpleError, nullable: true });
  },
});

export const MeQuery = queryField('me', {
  type: MeResponse,

  async resolve(_root, _args, { prisma, req }) {
    const userId = req.user?.uid;

    if (!userId) {
      return {
        error: {
          message: 'unauthorized',
        },
      };
    }

    const user = await prisma.user.findOne({ where: { id: userId } });

    if (!user) {
      return {
        error: {
          message: 'unauthorized',
        },
      };
    }

    return { user };
  },
});
