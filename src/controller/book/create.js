'use strict';

const db = require('../../../prisma/db.js');

module.exports = async (request, h) => {
  try {
    const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;

    const userId = request.user.id;
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return h
        .response({
          status: 'fail',
          message: 'User tidak ditemukan.',
        })
        .code(404);
    }

    const existingBook = await db.book.findFirst({
      where: {
        name: name,
        userId: userId,
      },
    });
    if (existingBook) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Nama buku sudah ada!',
        })
        .code(400);
    }

    if (readPage > pageCount) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount.',
        })
        .code(400);
    }

    const book = await db.book.create({
      data: {
        user: {
          connect: { id: userId },
        },
        name,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        year,
        author,
      },
    });

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          book,
        },
      })
      .code(201);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi data dengan benar.',
      })
      .code(400);
  }
};
