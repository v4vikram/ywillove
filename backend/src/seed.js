const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const models = require('./modules/associations');

const ADMIN = {
  name: 'Vikram',
  email: process.env.SEED_ADMIN_EMAIL || 'admin@uwillove.in',
  password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
};

const CATALOG = [
  {
    category: 'Bottoms',
    title: 'Korean Baggy Pant',
    description:
      'Wide-leg, mid-rise, drop crotch. Heavy cotton twill that holds its shape instead of clinging.',
    basePrice: '1299.00',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Black',
    skuPrefix: 'QK-BAGGY',
  },
  {
    category: 'Shirts',
    title: 'Oversized Boxy Shirt',
    description: 'Boxy cut, dropped shoulder, camp collar. Washed cotton, soft from the first wear.',
    basePrice: '1199.00',
    sizes: ['M', 'L', 'XL'],
    color: 'Off White',
    skuPrefix: 'QK-BOXY',
  },
  {
    category: 'Tees',
    title: 'Heavyweight Tee',
    description: '240 GSM single jersey. Holds structure, does not go transparent after two washes.',
    basePrice: '699.00',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Black',
    skuPrefix: 'QK-TEE',
  },
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function seedAdmin() {
  const [user, created] = await models.User.findOrCreate({
    where: { email: ADMIN.email },
    defaults: {
      name: ADMIN.name,
      email: ADMIN.email,
      passwordHash: await bcrypt.hash(ADMIN.password, 10),
      role: 'admin',
    },
  });

  if (!created && user.role !== 'admin') await user.update({ role: 'admin' });

  console.log(`admin: ${ADMIN.email} (${created ? 'created' : 'already existed'})`);
}

async function seedCatalog() {
  for (const entry of CATALOG) {
    const [category] = await models.Category.findOrCreate({
      where: { slug: slugify(entry.category) },
      defaults: { name: entry.category, slug: slugify(entry.category) },
    });

    const slug = slugify(entry.title);
    const [product, created] = await models.Product.findOrCreate({
      where: { slug },
      defaults: {
        title: entry.title,
        slug,
        description: entry.description,
        basePrice: entry.basePrice,
        categoryId: category.id,
        images: [
          `https://placehold.co/900x1200/111/eee.png?text=${encodeURIComponent(entry.title)}`,
          'https://placehold.co/900x1200/eee/111.png?text=Detail',
        ],
      },
    });

    if (created) {
      await models.ProductVariant.bulkCreate(
        entry.sizes.map((size) => ({
          productId: product.id,
          size,
          color: entry.color,
          price: entry.basePrice,
          supplierSku: `${entry.skuPrefix}-${entry.color.replace(/\s/g, '').toUpperCase().slice(0, 3)}-${size}`,
        })),
      );
    }

    console.log(`product: ${entry.title} (${created ? 'created' : 'already existed'})`);
  }
}

async function main() {
  await sequelize.authenticate();
  await sequelize.sync();
  await seedAdmin();
  await seedCatalog();
  await sequelize.close();
}

main().catch((err) => {
  console.error('seed failed', err);
  process.exit(1);
});
