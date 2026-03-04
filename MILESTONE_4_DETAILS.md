# Milestone 4: Core Public Pages

**Goal:** Build all informational and marketing pages to establish credibility, improve SEO, and drive engagement.

## 4.1 Home Page (`/`)

The entry point of the application. It should be visually stunning and direct users to key products.

- **Hero Section**: High-impact banner with dual CTAs ("Browse Equipment" & "Get a Quote").
- **Featured Products**: Dynamic grid fetching products where `is_featured = true`.
- **Category Showcase**: Quick links to Surgical & Physiotherapy sections with custom icons.
- **Why Choose Us**: Feature blocks highlighting quality, reliability, and support.
- **Testimonials**: A carousel of approved client reviews.
- **Latest Blog**: A preview of the 3 most recent posts from the resources section.

## 4.2 About Us (`/about`)

Building trust through transparency.

- **Mission & Vision**: Clear statements on company values.
- **Timeline**: Visual representation of company growth and milestones.
- **Leadership Team**: Portraits and roles of key personnel.
- **Stats Counter**: Years of service, number of clients served, and product range count.

## 4.3 Resources & Blog (`/resources`)

Educational content and support.

- **Blog Listing**: Grid of articles with category filtering (e.g., "Surgery Tips", "Rehab Guide").
- **Article View**: Clean reading experience with Markdown/MDX support.
- **FAQs**: Accordion-based answers to common medical equipment questions.
- **Resource Library**: Infographics and video embeds for equipment maintenance.

## 4.4 Contact Page (`/contact`)

Lead generation and customer support.

- **Inquiry Form**: Comprehensive form (Name, Email, Phone, Message) that submits directly to Supabase.
- **Interactive Map**: Google Maps integration for office/showroom location.
- **Direct Contact**: clickable phone numbers and email links.
- **Validation**: Strict client-side validation using `react-hook-form` and `zod`.

## Technical Tasks

- [ ] Implement Hero & Featured sections on `app/page.tsx`
- [ ] Create `app/about/page.tsx` with mission and team data
- [ ] Build `app/resources/blog/page.tsx` and `[slug]/page.tsx`
- [ ] Create `app/resources/faqs/page.tsx` using Accordion component
- [ ] Implement `app/contact/page.tsx` with form handling server actions
- [ ] Ensure full mobile responsiveness for all new pages
