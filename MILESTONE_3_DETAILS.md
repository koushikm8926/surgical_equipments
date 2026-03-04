# Milestone 3: Product Catalog, Filtering & Search - Detailed Implementation Plan

This document provides an in-depth, step-by-step breakdown of Milestone 3. This milestone turns the website into a functional e-commerce engine, allowing users to discover and explore your medical equipment.

---

## 🛍️ 3.1 Product Listing Page (`/products`)

### The Goal

Create a high-performance browsing experience where users can view your entire inventory with advanced filtering and sorting options.

### Steps

- **Server-Side Data Fetching:** Use Next.js Server Components to fetch product data directly from Supabase.
- **Advanced Filtering (Sidebar):**
  - **Category/Subcategory:** Filter by medical specialty (e.g., Surgical, Physiotherapy).
  - **Price Range:** A dynamic slider or input range.
  - **In-Stock Toggle:** Quickly hide out-of-stock items.
- **Sorting Options:** Allow users to sort by "Newest," "Price: Low to High," and "Featured."
- **Pagination:** Implement efficient data loading so the page stays fast even with hundreds of products.
- **URL-Based State:** Ensure that when a user applies a filter, the URL updates (e.g., `/products?category=surgical`). This makes the results shareable.

### Why do we need this?

- **User Discovery:** A storefront is useless if customers can't find what they need. Filtering by category and price is standard for any professional shop.
- **SEO & Performance:** Using Server Components ensures the products are indexed by Google immediately, and pagination keeps initial page load times low.

### FAQs

- **Q: How do URL query params work?**
  - **A:** We use Next.js `useSearchParams` and `useRouter` to sync the UI filter state with the browser's URL, allowing users to bookmark specific filter results.

---

## 🔍 3.2 Product Detail Page (`/products/[slug]`)

### The Goal

Convert interested visitors into customers by providing clear, detailed information and high-quality visuals for every product.

### Steps

- **Dynamic Routing:** Create `app/products/[slug]/page.tsx` to handle unique URLs for every item.
- **Professional Gallery:** Build an image gallery with zoom functionality for viewing technical details of equipment.
- **Rich Information:** Display specifications, features, price, and real-time stock status.
- **Related Products:** Automatically suggest similar equipment from the same category at the bottom of the page.
- **Breadcrumbs:** Helpful navigation like `Home > Products > Surgical > Scalpels`.

### Why do we need this?

- **Trust & Conversion:** High-quality images and detailed specs are critical when buying expensive surgical or physiotherapy equipment.
- **Internal Linking:** The "Related Products" section keeps users on the site longer and helps them find alternatives.

---

## ⚡ 3.3 Global Search

### The Goal

Allow users to find specific equipment instantly using a powerful, full-text search engine.

### Steps

- **Navbar Search Bar:** A debounced input field accessible from any page.
- **Supabase Full-Text Search:** Implement `to_tsvector` in the database to search through both product names and descriptions.
- **Search Results Page (`/search?q=`):** A dedicated page to display matches with highlighting.
- **"No Results" State:** If nothing is found, provide helpful links back to popular categories.

### Why do we need this?

- **Efficiency:** Many professional buyers know exactly what they are looking for (e.g., "Ultrasonic Cleaner"). Search provides the fastest path to purchase.

---

## 📂 3.4 Category Pages (`/products/[category]`)

### The Goal

Provide dedicated landing pages for specific product lines to improve SEO and organize the catalog.

### Steps

- **Category Slugs:** Filter the main product list based on the dynamic `category` URL segment.
- **Hero Banners:** Display unique descriptions and imagery for "Surgical" vs. "Physiotherapy" sections.

---

## 🏁 Summary of Milestone 3 Success Criteria

You will know Milestone 3 is complete when:

1. Users can navigate to `/products` and see a paginated grid of equipment.
2. Filtering by price or category updates the product list correctly.
3. Clicking a product card opens a beautiful, detailed page with all specs.
4. Searching for a keyword like "Surgical" returns relevant results instantly.
5. Sharing a filtered URL results in the same view for another user.
