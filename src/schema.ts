import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import { makeSchema, objectType } from '@nexus/schema';

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.post();
    t.crud.posts();
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.createOnePost();
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Post],
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
});
