const jwt = require('jsonwebtoken');
const process = require('process');

module.exports = async (request, h) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return h
        .response({
          status: false,
          message: 'Anda tidak memiliki otorisasi, silahkan login terlebih dahulu',
          data: null,
        })
        .code(401)
        .takeover();
    }

    const token = authHeader.split('Bearer ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return h
        .response({
          status: false,
          message: 'Token tidak valid: ID pengguna tidak ditemukan',
          data: null,
        })
        .code(401)
        .takeover();
    }

    request.user = decoded;
    return h.continue;
  } catch (err) {
    const message = err.name === 'JsonWebTokenError' ? 'Token tidak valid' : err.name === 'TokenExpiredError' ? 'Token telah kedaluwarsa' : 'Unauthorized';

    return h
      .response({
        status: false,
        message,
        data: null,
      })
      .code(401)
      .takeover();
  }
};
