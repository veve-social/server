import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import { makeSchema, queryType } from '@nexus/schema';

import { paths } from '../config/paths';
import { VerifyMutation, LoginMutation, MeQuery } from './auth';
import { User } from './user';

const Query = queryType({
  definition(t) {
    t.boolean('status', () => {
      return true;
    });
  },
});

export const schema = makeSchema({
  types: [Query, VerifyMutation, LoginMutation, User, MeQuery],
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
