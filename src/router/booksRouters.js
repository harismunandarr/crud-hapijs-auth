const bookController = require('../controller/book');
const authMiddleware = require('../middleware/authentication');

const bookRouters = [
  {
    method: 'GET',
    path: '/books',
    options: {
      pre: [authMiddleware],
    },
    handler: bookController.getAllBooks,
  },
  {
    method: 'GET',
    path: '/book/{id}',
    handler: bookController.findById,
    options: {
      pre: [authMiddleware],
    },
  },
  {
    method: 'POST',
    path: '/book',
    options: {
      pre: [authMiddleware],
    },
    handler: bookController.createBook,
  },
  {
    method: 'PUT',
    path: '/book/{id}',
    handler: bookController.updateBook,
    options: {
      pre: [authMiddleware],
    },
  },
  {
    method: 'DELETE',
    path: '/book/{id}',
    handler: bookController.deleteBook,
    options: {
      pre: [authMiddleware],
    },
  },
];

module.exports = bookRouters;
