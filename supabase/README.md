# Supabase (Auth + one profile)

1. Open the SQL editor for the project and run `schema.sql`.
2. Auth → Providers: keep **Email** enabled. Turn **Confirm email** off if a parent should get in immediately; otherwise they confirm once, then sign in.
3. Client env (already in `.env` for this repo):

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_…
```

Never put a `service_role` key in the Vite app.

The app upserts `profiles.id = auth.uid()` with a JSON payload (progress, bookmark, attempts). Homework photos are stripped before upload.
