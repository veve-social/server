import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import { makeSchema, queryType } from '@nexus/schema';

import { paths } from '../config/paths';
import { SignupMutation, LoginMutation } from './auth';

const Query = queryType({
  definition(t) {
    t.boolean('status', (_root, _args, ctx) => {
      console.log('USER: ', ctx.req.user);
      return true;
    });
  },
});

export const schema = makeSchema({
  types: [Query, SignupMutation, LoginMutation],
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: paths.schema,
    typegen: paths.nexus,
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('../context'),
        alias: 'Context',
      },
    ],
  },
});
