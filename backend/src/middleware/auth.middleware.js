const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { unauthorized, forbidden } = require('../utils/ApiError');

function readAccessToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

function verify(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

function requireAuth(req, res, next) {
  const token = readAccessToken(req);
  if (!token) return next(unauthorized());

  try {
    const payload = verify(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
}

// Guest checkout: a logged-out visitor still needs a cart, keyed by a guest id cookie.
function optionalAuth(req, res, next) {
  const token = readAccessToken(req);
  if (token) {
    try {
      const payload = verify(token);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      req.user = null;
    }
  }
  req.guestId = req.cookies?.guest_id || null;
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return next(forbidden('Admin only'));
  next();
}

module.exports = { requireAuth, optionalAuth, requireAdmin };
