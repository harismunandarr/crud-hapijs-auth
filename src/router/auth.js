const authController = require('../controller/auth');

const auth = [
  { method: 'POST', path: '/auth/login', handler: authController.login },
  { method: 'POST', path: '/auth/register', handler: authController.register },
];

module.exports = auth;
