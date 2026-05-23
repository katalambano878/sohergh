# Row Level Security (RLS) Setup & Hardening Guide

Use this guide when setting up or auditing RLS in Supabase for this project.

If `exec_sql` is unavailable in your environment, apply SQL manually in Supabase:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) -> your project -> **SQL Editor**.
2. Run policy SQL from your migration files, or from:
   - `scripts/apply-rls-direct.mjs`
   - `scripts/apply-rls.mjs`
3. Validate every policy with the checks below before production rollout.

---

## 1) Minimum baseline

For every sensitive table:

- RLS enabled.
- No broad `USING (true)` policies on private tables.
- No `anon` `SELECT/UPDATE/DELETE` on user-private or admin-private data.
- Owner checks use `auth.uid() = user_id` (or equivalent join-based ownership).
- Write policies include both `USING` and `WITH CHECK` where appropriate.

Public-read tables can allow `anon SELECT`:

- `products`, `categories`, `product_images`, `banners`, `pages`, `cms_content`, `site_settings` (read-only keys only), `navigation_*`.

Private tables must be owner-only or admin-only:

- `orders`, `order_items`, `profiles`, `addresses`, `notifications`, `cart_items`, `wishlist_items`, `customers`.

---

## 2) Quick audit SQL

Run these in SQL Editor:

```sql
-- RLS enabled/disabled status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

```sql
-- All policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

```sql
-- Dangerous patterns to review quickly
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND (
    qual = 'true'
    OR with_check = 'true'
    OR qual ILIKE '%user_id IS NULL%'
  )
ORDER BY tablename, policyname;
```

---

## 3) Policy patterns (recommended)

### Owner-only table (e.g. `cart_items`)

```sql
CREATE POLICY "cart select own"
ON public.cart_items
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "cart insert own"
ON public.cart_items
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart update own"
ON public.cart_items
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart delete own"
ON public.cart_items
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### Orders and order_items

- `orders`: user can read only own orders (`auth.uid() = user_id`).
- No anonymous full-order reads.
- If guest checkout exists, allow controlled insert path only, never open read.
- `order_items`: read should be via ownership of parent order:

```sql
EXISTS (
  SELECT 1
  FROM public.orders o
  WHERE o.id = order_items.order_id
    AND o.user_id = auth.uid()
)
```

### Admin/staff-only table

Use a vetted helper (e.g. `is_admin_or_staff()`) in policies/functions and keep its definition strict.

---

## 4) Storage bucket RLS (often missed)

RLS for table data is not enough. Also audit Storage policies:

- `products` bucket: public read is okay, write should be admin/staff only.
- private buckets: no public read/list.
- Ensure there is no blanket `INSERT/UPDATE/DELETE` for `anon`.

---

## 5) RPC / Function hardening

Audit public functions:

```sql
SELECT p.proname,
       pg_catalog.pg_get_function_arguments(p.oid) AS args,
       CASE WHEN p.prosecdef THEN 'SECURITY DEFINER' ELSE 'INVOKER' END AS security
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;
```

For every `SECURITY DEFINER` function, require explicit authorization checks inside function body.

---

## 6) Production rollout checklist

- [ ] Policies applied via migration (no manual drift).
- [ ] RLS + policy SQL audited (queries above).
- [ ] Guest checkout path tested (insert works, read does not overexpose).
- [ ] Authenticated customer tested (can only access own records).
- [ ] Admin/staff tested (can access required admin data).
- [ ] Storage policies tested (upload/list/delete permissions).
- [ ] RPC functions reviewed for privilege escalation.

---

## 7) Regression test matrix

Test each with `anon`, `authenticated user A`, `authenticated user B`, `admin/staff`:

- Read own order vs other user's order.
- Update own profile vs other user's profile.
- Cart/wishlist isolation between users.
- Product/category public read still works.
- Admin pages still function for admin/staff.

---

## 8) Common pitfalls

- `USING (true)` left on private tables.
- `anon` granted broad `ALL`.
- Missing `WITH CHECK` on insert/update.
- Guest order read path leaking PII.
- SECURITY DEFINER RPC missing auth checks.
- Storage bucket write policies left open.

---

## 9) Rollback strategy

- Keep each security migration atomic and reversible.
- Tag deployments before policy changes.
- If checkout breaks, rollback the last migration and restore from migration history.
- Re-run audit SQL after rollback to confirm known-good state.
