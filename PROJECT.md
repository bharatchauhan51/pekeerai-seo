# PekkerAI — Project Reference Document

> **Last Updated:** March 2026  
> **Purpose:** Single source of truth for AI agents and developers. Read this file first to understand the entire project, its architecture, practices, conventions, and business logic.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Business Logic & Core Concepts](#business-logic--core-concepts)
5. [Design System](#design-system)
6. [SEO Practices](#seo-practices)
7. [API Routes & Integrations](#api-routes--integrations)
8. [Authentication](#authentication)
9. [Routing & Navigation](#routing--navigation)
10. [Blog & Content Strategy](#blog--content-strategy)
11. [Deployment & Infrastructure](#deployment--infrastructure)
12. [Coding Conventions](#coding-conventions)
13. [Key Files Reference](#key-files-reference)
14. [Known Roadmap Items](#known-roadmap-items)

---

## Product Overview

**PekkerAI** is an AI-powered SEO content pipeline SaaS tool.

- **Domain:** [https://pekkerai.com](https://pekkerai.com)
- **Email:** hello@pekkerai.com
- **Twitter:** @PekkerAI
- **Tagline:** "The ultra-lean AI content pipeline for founders and SEO freelancers."
- **Value Proposition:** Go from a target keyword to a publish-ready, highly researched article for ~$1 per article.
- **Target Audience:** SaaS founders, SEO freelancers, content agencies, solo bloggers.
- **Current Stage:** Private Beta (waitlist-based onboarding, first 500 users get lifetime pricing).
- **Promo Code (Active):** `FOUNDER50` — 50% off for life during beta.

### What the Product Does (3-Step Pipeline)

1. **Enter Keyword** — User inputs a target keyword, optionally a competitor URL, and sets tone/audience preferences (AI Content Guardrails).
2. **AI Builds SEO Brief** — PekkerAI scrapes top-ranking results, extracts LSI keywords, analyzes competitor content structure, and generates an optimized article outline with title suggestions.
3. **Edit, Export, Publish** — User reviews and refines the AI-generated article in a rich editor (with AI chat for refinements), then exports as HTML or Markdown.

---

## Tech Stack

| Layer         | Technology                              | Version        |
|--------------|----------------------------------------|----------------|
| Framework    | **Next.js** (App Router)                | 16.1.6         |
| Language     | **TypeScript**                          | ^5             |
| UI Library   | **React**                               | 19.2.3         |
| Styling      | **TailwindCSS** (with PostCSS)          | ^4             |
| Icons        | **lucide-react**                        | ^0.575.0       |
| Fonts        | **Geist** and **Geist Mono** (via `next/font/google`) |    |
| Deployment   | **Vercel**                              | Production     |
| Package Mgr  | **npm**                                 |                |

### Scripts

```bash
npm run dev    # Start dev server (next dev)
npm run build  # Production build (next build)
npm run start  # Start production server (next start)
npm run lint   # Run ESLint
```

---

## Project Structure

```
pekkerai-seo/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, AuthProvider)
│   ├── page.tsx                # Landing page (~1000 lines, main marketing page)
│   ├── globals.css             # Global CSS + design tokens
│   ├── icon.tsx                # Dynamic favicon/icon generator
│   ├── robots.ts               # Robots.txt configuration
│   ├── sitemap.ts              # Dynamic sitemap generation
│   │
│   ├── api/
│   │   ├── contact/route.ts    # Contact form → Discord webhook
│   │   └── notify/route.ts     # Waitlist & payment intent → Discord webhook
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # Auth context (demo/simulated login)
│   │
│   ├── about/page.tsx           # About page
│   ├── blog/
│   │   ├── page.tsx             # Blog index (lists all posts)
│   │   ├── does-google-penalize-ai-generated-content/page.tsx
│   │   └── pekkerai-vs-koala-writer/page.tsx
│   ├── contact/
│   │   ├── page.tsx             # Contact page (server component with metadata)
│   │   └── ContactForm.tsx      # Contact form (client component)
│   ├── cookie-policy/page.tsx   # Cookie policy page
│   ├── dashboard/
│   │   ├── page.tsx             # Dashboard home (stats, recent articles, keywords)
│   │   ├── new/page.tsx         # Article creation wizard (4-step flow)
│   │   └── account/page.tsx     # Account settings, billing, plan management
│   ├── demo/page.tsx            # Public demo of the article creation flow
│   ├── login/page.tsx           # Login page (demo auth)
│   └── privacy/page.tsx         # Privacy policy page
│
├── public/
│   ├── demo.mp4                 # Product demo video (~34MB)
│   └── *.svg                    # Static SVG assets
│
├── .agents/
│   └── skills/design-guide/     # UI/UX design skill guide
│
├── SEO_CHECKLIST.md             # SEO best practices checklist
├── next.config.ts               # Next.js configuration (currently empty)
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

---

## Business Logic & Core Concepts

### Pricing Plans (Landing Page)

| Plan      | Price     | Articles/Month | Key Features                                                  |
|-----------|-----------|---------------|---------------------------------------------------------------|
| **Starter** | $9/mo   | 10            | AI Outline Generation, Auto Meta Data, Standard Support       |
| **Pro** ⭐  | $29/mo  | 40            | Multiple Tones of Voice, HTML & Markdown Export, Priority Support |
| **Agency**  | $49/mo  | 150           | Competitor URL Analysis, Advanced AI Guardrails, 24/7 Support |

> **Note:** The dashboard has DIFFERENT dummy pricing data (Starter $19, Pro $49, Business $99) used for the account/billing mockup. The **landing page pricing is the source of truth** for customer-facing plans.

### Article Creation Flow (4 Steps)

Located in `app/dashboard/new/page.tsx` and `app/demo/page.tsx`:

1. **Step 1 — Input & Setup:** Enter target keyword, optional competitor URL, tone of voice, target audience.
2. **Step 2 — Research & Structure:** AI analyzes top SERP results (simulated with dummy data), shows SERP analysis table (position, title, URL, word count, headings, score), generates editable article outline (H2/H3 hierarchy).
3. **Step 3 — Review & Refine:** Full article editor with rendered HTML content, AI chat sidebar for refinements (quick actions like "Make intro more engaging", "Add statistics"), SEO score panel, meta title/description preview, FAQ generation, download as HTML.
4. **Step 4 — Schedule & Publish:** Content calendar view, scheduling options, publish controls.

### Dashboard Data (Currently Dummy/Mock)

The dashboard displays hardcoded mock data:
- **Stats:** Total Articles (24), Monthly Traffic (12.4K), Avg. SEO Score (87), Keywords Ranking (142)
- **Recent Articles:** List with titles, status, scores, dates, views
- **Top Keywords:** Table with keyword, position, change, volume
- **Traffic Bars:** Weekly traffic visualization

### Waitlist / Beta Flow

- CTA buttons (e.g., "Start Pro Plan", "Choose Plan") → Open modal → Collect email → Submit to `/api/notify` → Sends Discord webhook
- The modal says "Join the Private Beta" and explains first 500 users get lifetime pricing
- Plan clicks also send tracking data (UTM params, device info, screen size, timezone, referrer)

---

## Design System

### Color Palette

Defined in `app/globals.css` as CSS custom properties:

| Token                    | Value                          | Usage                              |
|-------------------------|--------------------------------|------------------------------------|
| `--background`          | `#0a0a0a`                      | Page background (near-black)       |
| `--foreground`          | `#ededed`                      | Default text color                 |
| `--color-primary`       | `#a3e635` (lime-400)           | Primary brand color (buttons, accents) |
| `--color-primary-hover` | `#bef264` (lime-300)           | Hover state for primary            |
| `--color-primary-dark`  | `#84cc16` (lime-500)           | Darker primary variant             |
| `--color-surface`       | `#111111`                      | Card/panel backgrounds             |
| `--color-surface-hover` | `#1a1a1a`                      | Surface hover state                |
| `--color-border`        | `rgba(255,255,255,0.1)`        | Default border                     |
| `--color-border-hover`  | `rgba(255,255,255,0.2)`        | Border hover state                 |
| `--color-text-primary`  | `#ffffff`                      | Headings, primary text             |
| `--color-text-secondary`| `#9ca3af`                      | Body text (neutral-400)            |
| `--color-text-muted`    | `#6b7280`                      | Muted helper text (neutral-500)    |

### Theme: Dark-Only

The entire app is **dark mode only** — background `#0a0a0a`, text white/neutral, with **lime-400 (`#a3e635`)** as the accent color. There is no light mode toggle.

### Typography

- **Primary Font:** Geist Sans (`--font-geist-sans`)
- **Mono Font:** Geist Mono (`--font-geist-mono`)
- Font smoothing: `-webkit-font-smoothing: antialiased`

### Spacing & Radius System (CSS Variables)

```
Spacing: 0.25rem (1) → 0.5rem (2) → 0.75rem (3) → 1rem (4) → 1.5rem (6) → 2rem (8) → 3rem (12) → 4rem (16) → 6rem (24)
Radius:  0.375rem (sm) → 0.5rem (md) → 0.75rem (lg) → 1rem (xl) → 1.5rem (2xl) → 9999px (full)
```

### Glow Shadows

```css
--shadow-glow-sm: 0 0 20px rgba(163, 230, 53, 0.1);
--shadow-glow-md: 0 0 40px rgba(163, 230, 53, 0.15);
--shadow-glow-lg: 0 0 80px rgba(163, 230, 53, 0.1);
```

### Transitions

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Patterns

- **Scroll Reveal:** `RevealOnScroll` component in `page.tsx` uses `IntersectionObserver` with fade-in + translate-up animation
- **Hero Droplets:** Falling lime-green square particles with `droplet-fall` and `droplet-glow` keyframes
- **Glowing Orb:** Pulsing lime blur effect behind hero section
- **Shimmer / Fade-in-up:** Used for staggered entrance animations
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce` (disables all animations)

### Common UI Patterns

- **Cards:** `rounded-2xl border border-white/10 bg-[#111] p-8` with `hover:border-lime-400/30`
- **Buttons (Primary):** `bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-full`
- **Buttons (Secondary):** `border border-white/20 hover:border-lime-400/50 text-white rounded-full`
- **Inputs:** `bg-white/5 border border-white/10 rounded-xl` with `focus:ring-2 focus:ring-lime-400`
- **Navigation:** Sticky top bar with `bg-[#0a0a0a]/80 backdrop-blur-xl`, border-b border-white/5
- **Logo element:** Lime-400 rounded-lg square with `<Sparkles>` icon inside

### Selection Styling

```css
::selection { background: rgba(163, 230, 53, 0.2); color: #a3e635; }
```

---

## SEO Practices

### Metadata Structure (layout.tsx)

Every page implements its own `Metadata` export where possible. The root layout provides defaults:

```typescript
{
  metadataBase: new URL('https://pekkerai.com'),
  title: "PekkerAI — AI-Powered SEO Content Pipeline | Rank Higher in Minutes",
  description: "The ultra-lean AI content pipeline...",
  applicationName: 'PekkerAI',
  keywords: ['SEO content generator', 'AI writer', ...],
  openGraph: { ... },       // Full OG tags with title, description, URL, siteName
  twitter: { card: 'summary_large_image', ... },
  robots: { index: true, follow: true, googleBot: { ... } },
}
```

### Page-Level Metadata

Each public page exports its own `Metadata` object with:
- Unique `title` and `description`
- `keywords` array
- `openGraph` tags with canonical URL
- `alternates.canonical` for canonical URLs

### Sitemap (`app/sitemap.ts`)

Manually managed sitemap with 10 entries:
- Homepage (priority 1, weekly)
- Blog index (priority 0.9, weekly)
- About, Contact, Demo (priority 0.8, monthly)
- Blog articles (priority 0.8, monthly)
- Login (priority 0.6, monthly)
- Privacy, Cookie Policy (priority 0.3, monthly)

**⚠️ IMPORTANT:** When adding new pages, you MUST manually add them to `sitemap.ts`.

### Robots (`app/robots.ts`)

- Allows all crawlers on `/`
- Disallows `/api/` routes from indexing
- Explicitly allows `OAI-SearchBot` and `ChatGPT-User` bots
- Points to `https://pekkerai.com/sitemap.xml`

### SEO Checklist

A comprehensive checklist exists at `SEO_CHECKLIST.md` covering:
- URL structure (descriptive URLs, hyphens, HTTPS, subfolders over subdomains)
- Accessibility (semantic HTML, WAI-ARIA, 404 pages)
- Meta info (unique titles 60-100 chars, descriptions 50-160 chars)
- Keywords (single primary keyword per page, in title/H1/H2/URL)
- Content (heading hierarchy, 300+ word min, `<strong>` for keywords)
- Media (alt tags, descriptive filenames, WebP, explicit dimensions)
- Links (descriptive anchor text, 3+ internal links, `nofollow` for untrusted)
- Mobile (viewport meta, 44x44px tap targets, OG + Twitter cards)
- Architecture (sitemap, Google Search Console)

### Internal Linking Strategy

Blog articles are internally linked to each other with relevant anchor text. When creating new content:
- Add 3+ relevant internal links per article
- Use descriptive anchor text (not "click here")
- Link between blog posts, and from blog posts to landing page sections

---

## API Routes & Integrations

### `POST /api/contact` (`app/api/contact/route.ts`)

**Purpose:** Handles contact form submissions.

- **Input:** `{ name, email, message }`
- **Validation:** All three fields required → 400 if missing
- **Action:** Sends a Discord webhook embed with the submission details
- **Discord Embed:** Title "🚀 New Contact Form Submission" with name, email, message fields, lime-green color (`0xA3E635`)

### `POST /api/notify` (`app/api/notify/route.ts`)

**Purpose:** Tracks waitlist signups and plan click intents.

- **Input:** `{ plan, price, timestamp, email?, tracking? }`
- **Tracking Object:**
  ```typescript
  {
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    referrer, page_url, screen, language, timezone, device_type
  }
  ```
- **Action:** Sends a rich Discord webhook embed with all tracking data
- **Discord Embed:** Title "🔔 Payment Intent Detected!" with plan, time, email, UTM params, IP, user agent

### Discord Webhook

Both APIs use the **same Discord webhook URL** (hardcoded, not in env vars). The webhook posts to a Discord channel for real-time notifications.

> **⚠️ Note:** The webhook URL is currently hardcoded in the source code, not environment variables.

---

## Authentication

### Current Implementation: Demo/Simulated Auth

Located in `app/context/AuthContext.tsx`:

- **Storage:** `localStorage` key `pekkerai_user`
- **Login:** Accepts **any** email and password (demo mode)
- **User Object:** `{ email, name, plan: 'Pro', avatar }`
  - `name` is derived from email prefix, capitalized
  - `avatar` is first letter of email, uppercased
- **Logout:** Clears localStorage
- **Provider:** `<AuthProvider>` wraps all children in root layout
- **Hook:** `useAuth()` returns `{ user, isLoggedIn, isLoading, login, logout }`
- **Protected Routes:** Dashboard pages check `isLoggedIn` on mount and redirect to `/login` if not authenticated

### Auth Flow

1. User visits `/login`
2. Enters any email + password
3. 1.2s simulated delay
4. User object created and stored in localStorage
5. Redirected to `/dashboard`
6. If already logged in, `/login` auto-redirects to `/dashboard`

---

## Routing & Navigation

### Public Pages (No Auth Required)

| Route                    | File                                     | Type   | Description                    |
|--------------------------|------------------------------------------|--------|--------------------------------|
| `/`                      | `app/page.tsx`                           | Client | Landing page (marketing)       |
| `/about`                 | `app/about/page.tsx`                     | Server | About page                     |
| `/blog`                  | `app/blog/page.tsx`                      | Server | Blog index                     |
| `/blog/[slug]`           | `app/blog/[slug]/page.tsx`               | Server | Individual blog articles        |
| `/contact`               | `app/contact/page.tsx`                   | Server | Contact page                   |
| `/demo`                  | `app/demo/page.tsx`                      | Client | Interactive product demo        |
| `/login`                 | `app/login/page.tsx`                     | Client | Login page                     |
| `/privacy`               | `app/privacy/page.tsx`                   | Server | Privacy policy                 |
| `/cookie-policy`         | `app/cookie-policy/page.tsx`             | Server | Cookie policy                  |

### Protected Pages (Auth Required — checks localStorage)

| Route                    | File                                     | Type   | Description                    |
|--------------------------|------------------------------------------|--------|--------------------------------|
| `/dashboard`             | `app/dashboard/page.tsx`                 | Client | Dashboard home                 |
| `/dashboard/new`         | `app/dashboard/new/page.tsx`             | Client | Create new article (4-step wizard) |
| `/dashboard/account`     | `app/dashboard/account/page.tsx`         | Client | Account settings & billing     |

### Landing Page Navigation Links

```typescript
const navLinks = [
  { label: 'Features',     id: 'features',     path: '/#features' },
  { label: 'How it Works', id: 'how-it-works', path: '/#how-it-works' },
  { label: 'Pricing',      id: 'pricing',      path: '/#pricing' },
  { label: 'Blog',         id: 'blog',          path: '/blog' },
  { label: 'FAQ',          id: 'faq',           path: '/#faq' },
];
```

### Footer Links

- **Product:** Features, Pricing, How it Works, Roadmap
- **Company:** About, Blog, Contact
- **Legal:** Privacy Policy, Terms of Service, Cookie Policy
- **Social:** Twitter, LinkedIn, GitHub (currently `#` placeholders)

---

## Blog & Content Strategy

### Blog Structure

- **Index:** `app/blog/page.tsx` — Lists all posts from a hardcoded `POSTS` array
- **Articles are static files** — Each blog post is a separate `page.tsx` in its own directory

### Published Articles

1. **"PekkerAI vs Koala Writer"** (`/blog/pekkerai-vs-koala-writer`) — Comparison article, category: Comparison
2. **"Does Google Penalize AI-Generated Content?"** (`/blog/does-google-penalize-ai-generated-content`) — SEO Strategy article

### Blog Design Conventions

- Each article has its own `Metadata` export with title, description, keywords, OG tags
- Blog index uses a grid layout with cards linking to each post
- Blog pages share a consistent navigation pattern: Logo on left, "Back to Home" on right
- Category badges shown as uppercase lime-400 text
- Articles include internal links to each other

### Adding a New Blog Post

1. Create directory: `app/blog/[slug]/page.tsx`
2. Export `Metadata` with title, description, keywords, OG, canonical
3. Add the post to the `POSTS` array in `app/blog/page.tsx`
4. Add the URL to `app/sitemap.ts`
5. Add internal links to/from existing articles
6. Follow the SEO checklist in `SEO_CHECKLIST.md`

---

## Deployment & Infrastructure

### Hosting: Vercel

- Deployed automatically from Git
- Custom domain: `pekkerai.com`
- HTTPS enforced by default
- `.vercel/` directory exists for local Vercel CLI config (gitignored)

### Environment Variables

Currently, **no `.env` file is used**. The Discord webhook URL is hardcoded in API route files. If environment variables are introduced:
- `.env*` files are in `.gitignore`
- Use `process.env.VARIABLE_NAME` in server-side code (API routes)

### Build & Performance

- **No custom `next.config.ts` options** are set currently (empty config object)
- Images use Next.js `<Image>` component where appropriate
- Font optimization via `next/font/google`
- Smooth scrolling enabled globally (`scroll-behavior: smooth`)
- Custom scrollbar styling for dark theme

---

## Coding Conventions

### File Naming

- **Pages:** `page.tsx` in their route directory
- **Components:** PascalCase (e.g., `ContactForm.tsx`)
- **API Routes:** `route.ts` in their directory

### Component Patterns

- **Client Components:** Marked with `'use client'` — used for interactive pages (landing, dashboard, login, demo)
- **Server Components:** Default for static pages (about, blog, contact, privacy, cookie-policy)
- **Metadata:** Always export `Metadata` from server components; client-only pages set metadata in the root layout

### Styling Approach

- **TailwindCSS 4** for utility classes
- **CSS custom properties** for design tokens in `globals.css`
- **Inline styles** only for dynamic values (animation delays, dimensions)
- **`<style>` blocks** for keyframe animations (in `page.tsx`)
- **No CSS modules or styled-components**

### Common Tailwind Patterns Used

```
// Surface card
"rounded-2xl border border-white/10 bg-[#111] p-8"

// Primary button (pill)
"bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-full"

// Text input
"bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-lime-400"

// Nav bar
"border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50"

// Glassmorphic glow
"shadow-[0_0_40px_rgba(163,230,53,0.3)]"

// Focus visible outline
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
```

### State Management

- **React useState/useEffect** — No external state management library
- **Context API** — Only `AuthContext` for auth state
- **localStorage** — For auth persistence only

### Accessibility

- `aria-label` on interactive elements (buttons, nav, menu toggle)
- `aria-expanded` on expandable components
- `focus-visible` styles on all interactive elements
- `<label>` elements with `htmlFor` on all form inputs
- Semantic HTML (`<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`)
- `sr-only` text for screen readers where needed

### Responsive Design

- Mobile-first approach with Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- Hamburger menu on mobile (`md:hidden` toggle)
- Grid layouts collapse to single column on mobile
- Touch-friendly tap targets
- Flexible padding and font sizes

---

## Key Files Reference

| Purpose                     | File Path                               |
|----------------------------|-----------------------------------------|
| Root layout + SEO metadata | `app/layout.tsx`                        |
| Landing page               | `app/page.tsx`                          |
| Design tokens (CSS)        | `app/globals.css`                       |
| Auth system                | `app/context/AuthContext.tsx`           |
| Sitemap                    | `app/sitemap.ts`                        |
| Robots                     | `app/robots.ts`                         |
| Contact API                | `app/api/contact/route.ts`             |
| Notification API           | `app/api/notify/route.ts`              |
| Article wizard             | `app/dashboard/new/page.tsx`           |
| SEO checklist              | `SEO_CHECKLIST.md`                     |
| Dashboard                  | `app/dashboard/page.tsx`               |
| Account/billing            | `app/dashboard/account/page.tsx`       |
| Blog index                 | `app/blog/page.tsx`                    |
| UI/UX design skill guide   | `.agents/skills/design-guide/SKILL.md` |

---

## Known Roadmap Items

Based on FAQ and product copy:

- [ ] **WordPress Integration** — REST API export, planned for Q2 2026
- [ ] **Real Backend Auth** — Replace demo localStorage auth with actual auth provider
- [ ] **Payment Processing** — Currently plan clicks send Discord notifications; no actual Stripe/payment integration
- [ ] **Real AI Pipeline** — Article creation uses dummy/mock data; needs actual AI API integration
- [ ] **Database** — No database currently; all data is hardcoded/mocked
- [ ] **API Access** — Mentioned in Business plan features but not implemented
- [ ] **Team Collaboration** — Mentioned in pricing but not built
- [ ] **Terms of Service** — Footer links to `#` (placeholder)
- [ ] **Social Media Links** — Twitter, LinkedIn, GitHub links are `#` placeholders
- [ ] **Move Discord Webhook to env vars** — Currently hardcoded in source
- [ ] **Real analytics/tracking** — Currently relies on Discord webhooks for event tracking
- [ ] **Additional article credits purchase** — Mentioned in FAQ but not implemented
- [ ] **Content calendar** — Step 4 of article wizard shows a mock calendar

---

## Quick Start for AI Agents

1. **Read this file first** to understand the project.
2. **Check `SEO_CHECKLIST.md`** when working on any content or new pages.
3. **Follow the design system** — dark theme, lime-400 accents, design tokens from `globals.css`.
4. **Always update `sitemap.ts`** when adding new public routes.
5. **Use `'use client'`** only when the component needs interactivity (useState, useEffect, event handlers).
6. **Export `Metadata`** from server components for SEO.
7. **Follow existing patterns** — look at similar pages for layout/nav/footer consistency.
8. **Blog posts** need: own directory, Metadata export, entry in POSTS array, sitemap entry, internal links.
9. **Test accessibility** — aria labels, keyboard navigation, focus states.
10. **Respect reduced motion** — all animations must be disabled under `prefers-reduced-motion: reduce`.
