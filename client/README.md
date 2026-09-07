# SA Studio

Public-facing catalog for SA Studio, built with React and Vite.

## Supabase setup

The repository includes the database migration at `supabase/schema.sql`.

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste in `supabase/schema.sql`, and run it.
3. Open **Project Settings > API** and copy the project URL and anon key into `.env.local` using `.env.example` as the template.
4. In **Authentication > Users**, create the administrator account.
5. In SQL Editor, uncomment the final `update auth.users` statement in the schema and replace the email with the administrator email.
6. Sign out of `/admin` and sign back in so the session JWT includes `app_metadata.role = admin`. If fabric edits still save 0 rows, re-run `supabase/schema.sql` so `public.is_admin()` is installed.
7. Re-run `supabase/schema.sql` after pulling category changes so the database accepts only Upholstery, Curtains, or Wallpaper.

Before launch, also set Supabase Auth Site URL and redirect URLs to the final HTTPS domain, enable a strong password policy, confirm email settings, configure database backups, and set a storage file-size limit of 10 MB for the `fabric-images` bucket. The publishable anon key may be exposed in the browser; the service-role key must never be placed in this app.

The public site reads fabrics anonymously. The `/admin` page is intentionally absent from public navigation and requires a signed-in Supabase user whose `app_metadata.role` is `admin`. Do not put a Supabase service-role key in this Vite app or in deployment environment variables.

## Development

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

Deploy the `dist` directory with the client-side route fallback enabled so `/collections/...` and `/admin` resolve to `index.html`.

The app includes `public/robots.txt` and a Netlify-compatible `public/_headers` file. For another host, configure equivalent headers: HTTPS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` disabling camera/microphone/geolocation, and a Content-Security-Policy that allows the deployed Supabase project, Google Fonts, WhatsApp, Instagram, and Google Maps origins actually used by the site.

Recommended release checks:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

After deployment, verify `/`, `/collections`, a collection detail URL, and `/admin` after a hard refresh. Confirm anonymous users can read fabrics but cannot insert, update, delete, or upload through Supabase RLS.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
