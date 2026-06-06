# Mankind George Portfolio Site — Design Spec

**Date:** 2026-06-06
**Status:** Approved
**Stack:** Nuxt 3 + NestJS + PostgreSQL + Prisma

---

## 1. Architecture

Monorepo structure with two independent applications:

```
paper-george-site/
├── frontend/          # Nuxt 3, port 3000
├── backend/           # NestJS, port 3001
├── docker-compose.yml
├── .env.example
└── README.md
```

- **Local dev:** Both run natively on Windows, connecting to local PostgreSQL at `localhost:5432`
- **Production:** Docker Compose with `postgres-db` service, backend connects to `postgres-db:5432`
- Nuxt fetches data from NestJS via `useFetch` / `$fetch` with `runtimeConfig.public.apiBase`

---

## 2. Database Schema (Prisma)

### User
| Field | Type | Notes |
|-------|------|-------|
| id | Int | PK, autoincrement |
| username | String | unique |
| password | String | bcrypt hash |
| createdAt | DateTime | default now() |

### Experience
| Field | Type | Notes |
|-------|------|-------|
| id | Int | PK, autoincrement |
| columnType | String | "early" / "engineering" / "open-source" |
| year | String | e.g. "2020" |
| title | String | |
| contentMarkdown | String | Markdown body |
| stampStatus | String | "published" / "draft" / "archived" |
| sortOrder | Int | default 0 |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Project
| Field | Type | Notes |
|-------|------|-------|
| id | Int | PK, autoincrement |
| title | String | |
| description | String | |
| tags | String[] | PostgreSQL array |
| url | String? | nullable |
| sortOrder | Int | default 0 |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Scrap
| Field | Type | Notes |
|-------|------|-------|
| id | Int | PK, autoincrement |
| title | String | |
| content | String | |
| rotation | Float | -2.0 to 1.0 degrees |
| sortOrder | Int | default 0 |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Message
| Field | Type | Notes |
|-------|------|-------|
| id | Int | PK, autoincrement |
| name | String | |
| email | String | |
| subject | String | |
| body | String | |
| isRead | Boolean | default false |
| createdAt | DateTime | |

---

## 3. API Endpoints

### Auth
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/login` | No | `{ username, password }` | `{ access_token }` |

### Experiences
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/experiences` | No | All published, sorted by sortOrder |
| GET | `/api/experiences/:columnType` | No | Filter by column |
| POST | `/api/experiences` | Yes | Create |
| PUT | `/api/experiences/:id` | Yes | Update |
| DELETE | `/api/experiences/:id` | Yes | Delete |

### Projects
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/projects` | No | All, sorted |
| POST | `/api/projects` | Yes | Create |
| PUT | `/api/projects/:id` | Yes | Update |
| DELETE | `/api/projects/:id` | Yes | Delete |

### Scraps
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/scraps` | No | All, sorted |
| POST | `/api/scraps` | Yes | Create |
| PUT | `/api/scraps/:id` | Yes | Update |
| DELETE | `/api/scraps/:id` | Yes | Delete |

### Messages
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| POST | `/api/messages` | No | Submit contact form, triggers email |
| GET | `/api/messages` | Yes | List all |
| PUT | `/api/messages/:id/read` | Yes | Mark as read |

---

## 4. Authentication

- **Strategy:** JWT with bcrypt password hashing
- **Flow:** Login → POST `/api/auth/login` → validate credentials → return JWT
- **Storage:** Frontend stores JWT in httpOnly cookie
- **Protection:** NestJS `JwtAuthGuard` decorator on admin-only routes
- **Default user:** Seeded via `prisma/seed.ts` with `[INSERT_MANKIND_GEORGE_INFO_HERE]` placeholders

---

## 5. Email Notification

- **Library:** `@nestjs-modules/mailer` + nodemailer
- **Trigger:** POST `/api/messages` (contact form submission)
- **Config:** SMTP settings via `.env` (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- **Behavior:** Async send, does not block the API response

---

## 6. Design System

### Colors (100% opaque, no gradients)
| Token | Hex | Usage |
|-------|-----|-------|
| newsprint | `#F2EFE9` | Global background (aged paper) |
| ink | `#1E1E1E` | Text, borders, shadows |
| stamp | `#A64444` | Status stamps, tags |
| cardboard | `#DCD7C9` | Card/board background |

### Typography
| Role | Font | Fallback |
|------|------|----------|
| Headlines | Playfair Display | Georgia, serif |
| Body | Source Sans 3 | Arial, sans-serif |
| Metadata/code | IBM Plex Mono | Courier New, monospace |

### Borders & Shadows
- All borders: `border-2 border-[#1E1E1E]` (2px solid ink)
- All shadows: `shadow-[5px_5px_0px_#1E1E1E]` (hard offset, no blur)
- Variants: `shadow-[3px_3px_0px_#1E1E1E]` (small), `shadow-[8px_8px_0px_#1E1E1E]` (large)

### Prohibited
- No `backdrop-blur` or glassmorphism
- No linear/radial gradients
- No translucent overlays
- No soft/blurred shadows
- No cyberpunk/sci-fi/modern digital aesthetics

### Torn Paper Edges
- Custom `clipPath` entries in Tailwind config using irregular SVG polygons
- Multiple variants for variety across components

### Animations
| Name | Trigger | Curve |
|------|---------|-------|
| unfold | Page load (Module 1) | `cubic-bezier(0.23, 1, 0.32, 1)` |
| stamp-down | Button submit, stamps | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| spring-open | Accordion expand (Module 4) | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| slide-out | Contact form submit | `ease-in` |

---

## 7. Frontend Modules

### Module 1: Frontpage Broadside (首页)
- Full-width masthead: "THE MANKIND GEORGE CHRONICLE" in Playfair Display
- Double rule lines framing date and system status
- 4-column asymmetric newspaper grid
- 3D unfold animation on first load (`perspective(800px) rotateX`)
- Torn paper edge at viewport bottom, revealing cardboard

### Module 2: Editorial Clippings (关于我)
- Background: cardboard `#DCD7C9`
- Scraps with torn edges, random rotations (`rotate-1` to `rotate(-2)`)
- Hover: instant `rotate-0`, z-index top, slight lift (`-translate-y-1`)
- Transition: `duration-200`

### Module 3: Classified Ads (项目作品集)
- 1px ink grid lines mimicking classified ad layout
- Each project card has perforated bottom edge
- Tech tags on vertical paper strips with dashed borders
- Click strip: SVG clip-path switch (tear animation), inline detail panel expands

### Module 4: Milestone Chronicle (个人经历)
- 3-column editorial flow: early / engineering / open-source
- Each entry has dark red stamp seal in top-right corner
- Accordion: click to expand Markdown content
- Spring physics curve for natural bounce

### Module 5: Letter to the Editor (联络方式)
- Letterpaper background, no modern borders
- Input fields: ink underline only, no glow on focus
- Submit: button stamps down, letterpaper slides out of viewport

### Module 6: Editor's Control Desk (后台管理)
- Separate `/admin` route with login gate
- Industrial control panel aesthetic
- Full CRUD for: experiences, projects, scraps, messages
- JWT-protected, redirected to login if unauthenticated

---

## 8. Docker Production

### docker-compose.yml
- `postgres-db`: PostgreSQL 16 Alpine, persistent volume
- `backend`: NestJS app, depends on postgres-db
- `frontend`: Nuxt 3 app, depends on backend
- All config via `.env` variables

### Environment Switching
| Variable | Local (Windows) | Docker |
|----------|-----------------|--------|
| DATABASE_URL | `postgresql://user:pass@localhost:5432/mankind_george` | `postgresql://user:pass@postgres-db:5432/mankind_george` |
| NUXT_PUBLIC_API_BASE | `http://localhost:3001` | `http://backend:3001` |

### Dockerfiles
- `backend/Dockerfile`: Multi-stage, Node 20 Alpine, build + production
- `frontend/Dockerfile`: Multi-stage, Node 20 Alpine, build + production with Nitro server

---

## 9. Mock Data & Placeholders

All seed data uses `[INSERT_MANKIND_GEORGE_INFO_HERE]` as template variables. No real personal information is hardcoded. The seed script populates:
- 1 admin user (credentials in `.env`)
- 9 experiences (3 per column)
- 4 projects
- 4 scraps
- 0 messages (empty initially)

---

## 10. Responsive Design

- All modules use Tailwind responsive utilities (`sm:`, `md:`, `lg:`)
- Newspaper grid collapses: 4-col → 2-col → 1-col
- Mobile: single column, stacked layout
- Touch-friendly hover alternatives (tap to toggle on mobile)
