const app = require('./app');
const env = require('./config/env');
const sequelize = require('./config/db');

async function start() {
  await sequelize.authenticate();

  // Dev convenience only — production schema changes go through migrations.
  if (!env.isProd) await sequelize.sync();

  const server = app.listen(env.port, () => {
    console.log(`uwillove api listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
