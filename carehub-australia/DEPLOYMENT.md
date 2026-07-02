Deployment checklist for `ADMIN_SETUP_SECRET`

This file documents how to set the `ADMIN_SETUP_SECRET` environment variable on common hosting providers. This secret protects the one-time admin creation endpoint at `POST /api/admin/create-admin`.

General guidance
- Generate a strong secret (e.g. `openssl rand -hex 32`).
- Do not commit secrets to the repository. Use environment variables or the provider UI/secret store.
- After creating the admin account, either delete `app/api/admin/create-admin/route.ts` or unset `ADMIN_SETUP_SECRET` in production.

Vercel
1. Open your project in the Vercel dashboard.
2. Go to Settings → Environment Variables.
3. Add a new variable: `ADMIN_SETUP_SECRET` with the generated value.
4. Choose the environment scope (Preview / Production). For initial setup you can set it for Preview or Production as needed.
5. Redeploy the project (Vercel will pick up the new env var automatically for new deployments).

Render
1. Select your service in the Render dashboard.
2. Go to the "Environment" or "Environment Variables" section.
3. Add `ADMIN_SETUP_SECRET` and its value.
4. Save and trigger a manual deploy if necessary.

Netlify
1. Open Site settings → Build & deploy → Environment.
2. Add `ADMIN_SETUP_SECRET` and its value under Environment variables.
3. Trigger a deploy.

Docker / Kubernetes
- For containers, pass `ADMIN_SETUP_SECRET` via your container environment configuration or secret management system (Docker secrets, Kubernetes Secrets, etc.).

CI / GitHub Actions
- Use repository secrets (`Settings → Secrets`) and inject them as env vars during deploy (for example, `ADMIN_SETUP_SECRET: ${{ secrets.ADMIN_SETUP_SECRET }}`).

One-time admin creation reminder
- Use the helper or curl to POST to `/api/admin/create-admin` with the secret and admin details. Example:

```bash
curl -X POST https://your-app.example.com/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{"secret":"<your_secret>","email":"admin@example.com","password":"s3cureP@ss","fullName":"Admin User"}'
```

After successful creation, remove or disable the endpoint to prevent accidental reuse.
