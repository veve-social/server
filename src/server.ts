import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';

import { schema } from './schema';
import { createContext } from './context';
import { middlewares } from './middlwares';
import { routes } from './routes';

export const createServer = (): Promise<Express> => {
  return new Promise((resolve) => {
    const app = express();

    // recomended by express-session middleware
    app.set('trust proxy', 1);

    middlewares(app);

    routes(app);

    const server = new ApolloServer({ schema, context: createContext });

    server.applyMiddleware({ app, path: '/graphql', cors: false });

    resolve(app);
  });
};
