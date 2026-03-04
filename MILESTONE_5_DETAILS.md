# Milestone 5 — Admin Dashboard

This milestone focuses on building a secure, internal dashboard for site administrators to manage inventory, track orders, and view business performance metrics.

## Proposed Changes

### 📊 Dashboard Overview (`/admin`)

- **Key Metrics**: Display stats like Total Orders, Total Revenue, and Low Stock Alerts.
- **Recent Activity**: List of the latest orders and contact submissions.

### 📦 Product Management (`/admin/products`)

- **Product Index**: A searchable table of all products with stock status and visibility toggles.
- **Product Edit/Create**: Forms to manage product details (Name, Price, Category, Description).
- **Image Upload Integration**: Interface to upload and manage product images via Supabase Storage.

### 🛒 Order Management (`/admin/orders`)

- **Order List**: Overview of all customer orders.
- **Order Detail**: View specific order items, customer details, and update shipping/fulfillment status.

### 🛡️ Admin Security & Middleware

- **Middleware Update**: Ensure only users with `admin` meta-data in Supabase can access the `/admin/*` routes.
- **Form Actions**: Server-side validation for all CRUD operations to ensure data integrity.

## Verification Plan

### Automated Tests

- `npm run lint` to catch typescript errors in new admin components.
- Test server actions for product creation with invalid data (error handling).

### Manual Verification

- Log in as a non-admin user and attempt to visit `/admin` (should redirect).
- Create a new product and verify it appears in the public `/products` listing.
- Update an order status and check if the database reflects the change correctly.
