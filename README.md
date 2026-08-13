# ias_frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS admin console for `ias_backend`.

## Stack

- **Next.js 15** (App Router, route groups for `(auth)` / `(dashboard)`)
- **TypeScript**, strict mode
- **Tailwind CSS** — dark, indigo-accented theme suited to an admin/security console
- **@tanstack/react-query** for server state (companies/products/users lists)
- **zustand** for lightweight client auth state
- **react-hook-form + zod** for form validation
- **axios** with an interceptor that attaches the JWT and silently refreshes on 401
- **sonner** for toasts, **lucide-react** for icons

## Structure

```
src/
  app/
    (auth)/login, (auth)/register        # public routes
    (dashboard)/dashboard, companies,
       products, users                    # protected routes, shared shell
    layout.tsx, globals.css, page.tsx
  components/
    ui/        # Button, Input, Badge, Table — small, unstyled-opinion primitives
    layout/    # Sidebar, Header
  lib/
    api/       # one file per backend module: auth, companies, products, users
    auth/      # session.ts — access token storage
    utils.ts   # cn() class merge helper
  providers/   # react-query provider
  hooks/       # useAuth
  types/       # mirrors ias_backend's auth/company/product/user shapes
  middleware.ts  # route protection based on a session marker cookie
```

This mirrors your backend's module split (auth, companies, products, users) 1:1 so each
`lib/api/*.ts` file maps directly to one Express router.

## Getting started

```bash
npm install
cp .env.local.example .env.local
# point NEXT_PUBLIC_API_URL at your running ias_backend, then:
npm run dev
```

## Auth flow assumptions

- `POST /auth/login`, `/auth/register` return `{ user, tokens: { accessToken, refreshToken, expiresIn } }`.
- The refresh token should be set by the backend as an **httpOnly cookie** on login/register/refresh — the frontend never touches it directly, only calls `POST /auth/refresh` with `withCredentials: true`.
- Additionally, have the backend set a small **non-httpOnly marker cookie** (name matches `NEXT_PUBLIC_AUTH_COOKIE_NAME`, e.g. `ias_session=1`) so `middleware.ts` can gate page navigation without decoding the JWT. The real authorization check still happens server-side on every API call via the `Authorization: Bearer` header.
- `GET /auth/me` returns the current `AuthUser` — used by `useAuth()` to hydrate on load.

Adjust `src/types/*.ts` and `src/lib/api/*.ts` to match your actual response envelopes
(e.g. if `ias_backend` wraps responses in `{ data, meta }` everywhere, tighten
`PaginatedResponse<T>` and the `.then((r) => r.data)` calls accordingly).

## Next steps

- Add create/edit modals or dedicated `/companies/[id]`, `/products/[id]`, `/users/[id]` pages, wired to the `create`/`update` calls already stubbed in `lib/api/*`.
- Add a role-based guard (e.g. hide "Companies" nav item for non-`super_admin`) using `useAuth().user.role`.
- Add an audit log / sessions view if `ias_backend` exposes one.
