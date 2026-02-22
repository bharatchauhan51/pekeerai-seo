# SEO Developer Checklist

A comprehensive checklist of Search Engine Optimization (SEO) best practices to review every time new code or content is pushed to the web app. Based on the [marcobiedermann/search-engine-optimization](https://github.com/marcobiedermann/search-engine-optimization) guide.

### 🌐 URL & Structure
- [ ] **Descriptive URLs:** Ensure the page URL is descriptive and reflects the targeted keyword.
- [ ] **Hyphens for spacing:** Split words in URLs using hyphens (e.g., `/my-new-page`, not `/my_new_page`).
- [ ] **HTTPS:** Ensure the page is served over HTTPS (enforced by default on Vercel).
- [ ] **Trailing extensions:** Do not artificially strip out file extensions on URLs if they are needed, though Next.js handles clean routing.
- [ ] **Subdomains/Subfolders:** Understand that subdomains (`blog.domain.com`) are treated as separate domains by Google compared to subfolders (`domain.com/blog`). Prefer subfolders for SEO.

### ♿ Accessibility & Performance
- [ ] **Custom 404/403 Pages:** Ensure custom, branded "Page Not Found" (404) and "Access Denied" (403) pages exist.
- [ ] **Semantic HTML:** Use proper tags (e.g., `<nav>`, `<main>`, `<article>`, `<header>`). Do not use tables for layouts.
- [ ] **Redirects:** Use 301 (Permanent) redirects instead of 302 (Temporary) redirects when moving content.
- [ ] **Performance:** Test page loading speed and mobile performance. Optimize heavy scripts.
- [ ] **Robots/Indexing:** Ensure `robots.txt` exists and the page doesn't accidentally contain `<meta name="robots" content="noindex">` if it should be public.
- [ ] **WAI-ARIA Attributes:** Use `aria-labels` and roles to help screen readers and bots understand the UI.

### 📄 Meta Information
- [ ] **Unique Meta Description:** Every page must have a unique description (`<meta name="description">`), ideally between 50 and 160 characters.
- [ ] **Unique Title:** Every page must have a unique, compelling title (`<title>`) between 60 and 100 characters.

### 🔑 Keywords
- [ ] **Single Targeted Keyword:** Every page should target one primary keyword.
- [ ] **Title Inclusion:** The primary keyword must appear in the `<title>` tag.
- [ ] **Heading Inclusion:** The primary keyword should appear in the main `<H1>` tag and at least one sub-heading (`<H2>`/`<H3>`).
- [ ] **URL Inclusion:** The keyword should be part of the URL slug.
- [ ] **Avoid Keyword Meta Tag:** Do not bother using `<meta name="keywords">`; modern search engines ignore it.

### 📝 Content
- [ ] **Heading Hierarchy:** Use clear structure (H1 → H2 → H3). Only use one `<H1>` per page. Keep headings under 70 characters.
- [ ] **Word Count:** Articles/content pages should ideally be at least 300 words.
- [ ] **Highlighting:** Use the `<strong>` tag (bolding) to naturally highlight targeted keywords in the text.
- [ ] **Uniqueness:** Do not duplicate content. Ensure copy is original.

### 🖼️ Media (Images & Video)
- [ ] **Alt Tags:** All non-decorative images must have descriptive `alt=""` attributes (60-70 characters).
- [ ] **Descriptive File Names:** Name images `seo-content-pipeline.jpg` instead of `IMG_9042.jpg`.
- [ ] **Dimensions:** Add explicit `width` and `height` attributes to prevent layout shift (Next.js `<Image>` does this automatically).
- [ ] **Optimization:** Compress images to keep file sizes low (WebP preferred). Use responsive formats.
- [ ] **Video Tags:** Use HTML5 `<video>` tags instead of unplayable content blocks. 

### 🔗 Links
- [ ] **Descriptive Link Text:** Use descriptive anchor text. Avoid "Click here" or "Read more". Use "Read more about our SEO tool".
- [ ] **Internal Linking:** Add at least 3 relevant internal links to other pages on the site.
- [ ] **Nofollow tags:** Add `rel="nofollow"` to untrusted external links or user-generated links to prevent spam penalization.
- [ ] **Hreflang:** If adding multi-language support, use `<link rel="alternate" hreflang="...">` tags.

### 📱 Mobile & Social Media
- [ ] **Viewport Meta Tag:** Ensure `<meta name="viewport" content="width=device-width, initial-scale=1">` is present (Next.js includes this standard).
- [ ] **Tap Targets:** Ensure buttons and clickable links are large enough (min 44x44px) and spaced out for fat fingers.
- [ ] **OpenGraph (OG) Tags:** Include `<meta property="og:title">`, `og:description`, `og:image`, etc., so links look good when shared on Facebook/Discord.
- [ ] **Twitter Cards:** Include Twitter-specific meta tags (`twitter:card`, `twitter:title`, `twitter:image`).

### 🗺️ Archictecture & Tooling
- [ ] **Sitemap:** Ensure the URL is added to the `sitemap.xml` (or that dynamic sitemap generation picks it up automatically).
- [ ] **Google Search Console / Analytics:** Verify that the page tracks properly in your analytics platform and is eventually submitted/indexed via GSC.
