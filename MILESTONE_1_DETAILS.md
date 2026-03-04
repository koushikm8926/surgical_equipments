# Milestone 1: Project Setup & Design System - Detailed Implementation Plan

This document provides an in-depth, step-by-step breakdown of Milestone 1 from the main `IMPLEMENTATION_PLAN.md`. It explains _why_ each feature is needed, _how_ it will help you in the future, and answers common _FAQs_ you might have during this phase.

---

## 🏗️ 1.1 Repository & Tooling

### The Goal

Establish a structured, clean, and error-free codebase from day one.

### Steps

- **Initialize Next.js App Router (`/app` directory):** Use the modern Next.js structure for better performance and routing.
- **Add ESLint + Prettier:** Configure code linting and formatting rules.
- **Configure path aliases (`@/components`, `@/lib`):** Set up shortcuts for importing files.
- **Set up Husky + lint-staged:** Automate checks before you can commit code.

### Why do we need this?

- **Next.js App Router:** It's the standard for modern React applications, offering features like React Server Components (RSCs) for faster page loads and better SEO.
- **ESLint & Prettier:** They enforce a consistent coding style across your entire project. If another developer joins you (or if you look at your code 6 months from now), it will be readable and uniform.
- **Path Aliases:** Instead of writing messy imports like `../../../components/Button`, you can cleanly write `@/components/Button`.
- **Husky & Lint-staged:** These ensure you never accidentally commit broken or poorly formatted code by running your ESLint/Prettier checks automatically when you type `git commit`.

### How will this help in the future?

When your project grows to 50+ components and multiple pages, a consistent structure and automated quality checks prevent "spaghetti code" and make debugging significantly easier. It saves hours of manual review time.

### FAQs

- **Q: Do I really need Husky? I'm the only developer.**
  - **A:** Yes! Even as a solo developer, catching a missing parenthesis or an unused variable _before_ it ends up in your Git history saves you from deployment headaches later.

---

## 🔐 1.2 Supabase Integration

### The Goal

Connect your Next.js application to your Supabase backend securely.

### Steps

- **Create Supabase Project:** Set up the database in the Supabase Cloud.
- **Install SDKs (`@supabase/ssr`, `@supabase/supabase-js`):** Add the official libraries.
- **Set up Environment Variables (`.env.local`):** Store your connection URLs and keys.
- **Create Middleware (`middleware.ts`):** Manage user sessions across the app.
- **Create Client Helpers (`server.ts`, `client.ts`):** Set up reusable functions to talk to Supabase.

### Why do we need this?

- **Supabase SDKs & Env Vars:** These are required to establish the connection between your frontend and your database/authentication service.
- **Middleware:** Web apps are stateless. The middleware checks every page request to see if a valid "session" (a logged-in user) exists and refreshes their token automatically so they don't get logged out randomly.
- **Client Helpers:** Next.js has "Server Components" and "Client Components." You need different ways to securely talk to Supabase depending on where the code is running. These helper files abstract that complexity away.

### How will this help in the future?

By setting up proper server and client Supabase clients early, you ensure that your data fetching is secure (secrets never leak to the browser) and performant. The middleware guarantees a smooth authentication experience for users later on in Milestone 2.

### FAQs

- **Q: Why use `@supabase/ssr` instead of just `@supabase/supabase-js`?**
  - **A:** The `ssr` (Server-Side Rendering) package is critical for Next.js App Router. It securely manages cookies for authentication on the server, which the standard `supabase-js` cannot handle properly in SSR environments.

---

## 🗄️ 1.3 Database Schema Design

### The Goal

Define the structure of your data (tables, columns, relationships) and secure it.

### Steps

- **Run SQL Migrations:** Create the tables defined in the main plan (Products, Orders, Categories, etc.).
- **Set up Row Level Security (RLS) policies:** Define who can read, update, or delete data in each table.
- **Create Storage Buckets:** Create folders in Supabase for `product-images` and `blog-covers`.

### Why do we need this?

- **Schema Design:** A database needs a map. You need to tell it exactly what a "Product" looks like (it has a price, a description, stock levels, etc.).
- **RLS (Row Level Security):** This is the most crucial security feature in Supabase. By default, anyone with your public API key could delete all your products. RLS policies act as rules (e.g., "Only Admins can delete products," "Anyone can view products").
- **Storage Buckets:** You need a specialized place to store large files like product JPEGs, as storing images directly inside database text rows is highly inefficient.

### How will this help in the future?

A well-thought-out schema prevents data corruption and makes querying fast. For example, having a dedicated `status` column on the `orders` table makes building the Admin Dashboard (Milestone 5) trivial. Robust RLS policies mean you can safely query your database directly from the frontend without building complex, intermediate API layers.

### FAQs

- **Q: Why do I need to learn SQL to use Supabase?**
  - **A:** While Supabase provides a nice GUI, writing your schema in SQL (as migrations) means you have a version-controlled history of your database. If you ever need to recreate your database or set up a test environment, you just run the SQL script.

---

## 🎨 1.4 Design System

### The Goal

Create a cohesive, reusable library of visual elements that define the look and feel of your brand.

### Steps

- **Choose Fonts & Colors:** Import Google Fonts and set raw CSS variables.
- **Set up `globals.css`:** Define base typography and spacing.
- **Build Core UI Components:** Create raw, reusable React components (`Button`, `Card`, `Input`, `Navbar`).

### Why do we need this?

- **Design Consistency:** A medical/surgical website needs to look professional, trustworthy, and clean. Defining colors (like a calming "Medical Blue" and clean whites/grays) globally ensures every page feels related.
- **Reusable Components:** Instead of copying and pasting the HTML and CSS for a button 50 times across your site, you build one `<Button />` component. If you later decide to change the border radius of all buttons from square to rounded, you change it in _one_ file, and it updates everywhere.

### How will this help in the future?

When you reach Milestone 4 (Building Core Pages) or Milestone 5 (Admin Dashboard), development speed will skyrocket. Because you already built the `Button`, `Input`, and `Card` components, creating a complex form or a product grid becomes a simple exercise of snapping these pre-built Lego pieces together.

### FAQs

- **Q: Should I use a UI library like Tailwind CSS, shadcn/ui, or plain CSS?**
  - **A:**
    - _Tailwind CSS:_ Highly recommended. It speeds up styling significantly via utility classes.
    - _shadcn/ui:_ Extremely recommended for this stack. It generates accessible, beautiful components (like the Buttons and Inputs you need) directly into your `@/components/ui` folder, saving you days of work.
    - _Plain CSS:_ Very slow for modern web apps. Avoid unless you have very specific, custom animation requirements not covered by Tailwind.
- **Q: What if I decide I want a Dark Mode later?**
  - **A:** If you set up your colors using CSS variables (e.g., `--background`, `--foreground`) right now in `globals.css`, adding dark mode later is as simple as flipping the values of those variables when a "dark" class is applied to the HTML.

---

## 🏁 Summary of Milestone 1 Success Criteria

You will know Milestone 1 is complete when:

1. You can run `npm run dev` and see a Next.js start page with no errors.
2. Your `.env.local` is populated with Supabase keys.
3. You can see your tables (Products, Orders, etc.) sitting empty in the Supabase Dashboard.
4. You have a folder full of reusable UI components (`Button`, `Navbar`, etc.) ready to be dropped into pages.
