'use strict';

const db = require('../../../prisma/db.js');

module.exports = async (request, h) => {
  try {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;

    const existingBook = await db.book.findUnique({
      where: { id: id },
    });

    if (!existingBook) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Buku dengan ID tersebut tidak ditemukan.',
        })
        .code(404);
    }

    const duplicateBook = await db.book.findFirst({
      where: {
        name: name,
        userId: existingBook.userId,
        NOT: { id: id },
      },
    });

    if (duplicateBook) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Nama buku sudah digunakan.',
        })
        .code(400);
    }

    if (readPage > pageCount) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount.',
        })
        .code(400);
    }

    const updatedBook = await db.book.update({
      where: { id: id },
      data: {
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        name,
        year,
        author,
      },
    });

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui.',
        data: {
          book: updatedBook,
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon periksa data yang dikirimkan.',
      })
      .code(400);
  }
};
