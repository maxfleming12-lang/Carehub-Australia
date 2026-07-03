This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Login setup

Login uses Supabase email/password authentication. If the login screen says
`Login is not configured yet. Please contact support.`, create `.env.local`
from `.env.example` and add your Supabase project URL and publishable key.

See [docs/LOGIN_SETUP.md](docs/LOGIN_SETUP.md) for the full local and production setup.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## One-time admin setup

This project includes a one-time endpoint to create the initial admin account: `POST /api/admin/create-admin`.

- Add the setup secret to your local environment (do not commit):

```bash
# at project root
echo "ADMIN_SETUP_SECRET=$(openssl rand -hex 32)" >> .env.local
```

- Start your dev server and run the helper script (or use `curl`). The helper prompts for the secret and admin details:

```bash
chmod +x scripts/create-admin.sh
./scripts/create-admin.sh http://localhost:3000
```

- Or call the endpoint directly:

```bash
curl -X POST http://sataus.net/api/admin/create-admin \
	-H "Content-Type: application/json" \
	-d '{"secret":"<your_secret>","email":"admin@example.com","password":"s3cureP@ss","fullName":"Admin User"}'
```

Security notes:
- Ensure `.env.local` is listed in `.gitignore` and never commit secrets.
- After creating the admin account, delete or disable `app/api/admin/create-admin/route.ts` or unset `ADMIN_SETUP_SECRET` in production.
