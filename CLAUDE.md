# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build (run this to verify zero errors before committing)
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test suite. Use `npm run build` as the primary correctness check before any commit.

## Architecture

**PekkerAI** is a marketing/SEO website for an AI-powered SEO content pipeline product. Built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4. Deployed on Vercel at `pekkerai.com`.

### App structure

All pages are static Server Components under `app/`. No CMS — blog posts are hand-coded `.tsx` files.

| Path | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout: sets global metadata, fonts (Geist), mounts `PageViewTracker` |
| `app/page.tsx` | Homepage (landing page) |
| `app/blog/page.tsx` | Blog index — maintain the `POSTS` array in order (newest first) |
| `app/blog/{slug}/page.tsx` | Individual blog articles |
| `app/sitemap.ts` | Static sitemap — must be updated manually when adding pages |
| `app/robots.ts` | Robots rules |

### API routes (all post to Discord webhooks)

| Route | Trigger |
|-------|---------|
| `app/api/page-view/route.ts` | Every page visit (fires from `PageViewTracker`) |
| `app/api/notify/route.ts` | Payment intent clicks (plan + email + UTM data) |
| `app/api/contact/route.ts` | Contact form submissions |

The Discord webhook URL is **hardcoded** in `notify/route.ts` and `page-view/route.ts`. `contact/route.ts` also hardcodes it (the env var check in that file is dead code).

### Analytics

`app/components/PageViewTracker.tsx` is a Client Component rendered in the root layout. On each route change it fires a POST to `/api/page-view` with UTM params, referrer, screen size, and device type. Uses `sessionStorage` to deduplicate within a tab session.

### Design system

Dark theme throughout: `bg-[#0a0a0a]` background, `lime-400` as the primary accent color. Icons from `lucide-react`. The project uses Tailwind utility classes directly — no CSS custom properties or component library.

Internal links inside blog articles use this exact class pattern:
```tsx
className="text-lime-400 hover:text-lime-300 underline decoration-lime-400/30 underline-offset-4 transition-colors"
```

## Adding a blog article

Follow this sequence (all three steps are required):

1. **Create** `app/blog/{slug}/page.tsx` — see existing articles for the full structure template. Required elements:
   - `export const metadata` with title (≤58 chars), description (≤158 chars), OG tags, and canonical URL
   - JSON-LD `Article` schema (and `FAQPage` schema if there's an FAQ section)
   - Sticky nav with PekkerAI logo + "All Articles" back link
   - Author byline, TL;DR box, Table of Contents, body with H2 anchor IDs, CTA block

2. **Update** `app/blog/page.tsx` — prepend a new entry to the `POSTS` array (newest first):
   ```ts
   { slug: '{slug}', title: '...', description: '...', date: 'Month YYYY', category: 'Comparison' | 'SEO Strategy' | 'Guide' }
   ```

3. **Update** `app/sitemap.ts` — add a new entry with `priority: 0.8` and `changeFrequency: 'monthly'`.

After writing, add at least one internal link from an existing blog post to the new article (and vice versa).

## SEO requirements

Every page must have:
- Unique `<title>` (60–100 chars) and `<meta description>` (50–160 chars) with the target keyword
- One `<h1>` per page containing the target keyword
- Open Graph and Twitter Card meta tags
- Descriptive `alt` text on all non-decorative images

The `SEO_CHECKLIST.md` in the repo root is the reference checklist — consult it before pushing any new page.

## Skills

Custom Claude Code skills live in `.agents/skills/`:
- **`blog-article-creation`** — end-to-end workflow for creating, publishing, and promoting a blog article
- **`design-guide`** — UI/UX principles to follow when creating or modifying any visual interface
