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
    const { name, email, password } = request.payload;
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

    const hashedPassword = await bcrypt.hash(password, 8);
    const userForRegister = await db.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
      },
      select: {
        id: true,
        name: true,
        password: true,
        email: true,
        insertedAt: true,
        updatedAt: true,
      },
    });
    const secret_key = process.env.JWT_SECRET;
    if (!secret_key) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {
        userId: userForRegister.id,
        name: userForRegister.name,
        email: userForRegister.email,
        createdAt: userForRegister.createdAt,
        updatedAt: userForRegister.updatedAt,
      },
      secret_key,
      { expiresIn: '365d' }
    );

    const { password: userWithoutPassword } = userForRegister;

    return h
      .response({
        status: 'success',
        message: 'Register berhasil',
        data: {
          user: userWithoutPassword,
          token: token,
        },
      })
      .code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({
        status: 'fail',
        message: 'Error, tidak dapat registerasi',
      })
      .code(400);
  }
};
