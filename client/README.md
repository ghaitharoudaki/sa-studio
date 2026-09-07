# SA Studio

Public-facing catalog for SA Studio, built with React and Vite.

## Supabase setup

The repository includes the database migration at `supabase/schema.sql`.

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste in `supabase/schema.sql`, and run it.
3. Open **Project Settings > API** and copy the project URL and anon key into `.env.local` using `.env.example` as the template.
4. In **Authentication > Users**, create the administrator account.
5. In SQL Editor, uncomment the final `update auth.users` statement in the schema and replace the email with the administrator email.

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
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
