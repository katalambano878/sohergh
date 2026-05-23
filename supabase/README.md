# Supabase migrations

SQL migrations live in `migrations/`. Apply them with the [Supabase CLI](https://supabase.com/docs/guides/cli) (`supabase link`, then `supabase db push`) or by running each file in order in the Dashboard **SQL Editor**.

Use a dedicated project per environment. Do not commit service role keys or database passwords.
