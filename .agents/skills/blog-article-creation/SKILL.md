---
name: Blog Article Creation
description: Complete checklist for creating, publishing, and promoting SEO-optimized blog articles on pekkerai.com
---

# Blog Article Creation Skill

Follow this end-to-end workflow when creating a new blog article for pekkerai.com.

---

## Phase 1: Content Planning

1. **Define target keyword** — confirm it's low KD, has search volume
2. **Draft article outline** — use PekkerAI workflow: keyword → outline → write → edit
3. **Target word count** — typically 1,500–2,000 words (10 min read)
4. **Plan internal links** — identify 1–2 existing blog posts to link to/from

---

## Phase 2: Article Page (`app/blog/{slug}/page.tsx`)

### SEO Metadata (Next.js `export const metadata`)
- **Title tag**: max 58 characters, include target keyword
- **Meta description**: max 158 characters, include keyword + value proposition
- **Keywords array**: 5–8 related terms (primary + LSI)
- **Open Graph tags**: `og:title`, `og:description`, `og:url`, `og:type=article`, `publishedTime`, `authors`
- **Canonical URL**: `https://pekkerai.com/blog/{slug}`

### JSON-LD Structured Data (inside component as `<script type="application/ld+json">`)

#### Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "image": "https://pekkerai.com/og-image.png",
  "author": {
    "@type": "Person",
    "name": "Bharat Chauhan",
    "jobTitle": "Founder",
    "worksFor": { "@type": "Organization", "name": "PekkerAI", "url": "https://pekkerai.com" }
  },
  "publisher": {
    "@type": "Organization",
    "name": "PekkerAI",
    "url": "https://pekkerai.com",
    "logo": { "@type": "ImageObject", "url": "https://pekkerai.com/icon.png" }
  },
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://pekkerai.com/blog/{slug}" },
  "keywords": ["keyword1", "keyword2"]
}
```

#### FAQPage Schema (if article has FAQ section)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": { "@type": "Answer", "text": "Answer text." }
    }
  ]
}
```

### Article Structure
- **Nav bar**: sticky, PekkerAI logo + "All Articles" back link to `/blog`
- **Header**: category tag, read time, publish date, H1 title
- **Author byline**: avatar initials + name + title + date
- **TL;DR box**: lime accent border, bold summary
- **Table of Contents**: numbered anchor links
- **Body sections**: H2 headings with anchor IDs, tables, pros/cons cards, callout boxes
- **FAQ section**: `<details>` accordion pattern with lime accent on open
- **CTA block**: lime-400 background, heading + description + button + trust badges

### Internal Links
- Link to 1–2 existing blog posts using: `<Link href="/blog/{slug}" className="text-lime-400 hover:text-lime-300 underline decoration-lime-400/30 underline-offset-4 transition-colors">anchor text</Link>`
- Style must match existing link pattern exactly

---

## Phase 3: Site Updates

### Blog Index (`app/blog/page.tsx`)
Add new post to `POSTS` array at **position 0** (most recent first):
```ts
{
    slug: '{slug}',
    title: '...',
    description: '...',
    date: 'Month YYYY',
    category: 'Comparison' | 'SEO Strategy' | 'Guide',
}
```

### Sitemap (`app/sitemap.ts`)
Add new entry:
```ts
{
    url: `${baseUrl}/blog/{slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
}
```

### Cross-Linking
Add 1 contextual internal link from each existing blog post to the new article, in a relevant paragraph.

---

## Phase 4: Verification

1. **Build check**: `npx next build` — must pass with zero errors
2. **Local preview**: open `http://localhost:3000/blog/{slug}` and verify rendering
3. **Validate structured data**: paste page source into [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## Phase 5: Publish & Promote

1. **Git commit & push** to `main`
2. **Deploy** via Vercel (auto-deploy on push, or `vercel --prod`)
3. **Google Search Console**: URL Inspection → paste URL → Request Indexing
4. **Bing Webmaster Tools**: URL Inspection → paste URL → Submit
5. **Social post** (X/Twitter): 2-line teaser with link, e.g.:
   > "Published: {article hook} → https://pekkerai.com/blog/{slug}"
