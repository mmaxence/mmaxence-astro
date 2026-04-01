# Header & Footer Redesign

## Summary

Replace the current unfinished banner + footer with a polished, Linear-inspired system:
- **Sticky header** (desktop only) with scroll-aware collapse (subtitle fades out, bar compresses)
- **Unified closing section** replacing both contact banner and footer -- conversational sign-off with social links and copyright

## Header: Sticky with Scroll Transition (Desktop Only)

### Structure

```
[Logo] Maxence Mauduit                    Deep Dives  Experience  Blog  Shelf
       Product & Experience Executive
```

- Logo SVG (existing hexagon) + name on the left
- Subtitle: only "Product & Experience Executive" (drop "Interaction Systems & Scale" -- too verbose for a persistent header)
- Desktop nav links on the right, baseline-aligned with the name
- Solid background using `var(--theme-bg)` with a subtle bottom border that appears on scroll
- "About" page link remains in mobile FAB menu only (current behavior). Desktop users reach About via the closing section or direct URL. This is intentional -- About is secondary content.

### Scroll Behavior

Uses `position: sticky; top: 0` on desktop (not `position: fixed` -- sticky is correct because the header is a direct child of the page flow and no ancestor has `overflow: hidden`).

1. **At rest (scrollY = 0)**: Full header -- logo, name, subtitle, nav. Generous padding (matching current `pt-16`).
2. **On scroll (scrollY > 50)**: Header transitions to compact mode:
   - Subtitle fades out (opacity 0, height collapses via `max-height: 0; overflow: hidden`)
   - Vertical padding reduces (from `pt-16 pb-4` to `py-3`)
   - Bottom border fades in: `1px solid var(--theme-border)`
   - Transition: ~300ms, `cubic-bezier(0.4, 0, 0.2, 1)`
3. **Scroll-up past threshold**: Header re-expands when `scrollY <= 20` (hysteresis gap of 30px prevents flickering near the threshold).
4. **After Astro View Transitions**: Scroll listener re-initializes on `astro:page-load`. On navigation, check current `scrollY` and set header state accordingly (don't assume expanded).

### Height & Spacing Strategy

The header does NOT use a fixed pixel height. Instead:
- The `<header>` element itself is `position: sticky` -- content flows naturally below it.
- Since `sticky` keeps the element in the document flow, no spacer element or top-padding hack is needed on child pages. The header occupies its natural height, and content begins after it.
- When the header compresses on scroll, the content reflows naturally.
- No changes needed to individual page top margins except `index.astro` which has `margin-top: -4rem` on the hero section -- this negative margin should be removed or adjusted since the header is now sticky and always occupies space.

### Visual Details

- Background: `var(--theme-bg)` -- solid, no blur
- Border bottom: only visible when scrolled, using `var(--theme-border)` with `opacity` transition
- All transitions respect `prefers-reduced-motion` (instant state change, no animation)
- Theme-aware: all colors from CSS variables, works with default/ide/pixel/random themes

### Mobile

- Header is NOT sticky on mobile -- stays at the top as current behavior
- Mobile keeps the existing FAB bottom-sheet menu (no changes)
- Subtitle hidden on mobile (already the case via responsive classes)

## Closing Section: Unified Banner + Footer

Replaces both the current `.contact-banner` div and the `<footer>` element with a single `<footer>`. Renders on all viewports (desktop and mobile).

### Structure

```
------------------------------------------------------------

  If you're navigating complex product decisions or
  scaling challenges, I'm always happy to exchange
  perspectives -- reach out at contact@mmaxence.me

              [LinkedIn]  [GitHub]

            (c) 2026 Maxence Mauduit

------------------------------------------------------------
```

### Layout

- Centered, single-column, max-width ~640px (`max-w-2xl`)
- Top separator: `1px solid var(--theme-border)` with generous margin above (`mt-16` or similar)
- CTA text: body font, `text-base` to `text-lg`, normal weight, centered. The email is an inline `mailto:` link within the sentence.
- Social icons: LinkedIn (`https://www.linkedin.com/in/mmaxence/`) + GitHub (`https://github.com/mmaxence`), same size as current (20px SVGs), centered row below the text. Subtle -- `opacity: 0.6` default, `opacity: 1` on hover. Gap of `1rem` between icons. Open in new tab with `rel="noopener noreferrer"`.
- Copyright: small text (`text-sm`), muted color (`var(--theme-text-muted)`), centered below icons
- Generous vertical padding: `py-16`

### Interaction

- Email link: standard `mailto:contact@mmaxence.me` with the existing underline hover animation from `global.css`
- Social icons: opacity transition on hover (0.6 -> 1.0), 300ms ease
- Entire section fades in on scroll (using existing `AnimatedContent` component)

### What Gets Removed

- The `.contact-banner` div (background-colored bar)
- The current `<footer>` nav links row (redundant -- header is always visible on desktop)
- Footer-specific CSS overrides in `global.css`: `footer a.link` and `footer .social > a:hover` rules (lines 454-460)

## Theme Compatibility

Both header and closing section use only CSS custom properties:
- `--theme-bg`, `--theme-text`, `--theme-text-muted`, `--theme-border`, `--theme-accent`
- `--theme-font-heading`, `--theme-font-body`

No hardcoded colors. Works with default, ide, pixel, and random themes.

## CSS Changes in global.css

### Add

- `.header-sticky` -- sticky positioning, z-index, bg color, transition for padding and border
- `.header-scrolled` -- compact padding, visible border-bottom
- `.header-subtitle` -- transition for opacity and max-height
- `.header-scrolled .header-subtitle` -- opacity 0, max-height 0, overflow hidden
- `.header-border` -- border-bottom with opacity transition

### Remove

- `footer a.link { border: none; }` (line 454-456)
- `footer .social > a:hover { background-color: transparent; }` (line 458-460)

## Files to Modify

1. `src/components/layout/Header.astro` -- add sticky positioning (desktop only via `md:` prefix), scroll-aware collapse script, simplify subtitle to single line, add CSS classes for transitions
2. `src/components/layout/Footer.astro` -- complete rewrite: remove nav links and contact banner, replace with unified conversational closing section
3. `src/styles/global.css` -- add header transition classes, remove obsolete footer overrides
4. `src/pages/index.astro` -- remove or adjust `margin-top: -4rem` on hero section
5. All pages importing Header/Footer -- no changes needed (sticky header handles its own spacing, footer is a drop-in replacement)

## Out of Scope

- Mobile-specific footer variations (evaluate after desktop redesign ships)
- Nav link additions or removals beyond the subtitle change
- ThemeSwitcher / ThemeToast changes
