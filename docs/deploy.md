# Deploy — Vercel (frontend) + Render (backend)

Frontend Vercel pe, backend Render pe, DB Aiven pe hi rahega.
Baad mein backend VPS pe le jaana ho to sirf do cheezein badalni hongi:
`CLIENT_ORIGIN` aur webhook URLs. DB kahin nahi jaayega.

---

## 0. Pehle — Aiven service chal rahi hai?

Free tier services inactivity pe **pause** ho jaati hain. Console kholo, service
"Running" dikhni chahiye. Paused ho to resume karo aur DNS aane tak 2-3 min ruko.

Wahin se **`ca.pem` download kar lo** (Connection information → CA certificate).
Uska poora text Render mein `DB_SSL_CA` ke andar jaayega.

## 1. GitHub

Render aur Vercel dono GitHub se deploy karte hain, to repo push karna zaroori hai.

```bash
cd projects/uwillove
git add -A
git commit -m "uwillove: storefront, admin, checkout"
git branch -M main
git remote add origin https://github.com/v4vikram/uwillove.git
git push -u origin main
```

`.env` gitignored hai — check kar lena `git status` mein wo na dikhe.

## 2. Render (backend) — pehle, kyunki URL chahiye hoga

New → Blueprint → repo select karo. `render.yaml` root pe hai, wo apne aap
uth jaayega. Ya manually: New → Web Service, root directory `backend`.

Dashboard mein ye env vars bharo (`render.yaml` mein `sync:false` wale):

| Key | Value |
|---|---|
| `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASSWORD` | Aiven se |
| `DB_SSL_CA` | `ca.pem` ka **poora text** |
| `RAZORPAY_KEY_ID` `RAZORPAY_KEY_SECRET` | Razorpay Test Mode |
| `RAZORPAY_WEBHOOK_SECRET` | wahi hex jo `.env` mein hai |
| `QIKINK_*` `CLOUDINARY_*` | abhi dummy chhod do |
| `CLIENT_ORIGIN` | abhi `http://localhost:3000`, step 4 mein badlega |

`JWT_ACCESS_SECRET` aur `JWT_REFRESH_SECRET` Render khud generate karega.

Deploy hone ke baad: `https://<app>.onrender.com/health` pe `{"status":"ok"}` aana chahiye.

> Qikink dummy hai to boot pe warning aayegi — `[env] running with stubs for: ...`.
> Ye normal hai. Par **dummy JWT ya Razorpay pe server boot hi nahi hoga**, jaan-bujh ke.

## 3. Vercel (frontend)

New Project → wahi repo → **Root Directory: `frontend`**.

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<app>.onrender.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` |

## 4. Wapas Render pe — CORS

`CLIENT_ORIGIN` ko Vercel wale URL pe set karo, phir redeploy.

**Ye bhoolna sabse common galti hai.** Galat hua to site khulegi par login/cart
chupchaap fail honge — browser console mein CORS error aayega, server pe kuch nahi.

## 5. Razorpay webhook

Dashboard → Settings → Webhooks → Add:

- **URL:** `https://<app>.onrender.com/api/v1/payments/webhook`
- **Secret:** wahi hex jo `RAZORPAY_WEBHOOK_SECRET` mein hai — **exactly wahi**
- **Events:** `payment.captured`, `payment.failed`

Ab pehli baar payment asli mein `paid` hoga.

## 6. Test

1. Vercel URL kholo → product → add to cart → checkout
2. Razorpay test card: `4111 1111 1111 1111`, koi bhi future expiry, koi bhi CVV
3. Order page `pending` se `paid` hona chahiye (webhook aane pe)
4. `/admin/orders` mein order dikhna chahiye, fulfillment `sent_to_supplier`
   (Qikink dummy hai to stub chalega)

---

## Dhyan rakhne wali baatein

**Render free tier ~15 min idle pe so jaata hai.** Pehla request 30-60 sec le sakta
hai. Testing ke liye theek, par **asli customer se paisa lene se pehle** paid plan
ya VPS chahiye. Achhi baat: frontend ISR-cached hai, to zyadatar page loads backend
ko chhute hi nahi — sirf cart/checkout/login hit karte hain.

**Abhi dev aur prod ek hi Aiven DB share karenge.** Asli orders aane se pehle alag
DB banana (Aiven console se), warna local experiment prod data ko chhed dega.
Naye DB pe tables banane ke liye: `npm run db:push` (ye migrations nahi hain —
stopgap hai jab tak `sequelize-cli` set nahi hota).

**Env vars ab teen jagah hain** — local `.env`, Render, Vercel. Drift ka risk hai.
`.env.example` ko hamesha sach rakhna.
