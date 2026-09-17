# STREET/01 — Wear Your Attitude

A production-quality, full-stack streetwear e-commerce platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Editorial design, real database persistence, complete commerce flow: browse → cart → checkout → order → admin management.

![Homepage](docs/screenshots/homepage.png)
![Product page](docs/screenshots/product.png)
![Admin dashboard](docs/screenshots/admin.png)

---

## ✨ Features

### Storefront
- Editorial homepage — hero, new arrivals, featured collection, categories, trending, brand story, newsletter
- Product listing with URL-driven filters (category, size, color, price, rating, availability, sale) and sorting
- Product detail pages with image gallery, lightbox, variant selection (color × size), per-variant stock, and size guide
- Debounced search with suggestions
- Cart drawer + full cart page with persistent state
- Wishlist with guest persistence and DB sync on login
- Coupon system with server-side validation (percentage/fixed, expiry, min-order, usage limits)
- Guest and authenticated checkout
- Order confirmation with status timeline

### Account
- Register, login, logout via Auth.js (NextAuth v5)
- Dashboard with order count, spend, wishlist
- Order history and order detail
- Address book with default address
- Profile edit + password change
- DB-synced wishlist

### Admin
- Protected dashboard with revenue chart (30-day), recent orders, low stock, recent customers
- Order management — status + payment status
- Product CRUD with full variant matrix editor
- Customer directory with order history
- Category CRUD with visibility toggle
- Coupon CRUD
- Review moderation (approve / unapprove / delete)

### Technical
- 100% TypeScript, fully typed — zero `any` in core paths
- PostgreSQL + Prisma with 16 models
- Row-level transaction safety on order creation
- Server-only data layer (`server-only` package prevents client leaks)
- Zod validation on every server action
- Never trusts client-submitted prices, stock, or discounts
- SEO: dynamic sitemap, robots, JSON-LD product schema, OG tags
- Fully responsive from 320px to 4K
- Light + dark theme with persistence
- Respects `prefers-reduced-motion`
- Accessible — semantic HTML, focus states, keyboard navigation, ARIA where needed

---

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4 |
| State | Zustand (with persist) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Auth.js (NextAuth v5) |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Toasts | Sonner |
| Deployment | Vercel + any Postgres provider |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (Docker recommended)
- npm

### Install

```bash
git clone https://github.com/YOUR-USERNAME/street-01.git
cd street-01
npm install