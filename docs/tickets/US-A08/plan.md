# US-A0.8 — Integrate Keycloak OIDC Authentication — Implementation Plan

## Summary

The **backend already handles the entire OIDC flow** — it has `/auth/oauth` and `/auth/oauth/callback` endpoints that redirect to Keycloak (`auth.nrichter.com`), exchange authorization codes, and issue a `session_token` httpOnly JWT cookie (signed with `JWT_SECRET`, 1h expiry, 24h cookie maxAge).

The frontend's job is simple: **redirect to the backend's OAuth endpoint, read the resulting cookie, and protect routes.**

**New dependency:** `jose` (decode the backend's JWT to extract user info server-side — no verification needed since the cookie is httpOnly and backend-signed, but we decode the payload for display purposes).

---

## Architecture Overview

```
Browser ──► /login ──► Backend /auth/oauth ──► Keycloak (auth.nrichter.com)
                                                    │
                                              user authenticates
                                                    │
                                        Backend /auth/oauth/callback
                                          ├── exchanges code for ID token
                                          ├── creates/retrieves user record
                                          ├── issues session_token JWT cookie
                                          └── redirects to Frontend (FRONTEND_URL)
                                                    │
                                              Browser has session_token cookie
                                              ├── Frontend reads cookie server-side
                                              ├── Frontend decodes JWT → { sub, email, role, userId }
                                              └── Cookie sent to Backend on every API call
```

**Key insight:** The backend's JWT payload is `{ sub, email, role, userId }`. The backend enforces RBAC via its `RolesGuard`. The frontend only needs to know **if** the user is authenticated and **who** they are — not enforce permissions.

**No token refresh.** When the JWT expires (1h), the next backend request returns 401. The frontend detects this and redirects to re-authenticate.

---

## Sub-task Breakdown

### US-A0.8.1 — Configure OIDC client and token management

**Goal:** Set up env vars and the session-reading layer.

| Step | File | What | Verify |
|------|------|------|--------|
| 1 | `.env.example` | Add `NEXT_PUBLIC_BACKEND_URL=http://localhost:3100` (backend base URL for OAuth redirect) | var present |
| 2 | `next.config.ts` | Enable `experimental.authInterrupts: true` | `next build` succeeds |
| 3 | `package.json` | `npm install jose` | `jose` in dependencies |
| 4 | `src/app/lib/session.ts` | `getSession()`: reads `session_token` cookie via `cookies()`, decodes JWT payload with `jose.decodeJwt()` (no verification — backend owns the secret), returns typed `Session \| null`. Checks `exp` claim. `import 'server-only'`. | Unit tests pass |

**Key decisions:**
- We **decode** the backend's JWT, we don't **verify** it. The cookie is httpOnly, set by the backend, and the backend verifies it on every API call. The frontend just reads the payload for display.
- No `SESSION_SECRET` needed on the frontend side.
- No OIDC helpers needed — the backend handles all Keycloak communication.

---

### US-A0.8.2 — Create auth context provider and session hook

**Goal:** Expose auth state to client components via React Context.

| Step | File | What | Verify |
|------|------|------|--------|
| 1 | `src/app/lib/dal.ts` | Data Access Layer: `verifySession()` — calls `getSession()`, returns typed `Session` or `null`. Server-only. | Unit tests pass |
| 2 | `src/app/api/auth/session/route.ts` | GET route handler — calls `verifySession()`, returns `{ user: { email, role, userId }, isAuthenticated }`. No token leaked. | `curl` returns expected JSON |
| 3 | `src/app/components/AuthProvider.tsx` | `"use client"` context provider. Fetches `/api/auth/session` on mount. Exposes `useAuth()` hook → `{ user, isAuthenticated, isLoading, login, logout }`. `login()` redirects to `NEXT_PUBLIC_BACKEND_URL/auth/oauth`. `logout()` calls backend's logout endpoint. | Renders without error |
| 4 | `src/app/layout.tsx` | Wrap `{children}` with `<AuthProvider>` | App renders |

**Key decisions:**
- `useAuth()` returns `isLoading: true` until the session fetch resolves (avoids flash of wrong UI).
- `login()` does a full-page redirect to the backend's `/auth/oauth` — no frontend-side OAuth logic.

---

### US-A0.8.3 — Build protected route wrapper component

**Goal:** Protect routes using Next.js 16's `unauthorized()` and `proxy.ts`.

| Step | File | What | Verify |
|------|------|------|--------|
| 1 | `src/app/unauthorized.tsx` | Custom 401 UI — "Please log in" message with a button that calls `login()`. Uses the Next.js 16 `unauthorized` file convention. | Navigating to protected route while logged out shows this page |
| 2 | `src/proxy.ts` | Optimistic route guard: checks if `session_token` cookie exists (NOT expired-check — just exists). Redirects unauthenticated users from protected routes to `/login`. Redirects authenticated users away from `/login` to `/`. | Redirect works |
| 3 | `src/app/lib/protect.ts` | Helper: `requireAuth()` — calls `verifySession()`, calls `unauthorized()` if null. Used at top of protected server components. | Protected pages return 401 when no session |

**Key decisions:**
- `proxy.ts` does **optimistic** checks only (cookie exists? → allow/deny). The authoritative check is `unauthorized()` in the page.
- Protected routes list starts with `['/dashboard']`, extended as pages are added.
- No RBAC in the frontend — backend enforces roles. Frontend can optionally hide UI elements based on `user.role` from the session, but this is cosmetic only.

---

### US-A0.8.4 — Scaffold login and OAuth callback routes

**Goal:** Complete the login/logout flow.

| Step | File | What | Verify |
|------|------|------|--------|
| 1 | `src/app/login/page.tsx` | Login page — "Sign in" button. Redirects to `NEXT_PUBLIC_BACKEND_URL/auth/oauth`. Simple page, no form. | Clicking button redirects to Keycloak via backend |
| 2 | `src/app/api/auth/logout/route.ts` | GET route handler: clears `session_token` cookie (frontend-side), redirects to backend's logout endpoint if one exists, otherwise redirects to `/login`. | Logout clears session |
| 3 | Integration test | Test flow: login redirect → (mock) callback sets cookie → protected route accessible → logout → session cleared → protected route shows 401. | Test passes |

**Note:** No `/api/auth/callback` route needed on the frontend. The backend's callback at `/auth/oauth/callback` handles the Keycloak response and redirects back to the frontend with the cookie already set.

---

## File Tree (new files)

```
src/
├── proxy.ts
├── app/
│   ├── unauthorized.tsx
│   ├── lib/
│   │   ├── session.ts
│   │   ├── dal.ts
│   │   └── protect.ts
│   ├── components/
│   │   └── AuthProvider.tsx
│   ├── login/
│   │   └── page.tsx
│   └── api/auth/
│       ├── session/route.ts
│       └── logout/route.ts
```

## Env Vars (added to `.env.example`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3100
```

## Backend Reference (for context, not modified by this ticket)

- **Keycloak:** `auth.nrichter.com`
- **Backend OAuth endpoints:** `GET /auth/oauth` (initiate), `GET /auth/oauth/callback` (handle)
- **Backend logout:** `POST /auth/logout` (clears cookie, returns 204)
- **Backend session info:** `GET /auth/me` (returns user profile from JWT)
- **Cookie name:** `session_token`
- **JWT payload:** `{ sub: string, email: string, role: UserRole, userId: number }`
- **JWT expiry:** 1h (`JWT_EXPIRATION=1h`)
- **Cookie maxAge:** 24h
- **No refresh tokens** — user re-authenticates after JWT expiry

## Test Strategy

- **Unit tests:** `session.ts`, `dal.ts`, `protect.ts` — mock `cookies()` for session reads.
- **Component tests:** `AuthProvider.tsx` — mock `/api/auth/session` fetch response.
- **Integration test:** Full flow with mocked `session_token` cookie.
- **Target:** >90% coverage on new auth code (per project guidelines).

## Resolved Questions

1. **Keycloak:** External instance at `auth.nrichter.com` — no Keycloak setup needed.
2. **RBAC:** Backend enforces access control via `RolesGuard`. Frontend does **not** implement RBAC. It may optionally read `user.role` for cosmetic UI decisions (show/hide admin buttons), but this is not a security boundary.
3. **Token refresh:** Backend issues a 1h JWT with no refresh token. When expired, the next API call returns 401 → frontend redirects to `/login` → user re-authenticates via Keycloak. No client-side refresh logic needed.