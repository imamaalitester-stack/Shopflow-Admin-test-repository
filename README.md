# ShopFlow Admin

A storefront order dashboard. Built with Next.js 14, Supabase and Stripe.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key.
3. Put your Stripe key in `components/CheckoutButton.tsx` so the checkout can
   create a session.

## Deploying

Push to GitHub and import the repo into Vercel. No extra configuration needed.
