const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { conflict, unauthorized } = require('../../utils/ApiError');
const User = require('./user.model');

function signTokens(user) {
  const payload = { sub: String(user.id), role: user.role };
  return {
    accessToken: jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl }),
    refreshToken: jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshTtl }),
  };
}

async function register({ name, email, password, phone }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw conflict('Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, passwordHash });

  return { user, ...signTokens(user) };
}

async function login({ email, password }) {
  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user) throw unauthorized('Invalid email or password');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw unauthorized('Invalid email or password');

  const safeUser = user.toJSON();
  delete safeUser.passwordHash;

  return { user: safeUser, ...signTokens(user) };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw unauthorized('No refresh token');

  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch {
    throw unauthorized('Invalid refresh token');
  }

  const user = await User.findByPk(payload.sub);
  if (!user) throw unauthorized('User no longer exists');

  return { user, ...signTokens(user) };
}

module.exports = { register, login, refresh };
