# Milestone 7 — Admin Dashboard & Analytics

**Goal:** Create a premium, high-performance administrative interface for managing the store, tracking sales performance, and overseeing the order fulfillment lifecycle.

---

## 7.1 Admin Overview (Analytics Dashboard)

### Metrics & KPIs

The dashboard will feature a "at-a-glance" summary of business health:

- **Total Revenue:** Sum of all successful orders.
- **Order Volume:** Total number of orders received.
- **Conversion Rate:** Percentage of visitors who placed an order (optional/future).
- **Average Order Value (AOV):** Total Revenue / Order Count.

### Order Status Breakdown

Real-time count of orders categorized by their fulfillment state:

- **Pending:** Payment initialized but not confirmed.
- **Processing:** Paid, awaiting packaging.
- **Shipped:** In transit to the customer.
- **Delivered:** Successfully received by the customer.
- **Cancelled/Refunded:** Failed or returned orders.

---

## 7.2 UI/UX Design System

The Admin Dashboard will use a **sleek, professional "Enterprise Dark/Light" aesthetic** with:

- **Glassmorphism:** Subtle background blurs for modals and sidebars.
- **Dynamic Charts:** Using `recharts` or similar for sales trends.
- **Status Badges:** Color-coded (Emerald for Delivered, Amber for Pending, Blue for Processing).
- **Sticky Navigation:** Vertical sidebar for quick access to Orders, Products, and Users.

### New Components

| Component                          | Purpose                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| `components/admin/stat-card.tsx`   | Displays a single metric with an icon and percentage trend.     |
| `components/admin/order-table.tsx` | A dense, searchable table with bulk actions (e.g., set status). |
| `components/admin/sidebar.tsx`     | Admin-only navigation with role verification.                   |
| `components/admin/chart-sales.tsx` | Line/Area chart showing daily/weekly sales volume.              |

---

## 7.3 Technical Implementation

### Access Control (RBAC)

- **Middleware:** `middleware.ts` will be updated to protect `/admin/*` routes.
- **Server-Side Check:** Each admin page will verify `profile.role === 'admin'`.

### API Routes

- `GET /api/admin/stats` — Returns aggregated order counts and revenue data.
- `PATCH /api/admin/orders/[id]` — Updates order status (e.g., 'processing' -> 'shipped').
- `GET /api/admin/users` — List of customers with their order history summary.

### Database Logic

The analytics will be calculated via Supabase queries:

```sql
-- Example: Get order counts by status
SELECT status, count(*) FROM orders GROUP BY status;

-- Example: Get total revenue
SELECT sum(total_amount) FROM orders WHERE status != 'cancelled';
```

---

## 7.4 Implementation Roadmap

| Step | Action                    | Description                                             |
| ---- | ------------------------- | ------------------------------------------------------- |
| 1    | `/admin/layout.tsx`       | Setup the base layout with sidebar and auth protection. |
| 2    | Dashboard Analytics       | Implement `GET /api/admin/stats` and KPI cards.         |
| 3    | Order Management          | List all orders with filtering and status update tools. |
| 4    | Product/Inventory Control | Full CDRUD for products and categories.                 |
| 5    | User Management           | View customer profiles and engagement metrics.          |

---

## 7.5 Verification Plan

- [ ] **Auth Check:** Non-admin users redirected away from `/admin`.
- [ ] **Data Integrity:** Stats match the actual records in the database.
- [ ] **Responsive UI:** Dashboard is usable on tablets and desktops.
- [ ] **Live Updates:** Status changes reflect immediately in the UI.
