import { createServer } from './server';

createServer().then((app) => {
  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at: http://localhost:4000 ⭐️ `);
  });
});
