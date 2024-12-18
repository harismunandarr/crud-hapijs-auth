'use strict';

const Hapi = require('@hapi/hapi');
const bookRoutes = require('./router/booksRouters.js');
let process = require('process');
const auth = require('./router/auth.js');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  server.route(auth);
  server.route(bookRoutes);

  await server.start();
  console.log('Server running on', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
