# Milestone 2: Authentication & User Management - Detailed Implementation Plan

This document provides an in-depth, step-by-step breakdown of Milestone 2 from the main `IMPLEMENTATION_PLAN.md`. It explains _why_ each feature is needed, _how_ it will be implemented, and answers common _FAQs_ you might have during this phase.

---

## 🔐 2.1 Auth Flow (Supabase Auth)

### The Goal

Provide a secure and seamless way for users to sign up, log in, and recover their accounts, while ensuring that protected parts of your website remain restricted.

### Steps

- **Build Auth Pages (`/auth/login`, `/auth/signup`):** Create the UI forms for users to enter their email and password.
- **Implement Email Verification (OTP):** Configure Supabase to send a One-Time Password or magic link to verify the user's email address upon registration.
- **Implement Password Reset Flow (`/auth/reset-password`):** Build a flow allowing users to securely reset forgotten passwords.
- **Add OAuth Login (Google):** Integrate Google Sign-In as a quick, low-friction alternative to email/password registration.
- **Protect Routes via Middleware:** Update `middleware.ts` to actively redirect unauthenticated users away from protected pages (like `/account` or `/admin`) back to the login page.

### Why do we need this?

- **Auth Pages & Verification:** Email verification prevents spam accounts and ensures you have a reliable way to contact real customers regarding their orders.
- **Google OAuth:** Reduces friction. Many users abandon checkout if forced to create a new password; Google login makes it a one-click process.
- **Middleware Protection:** Ensures that users cannot simply type `/admin` or `/account` in the URL bar and access private data.

### How will this help in the future?

A robust authentication system is the backbone of personalization. Once users can securely log in, you can save their carts, track their past orders (Milestone 6), and allow them to manage their shipping details, vastly improving the customer experience.

### FAQs

- **Q: Do I need to build a custom backend to handle passwords securely?**
  - **A:** No! Supabase Auth handles all the cryptographic hashing, salting, and secure storage of passwords out of the box.

---

## 👤 2.2 User Profile (`/account`)

### The Goal

Give users a centralized dashboard to manage their personal information and preferences.

### Steps

- **Profile Edit Page:** Create a form to update full name, phone number, and allow avatar uploads (stored in Supabase Storage).
- **Manage Saved Addresses:** Create Create, Read, Update, Delete (CRUD) functionality for shipping/billing addresses so users don't have to re-type them at checkout.
- **Change Password:** Provide a secure form for authenticated users to update their current password.

### Why do we need this?

- **Saved Addresses:** This is crucial for an e-commerce platform. It significantly reduces friction during the checkout process (Milestone 6).
- **Avatar/Profile Data:** Helps personalize the experience and provides necessary contact info (like phone numbers) for shipping couriers.

### How will this help in the future?

When we implement the Stripe checkout flow, we can auto-fill the user's saved address and contact details, making the purchase process as fast as possible.

### FAQs

- **Q: Where are the avatars stored?**
  - **A:** They will be uploaded directly to the `avatars` bucket in Supabase Storage, and the public URL will be saved to the user's row in the `profiles` table.

---

## 🛡️ 2.3 Roles & Permissions

### The Goal

Differentiate between regular customers and store administrators to securely control who can manage products and view all orders.

### Steps

- **Define `role` inside the `profiles` table:** Ensure the `role` column exists (e.g., `'customer'` or `'admin'`). By default, everyone signs up as a `'customer'`.
- **Implement Row Level Security (RLS) Policies:** Write SQL rules stating that `admin` users can read/write everything, but `customer` users can only read/write their own specific rows in tables like `orders` or `addresses`.
- **Admin Assignment:** Document the manual process of upgrading a user from customer to admin directly via the Supabase Dashboard (SQL Editor).

### Why do we need this?

- **Security:** Without proper RLS tied to roles, any authenticated user could technically send an API request to delete products or view other people's orders.
- **Dashboard Access:** The middleware will check this role and completely block non-admins from accessing the `/admin` routes.

### How will this help in the future?

This sets the stage for Milestone 5 (Admin Dashboard). Because the database itself enforces these rules via RLS, your backend is deeply secure regardless of any accidental bugs introduced in the frontend UI.

### FAQs

- **Q: How does a user become an admin? Is there a UI for it?**
  - **A:** For security reasons, there is no public UI to "become an admin." You, the site owner, will manually change the `role` field from `'customer'` to `'admin'` for specific email addresses using the Supabase Web Dashboard.

---

## 🏁 Summary of Milestone 2 Success Criteria

You will know Milestone 2 is complete when:

1. A new user can successfully sign up using an email/password or Google account.
2. An unauthenticated user attempting to visit `/account` is automatically redirected to `/auth/login`.
3. A logged-in user can update their name, upload a profile picture, and save a shipping address.
4. You have successfully elevated at least one user account to an `admin` role via the Supabase dashboard.
