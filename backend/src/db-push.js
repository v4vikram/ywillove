// Manual schema push. NOT migrations — this is the stopgap until sequelize-cli is
// set up, and it is deliberately never run on server boot in production.
const sequelize = require('./config/db');
require('./modules/associations');

async function main() {
  await sequelize.authenticate();
  await sequelize.sync();

  const [tables] = await sequelize.query('SHOW TABLES');
  console.log(`schema pushed — ${tables.length} tables`);

  await sequelize.close();
}

main().catch((err) => {
  console.error('db push failed', err);
  process.exit(1);
});
