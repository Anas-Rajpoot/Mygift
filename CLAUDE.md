# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MyGift.pk** — a luxury Pakistani e-commerce brand (mygift.pk) based in Multan. Headless Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript 5 (strict) frontend connected to WordPress/WooCommerce via GraphQL and REST APIs.

## Brand Identity

**MyGift.pk** sells across 5 categories: Gifts & Hampers, Clothing & Fashion, Watches & Accessories, Digital Products, Flowers & Cakes. Key differentiator: overseas Pakistani diaspora can order in their currency (USD/GBP/AED) and we deliver to their family in Pakistan.

### Design Direction: LUXURY PREMIUM DARK
- Dark backgrounds only (no white pages) — `--ink: #0f0608`, `--surface: #1a0c10`
- Gold as the ONLY accent — `--gold: #c9a84c`, used sparingly for maximum impact
- Fonts: Cormorant Garamond (display/hero), Cinzel (labels/nav caps), DM Sans (body/UI)
- NO rounded corners above 8px, NO drop shadows, NO gradients except dark-to-darker
- Borders: 1px gold at low opacity (`rgba(201,168,76,0.15)`)
- Icons: Lucide React only (no emoji in UI)
- Hover states always involve gold

## Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Production build (also serves as type-check)
npm run lint     # ESLint
npm run start    # Start production server
```

No test runner. Verify with `npm run build` and `npm run lint`.

## Architecture

### Dual API Pattern
- **GraphQL** (`src/lib/graphql.ts`): WordPress content — pages, menus, site settings. Uses `graphqlFetch()` with Next.js revalidation.
- **WooCommerce REST** (`src/lib/woocommerce.ts`): Products, orders, categories, customers. Exports `products`, `categories`, `orders`, `customers` objects. Basic Auth with server-side secrets.
- **Auth** (`src/lib/auth.ts`): JWT via `wp-json/jwt-auth/v1/token`.

### Server vs Client Components
- Pages/layouts: server components (can `await` data directly)
- Interactive components: `'use client'` directive
- Sensitive API calls: through `src/app/api/` routes

### State Management (Zustand)
- `cart-store.ts` — cart items, totals (localStorage persisted)
- `auth-store.ts` — JWT token, user info (localStorage persisted)
- `ui-store.ts` — modals, mobile menu, cart drawer
- **Always use selector hooks** (e.g., `useCartItems()`) not full store

### CSS Variables & Theme
All design tokens defined in `globals.css` as CSS custom properties:
- Colors: `--ink`, `--surface`, `--surface-2`, `--wine`, `--gold`, `--gold-light`, `--cream`, `--muted`, `--rose`, `--border`, `--border-hover`
- Font families: `--font-sans` (DM Sans), `--font-heading` (Cormorant Garamond), `--font-accent` (Cinzel)

### Animation Patterns (Framer Motion)
- `fadeUp`: opacity 0->1, y 32->0, duration 0.7
- `stagger`: staggerChildren 0.08
- `scaleIn`: opacity 0->1, scale 0.94->1
- Always use `whileInView` with `viewport={{ once: true, margin: "-80px" }}`

## Key Conventions

- Path alias: `@/` maps to `src/`
- Styling: Tailwind utilities + `cn()` from `@/lib/utils`
- Types: `src/types/woocommerce.ts` — extend, don't recreate
- Images: Next.js `<Image>` with remote patterns in `next.config.ts`
- UI components: `src/components/ui/` (Button, Input, Skeleton, SectionHeader)
- Home sections: `src/components/home/` (hero, marquee, categories, occasions, diaspora, giftlab, trust-bar)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_WORDPRESS_URL    # WordPress site URL
NEXT_PUBLIC_GRAPHQL_URL      # WPGraphQL endpoint
WC_CONSUMER_KEY              # Server-side only
WC_CONSUMER_SECRET           # Server-side only
JWT_SECRET                   # Must match wp-config.php
NEXT_PUBLIC_SITE_URL         # Frontend URL
```
