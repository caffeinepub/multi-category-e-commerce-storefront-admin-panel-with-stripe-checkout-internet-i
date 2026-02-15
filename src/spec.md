# Specification

## Summary
**Goal:** Build a modern multi-category e-commerce storefront and admin panel with Internet Identity authentication, Stripe checkout, wishlist, and simple order tracking.

**Planned changes:**
- Create frontend information architecture and routing for: Home, Category listing, Product detail, Cart, Checkout, Wishlist, Orders (tracking), Account/Login, Support, plus admin panel routes.
- Apply a coherent premium visual theme (responsive, fast, non-default blue+purple) using consistent UI components.
- Define a single-actor Motoko backend data model and APIs for categories/subcategories, products (images, variants, inventory), reviews, carts, wishlists, orders/order items, users (principals), and admin roles/permissions.
- Build Home page sections (hero banners, offers, featured categories) and connect featured categories to category listing pages.
- Implement category-wise product listing with subcategory navigation and basic client-side sorting/filtering plus pagination/incremental loading.
- Implement product detail pages with image gallery, variants, reviews (auth-required to submit), and add-to-cart / add-to-wishlist actions.
- Implement cart with add/update/remove, quantities, totals, variant display, persistence per authenticated principal, and guest local fallback until login.
- Implement checkout with shipping/contact form, order summary, and payment selection: Stripe (real) plus offline/manual UPI/net banking/COD (creates payment-pending/manual state).
- Add Internet Identity login for customers/admins, account page (principal, logout), and enforce admin-only access on routes and backend methods.
- Implement order tracking statuses (Placed → Packed → Shipped → Delivered, optionally Cancelled) visible to customers and editable in admin panel.
- Implement wishlist for authenticated users with toggles from listings and product detail; wishlist page for management.
- Build admin panel UI + backend endpoints for managing categories/products (images, variants, inventory/pricing), orders (status + manual payment marking), and user/admin role assignment.
- Add Support page with contact form stored in backend for admin review and a configurable WhatsApp link/button.
- Add baseline SEO/performance: per-page titles/meta where applicable, accessible headings, optimized/lazy-loaded images, and loading/empty states.
- Seed initial data for six top-level categories and a small set of example products across categories (idempotent or admin-triggered).
- Add generated static images under `frontend/public/assets/generated` and render them in the UI (hero banners and category tiles/icons).

**User-visible outcome:** Users can browse a premium multi-category storefront, view product details and reviews, manage cart and wishlist, sign in with Internet Identity to checkout (Stripe or manual offline options), and track order status; admins can log in to manage catalog, orders, users/roles, and support submissions.
