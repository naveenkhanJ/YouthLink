# shared/

For code genuinely used by more than one surface.

**Currently empty, and that is fine.** All three surfaces are ES modules now (`backend/` moved off CommonJS on 2026-08-17), so the module-system mismatch that used to block sharing runtime code here is gone. That doesn't make it free, though — `mobile/`'s Metro bundler and `dashboard/`'s Vite build still resolve modules differently from plain Node, so real shared logic would still need thinking through as packaging, not just matching import syntax.

What can realistically live here is data rather than logic — a JSON file of the category allow-list, for example, or shared constant values.

**Don't duplicate the enums.** `backend/prisma/schema.prisma` defines them and is the single source of truth; a second copy here would drift.
