'use strict';

const db = require('../../../prisma/db.js');

module.exports = async (request, h) => {
  const { id } = request.params;
  try {
    const deleteBook = await db.book.delete({
      where: { id: id },
    });
    if (!deleteBook) {
      return h
        .response({
          success: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    }
    return h
      .response({
        success: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        success: 'fail',
        message: 'Gagal menghapus buku',
      })
      .code(400);
  }
};
