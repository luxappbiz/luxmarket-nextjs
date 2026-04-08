# LUX Market

LUX Market is a Next.js 16 App Router application for a luxury marketplace experience. The current app includes catalog browsing, authentication, account management, membership checkout, and direct messaging backed by WordPress and WooCommerce APIs.

## Stack

- Next.js `16.2.2`
- React `19`
- TypeScript
- Tailwind CSS `4`
- Radix UI primitives
- Stripe client integration in `checkout-module/`

## Repository Layout

- `app/`: App Router layouts, pages, and server actions
- `components/`: feature and shared UI components
- `checkout-module/`: reusable checkout flow and payment logic
- `lib/`: API clients and auth/account utilities
- `contexts/` and `hooks/`: client-side shared state and auth helpers
- `docs/`: project documentation and tasklists

## Local Development

This repository currently includes both `package-lock.json` and `pnpm-lock.yaml`. Use one package manager consistently in your local environment. The commands below use `npm`.

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

`npm run lint` uses the repo ESLint flat config and currently passes with warnings.

## Environment Variables

Create `.env.local` in the project root and provide the variables required for the features you are using.

### Core App / WordPress URLs

```env
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_BASE_API_URL=
NEXT_PUBLIC_API_BASE_URL=
```

### WooCommerce / Checkout

```env
WORDPRESS_URL=
WC_WORDPRESS_URL=
WC_CONSUMER_KEY=
WC_CONSUMER_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Current Runtime Notes

- Route protection for `/account` is handled by [proxy.ts](/Users/justinestrada/Documents/LUX/Applications/luxmarket-nextjs/proxy.ts).
- Membership checkout currently starts from [app/(main)/membership/page.tsx](/Users/justinestrada/Documents/LUX/Applications/luxmarket-nextjs/app/(main)/membership/page.tsx) and passes plan data by query string into [app/(main)/checkout/page.tsx](/Users/justinestrada/Documents/LUX/Applications/luxmarket-nextjs/app/(main)/checkout/page.tsx).
- Messaging, account, and checkout flows depend on external WordPress and WooCommerce endpoints being reachable.
- Commerce requests now go through internal `/api/commerce` and `/api/account` routes so WooCommerce consumer credentials do not need to be exposed to the browser.
- The new server-side commerce layer supports legacy `NEXT_PUBLIC_*` credential variables as a temporary fallback, but server-only environment variables are preferred.
- Production builds that use `next/font/google` require network access to Google Fonts during build unless fonts are self-hosted.

## Verification

Use these commands for basic validation:

```bash
npm run lint
npm run build
```

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Stripe Documentation](https://docs.stripe.com/)
