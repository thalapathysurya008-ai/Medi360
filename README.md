# MediGuide 360 — Starter project

A beginner-friendly, mobile-responsive web prototype using **Next.js + Supabase**, ready to push to GitHub and deploy on Vercel.

## Included in this version

- Email/password sign-up and login using Supabase Auth
- Basic patient profile (full name only)
- Supabase `profiles` table with Row Level Security (RLS)
- Responsive dashboard placeholders for records, hospitals, OPD booking and voice assistant

**Important:** This is a learning prototype. It does not store medical records, diagnose conditions, book real appointments, or replace emergency care. Use fictional test accounts and sample data only. Do not upload real patient information.

## 1. Create a Supabase project

1. Open https://supabase.com/ and create a free project.
2. In the project dashboard, open **SQL Editor**.
3. Open `supabase/schema.sql` from this repository, copy all its SQL, paste it into SQL Editor and run it.
4. Open **Project Settings → API** (or the API keys page).
5. Copy the Project URL and the public `anon` key / publishable key. Never use a `service_role` or secret key in frontend code.

## 2. Add environment variables

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=PASTE_YOUR_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

Do not share `.env.local`, post its values publicly, or commit it to GitHub. `.gitignore` already excludes it.

## 3. Run locally

You need Node.js and npm in a computer environment or a cloud development workspace:

```bash
npm install
npm run dev
```

Open the local development URL shown by the environment.

## 4. Push to GitHub

1. Create a new **private** GitHub repository named `mediguide360`.
2. Upload the project files and folders from this ZIP.
3. Do not upload `.env.local`, passwords, secret keys, or real patient information.
4. Keep `.env.example` in the repository; it contains placeholders only.

## 5. Deploy with Vercel

1. Open https://vercel.com/ and sign in with GitHub.
2. Choose **Add New → Project**, then import your `mediguide360` repository.
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Paste the same Supabase Project URL and public anon/publishable key.
5. Deploy. If you change environment variables later, redeploy the project.

## 6. Configure Supabase Auth URL settings

After Vercel gives you a deployment URL:

1. In Supabase, open **Authentication → URL Configuration**.
2. Set the Site URL to your Vercel deployment URL.
3. Add the Vercel URL to the Redirect URLs list if needed.
4. Test sign-up, email confirmation (if enabled), login, profile save and logout.

## Phone-only workflow

Editing a multi-file Next.js project entirely on a phone is possible but can be awkward. Use GitHub's website to upload/edit files, and Vercel to deploy. If the Vercel build fails, copy the complete error message so it can be fixed. A cloud development environment may make installing dependencies and testing easier.

## Security notes before any real-world use

- Keep Supabase Row Level Security enabled. The included policies allow each signed-in user to access only their own profile row.
- Frontend environment variables beginning with `NEXT_PUBLIC_` are public by design. Only put the Supabase public/anon/publishable key there.
- Never put the Supabase service-role key in the browser, GitHub, or a `NEXT_PUBLIC_` variable.
- Before adding health records, family access, insurance, or hospital integrations, design consent, access control, audit logs, retention and backup policies and get appropriate technical/legal review. Follow applicable Indian privacy and health-data requirements.
- Do not use real patient data in this college prototype.
