const env = require('../config/env');
const { ApiError } = require('../utils/ApiError');

function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.originalUrl} not found` } });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isKnown = err instanceof ApiError;
  const statusCode = isKnown ? err.statusCode : 500;

  if (!isKnown) console.error(err);

  res.status(statusCode).json({
    error: {
      message: isKnown ? err.message : 'Something went wrong',
      code: err.code,
      ...(env.isProd ? {} : { stack: err.stack }),
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
