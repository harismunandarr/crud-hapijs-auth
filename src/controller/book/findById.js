'use strict';

const db = require('../../../prisma/db.js');

module.exports = async (request, h) => {
  const { id } = request.params;
  try {
    const book = await db.book.findUnique({ where: { id: id } });
    if (!book)
      return h
        .response({
          status: 'fail',
          message: 'Buku tidak di temukan',
        })
        .code(404);
    return h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: 'fail',
        message: 'Error, tidak dapat menemukan buku',
      })
      .code(400);
  }
};
