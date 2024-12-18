'use strict';

const db = require('../../../prisma/db.js');
const bcrypt = require('bcryptjs');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
let process = require('process');

env.config();

function validateUsername(name) {
  return !/\s/.test(name);
}

module.exports = async (request, h) => {
  try {
    const { name, password } = request.payload;

    if (password.length < 8) {
      return h
        .response({
          status: 'fail',
          message: 'Minimal password 8 karakter',
        })
        .code(400);
    }

    if (!validateUsername(name)) {
      return h
        .response({
          status: 'fail',
          message: 'Username tidak boleh mengandung spasi',
        })
        .code(400);
    }

    if (!name || !password) {
      return h
        .response({
          status: 'fail',
          message: 'Username dan password harus diisi',
        })
        .code(400);
    }
    const user = await db.user.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      return h
        .response({
          status: 'fail',
          message: 'User tidak ditemukan',
        })
        .code(404);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    // console.info(validPassword);
    if (!validPassword) {
      return h.response({
        status: 'fail',
        message: 'Password salah',
      });
    }

    const secretKey = process.env.JWT_SECRET;
    console.info(secretKey);

    const token = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: '1d',
    });

    return h
      .response({
        status: 'success',
        message: 'Login berhasil',
        data: {
          user: user,
          token: token,
        },
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: 'fail',
        message: 'Error, tidak dapat melakukan login',
      })
      .code(400);
  }
};
