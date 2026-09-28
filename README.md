# uwillove

Men's streetwear e-commerce — Next.js frontend + Node/Express backend + MySQL, print-on-demand
via Qikink.

Decisions aur unke reasons: [`docs/decisions.md`](docs/decisions.md)

## Structure

```
frontend/   Next.js (App Router, TypeScript, Tailwind)  → Vercel
backend/    Node/Express + Sequelize + MySQL            → VPS
docs/       decisions, architecture notes
```

## Backend chalane ke liye

```bash
cd backend
cp .env.example .env        # dummy values already bhare hain
npm run dev
```

MySQL mein ek khaali DB chahiye (`CREATE DATABASE uwillove;`). Dev mein tables
`sequelize.sync()` khud bana deta hai.

Health check: `GET http://localhost:5000/health`

## Frontend chalane ke liye

```bash
cd frontend
npm run dev
```

## API (v1)

| Method | Path | Auth |
|---|---|---|
| POST | `/api/v1/auth/register` · `/login` · `/refresh` · `/logout` | — |
| GET | `/api/v1/auth/me` | user |
| GET | `/api/v1/products` · `/products/:slug` · `/categories` | — |
| POST/PATCH/DELETE | `/api/v1/products` | admin |
| GET/POST/PATCH/DELETE | `/api/v1/cart` · `/cart/items/:variantId` | guest or user |
| POST | `/api/v1/orders` (`Idempotency-Key` header zaroori) | guest or user |
| GET | `/api/v1/orders` · `/orders/:orderNumber` | user |
| POST | `/api/v1/payments/webhook` | Razorpay signature |
| POST | `/api/v1/fulfillment/webhook` · `/retry` · `/orders/:id/dispatch` | Qikink / admin |
| GET/POST | `/api/v1/products/:productId/reviews` · `/reviews` | — / user |

## Backend modules

`backend/src/modules/` — har module ke andar apna model, routes, controller, service:

`auth` · `product` · `cart` · `order` · `payment` · `fulfillment` · `review`

Cross-module relations ek jagah: `modules/associations.js`.
Checkout transaction (conditional stock decrement + idempotency): `modules/order/order.service.js`.
