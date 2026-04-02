# Frontend Implementation Spec: Advanced Outline Editor (Step 2)

## Context

The PekkerAI article creation pipeline has been enhanced with a new **`POST /api/articles/outline`** endpoint. The backend now supports two outline modes:

1. **Quick Draft Outline** — Auto-generated during Step 1 (SERP analysis). A basic flat list of H2/H3 headings. Already available in the `analyzeSerp` response.
2. **Advanced LSI-Powered Outline** — Generated via the new dedicated endpoint. Hierarchical, includes pre-planned FAQs, uses LSI keywords for better topical coverage.

Your job is to build the **Step 2 — Outline Editor** screen that lets users view, choose between, and edit their article outline before proceeding to article generation.

---

## API Contracts

### Existing: Step 1 Response (already implemented)

`POST /api/articles/analyze` returns:

```json
{
  "articleId": 42,
  "serpResults": [
    { "position": 1, "title": "...", "url": "...", "snippet": "...", "score": 92 }
  ],
  "outline": [
    { "type": "h2", "text": "What Are AI SEO Tools?" },
    { "type": "h3", "text": "Definition and Core Components" },
    { "type": "h2", "text": "Top 10 AI SEO Tools in 2026" }
  ],
  "meta": { "title": "...", "description": "...", "slug": "..." },
  "recommendations": { "targetWordCount": "2800-3200", "targetHeadings": "12-15" },
  "lsiKeywords": ["search engine optimization", "content strategy", "keyword research", ...],
  "targetWordCount": 3000
}
```

### New: Advanced Outline Endpoint

`POST /api/articles/outline`

**Request Body:**
```json
{
  "articleId": 42,
  "keyword": "ai seo tools",
  "lsiKeywords": ["search engine optimization", "content strategy", ...],
  "serpResults": [
    { "position": 1, "title": "...", "url": "...", "snippet": "..." }
  ]
}
```

**Response:**
```json
{
  "articleId": 42,
  "outline": {
    "sections": [
      {
        "type": "H2",
        "title": "What Are AI SEO Tools and Why Do They Matter?",
        "subsections": [
          { "type": "H3", "title": "The Evolution of SEO Automation" },
          { "type": "H3", "title": "Key Features to Look For" }
        ]
      },
      {
        "type": "H2",
        "title": "Top 10 AI SEO Tools Worth Your Investment in 2026",
        "subsections": [
          { "type": "H3", "title": "Enterprise-Level Platforms" },
          { "type": "H3", "title": "Budget-Friendly Alternatives" }
        ]
      }
    ],
    "faq": [
      { "q": "What is the best AI SEO tool for beginners?", "a": "..." },
      { "q": "How much do AI SEO tools cost?", "a": "..." },
      { "q": "Can AI SEO tools replace human writers?", "a": "..." },
      { "q": "Which AI SEO tool has the best keyword research?", "a": "..." },
      { "q": "Are AI SEO tools worth the investment?", "a": "..." }
    ],
    "introHook": "The SEO landscape is shifting faster than ever...",
    "conclusionCta": "Start with one tool, master it, and scale from there."
  },
  "lsiKeywordsCovered": ["search engine optimization", "content strategy", "keyword research"]
}
```

**Headers:** `Authorization: Bearer <token>`

---

## UI Specification

### Step 2 Screen: Outline Editor

This screen appears after Step 1 (SERP Analysis) completes. The user lands here with the `articleId`, `serpResults`, `lsiKeywords`, and the auto-generated quick draft outline already available from Step 1's response.

#### Layout

```
┌─────────────────────────────────────────────────────┐
│  Step 1 ──●── Step 2 (Outline) ──○── Step 3 ──○── Step 4  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────┐  ┌──────────────────────┐  │
│  │   OUTLINE EDITOR    │  │   SIDEBAR            │  │
│  │                     │  │                      │  │
│  │  [Quick Draft] [Advanced ✨]  │  │  LSI Keywords       │  │
│  │                     │  │  ☑ content strategy  │  │
│  │  ▼ H2: What Are...  │  │  ☑ keyword research  │  │
│  │    H3: Definition   │  │  ☐ backlink analysis │  │
│  │    H3: Core Comps   │  │  ☐ rank tracking     │  │
│  │  ▼ H2: Top 10...    │  │  ...                 │  │
│  │    H3: Enterprise   │  │                      │  │
│  │    H3: Budget       │  │  SERP Competitors    │  │
│  │  ▼ H2: How to...    │  │  1. competitor.com   │  │
│  │    H3: Step-by-Step │  │  2. rival.com        │  │
│  │                     │  │  3. example.com      │  │
│  │  ── FAQ Section ──  │  │                      │  │
│  │  Q: What is the...  │  │  Recommendations     │  │
│  │  Q: How much do...  │  │  Words: 2800-3200    │  │
│  │  Q: Can AI SEO...   │  │  Headings: 12-15     │  │
│  │                     │  │                      │  │
│  │  [+ Add H2] [+ Add FAQ]  │  │                      │  │
│  └─────────────────────┘  └──────────────────────┘  │
│                                                     │
│            [← Back]              [Generate Article →]  │
└─────────────────────────────────────────────────────┘
```

#### Components to Build

##### 1. Outline Mode Toggle

Two-button toggle at the top of the outline editor:

| Button | Behavior |
|--------|----------|
| **Quick Draft** | Shows the flat outline from Step 1's `analyzeSerp` response. No additional API call needed. Fast, instant. |
| **Advanced ✨** | Calls `POST /api/articles/outline` with `articleId`, `keyword`, `lsiKeywords`, and `serpResults`. Shows a loading spinner while generating (~5-10 seconds). Displays the hierarchical outline with FAQs. |

- Default to **Quick Draft** on load (zero wait time)
- When user clicks **Advanced ✨**, show a loading state with message: "Generating LSI-optimized outline..." 
- Cache the advanced outline in state — don't re-fetch if the user toggles back and forth
- If the advanced generation fails, show a toast error and keep the quick draft visible

##### 2. Outline Tree Editor (Main Panel)

**For Quick Draft mode** (flat list):
- Render each heading as a draggable list item
- Each item shows: drag handle | heading type badge (H2/H3) | editable text input
- Users can:
  - ✏️ **Edit** any heading text inline (click to edit)
  - 🔄 **Change type** — toggle between H2 and H3 via dropdown or click on the badge
  - 🗑️ **Delete** a heading (with confirm for H2s that have H3 children)
  - ↕️ **Reorder** via drag-and-drop
  - ➕ **Add** new H2 or H3 at the bottom via "+ Add Heading" button

**For Advanced mode** (hierarchical):
- H2 sections are collapsible accordion items
- H3 subsections are indented under their parent H2
- FAQ section is a separate visual block at the bottom
- Same edit/delete/reorder/add capabilities as Quick Draft
- Additional: "Intro Hook" and "Conclusion CTA" shown as editable text blocks at top/bottom
- Users can drag H3s between different H2 parents
- Users can add/edit/delete FAQ items

##### 3. LSI Keywords Sidebar

- Display the `lsiKeywords` array from Step 1 as a checklist
- Each keyword gets a checkbox
- **Auto-check** keywords that appear in any outline heading text (case-insensitive match)
- Show count: "8/15 LSI keywords covered"
- Clicking an unchecked keyword could suggest: "Add to a heading?" (optional nice-to-have)
- Visual indicator: green when ≥70% covered, yellow when 50-69%, red when <50%

##### 4. SERP Competitors Sidebar

- Show top 5 competitors from `serpResults` as a compact list
- Each shows: position badge, title (truncated), domain extracted from URL
- Clicking opens the URL in a new tab
- This is read-only reference for the user while editing their outline

##### 5. Recommendations Card

- Display `recommendations.targetWordCount` and `recommendations.targetHeadings`
- Show current heading count vs target: "Current: 11 headings (Target: 12-15)"
- Green/yellow/red indicator based on whether they're in range

##### 6. Action Buttons

| Button | Behavior |
|--------|----------|
| **← Back** | Go back to Step 1 (SERP results). Preserve outline edits in state. |
| **Generate Article →** | Proceed to Step 3. Sends the current outline (whichever mode is active + user edits) to `POST /api/articles/generate`. |

---

## State Management

Store these in your article creation state (context/store):

```typescript
interface OutlineState {
  // From Step 1
  articleId: number;
  keyword: string;
  serpResults: SerpResult[];
  lsiKeywords: string[];
  recommendations: { targetWordCount: string; targetHeadings: string };
  
  // Outlines
  quickDraftOutline: OutlineItem[];         // From analyzeSerp response
  advancedOutline: AdvancedOutline | null;  // From /api/outline response (null until fetched)
  activeMode: 'quick' | 'advanced';
  
  // User edits (applied on top of whichever mode is active)
  editedOutline: OutlineItem[] | AdvancedOutline;
  hasEdits: boolean;
  
  // Loading
  isGeneratingAdvanced: boolean;
}

interface OutlineItem {
  type: 'h2' | 'h3';
  text: string;
}

interface AdvancedOutline {
  sections: {
    type: 'H2';
    title: string;
    subsections: { type: 'H3'; title: string }[];
  }[];
  faq: { q: string; a: string }[];
  introHook: string;
  conclusionCta: string;
}
```

---

## Flow Summary

```
User completes Step 1 (SERP Analysis)
        │
        ▼
Step 2: Outline Editor loads
  ├── Quick Draft outline displayed immediately (from Step 1 response)
  ├── User can edit, reorder, add/delete headings
  ├── User clicks "Advanced ✨" → API call → richer outline with FAQs
  ├── User can toggle between Quick Draft and Advanced
  ├── User can edit either version
  ├── LSI keyword coverage shown in sidebar
  │
  └── User clicks "Generate Article →"
        │
        ▼
Step 3: Article Generation
  └── Sends final outline to POST /api/articles/generate
```

---

## Design Notes

- **Quick Draft badge**: Use a subtle gray badge/pill, e.g., "Quick Draft"
- **Advanced badge**: Use a gradient/accent badge with sparkle icon, e.g., "Advanced ✨" — this feels premium
- **Heading type badges**: H2 = blue pill, H3 = gray pill (smaller, indented)
- **FAQ section**: Visually separate from the heading tree — use a different background or card
- **Empty state**: If no outline yet (edge case), show "Generate an outline to get started" with a CTA button
- **Dark mode**: Ensure all components work in dark mode if your app supports it
- **Animations**: Subtle expand/collapse animation on H2 accordion sections; smooth drag-and-drop transitions
- **Mobile**: On mobile, hide the sidebar and show LSI keywords as a collapsible section below the outline editor

---

## Error Handling

| Scenario | UI Behavior |
|----------|-------------|
| Advanced outline API fails | Toast: "Could not generate advanced outline. Try again or use Quick Draft." Keep quick draft visible. |
| Network timeout | Toast with retry button |
| User navigates away mid-generation | Cancel the API call, preserve quick draft state |
| No LSI keywords available | Hide the LSI sidebar section, still allow outline editing |
