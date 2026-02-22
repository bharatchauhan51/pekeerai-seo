---
name: UI/UX Design Guide
description: >
  Comprehensive UI/UX design skill guide derived from the justinhartman/ui-ux-design-library
  (https://github.com/justinhartman/ui-ux-design-library). This skill defines the design
  principles, patterns, and best practices that MUST be followed when creating or modifying
  any visual interface in this project. It covers User Interface design, User Experience
  design, Interaction Design, Typography, Color Theory, Visual Hierarchy, White Space,
  Responsive & Mobile Design, Style Guides, Wireframing, Usability, and Marketing/Conversion
  optimization.
---

# UI/UX Design Guide — Pekker AI SEO

> **Source:** [justinhartman/ui-ux-design-library](https://github.com/justinhartman/ui-ux-design-library)
> A curated collection of 70+ professional UI/UX design resources.

This skill MUST be consulted before creating or modifying any page, component, or layout in the application. Every design decision should be traceable to one or more principles listed below.

---

## Table of Contents

1. [Core Design Philosophy](#1-core-design-philosophy)
2. [Visual Hierarchy](#2-visual-hierarchy)
3. [Color Theory & Palette](#3-color-theory--palette)
4. [Typography](#4-typography)
5. [White Space & Layout](#5-white-space--layout)
6. [UI Design Patterns](#6-ui-design-patterns)
7. [Interaction Design](#7-interaction-design)
8. [Responsive & Mobile Design](#8-responsive--mobile-design)
9. [User Experience (UX) Principles](#9-user-experience-ux-principles)
10. [Style Guide & Consistency](#10-style-guide--consistency)
11. [Wireframing & Prototyping Process](#11-wireframing--prototyping-process)
12. [Usability Testing Checklist](#12-usability-testing-checklist)
13. [Marketing & Conversion Optimization](#13-marketing--conversion-optimization)
14. [Collaboration Between Design & Development](#14-collaboration-between-design--development)
15. [Design Review Checklist](#15-design-review-checklist)
16. [Reference Library](#16-reference-library)

---

## 1. Core Design Philosophy

These overarching principles inform every design choice:

### 1.1 Human-Centered Design
- **Always design for real people.** Every feature must solve a genuine user need.
- Empathize first, prototype second, test third.
- Reference: *Field Guide to Human-Centered Design*, *The Elements of User Experience*

### 1.2 Task-Centered Interface Design
- Interfaces must be organized around **user tasks**, not system features.
- Reduce cognitive load by surfacing only what the user needs at each step.
- Reference: *Task Centred User Interface Design*

### 1.3 Visual Storytelling
- Every page should tell a story — guide the user's eye from headline → supporting content → call to action.
- Use a clear narrative arc: **hook → context → action**.
- Reference: *The Visual Storyteller's Guide to Web UI Design*, *Clever Interactive Techniques for Web Storytelling*

### 1.4 Winning Over Users
- First impressions matter. The UI must feel **premium, polished, and trustworthy** within the first 3 seconds.
- Avoid anything that looks unfinished, generic, or template-like.
- Reference: *Winning Over Users With Attractive UI Design*

---

## 2. Visual Hierarchy

> Reference: *The Building Blocks of Visual Hierarchy*

### 2.1 Rules
1. **Size** — Larger elements attract attention first. Headlines > subheadlines > body text.
2. **Color & Contrast** — High-contrast elements stand out. Use accent colors sparingly for CTAs and key actions.
3. **Position** — Top-left is seen first (F-pattern for text-heavy, Z-pattern for visual-heavy).
4. **Spacing** — Proximity groups related elements; separation distinguishes sections.
5. **Weight & Style** — Bold and italic draw attention; use them purposefully, not decoratively.

### 2.2 Implementation Rules
- Every page MUST have a single **primary visual focal point** (usually the H1 or hero element).
- No more than **3 levels** of visual emphasis on any given screen.
- CTAs must be the **most prominent interactive element** on the page.

---

## 3. Color Theory & Palette

> Reference: *Color Theory in Web UI Design*, *Flat Design and Colors*, *The Vibrancy of Color*

### 3.1 Principles
- **Never use raw CSS named colors** (e.g., `red`, `blue`, `green`). Always use curated HSL or hex values.
- Choose a **harmonious palette** of 4–6 colors: 1 primary, 1 secondary, 1 accent, 2–3 neutrals.
- Maintain **WCAG AA contrast ratios** minimum (4.5:1 for normal text, 3:1 for large text).

### 3.2 Color Usage Rules
| Role         | Usage                                      | Count |
|-------------|---------------------------------------------|-------|
| Primary      | Brand identity, headers, nav, key elements | 1     |
| Secondary    | Supporting elements, secondary buttons      | 1     |
| Accent       | CTAs, alerts, interactive highlights        | 1     |
| Neutral Dark | Text, borders, shadows                      | 1–2   |
| Neutral Light| Backgrounds, cards, dividers                | 1–2   |

### 3.3 Dark Mode
- Every design SHOULD support a dark mode variant.
- Dark mode is not just "invert colors" — adjust saturation, reduce brightness, and increase contrast.
- Use slightly desaturated versions of accent colors on dark backgrounds.

### 3.4 Gradients
- Prefer subtle, dual-tone gradients over harsh multi-color ones.
- Gradients should flow in a **consistent direction** across the app (e.g., top-left → bottom-right).
- Use gradients for hero sections, CTAs, and decorative accents — not body content.

---

## 4. Typography

> Reference: *Web UI Trends — Dramatic Typography*, *Mobile UI Trends — Meaningful Mobile Typography*

### 4.1 Font Selection
- Use **modern, professional typefaces** from Google Fonts (e.g., Inter, Outfit, Plus Jakarta Sans, DM Sans, Manrope).
- NEVER rely on browser default fonts.
- Maximum **2 typeface families** per project: one for headings, one for body (or one family with multiple weights).

### 4.2 Type Scale
Use a consistent modular type scale. Recommended base: `16px` with ratio `1.25` (Major Third):

| Element  | Size     | Weight   | Line Height |
|----------|----------|----------|-------------|
| H1       | 2.441rem | 700–800  | 1.1–1.2     |
| H2       | 1.953rem | 600–700  | 1.2–1.3     |
| H3       | 1.563rem | 600      | 1.3         |
| H4       | 1.25rem  | 500–600  | 1.4         |
| Body     | 1rem     | 400      | 1.5–1.7     |
| Small    | 0.8rem   | 400      | 1.5         |
| Caption  | 0.64rem  | 400–500  | 1.4         |

### 4.3 Typography Rules
- Maximum **60–75 characters per line** for optimal readability.
- Use **sufficient line-height** — never less than 1.4 for body text.
- Headings should have **tighter** line-height (1.1–1.3) for visual cohesion.
- Left-align body text; centered text is only for short headlines or captions.
- Never use more than **3 font weights** on a single page.

---

## 5. White Space & Layout

> Reference: *White Space in Web UI Design — Mastering the Power of Nothing*, *Zen of White Space — Balance, Contrast, Hierarchy*, *Zen of White Space — Space, Ratios, Minimalism*

### 5.1 The Power of Nothing
- White space is **not wasted space** — it is active design.
- Generous padding and margin improve readability, focus, and perceived quality.

### 5.2 Spacing System
Use an **8px base grid** for all spacing:

| Token  | Value  | Usage                                |
|--------|--------|--------------------------------------|
| xs     | 4px    | Inline padding, icon gaps            |
| sm     | 8px    | Tight groups, form field gaps        |
| md     | 16px   | Card padding, list item spacing      |
| lg     | 24px   | Section inner padding                |
| xl     | 32px   | Between sections                     |
| 2xl    | 48px   | Major section breaks                 |
| 3xl    | 64px   | Hero/page-level vertical padding     |
| 4xl    | 96px   | Full-bleed section vertical padding  |

### 5.3 Layout Rules
- Use **CSS Grid** or **Flexbox** — never floats or absolute positioning for layout.
- Max content width: **1200px** (or `75rem`) with auto margins for centering.
- Consistent gutters: **24px** minimum between grid columns.
- Cards and containers MUST have sufficient internal padding (minimum `16px`).

---

## 6. UI Design Patterns

> Reference: *Tactical UI Design Patterns*, *Web UI Design Patterns 2014*, *Card-Based Design Patterns*, *The Elegance of Minimalism*, *The Evolution of Flat Design*

### 6.1 Card-Based Design
- Use cards to encapsulate related content (article previews, feature tiles, pricing).
- Cards MUST have: rounded corners (`8–16px`), consistent padding, subtle shadow or border.
- Cards should have clear hover/focus states.

### 6.2 Minimalism
- Remove every element that does not serve a purpose.
- **"If in doubt, leave it out."**
- Every visual element must earn its place on the screen.

### 6.3 Flat & Modern Design
- Prefer flat design with subtle depth cues (soft shadows, layering, glassmorphism).
- Avoid heavy gradients, bevels, or skeuomorphic elements.
- Use **shadow hierarchy** to convey elevation:
  - `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` — resting state
  - `box-shadow: 0 4px 12px rgba(0,0,0,0.12)` — hover/elevated
  - `box-shadow: 0 8px 24px rgba(0,0,0,0.16)` — modal/overlay

### 6.4 Buttons
- Primary buttons: filled, high contrast, rounded corners.
- Secondary buttons: outlined or ghost style.
- Minimum touch target: **44×44px** (mobile), **36×36px** (desktop).
- Always include hover, active, focus, and disabled states.

### 6.5 Forms
- Labels above inputs (not placeholder-only).
- Inline validation with clear success/error states.
- Group related fields; use fieldsets or visual separators.
- Auto-focus the first input on page load where appropriate.

---

## 7. Interaction Design

> Reference: *About Face — The Essentials of Interaction Design*, *Demystifying Delightful Interaction Design*, *The 5 Building Blocks of Interaction Design*, *Interaction Design Best Practices — Mastering Time, Responsiveness, and Behavior*, *Interaction Design Best Practices — Mastering Words, Visuals, Space*

### 7.1 The 5 Building Blocks
1. **Words** — Microcopy must be clear, concise, and human. No jargon.
2. **Visuals** — Icons, images, and colors should communicate meaning instantly.
3. **Physical Objects / Space** — Consider the device context (mobile touch vs. desktop cursor).
4. **Time** — Animations, transitions, and loading states must feel natural.
5. **Behavior** — Provide immediate feedback for every user action.

### 7.2 Animation & Motion
- Use animations to **communicate**, not to decorate.
- Duration: **150–300ms** for micro-interactions, **300–500ms** for transitions.
- Easing: Use `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for movement.
- Always respect `prefers-reduced-motion` for accessibility.

```css
/* Standard transition pattern */
.element {
  transition: all 0.2s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
  }
}
```

### 7.3 Feedback & Responsiveness
- Every click/tap MUST produce visible feedback within **100ms**.
- Loading states: Use skeleton screens or shimmer effects (never blank screens).
- Success/error feedback: Use toast notifications, inline messages, or modal confirmations.
- Hover states: Subtle color shift, elevation change, or scale (`transform: scale(1.02)`).

### 7.4 Delightful Micro-Interactions
- Add subtle animations to enhance engagement:
  - Button press: slight scale-down (`0.97`)
  - Success: check icon with draw animation
  - Navigation: smooth scroll with container transitions
  - Loading: branded spinner or progress bar

---

## 8. Responsive & Mobile Design

> Reference: *Responsive Web Design Best Practices*, *Flat Mobile Design Evolved*, *Mobile Card Interfaces*, *Mobile UI Design Patterns*, *Tablet Web Design Best Practices*, *Progressive Web Apps Guide*

### 8.1 Breakpoints
Use a mobile-first approach with these standard breakpoints:

```css
/* Mobile first — base styles apply to smallest screens */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

### 8.2 Mobile Design Rules
- Touch targets: minimum **44×44px**.
- No hover-dependent interactions on mobile (provide tap alternatives).
- Bottom-accessible navigation for thumb-friendly zones.
- Use **cards** as the primary mobile layout pattern.
- Reduce content density — one idea per screen on mobile.

### 8.3 Responsive Layout Rules
- Images MUST be responsive: `max-width: 100%; height: auto;`.
- Text should reflow — never require horizontal scrolling.
- Navigation should collapse to hamburger or bottom nav on mobile.
- Tables should transform to card layouts or horizontally scroll on small screens.
- Test at: 320px, 375px, 768px, 1024px, 1440px minimum.

### 8.4 Progressive Enhancement
- Core content and functionality must work without JavaScript.
- Enhance progressively with animations, advanced layouts, and interactivity.

---

## 9. User Experience (UX) Principles

> Reference: *The Basics of UX Design*, *The Elements of Successful UX Design*, *UX Design Process Best Practices*, *10 Pro Tips to a Smarter UX Design Process*, *3 Common UX Mistakes Killing Good Design*, *Designing Better UX with UI Patterns*, *8 Steps to Building Features Your Users Actually Want*

### 9.1 The 3 Common UX Mistakes to Avoid
1. **Designing for yourself instead of the user.** Always validate assumptions.
2. **Overloading with features.** Each screen should have ONE primary action.
3. **Ignoring friction points.** Every extra click or field is a potential drop-off.

### 9.2 UX Design Checklist
- [ ] Every page has a **clear purpose** and a single primary CTA.
- [ ] Navigation is **intuitive** — users should find what they need in ≤3 clicks.
- [ ] Forms are **minimal** — ask only for what's absolutely necessary.
- [ ] Error states are **helpful** — tell users what went wrong AND how to fix it.
- [ ] Loading states are **informative** — never leave users wondering if something is happening.
- [ ] The information architecture follows **user mental models**, not internal structure.

### 9.3 User Flow Optimization
- Map out happy paths and edge cases before coding.
- Reduce the number of steps to complete any task.
- Provide clear **progress indicators** for multi-step flows.
- Always offer a way to **go back** or **undo**.

### 9.4 Accessibility (a11y)
- All interactive elements must be **keyboard navigable**.
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, etc.
- All images must have meaningful `alt` text.
- Form inputs must have associated `<label>` elements.
- Color must **never be the only indicator** of state (complement with icons or text).
- Minimum contrast ratios per WCAG 2.1 AA.

---

## 10. Style Guide & Consistency

> Reference: *Style Guides — An Overview For Modern Designers*, *The Critical Components Of Web UI Style Guides*, *Consistency — UI Design Creativity Without Confusion*

### 10.1 Why Consistency Matters
- Consistency reduces learning curve and builds trust.
- Every component should look and behave the same way everywhere it appears.
- **"Creativity without confusion"** — be creative with the overall design, but consistent in patterns.

### 10.2 What the Style Guide Must Define
1. **Color Palette** — Named tokens for all colors (primary, secondary, accent, neutrals, semantic).
2. **Typography** — Font families, sizes, weights, line-heights for all text roles.
3. **Spacing** — Standardized spacing scale (4/8px grid).
4. **Border Radius** — Consistent rounding values (e.g., `4px`, `8px`, `12px`, `9999px`).
5. **Shadows** — Elevation scale (0–5 with defined shadows).
6. **Component Library** — Buttons, inputs, cards, modals, badges, tooltips, etc.
7. **Iconography** — Consistent icon set (e.g., Lucide React, already installed), uniform size and stroke width.
8. **Motion** — Standard durations, easing curves, and transition patterns.

### 10.3 CSS Custom Properties (Design Tokens)

Define all design tokens as CSS custom properties on `:root`:

```css
:root {
  /* Colors */
  --color-primary: hsl(220, 90%, 56%);
  --color-primary-hover: hsl(220, 90%, 48%);
  --color-secondary: hsl(260, 80%, 60%);
  --color-accent: hsl(340, 82%, 52%);
  --color-success: hsl(142, 76%, 36%);
  --color-warning: hsl(38, 92%, 50%);
  --color-error: hsl(0, 84%, 60%);
  
  --color-text-primary: hsl(220, 20%, 12%);
  --color-text-secondary: hsl(220, 12%, 45%);
  --color-text-muted: hsl(220, 8%, 65%);
  
  --color-bg-primary: hsl(0, 0%, 100%);
  --color-bg-secondary: hsl(220, 20%, 97%);
  --color-bg-tertiary: hsl(220, 16%, 94%);
  
  --color-border: hsl(220, 13%, 90%);
  --color-border-hover: hsl(220, 13%, 80%);
  
  /* Typography */
  --font-sans: 'Inter', 'DM Sans', system-ui, -apple-system, sans-serif;
  --font-heading: 'Outfit', 'Plus Jakarta Sans', var(--font-sans);
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
  --space-4xl: 6rem;     /* 96px */

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.14);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.18);

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;
  --transition-enter: 250ms ease-out;
  --transition-exit: 200ms ease-in;
}
```

---

## 11. Wireframing & Prototyping Process

> Reference: *The Guide to Wireframing*, *The Guide to Interactive Wireframing*, *The Guide to Mockups*, *Building UI Mockups Developers Won't Hate*, *The Ultimate Guide to Prototyping*, *The Practical Handbook To Rapid Lo-Fi Prototyping*

### 11.1 Design Process Order
1. **Lo-fi wireframes** — Establish layout and information hierarchy.
2. **Hi-fi mockups** — Apply visual design (colors, typography, imagery).
3. **Interactive prototypes** — Add interactions, transitions, and flows.
4. **Implementation** — Code the approved design.

### 11.2 Key Principles
- Wireframes should focus on **structure**, not style.
- Mockups should demonstrate **visual fidelity** close to the final product.
- Prototypes should validate **interactions and user flows** before development.
- Always create mockups that **developers can understand** — annotate spacing, colors, and behavior.

---

## 12. Usability Testing Checklist

> Reference: *Complete Guide to User Testing*, *The Guide To Usability Testing*, *Practical User Research For Enterprise UX*, *Lessons Learned from Watching 200,000 User Testing Videos*

### 12.1 Before Launch
- [ ] Test with **5+ real users** (not team members).
- [ ] Verify all **critical user flows** work end-to-end.
- [ ] Check **page load performance** — < 3s on 3G.
- [ ] Validate **cross-browser** compatibility (Chrome, Safari, Firefox, Edge).
- [ ] Test **keyboard-only navigation** through all interactive elements.
- [ ] Screen reader testing for core flows.
- [ ] Touch target sizes validated on actual mobile devices.

### 12.2 Common Usability Issues
- Unclear CTAs — users don't know what to click next.
- Inconsistent navigation — users get lost.
- Missing feedback — users don't know if their action worked.
- Too many choices — decision paralysis (Hick's Law).
- Poor error messages — users can't recover from mistakes.

---

## 13. Marketing & Conversion Optimization

> Reference: *Converting The Believers*, *Mobile Commerce UX Design Best Practices*

### 13.1 Conversion Design Principles
- **One CTA per section** — don't split user attention.
- **Social proof** — testimonials, logos, stats near CTAs.
- **Urgency & scarcity** — use sparingly and honestly.
- **Reduce friction** — fewer form fields = higher completion.
- **Trust signals** — security badges, guarantees, clear privacy policies.

### 13.2 Landing Page Structure
1. Hero with clear value proposition + primary CTA
2. Social proof / trust badges
3. Features / benefits (3–4 max)
4. Deeper explanation / how it works
5. Testimonials / case studies
6. FAQ / objection handling
7. Final CTA section

---

## 14. Collaboration Between Design & Development

> Reference: *Designers Guide to Collaborating with Devs*, *Design Collaboration In The Enterprise*, *Building UI Mockups Developers Won't Hate*

### 14.1 Handoff Best Practices
- Use **design tokens** (CSS custom properties) so design and code share the same values.
- Annotate components with exact spacing, size, and behavioral notes.
- Component names in design files should match React component names.
- Share interactive states (hover, active, disabled, loading, error, empty).

---

## 15. Design Review Checklist

Before merging any UI change, verify:

### Visual Quality
- [ ] Follows the **color palette** — no ad-hoc colors.
- [ ] Uses the **type scale** — no ad-hoc font sizes.
- [ ] Spacing uses the **8px grid** system — no arbitrary values.
- [ ] Shadows use the **elevation scale** — no custom shadows.
- [ ] Border radii use **defined tokens**.

### UX Quality
- [ ] Page has a **clear visual hierarchy** with one primary focal point.
- [ ] **One primary CTA** per viewport is clearly identifiable.
- [ ] All interactive elements have **hover, focus, and active states**.
- [ ] Loading states use **skeleton screens or shimmer** (no blank areas).
- [ ] Error states provide **actionable guidance**.

### Responsiveness
- [ ] Tested and looks great at **320px, 768px, 1024px, 1440px**.
- [ ] **No horizontal scrolling** at any viewport.
- [ ] Touch targets ≥ **44px** on mobile.
- [ ] Navigation adapts properly for **mobile**.

### Accessibility
- [ ] Semantic HTML elements used.
- [ ] Contrast ratios meet **WCAG AA**.
- [ ] Keyboard navigation works.
- [ ] `alt` text on all images.
- [ ] `aria-label` on icon-only buttons.

### Performance
- [ ] Images are optimized (use Next.js `<Image>` component).
- [ ] Fonts loaded efficiently (preconnect, display swap).
- [ ] Animations use `transform` and `opacity` (GPU-accelerated).
- [ ] No layout shifts (`CLS < 0.1`).

---

## 16. Reference Library

All principles in this guide are distilled from these resources. Consult the original materials at [github.com/justinhartman/ui-ux-design-library](https://github.com/justinhartman/ui-ux-design-library) for deeper dives:

### Introductory
| Title | Category |
|-------|----------|
| Bright Ideas for UX Designers | Fundamentals |
| Field Guide to Human-Centered Design | Methodology |
| The Elements of User Experience | Framework |
| Getting Real (37signals) | Philosophy |
| Human Computer Interaction | Academic |
| Introduction to Good Usability | Fundamentals |
| Pixel Perfect Precision | Craft |
| UX Design for Startups | Strategy |
| UX Storytellers — Connecting the Dots | Case Studies |

### User Interface Design
| Title | Focus |
|-------|-------|
| Color Theory in Web UI Design | Color |
| Consistency — Creativity Without Confusion | Consistency |
| Flat Design and Colors | Modern Aesthetics |
| Tactical UI Design Patterns | Patterns |
| Task Centred User Interface Design | Task Flow |
| The Building Blocks of Visual Hierarchy | Hierarchy |
| The Visual Storyteller's Guide to Web UI | Narrative |
| Web UI Design for the Human Eye | Perception |
| Card-Based Design Patterns | Components |
| The Elegance of Minimalism | Style |
| The Evolution of Flat Design | Trends |
| The Vibrancy of Color | Color |
| White Space — Mastering the Power of Nothing | Layout |
| Zen of White Space — Balance, Contrast, Hierarchy | Layout |
| Zen of White Space — Space, Ratios, Minimalism | Layout |
| Web UI Design Patterns 2014 | Patterns |
| Winning Over Users With Attractive UI Design | First Impressions |

### User Experience Design
| Title | Focus |
|-------|-------|
| 3 Common UX Mistakes Killing Good Design | Anti-patterns |
| 8 Steps to Building Features Users Want | Feature Design |
| 10 Pro Tips to a Smarter UX Design Process | Process |
| Designing Better UX with UI Patterns | Patterns |
| The Basics of UX Design | Fundamentals |
| The Elements of Successful UX Design | Principles |
| UX Design Process Best Practices | Process |
| The Field Guide to UX Strategy | Strategy |
| The Guide to UX Design Process & Documentation | Documentation |
| UX Research Methodologies | Research |
| UX Gamification Redefined | Engagement |

### Interaction Design
| Title | Focus |
|-------|-------|
| About Face 3 & 4 — Essentials of IxD | Comprehensive |
| Demystifying Delightful Interaction Design | Delight |
| The 5 Building Blocks of Interaction Design | Framework |
| Interaction Design Best Practices (Time, Responsiveness) | Performance |
| Interaction Design Best Practices (Words, Visuals, Space) | Communication |
| Interaction Design Unlocked — Designing the Details | Details |
| Complex Animations (Curated Collection) | Animation |

### Typography
| Title | Focus |
|-------|-------|
| Meaningful Mobile Typography | Mobile |
| Dramatic Typography | Web |

### Mobile & Responsive
| Title | Focus |
|-------|-------|
| Responsive Web Design Best Practices | Methodology |
| Flat Mobile Design Evolved | Style |
| Mobile Card Interfaces | Patterns |
| Mobile UI Design Patterns | Patterns |
| Tablet Web Design Best Practices | Tablets |
| Progressive Web Apps Guide | PWAs |
| Guide to Mobile UX Research | Research |
| Push Notification Best Practices | Engagement |

### Style Guides
| Title | Focus |
|-------|-------|
| Style Guides — Overview For Modern Designers | Method |
| Critical Components Of Web UI Style Guides | Components |

### Wireframing & Prototyping
| Title | Focus |
|-------|-------|
| The Guide to Wireframing | Method |
| The Guide to Interactive Wireframing | Interactive |
| The Guide to Mockups | Visual |
| Building UI Mockups Developers Won't Hate | Handoff |
| The Ultimate Guide to Prototyping | Process |
| Rapid Lo-Fi Prototyping Handbook | Speed |

### Usability Testing
| Title | Focus |
|-------|-------|
| Complete Guide to User Testing | Comprehensive |
| The Guide To Usability Testing | Method |
| Practical User Research For Enterprise UX | Enterprise |
| Lessons from 200,000 User Testing Videos | Insights |

### Marketing & Conversion
| Title | Focus |
|-------|-------|
| Converting The Believers | Conversion |
| Mobile Commerce UX Design Best Practices | Mobile Commerce |

---

## Usage

When any design work is requested, follow this process:

1. **Read this skill file first** to refresh the design principles.
2. **Check the Design Review Checklist** (Section 15) before and after implementation.
3. **Use design tokens** from Section 10.3 — never hardcode colors, spacing, or shadows.
4. **Follow the visual hierarchy** rules from Section 2.
5. **Test responsiveness** per Section 8 breakpoints.
6. **Validate accessibility** per Section 9.4.

> 🎯 **Goal:** Every screen we ship should feel like it was designed by a professional UI/UX team — because it follows professional UI/UX principles.
