# Specification

## Summary
**Goal:** Remove Beauty and Health & Wellness categories across the entire Mixora Storefront so only Clothes, Jewellery, and Fragrances remain.

**Planned changes:**
- Update backend `getCategories()` (and any seeded/default category data) to return exactly three top-level categories: Clothes, Jewellery, Fragrances.
- Remove Beauty and Health & Wellness from all storefront category surfaces (header/nav, mobile menu, footer links, home featured categories grid).
- Update category-related UI text and metadata so Beauty/Wellness are not mentioned anywhere customer-facing, and keep category text in English.
- Ensure removed categories are not reachable via UI, and direct navigation to removed/unknown category IDs does not present them as valid categories.

**User-visible outcome:** Shoppers will only see Clothes, Jewellery, and Fragrances throughout the site, and Beauty/Health & Wellness will not appear in navigation, category sections, or page text; visiting removed category URLs will not show them as valid categories.
