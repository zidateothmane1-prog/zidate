# ZIDATE Website

Premium multi-page ZIDATE clothing brand website built with React, Vite, React Router, Tailwind CSS, Framer Motion, lucide-react, and Supabase for Cash on Delivery orders.

## Pages

- `/` - Home
- `/products` - Product collection
- `/offers` - COD offer packs
- `/why-zidate` - Brand story
- `/order` - COD checkout form
- `/order?product=white-oversized-tshirt&offer=2-tshirts`
- `/order?product=white-oversized-tshirt&offer=3-tshirts`

## Install Dependencies

```bash
npm install
```

## Run Locally

Create a local environment file:

```bash
copy .env.example .env
```

Add your Supabase values to `.env`, then run:

```bash
npm run dev
```

## Supabase Setup

1. Create a Supabase project.
2. Open Project Settings > API.
3. Copy the Project URL.
4. Copy the anon public key.
5. Never use the service role key in this frontend project.
6. Open SQL Editor and run `supabase.sql`.

The SQL creates or updates `public.orders` with customer, product, offer, COD, status, and timestamp fields.

## Row Level Security

`supabase.sql` enables RLS and creates one public policy: anonymous visitors can insert orders only.

Do not add a public `select` policy. Public users must not be able to read customer orders.

## Environment Variables

Local `.env`:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Netlify:

1. Open Site configuration > Environment variables.
2. Add `VITE_SUPABASE_URL`.
3. Add `VITE_SUPABASE_ANON_KEY`.
4. Redeploy after saving.

## Netlify Deployment

This project includes `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`

The redirect rule sends all routes to `index.html`, so refresh works on `/products`, `/offers`, `/why-zidate`, and `/order`.

## Test the Order Form

1. Run `supabase.sql` in Supabase.
2. Add environment variables locally or in Netlify.
3. Open `/products` or `/offers`.
4. Click an enabled `Order Now` button.
5. Confirm `/order` opens with product and offer pre-filled from URL query params.
6. Submit a valid test order.
7. Confirm the success message appears.
8. Check the `orders` table in Supabase.

Coming soon products have disabled buttons and cannot be ordered.

## Build

```bash
npm run build
```

Production files are generated in `dist/`.

## Common Errors and Fixes

- `Supabase is not configured yet`: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then restart the dev server.
- Insert fails with RLS error: run `supabase.sql` and confirm the anon insert policy exists.
- Public users can read orders: remove any public select policy from `public.orders`.
- Netlify route refresh shows 404: keep the redirect rule in `netlify.toml`.
- Product image missing: add a JPG to `public/products/` or rely on the built-in product visual fallback.

## Product Data

Edit products and offers in `src/data/products.js`.

## WhatsApp Link

Update `WHATSAPP_LINK` in `src/App.jsx` with the real ZIDATE WhatsApp number when ready.

## Admin, Notifications, And Analytics

### 1. Create Admin User

In Supabase Auth, create an email/password user with this exact email:

```text
zidateothmane1@gmail.com
```

Only this email can access:

- `/admin/dashboard`
- `/admin/orders`
- `/admin/analytics`

Other authenticated users are blocked by frontend route checks and Supabase RLS policies.

### 2. Run Database SQL

Open Supabase SQL Editor and run:

```text
supabase.sql
```

This creates or updates:

- `orders`
- `page_views`
- Insert-only public policies
- Admin-only read/update policies

### 3. RLS Security

Security rules:

- Public users can insert orders only.
- Public users cannot read orders.
- Public users can insert page views only.
- Public users cannot read analytics.
- Only `zidateothmane1@gmail.com` can read orders and analytics.
- Only `zidateothmane1@gmail.com` can update order status.

Do not expose a Supabase service role key in this project.

### 4. Netlify Environment Variables

Add these in Netlify Site configuration > Environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_EMAIL=zidateothmane1@gmail.com
EMAIL_FROM=orders@yourdomain.com
RESEND_API_KEY=your_resend_api_key
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are frontend variables.

`ADMIN_EMAIL`, `EMAIL_FROM`, and `RESEND_API_KEY` are Netlify Function variables. Never expose `RESEND_API_KEY` in frontend code.

### 5. Resend Email Notifications

The Netlify Function is:

```text
netlify/functions/send-order-email.js
```

Order flow:

1. Customer submits COD order.
2. Order is saved to Supabase.
3. Frontend calls `POST /.netlify/functions/send-order-email`.
4. Function sends “New ZIDATE COD Order” to `zidateothmane1@gmail.com`.
5. If email fails, the order remains saved and the customer still sees success.

Configure `EMAIL_FROM` with a verified Resend sender/domain.

### 6. Test Notifications

1. Deploy to Netlify or run Netlify Dev.
2. Add all environment variables.
3. Submit an order from `/order`.
4. Confirm the order row appears in Supabase.
5. Confirm the email arrives at `zidateothmane1@gmail.com`.
6. Check Netlify Function logs if email does not arrive.

### 7. Admin Login

Go to:

```text
/admin/login
```

Log in using the Supabase Auth admin user. Successful login redirects to `/admin/dashboard`.

### 8. Orders Management

Open:

```text
/admin/orders
```

You can:

- Search by name, phone, city, or order ID.
- Filter by status, city, and offer.
- Open order details.
- Update status: `new`, `confirmed`, `shipped`, `delivered`, `cancelled`.

### 9. Analytics

Open:

```text
/admin/analytics
```

Analytics tracks anonymous page views for:

- `/`
- `/products`
- `/offers`
- `/why-zidate`
- `/order`

Tracked fields are privacy-light: page path, title, referrer, user agent, anonymous visitor ID, anonymous session ID, and timestamp.

### 10. Common Admin Errors

- Admin login fails: verify the Supabase Auth user exists and password is correct.
- Admin sees unauthorized: email must be exactly `zidateothmane1@gmail.com`.
- Orders do not load: run `supabase.sql` and check RLS policies.
- Status update fails: confirm the admin update policy exists.
- Email fails: check `RESEND_API_KEY`, verified `EMAIL_FROM`, and Netlify Function logs.
- Analytics empty: visit public routes after adding Supabase env vars.
- Netlify Functions not found: keep `[functions] directory = "netlify/functions"` in `netlify.toml`.
