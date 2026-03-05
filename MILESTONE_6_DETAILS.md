# Milestone 6 — Shopping Cart, Checkout & Order Flow

**Goal:** Build a complete e-commerce transaction layer on top of the existing product catalog and user system. This includes a persistent shopping cart, a multi-step checkout with Stripe payments, order history, and a B2B quote request flow.

---

## 6.1 Shopping Cart

### Architecture Decision

Cart state will be managed by a **React Context** (`CartContext`) with dual persistence:

- **Guests:** `localStorage` only.
- **Logged-in users:** `localStorage` for immediate performance + synced to a `cart_items` Supabase table for cross-device support.

#### Database — New Migration (`0005_milestone_6_cart.sql`)

```sql
CREATE TABLE cart_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id    UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
```

#### New Files

| File                                     | Purpose                                                      |
| ---------------------------------------- | ------------------------------------------------------------ |
| `contexts/cart-context.tsx`              | `CartContext`, `CartProvider`, `useCart` hook                |
| `components/cart/cart-drawer.tsx`        | Slide-out drawer with item list, quantity steppers, subtotal |
| `components/cart/cart-item.tsx`          | Individual row for a product in the cart                     |
| `components/cart/add-to-cart-button.tsx` | Re-usable button for product cards/detail pages              |
| `app/api/cart/sync/route.ts`             | `POST` — syncs `localStorage` cart → Supabase on login       |

#### Modified Files

| File                                   | Change                                                           |
| -------------------------------------- | ---------------------------------------------------------------- |
| `app/layout.tsx`                       | Wrap children in `<CartProvider>`                                |
| `components/navbar.tsx`                | Replace hardcoded `0` badge with reactive `useCart().totalItems` |
| `app/products/[slug]/page.tsx`         | Add `<AddToCartButton>`                                          |
| `components/products/product-card.tsx` | Add `<AddToCartButton>`                                          |

#### Cart Context API

```ts
interface CartState {
  items: CartItem[]; // { product, quantity }
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}
```

**Sync logic (on auth state change):**

1. On login → `POST /api/cart/sync` with `localStorage` cart items.
2. Server merges guest items into `cart_items` table (higher qty wins).
3. Client reads merged cart from Supabase and updates `localStorage`.

---

## 6.2 Checkout Flow (`/checkout`)

The checkout is a **single-page multi-step form** using component-driven state (no page navigations per step) to preserve form data.

```
Step 1: Shipping Address → Step 2: Order Review → Step 3: Payment
```

#### New Files

| File                                            | Purpose                                                    |
| ----------------------------------------------- | ---------------------------------------------------------- |
| `app/checkout/page.tsx`                         | Root page, step manager, progress indicator                |
| `app/checkout/components/step-shipping.tsx`     | Address form (pre-filled from `profiles.shipping_address`) |
| `app/checkout/components/step-review.tsx`       | Cart item summary, totals, edit link                       |
| `app/checkout/components/step-payment.tsx`      | Stripe Elements embed                                      |
| `app/checkout/components/checkout-progress.tsx` | Top progress bar                                           |
| `app/orders/[id]/confirmation/page.tsx`         | Success page showing order #, items, ETA                   |

#### Step 1: Shipping Address

- Fields: Full Name, Street Address, City, State, PIN Code, Country, Phone
- If logged in, pre-populate from `profiles.shipping_address` (JSONB field — add if missing in a migration).
- "Use this address" checkbox to save/update profile address.
- Client-side validation with `react-hook-form` + `zod`.

#### Step 2: Order Review

- Display line items from `useCart()`.
- Show subtotal, shipping (free/flat-rate), GST (18%), and grand total.
- "Edit Cart" link returns to the previous page.
- "Confirm & Proceed to Payment" button calls `POST /api/checkout/create-payment-intent`.

#### Step 3: Payment (Stripe Elements)

- Render Stripe's `PaymentElement` inside `<Elements>` provider.
- On submit: `stripe.confirmPayment()` redirected to `/orders/[id]/confirmation`.
- Handle error states (declined card, network error) with clear inline messages.

#### Order Confirmation Page

- Route: `/orders/[id]/confirmation`
- Fetch order by ID (server-side, validate `user_id === auth.uid()`).
- Display: Order ID, items, totals, shipping address, estimated delivery.
- Clear cart via `clearCart()` on page load.
- CTA: "Continue Shopping" and "View Order History".

---

## 6.3 Stripe Integration

### Prerequisites

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### Environment Variables (add to `.env.local`)

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### API Routes

#### `POST /api/checkout/create-payment-intent`

**File:** `app/api/checkout/create-payment-intent/route.ts`

**Logic:**

1. Authenticate user via Supabase server client.
2. Validate cart items (re-fetch prices from `products` table — never trust client-side prices).
3. Calculate final `amount` server-side (subtotal + GST).
4. Create `PaymentIntent` via Stripe SDK.
5. Create a **pending** `orders` record in Supabase with `status = 'pending'`.
6. Store `stripe_payment_intent_id` on the order row (add this column in migration).
7. Return `clientSecret` to the client.

```ts
// Response shape
{
  clientSecret: string;
  orderId: string;
}
```

#### `POST /api/webhooks/stripe`

**File:** `app/api/webhooks/stripe/route.ts`

**Logic:**

1. Verify Stripe signature using `STRIPE_WEBHOOK_SECRET`.
2. Handle `payment_intent.succeeded` → update `orders.status = 'processing'`, clear `cart_items` for user.
3. Handle `payment_intent.payment_failed` → update `orders.status = 'cancelled'`, notify user.
4. Use `export const dynamic = 'force-dynamic'` and read raw body for signature verification.

> ⚠️ **Important:** This route must NOT use Next.js body parsing middleware. Use `req.text()` for raw body.

### Database Schema Changes (add to migration `0005_milestone_6_cart.sql`)

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS phone TEXT;
```

---

## 6.4 Order History

#### New Files

| File                               | Purpose                                    |
| ---------------------------------- | ------------------------------------------ |
| `app/account/orders/page.tsx`      | List of all past orders with status badges |
| `app/account/orders/[id]/page.tsx` | Detail view with status timeline and items |

#### Order List (`/account/orders`)

- Server component, fetches from `orders` WHERE `user_id = auth.uid()`.
- Columns: Order ID (truncated), Date, Items Count, Total, Status badge, "View" link.
- Empty state: "No orders yet" with CTA to `/products`.

#### Order Detail (`/account/orders/[id]`)

- Server component, fetches order + `order_items` + `products` join.
- **Status Timeline:** Visual stepper showing: `Placed → Processing → Shipped → Delivered`.
- Product thumbnails, quantities, prices.
- Shipping address panel.
- "Need help?" link to `/contact`.

#### Navigation Update

- Add `{ href: '/account/orders', label: 'My Orders' }` to the `/account` sidebar nav (in `app/account/layout.tsx`).

---

## 6.5 Quote Request (B2B Flow)

### Product Page Integration

- Add "Request a Quote" button on `/products/[slug]` page (secondary to "Add to Cart").
- Button opens a modal/drawer with a pre-filled product name field.

#### New Files

| File                                           | Purpose                                       |
| ---------------------------------------------- | --------------------------------------------- |
| `components/products/quote-request-button.tsx` | Button + modal (client component)             |
| `app/api/quotes/route.ts`                      | `POST` — saves to `contact_submissions`       |
| `supabase/functions/notify-admin/index.ts`     | Supabase Edge Function for email notification |

#### `contact_submissions` Schema Update

```sql
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general', -- general, quote_request
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS quantity INTEGER;
```

#### Quote Modal Fields

- Product Name (pre-filled, read-only)
- Your Name
- Email / Phone
- Institution / Hospital Name
- Required Quantity
- Additional Notes
- Checkbox: "I am purchasing on behalf of an institution"

#### API Route (`POST /api/quotes`)

1. Validate form data with `zod`.
2. Insert into `contact_submissions` with `type = 'quote_request'`.
3. Trigger Supabase Edge Function `notify-admin` via HTTP call.
4. Return `{ success: true }`.

#### Supabase Edge Function (`notify-admin`)

- **File:** `supabase/functions/notify-admin/index.ts`
- Uses **Resend** (recommended) or SendGrid to send email.
- Email to admin includes: product name, quantity, contact details, institution.
- Deployed via: `supabase functions deploy notify-admin`

```ts
// supabase/functions/notify-admin/index.ts (pseudo-code)
import { serve } from 'https://deno.land/std/http/server.ts';
import { Resend } from 'npm:resend';

serve(async (req) => {
  const { quoteData } = await req.json();
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  await resend.emails.send({
    from: 'quotes@yourdomain.com',
    to: 'admin@yourdomain.com',
    subject: `New Quote Request: ${quoteData.productName}`,
    html: `<p>...</p>`,
  });
  return new Response(JSON.stringify({ ok: true }));
});
```

---

## Database Migration Summary

**File:** `supabase/migrations/0005_milestone_6_cart.sql`

```sql
-- Cart Items
CREATE TABLE cart_items ( ... );

-- Orders schema extension
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Profiles schema extension
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- contact_submissions extension
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS quantity INTEGER;
```

Run with: `supabase db push` (for remote) or `supabase migration up` (local Docker).

---

## Implementation Order (Suggested)

| Step | What to build                    | Why first?                             |
| ---- | -------------------------------- | -------------------------------------- |
| 1    | DB migration `0005`              | All other features depend on db schema |
| 2    | `CartContext` + `localStorage`   | Foundation for cart UI                 |
| 3    | `CartDrawer` + `AddToCartButton` | Visible, testable immediately          |
| 4    | Navbar cart badge                | Quick win, uses context                |
| 5    | Stripe API routes                | Backend before frontend checkout       |
| 6    | Checkout pages (Steps 1–3)       | Depends on Stripe route                |
| 7    | Order Confirmation page          | Depends on checkout flow               |
| 8    | Order History pages              | Depends on orders being created        |
| 9    | Quote Request modal + API        | Mostly independent                     |
| 10   | Supabase Edge Function           | Last, requires Resend API key          |

---

## Verification Plan

### Automated

- `npm run lint` — catch TypeScript errors in new files.
- Test Stripe webhook locally with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

### Manual

- [ ] Guest adds item → badge shows count → opens drawer → sees item.
- [ ] Login → guest cart merges with profile cart.
- [ ] Complete full checkout with `4242 4242 4242 4242` (Stripe test card).
- [ ] Order appears in `/account/orders` after payment.
- [ ] Failed payment (use `4000 0000 0000 9995`) shows clear error message.
- [ ] "Request a Quote" form submits and admin receives email notification.
