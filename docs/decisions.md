# uwillove — Decisions

Har decision ka ek reason likha hai. Interview mein "aapne yeh kyun choose kiya?" ka
jawab yahin se aayega — isliye reason column khaali mat chhodna.

## Business

| Decision | Kya | Kyun |
|---|---|---|
| Audience | Men's only (abhi ke liye) | Focused launch. Unisex karna hai ya nahi — baad mein decide, traffic dekh ke |
| Products | 3-4 items only: Korean baggy pant, baggy shirt, t-shirt | Trend chal raha hai Insta pe. Chhota catalog = fast launch, kam risk |
| Marketing | Instagram-first | Audience wahin hai; paid ads baad mein |
| Model | Print-on-demand (POD) | Zero inventory cash. Aur architecture mein real problems aate hain (webhooks, supplier sync, failure handling) — ye interview mein bolne layak hai |
| Supplier | **Qikink** (India) | India-domestic printing + shipping + COD. Printful/Printify US/EU se ship karte hain — India customer ko 2-4 week aur customs |
| Theme | Minimal premium, black & white, Gen-Z appeal | Monochrome = product photo hero banta hai, aur cheap nahi lagta |

## Tech

| Decision | Kya | Kyun |
|---|---|---|
| Frontend | Next.js (App Router, TS, Tailwind) → Vercel | SSG/ISR se SEO aur Core Web Vitals free milte hain |
| Backend | Node/Express, alag service → VPS | Job wala hi pattern; do services ka deployment story interview mein strong hai |
| DB | **MySQL** (Sequelize) | System-design prep MySQL-first hai — build aur prep dono align |
| Backend structure | Modules-based (`modules/<domain>/`) | Har domain self-contained: model + routes + controller + service. Flat MVC 20 files ke baad bikhar jaata hai |
| Auth | JWT access (memory) + refresh (httpOnly cookie) | localStorage XSS mein padha ja sakta hai. Timewatch project mein localStorage use hua tha — yeh uska conscious upgrade hai |
| Payments | Razorpay, webhook-verified | Browser ka "payment success" callback fake ho sakta hai; webhook hi source of truth |
| Images | Cloudinary | Free tier + on-the-fly transforms, S3 se kam glue code |
| Search (MVP) | MySQL `FULLTEXT` | Chhote catalog pe kaafi. Meilisearch tab jab catalog bade |
| Stock | `trackInventory` flag per variant | POD items made-to-order hain (decrement nahi), khud ka stock ho to conditional-decrement path |

## Frontend architecture

| Decision | Kya | Kyun |
|---|---|---|
| Shop + admin | **Ek hi app**, route groups `(shop)` / `(admin)` | Admin sirf main hoon, 4 products hain. App Router har route ko alag chunk karta hai to admin ka JS shop visitor ko jaata hi nahi. Timewatch pe alag rakhe the kyunki wahan multiple internal users the — wahi condition yahan nahi. Aur backend alag API hai, to kal chahiye to `(admin)` uthake alag app bana lena, backend chhuna nahi padega |
| Folder structure | Feature-based (`features/<domain>/`) | Backend jaisa hi. `app/` sirf routing ke liye — patla. Mapping 1:1 nahi: `checkout` ek UI flow hai jo backend ke order+payment dono modules se baat karta hai. Frontend boundary user flow se banti hai, backend boundary data ownership se |
| HTTP | **Native fetch** + `lib/api` wrapper | Axios Server Components mein Next.js ka cache dekh hi nahi sakta (andar Node `http` use karta hai) — matlab ISR khatam. Aur wahi Next.js lene ka reason tha. Wrapper 401 pe single-flight refresh-and-retry karta hai |
| Data fetching | React Query **nahi** | Reads Server Components mein hain. React Query daalte to **do caching layers** ho jaate alag invalidation ke saath — wo bugs debug karna mushkil hai. Cart ke optimistic updates React 19 ke `useOptimistic` se. Admin mein server-side paginated tables aayein tab lena, sirf `features/admin` mein |
| State | Redux/Zustand **nahi** | Global bacha sirf session — wo Context se. Filters URL search params mein (shareable, back button, server padh sakta hai). Zustand tab jab Context ka re-render cascade actually problem bane — is size pe nahi hai. `useSession()` hook seam hai: badalna ho to ek file |
| UI kit | shadcn — **sirf primitives + admin** | Code repo mein copy hota hai, dependency nahi — restyle ki azaadi. Radix se accessibility free. Par product card / gallery / hero khud likhe hain — brand wahin dikhta hai, shadcn default laga dete to shop generic lagta |
| Auth token | Access token **memory mein**, refresh httpOnly cookie | localStorage injected script padh sakta hai. Page refresh pe `restoreSession()` cookie exchange karke token wapas leta hai |
| Rendering | `/` static + ISR 1h · `/products/[slug]` SSG via `generateStaticParams` · `/products` dynamic | Product pages pe SEO ka poora weight hai — wo build pe prerender hone chahiye. `/products` searchParams padhta hai isliye dynamic — sahi hai |

### Auth ke do consequences jo design se nikle

1. **Orders / account / admin sab client-rendered hain.** Access token memory mein hai aur
   refresh cookie backend origin (`localhost:5000`) pe set hai — Next ka server use padh
   hi nahi sakta. To per-user data Server Component mein fetch karna possible hi nahi.
   Trade-off: ye pages SSR nahi hote. Theek hai — inme SEO ka kuch hai bhi nahi (`robots`
   mein `noindex` bhi hai).
2. **`RequireAuth` sirf UX hai.** Asli guard backend ka `requireAuth`/`requireAdmin` hai.
   Verify kiya: bina token 401, customer token se admin route pe 403.

### Cache invalidation — `updateTag`, `revalidateTag` nahi

Admin product save karta hai → write seedha Express API pe jaata hai → Next ke cache ko
pata hi nahi chalta. Isliye har admin mutation ke baad ek Server Action chalti hai
(`features/admin/actions.ts`).

Next 16 mein `revalidateTag(tag, profile)` ab do arguments leta hai, aur `profile: 'max'`
stale-while-revalidate karta hai — matlab **jo admin ne abhi save kiya wo use khud turant
nahi dikhega.** Isliye `updateTag()` use kiya, jo Server Actions ke liye hi bana hai
(read-your-own-writes) aur cache turant expire karta hai.

> **Gotcha jo do baar laga:** DB mein seedha data badla (seed script se) to storefront
> purana hi dikhta raha, kyunki koi `updateTag` chala hi nahi. ISR ka yahi matlab hai —
> **out-of-band DB writes cache ko invalidate nahi karte.** Admin UI se change karoge to
> theek chalega; script se karo to dev mein `.next` clear karna padega.

**Next.js 16 note:** `middleware.ts` ab `proxy.ts` hai. Par is split architecture mein proxy-based admin guard **kaam hi nahi karta** — refresh cookie backend origin (`localhost:5000`) pe set hoti hai, frontend origin use dekh hi nahi sakta. Isliye admin guard layout mein (UX ke liye) aur **asli guard backend ke `requireAdmin` middleware mein** hai. Frontend guard UX hai, security nahi.

## SEO

| Decision | Kya | Kyun |
|---|---|---|
| Homepage ka SEO role | Internal links dena, keywords nahi | Homepage sirf brand term pe rank karta hai. Paisa category/product pages se aata hai — homepage ka kaam crawler ko wahan tak pahunchana hai |
| Structured data | Organization + WebSite (home), Product + BreadcrumbList (PDP) | WebSite se sitelinks searchbox, Product se rich result (price, availability) |
| `aggregateRating` | **Sirf jab asli reviews hon** | Fake rating markup Google ka manual action hai — rich result khone se bada nuksaan |
| Carousel hero | Nahi | Slide 2-3 koi dekhta nahi, aur LCP kharab karta hai |
| sitemap + robots | `app/sitemap.ts`, `app/robots.ts` | `/cart`, `/orders`, `/admin` disallow — unme rank karne ko kuch hai hi nahi |
| Cache TTL alignment | Reviews aur catalog dono 1h | Page apne saare fetches ka **sabse chhota** revalidate leta hai. Reviews pe 10m daala tha to poora homepage 10m ho gaya tha — freshness tag se aati hai, timer se nahi |

## Legal pages — draft hain

`/shipping`, `/returns`, `/privacy`, `/terms`, `/contact` likhe hue hain aur POD+India
model ke hisaab se honest hain, par **ye legally reviewed nahi hain.** Live jaane se pehle:
business name, registered address, GSTIN add karna, aur Razorpay ke live-mode requirements
se match karna (wo ye paanchon pages maangta hai activation ke waqt).

## Abhi dummy hai — live jaane se pehle replace karna

`backend/.env.example` dekho. Ye sab dummy values pe chal raha hai, code already likha hai:

| Env | Abhi | Kya karna hai |
|---|---|---|
| `RAZORPAY_*` | `rzp_test_dummy` | dashboard.razorpay.com → Test Mode keys. Dummy pe checkout fake gateway order banata hai, flow chalta hai |
| `QIKINK_*` | `dummy_*` | Qikink account approval ke baad. Dummy pe order "sent" mark hota hai, API call nahi jaati |
| `CLOUDINARY_*` | `dummy_*` | cloudinary.com free signup |
| Domain | decide nahi hua | `uwillove.in` / `.com` availability check |

Production mein dummy value chhod di to server boot hi nahi hoga — `config/env.js` check
karta hai aur throw kar deta hai.

## Baad ke liye (abhi nahi)

- Migrations (`sequelize-cli`) — abhi dev mein `sync()` chal raha hai
- Redis caching (catalog reads, version-counter invalidation)
- Background queue (order confirmation email, supplier retry)
- AI layer: product description generation, semantic search, size assistant
