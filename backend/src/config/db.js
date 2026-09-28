const fs = require('node:fs');
const { Sequelize } = require('sequelize');
const env = require('./env');

// Managed MySQL (Aiven, RDS) refuses plaintext connections. With a CA file we verify
// the server properly; without one we still encrypt, which is fine for dev only.
function sslOptions() {
  if (!env.db.ssl) return {};

  // Hosted platforms (Render, Railway) have nowhere to put a file, so the CA can
  // also arrive as PEM text in an env var. A path still works for the VPS later.
  const ca = env.db.sslCa || (env.db.sslCaPath ? fs.readFileSync(env.db.sslCaPath, 'utf8') : '');

  if (ca) return { ssl: { ca, rejectUnauthorized: true } };

  if (env.isProd) {
    throw new Error('DB_SSL=true in production requires DB_SSL_CA or DB_SSL_CA_PATH');
  }

  return { ssl: { rejectUnauthorized: false } };
}

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: env.isProd ? false : (sql) => console.log(`[sql] ${sql}`),
  dialectOptions: sslOptions(),
  define: {
    underscored: true,
    timestamps: true,
  },
  pool: { max: 10, min: 0, idle: 10000 },
});

module.exports = sequelize;
