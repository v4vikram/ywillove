const env = require('../../config/env');
const authService = require('./auth.service');
const User = require('./user.model');

const REFRESH_COOKIE = 'refresh_token';

// httpOnly so an injected script can't read it (the XSS hole localStorage leaves open).
const refreshCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  path: '/api/v1/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function sendSession(res, status, { user, accessToken, refreshToken }) {
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.status(status).json({ user, accessToken });
}

async function register(req, res) {
  const session = await authService.register(req.body);
  sendSession(res, 201, session);
}

async function login(req, res) {
  const session = await authService.login(req.body);
  sendSession(res, 200, session);
}

async function refresh(req, res) {
  const session = await authService.refresh(req.cookies?.[REFRESH_COOKIE]);
  sendSession(res, 200, session);
}

async function logout(req, res) {
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
  res.status(204).send();
}

async function me(req, res) {
  const user = await User.findByPk(req.user.id);
  res.json({ user });
}

module.exports = { register, login, refresh, logout, me };
