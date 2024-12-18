'use strict';
const db = require('../../../prisma/db.js');

module.exports = async (request, h) => {
  try {
    const { page = 1, limit = 10, name = '', reading, finished } = request.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (pageNumber < 1 || pageSize < 1) {
      return h
        .response({
          status: 'fail',
          message: 'Invalid page number or limit',
        })
        .code(400);
    }

    const whereConditions = {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    };

    if (reading === '1') {
      whereConditions.reading = true;
    } else if (reading === '0') {
      whereConditions.reading = false;
    }

    if (finished === '1') {
      whereConditions.finished = true;
    } else if (finished === '0') {
      whereConditions.finished = false;
    }

    const books = await db.book.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        publisher: true,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalBooks = await db.book.count({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        ...(reading === '1' ? { reading: true } : reading === '0' ? { reading: false } : {}),
        ...(finished === '1' ? { finished: true } : finished === '0' ? { finished: false } : {}),
      },
    });

    const totalPages = Math.ceil(totalBooks / pageSize);

    return h
      .response({
        status: 'success',
        data: {
          books,
          meta: {
            page: pageNumber,
            limit: pageSize,
            total: totalBooks,
            totalPages,
          },
        },
      })
      .code(200);
  } catch (err) {
    console.error('Error in book retrieval:', err);
    return h
      .response({
        status: 'error',
        message: 'Failed to retrieve books',
        error: err.message,
      })
      .code(400);
  }
};
