require('dotenv').config();

const required = ['DB_NAME', 'DB_USER', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing env vars: ${missing.join(', ')} — copy .env.example to .env`);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
    sslCaPath: process.env.DB_SSL_CA_PATH || '',
    sslCa: process.env.DB_SSL_CA || '',
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL || '30d',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },

  qikink: {
    clientId: process.env.QIKINK_CLIENT_ID,
    accessToken: process.env.QIKINK_ACCESS_TOKEN,
    baseUrl: process.env.QIKINK_BASE_URL,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

env.isProd = env.nodeEnv === 'production';

if (env.isProd) {
  const isDummy = (value) => String(value).includes('dummy');

  // Auth and payments cannot degrade — a dummy value here means broken sessions or
  // money handled with someone else's keys.
  const fatal = Object.entries({
    JWT_ACCESS_SECRET: env.jwt.accessSecret,
    JWT_REFRESH_SECRET: env.jwt.refreshSecret,
    RAZORPAY_KEY_ID: env.razorpay.keyId,
    RAZORPAY_KEY_SECRET: env.razorpay.keySecret,
  }).filter(([, value]) => isDummy(value));

  if (fatal.length) {
    throw new Error(`Dummy credentials in production: ${fatal.map(([k]) => k).join(', ')}`);
  }

  // These have working stub paths, so the site still runs without them. Deploying
  // before the Qikink account exists is a normal state, not a misconfiguration.
  const degraded = Object.entries({
    QIKINK_ACCESS_TOKEN: env.qikink.accessToken,
    CLOUDINARY_API_KEY: env.cloudinary.apiKey,
  }).filter(([, value]) => isDummy(value));

  if (degraded.length) {
    console.warn(`[env] running with stubs for: ${degraded.map(([k]) => k).join(', ')}`);
  }
}

module.exports = env;
