# Surgical & Physiotherapy Equipment Website — Implementation Plan

**Stack:** Next.js (App Router) · Supabase (DB, Auth, Storage) · Stripe (Payments)

---

## 🗺️ High-Level Milestones Overview

| #   | Milestone                                    | Est. Duration |
| --- | -------------------------------------------- | ------------- |
| 1   | Project Setup & Design System                | 3–4 days      |
| 2   | Authentication & User Management             | 3–4 days      |
| 3   | Product Catalog, Filtering & Search          | 5–7 days      |
| 4   | Core Pages (Home, About, Resources, Contact) | 4–5 days      |
| 5   | Admin Dashboard (Product & Order Management) | 5–7 days      |
| 6   | Cart, Online Ordering & Stripe Payments      | 5–7 days      |
| 7   | QA, SEO, Polish & Deployment                 | 3–5 days      |

**Total Estimated Duration: ~4–5 weeks**

---

## Milestone 1 — Project Setup & Design System

**Goal:** Lay the technical foundation so every subsequent milestone builds on a clean, consistent base.

### 1.1 Repository & Tooling

- [ ] Confirm Next.js App Router is set up (`/app` directory)
- [ ] Add ESLint + Prettier with a shared config
- [ ] Configure path aliases (`@/components`, `@/lib`, etc.) in `tsconfig.json`
- [ ] Set up `husky` + `lint-staged` pre-commit hooks

### 1.2 Supabase Integration

- [ ] Create a Supabase project (org, region, plan)
- [ ] Install `@supabase/ssr` and `@supabase/supabase-js`
- [ ] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Create a Supabase middleware (`middleware.ts`) for session refresh
- [ ] Create server-side and client-side Supabase client helpers (`@/lib/supabase/server.ts`, `client.ts`)

### 1.3 Database Schema Design (Supabase)

Define and run migrations for the following core tables:

```sql
-- Products
products (id, name, slug, description, category, subcategory, price, stock_qty, images[], features[], is_featured, created_at)

-- Categories
categories (id, name, slug, parent_id)

-- Orders
orders (id, user_id, status, total_amount, stripe_payment_intent_id, shipping_address, created_at)

-- Order Items
order_items (id, order_id, product_id, qty, unit_price)

-- Blog Posts
posts (id, title, slug, content, cover_image, tags[], published_at, author_id)

-- Testimonials
testimonials (id, name, role, content, rating, is_approved)

-- FAQs
faqs (id, question, answer, category, order)

-- Contact Submissions
contact_submissions (id, name, email, phone, message, created_at)
```

- [ ] Set up Row Level Security (RLS) policies for each table
- [ ] Create Supabase Storage buckets: `product-images`, `blog-covers`, `avatars`

### 1.4 Design System

- [ ] Choose and import a Google Font (e.g., **Inter** or **Plus Jakarta Sans**)
- [ ] Define CSS variables for color palette (primary, secondary, accent, neutrals)
- [ ] Create global `globals.css` with base styles, typography scale, and spacing tokens
- [ ] Build reusable UI components:
  - `Button` (variants: primary, secondary, outline, ghost)
  - `Badge` (category tags, stock status)
  - `Card` (product card, blog card)
  - `Input`, `Select`, `Textarea`, `Checkbox`
  - `Modal` / `Drawer`
  - `Toast` / `Notification`
  - `Navbar` & `Footer`
  - `Spinner` / `Skeleton` loaders
- [ ] Organize component library under `@/components/ui/`

---

## Milestone 2 — Authentication & User Management

**Goal:** Allow customers to register, login, and manage their accounts.

### 2.1 Auth Flow (Supabase Auth)

- [ ] Email/password sign-up & login pages (`/auth/login`, `/auth/signup`)
- [ ] Email verification flow (Supabase OTP)
- [ ] Password reset flow (`/auth/reset-password`)
- [ ] OAuth login: **Google**
- [ ] Protect routes via `middleware.ts` (redirect unauthenticated users)

### 2.2 User Profile (`/account`)

- [ ] Edit profile (name, phone, avatar upload to Supabase Storage)
- [ ] Saved addresses (CRUD)
- [ ] Change password

### 2.3 Roles & Permissions

- [ ] `profiles` table with `role` enum (`customer`, `admin`)
- [ ] RLS policies: admins can read/write all; customers access only their own data
- [ ] Admin role assignment via Supabase dashboard

---

## Milestone 3 — Product Catalog, Filtering & Search

**Goal:** The core commerce engine — browsable, filterable, searchable product catalog.

### 3.1 Product Listing Page (`/products`)

- [ ] Server-side fetching from Supabase with pagination
- [ ] Grid / list toggle view
- [ ] **Sidebar filters:** Category, Subcategory, Price range slider, In-stock toggle
- [ ] **Sort options:** Price (asc/desc), Newest, Featured
- [ ] URL-based filter state (query params) for shareable links

### 3.2 Product Detail Page (`/products/[slug]`)

- [ ] Image gallery (multi-image with zoom)
- [ ] Product name, description, price, stock status
- [ ] Features & specifications list
- [ ] "Add to Cart" / "Request Quote" button
- [ ] Related products section (same category)
- [ ] Breadcrumb navigation

### 3.3 Search

- [ ] Search bar in Navbar (debounced input)
- [ ] `/search?q=` results page
- [ ] Supabase full-text search (`to_tsvector`) on `name` + `description`
- [ ] "No results" state with suggestions

### 3.4 Category Pages (`/products/[category]`)

- [ ] Dynamic category pages (e.g., `/products/surgical`, `/products/physiotherapy`)
- [ ] Category hero banner with description

---

## Milestone 4 — Core Public Pages

**Goal:** Build all informational pages to establish credibility and drive engagement.

### 4.1 Home Page (`/`)

- [ ] **Hero section** — Full-width banner, tagline, dual CTA ("Browse Products" / "Contact Us")
- [ ] **Featured Products** — Grid fetched where `is_featured = true`
- [ ] **Categories showcase** — Surgical & Physiotherapy card strips with icons
- [ ] **Why Choose Us** — Icon + text feature blocks
- [ ] **Testimonials carousel** — Approved testimonials from `testimonials` table
- [ ] **Latest Blog Posts** — 3 recent posts preview
- [ ] **CTA Banner** — "Ready to equip your facility? Get in touch."

### 4.2 About Us Page (`/about`)

- [ ] Company story & mission statement
- [ ] Timeline / history milestones component
- [ ] Team profiles grid (name, role, photo)
- [ ] Stats bar (years in business, products, clients, countries)
- [ ] Certifications / partner logos

### 4.3 Resources Page (`/resources`)

- [ ] Blog listing (`/resources/blog`) with category filter tags
- [ ] Blog post detail (`/resources/blog/[slug]`) — Markdown/MDX rendered content
- [ ] FAQs (`/resources/faqs`) — Accordion component, grouped by category
- [ ] Testimonials (`/resources/testimonials`) — Star ratings, review cards
- [ ] Educational library (`/resources/library`) — Video embeds / infographic cards

### 4.4 Contact Page (`/contact`)

- [ ] Contact form (Name, Email, Phone, Subject, Message) → inserts to `contact_submissions`
- [ ] Google Maps embed (company address)
- [ ] Contact details (phone, email, address, working hours)
- [ ] Form validation with `react-hook-form` + `zod`
- [ ] Success/error toast after submission

---

## Milestone 5 — Admin Dashboard

**Goal:** Give administrators full control over products, orders, blog posts, and inquiries.

### 5.1 Dashboard Layout (`/admin`)

- [ ] Protected admin route (role check in middleware)
- [ ] Sidebar navigation (Products, Orders, Blog, FAQs, Testimonials, Contacts)
- [ ] Stats overview cards (Total Products, Pending Orders, New Contacts, Revenue)
- [ ] Recent orders & recent contact submissions widgets

### 5.2 Product Management (`/admin/products`)

- [ ] Data table: list all products with search, sort, pagination
- [ ] Create product form (all fields, multi-image upload to Supabase Storage)
- [ ] Edit product form (pre-populated)
- [ ] Delete product with confirmation modal
- [ ] Toggle featured status

### 5.3 Order Management (`/admin/orders`)

- [ ] Orders table with status filter (pending, processing, shipped, delivered, cancelled)
- [ ] Order detail view (items, customer info, shipping, payment status)
- [ ] Update order status via dropdown

### 5.4 Blog Management (`/admin/blog`)

- [ ] Rich text / Markdown editor (e.g., `react-md-editor`)
- [ ] Cover image upload to Supabase Storage
- [ ] Publish / draft toggle
- [ ] Create, edit, delete posts

### 5.5 Other Admin Sections

- [ ] FAQ CRUD with drag-to-reorder
- [ ] Testimonial approval (approve / reject)
- [ ] View & manage contact form submissions

---

## Milestone 6 — Cart, Ordering & Stripe Payments

**Goal:** Enable end-to-end online purchasing.

### 6.1 Shopping Cart

- [ ] Cart state via React Context + `localStorage` (synced to Supabase for logged-in users)
- [ ] Cart drawer/sidebar (item list, quantities, subtotal)
- [ ] Add / remove / update quantity
- [ ] Cart item count badge on Navbar icon

### 6.2 Checkout Flow (`/checkout`)

- [ ] Step 1: Shipping address form (saved addresses pre-filled for logged-in users)
- [ ] Step 2: Order review (items, totals)
- [ ] Step 3: Payment (Stripe Elements)
- [ ] Order confirmation page (`/orders/[id]/confirmation`)

### 6.3 Stripe Integration

- [ ] Install `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`
- [ ] API route: `POST /api/checkout/create-payment-intent`
- [ ] Stripe webhook: `POST /api/webhooks/stripe` → update `orders.status` on payment success
- [ ] Handle payment failure states with clear UI messaging

### 6.4 Order History

- [ ] `/account/orders` — list of customer's past orders
- [ ] `/account/orders/[id]` — order detail with status tracker

### 6.5 Quote Request (B2B Flow)

- [ ] "Request a Quote" button on product pages (for bulk/institutional orders)
- [ ] Form submits to `contact_submissions` with `type = 'quote_request'`
- [ ] Admin email notification via Supabase Edge Function (Resend / SendGrid)

---

## Milestone 7 — QA, SEO, Polish & Deployment

**Goal:** Ship a production-ready, performant, accessible website.

### 7.1 SEO

- [ ] Dynamic `metadata` exports on every page (title, description, OG tags)
- [ ] `sitemap.xml` — auto-generated via `/app/sitemap.ts`
- [ ] `robots.txt`
- [ ] Structured data (JSON-LD) for products using schema.org `Product`
- [ ] Canonical URLs

### 7.2 Performance

- [ ] Use `next/image` for all images (lazy loading, correct sizing)
- [ ] Bundle analysis with `@next/bundle-analyzer`
- [ ] Suspense boundaries and streaming for heavy routes
- [ ] Cache Supabase queries with Next.js fetch cache / `unstable_cache`
- [ ] Lighthouse score target: **90+** across Performance, Accessibility, SEO

### 7.3 Accessibility

- [ ] Semantic HTML throughout
- [ ] ARIA labels on all interactive elements
- [ ] Full keyboard navigation (modals, dropdowns, carousels)
- [ ] Color contrast compliance (WCAG AA)

### 7.4 Testing

- [ ] Unit tests for utility functions (`jest`)
- [ ] Component tests (`@testing-library/react`)
- [ ] E2E tests for critical flows: auth, product browsing, checkout (`Playwright`)

### 7.5 Deployment

- [ ] Connect GitHub repo to **Vercel**
- [ ] Set all environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Configure Supabase Auth redirect URLs to production domain
- [ ] Register Stripe webhook endpoint pointing to production URL
- [ ] Enable Vercel Analytics & Speed Insights
- [ ] Attach custom domain + SSL

---

## 📦 Recommended Packages

| Purpose             | Package                                                  |
| ------------------- | -------------------------------------------------------- |
| Supabase client     | `@supabase/supabase-js`, `@supabase/ssr`                 |
| Forms & validation  | `react-hook-form`, `zod`                                 |
| Payments            | `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js` |
| Icons               | `lucide-react`                                           |
| Animations          | `framer-motion`                                          |
| Rich text editor    | `react-md-editor`                                        |
| Date utilities      | `date-fns`                                               |
| Toast notifications | `react-hot-toast` or `sonner`                            |
| Testing             | `jest`, `@testing-library/react`, `playwright`           |

---

## 🔑 Key Supabase Features to Leverage

| Feature                | Use Case                                   |
| ---------------------- | ------------------------------------------ |
| **Auth**               | Email/password + Google OAuth              |
| **Row Level Security** | Protect all tables per role                |
| **Storage**            | Product images, blog covers, avatars       |
| **Edge Functions**     | Email notifications (quotes, orders)       |
| **Full-Text Search**   | Product and blog search (`to_tsvector`)    |
| **Realtime**           | (Optional) Live stock/order status updates |
