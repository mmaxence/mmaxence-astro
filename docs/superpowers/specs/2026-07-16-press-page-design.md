# Press Page — Design Spec

**Date:** 2026-07-16
**Status:** approved (conversation, 2026-07-16)

## Purpose

A `/press/` index page listing third-party coverage: anything **not written by Max** that is about him or about the processes/products he has worked on (Buzzvil design work counts even when he isn't named — e.g., the Economic Review piece on Buzzvil's AI-native transition featuring the design team's PR growth).

The existing `/about/` colophon is untouched; it stays "about this website." Press is a new, distinct content type: external links with metadata, no body content.

## Navigation

Header `menuItems`, inserted **before Shelf**:

```
Deep Dives · Experience · Blog · Press · Shelf · About(mobile/footer only)
```

## Data

`src/data/press.ts` — typed array, following the `timeline.ts` data-file pattern. No content collection (no body content to render, nothing to gain from `getCollection`).

```ts
interface PressItem {
  title: string;      // original-language headline, verbatim
  titleEn?: string;   // English gloss, only when original is not English
  outlet: string;     // e.g., "Economic Review (이코노믹리뷰)"
  date: string;       // ISO yyyy-mm-dd
  url: string;
  type: 'article' | 'interview' | 'podcast' | 'talk';
  note?: string;      // one line: why it's here / what it covers
}
```

`type` values extend only when a found item demands it.

## Page

`src/pages/press/index.astro`, following the existing index-page grammar (BaseLayout, Header, PageContent, PageHeader, AnimatedContent, reveal beats, ThemeToast, Footer):

- Items grouped by year, newest first; year as the section heading with a `reveal-rule` hairline (same as Shelf's category headings).
- Each entry: kicker line (outlet · date · type), title linking out (`target="_blank" rel="noopener noreferrer"`), English gloss under Korean titles, then the note.
- No filtering UI, no pagination — YAGNI until the list outgrows a single scroll.

## Content sourcing (separate step)

Discovery pass after the page ships: Korean + English web searches (Max's name in Latin and Korean renderings, 버즈빌 디자인, Buzzvil AI-native coverage, interviews, podcasts, talks). Max reviews the candidate list and picks; keepers are added to `press.ts`. Seed item: Economic Review 2026-07-14, "버즈빌 AI 네이티브 반년 디자이너가 코드를 짠다".

## llms.txt

`/llms.txt` hand-lists Key Pages and per-section item lists; Press is included there (Key Pages line + a "Press (third-party coverage)" section built from `press.ts`) so the agent-facing index stays consistent with the site.

## Out of scope

- RSS integration for press items (external links don't belong in the article feed)
- OG-image thumbnails per item
- Homepage press strip
