class ApiError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const badRequest = (msg, code) => new ApiError(400, msg, code);
const unauthorized = (msg = 'Not authenticated', code) => new ApiError(401, msg, code);
const forbidden = (msg = 'Not allowed', code) => new ApiError(403, msg, code);
const notFound = (msg = 'Not found', code) => new ApiError(404, msg, code);
const conflict = (msg, code) => new ApiError(409, msg, code);

module.exports = { ApiError, badRequest, unauthorized, forbidden, notFound, conflict };
