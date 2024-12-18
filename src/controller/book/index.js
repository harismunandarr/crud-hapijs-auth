const createBook = require('./create');
const getAllBooks = require('./read');
const findById = require('./findById');
const updateBook = require('./update');
const deleteBook = require('./delete');

module.exports = {
  createBook,
  getAllBooks,
  findById,
  updateBook,
  deleteBook,
};
