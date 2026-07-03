# Login Setup

The login and registration pages use Supabase email/password authentication. If you see `Login is not configured yet. Please contact support.`, the app is missing Supabase environment variables at runtime.

## 1. Create Supabase Project

1. Create or open a Supabase project.
2. Go to **Project Settings > API**.
3. Copy:
   - Project URL
   - Publishable key, or anon public key
   - Service role key

## 2. Configure Local Environment

Create `carehub-australia/.env.local`:

```bash
cp .env.example .env.local
```

Update these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SETUP_SECRET=replace-with-a-random-secret
NEXT_PUBLIC_APP_URL=http://sataus.net
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` also works if you prefer that name instead of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## 3. Create Database Tables

In Supabase, open **SQL Editor** and run:

```sql
-- paste the contents of supabase/schema.sql
```

The schema creates the `profiles` table and the trigger that automatically creates a profile when a user signs up.

## 4. Enable Email/Password Auth

In Supabase, open **Authentication > Providers > Email** and make sure email/password signups are enabled.

For local development, you can disable email confirmation if you want new registrations to log in immediately. If confirmation is enabled, users must click the confirmation email before login.

## 5. Create the First Admin

Start the app:

```bash
npm run dev
```

Then run:

```bash
chmod +x scripts/create-admin.sh
./scripts/create-admin.sh http://sataus.net
```

Use the same `ADMIN_SETUP_SECRET` from `.env.local` when prompted.

After the admin account is created, sign in at:

```text
http://sataus.net/admin/login
```

Regular users can sign in at:

```text
http://sataus.net/auth/login
```

## Production

Add the same required variables to the hosting provider:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SETUP_SECRET`, only while creating the initial admin
- `NEXT_PUBLIC_APP_URL`

Redeploy after changing environment variables.

After the first admin is created, remove `ADMIN_SETUP_SECRET` from production or disable `app/api/admin/create-admin/route.ts`.
