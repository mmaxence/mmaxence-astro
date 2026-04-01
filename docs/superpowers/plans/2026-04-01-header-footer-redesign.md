# Header & Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unfinished contact banner + footer with a sticky scroll-collapsing header (desktop) and a unified conversational closing section.

**Architecture:** The header becomes `position: sticky` on desktop with a scroll listener that toggles a `.header-scrolled` class. The subtitle collapses and padding compresses on scroll. The footer and contact banner merge into a single centered `<footer>` with a conversational CTA, social icons, and copyright. No new dependencies.

**Tech Stack:** Astro components, Tailwind CSS, vanilla JS scroll listener, CSS transitions

**Spec:** `docs/superpowers/specs/2026-04-01-header-footer-redesign-design.md`

---

### Task 1: Add header scroll transition styles to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Remove obsolete footer CSS overrides**

Search for the `FOOTER SPECIFIC OVERRIDES` comment block in `global.css` and remove the entire section:

```css
/* Remove this entire block: */
/* ============================================
   FOOTER SPECIFIC OVERRIDES
   ============================================ */

footer a.link {
  border: none;
}

footer .social > a:hover {
  background-color: transparent;
}
```

- [ ] **Step 2: Add header transition styles**

Add a new section after the removed footer overrides:

```css
/* ============================================
   STICKY HEADER TRANSITIONS (Desktop Only)
   ============================================ */

@media (min-width: 768px) {
  .header-sticky {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--theme-bg);
    transition: background-color 0.3s ease;
  }

  .header-sticky .header-nav {
    transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-sticky.header-scrolled .header-nav {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .header-subtitle {
    max-height: 2rem;
    opacity: 1;
    overflow: hidden;
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-scrolled .header-subtitle {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  .header-border {
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-scrolled .header-border {
    border-color: var(--theme-border);
  }
}

/* Respect reduced motion for header transitions */
@media (prefers-reduced-motion: reduce) {
  .header-subtitle,
  .header-sticky .header-nav,
  .header-border {
    transition: none !important;
  }
}
```

- [ ] **Step 3: Verify by starting dev server**

Run: `npx astro dev 2>&1 | head -10`
Expected: Server starts without errors (Ctrl+C to stop)

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "Add sticky header transition styles, remove obsolete footer overrides"
```

---

### Task 2: Restructure Header.astro with sticky behavior

**Files:**
- Modify: `src/components/layout/Header.astro`

- [ ] **Step 1: Update the header template**

Replace the `<header>` opening tag and the `<nav>` structure. Key changes:
- Wrap `<header>` with `header-sticky header-border` classes
- Add `header-nav` class to `<nav>` for padding transitions
- Simplify subtitle to single line "Product & Experience Executive"
- Add `header-subtitle` class to subtitle wrapper

The full updated template section (lines 32-148, everything between `---` frontmatter and `<style>`):

```astro
<header class="header-sticky header-border">
  <nav class="header-nav pt-6 md:pt-16 pb-4 px-4 md:px-4" role="navigation">
    <div class="flex flex-col md:flex-row items-start md:items-baseline justify-between max-w-screen-xl mx-auto gap-3 md:gap-6">
      <a href="/" class="header-logo-link flex flex-row items-center mb-0 pl-0 md:pl-2 grow md:mr-3 no-underline hover:bg-transparent border-none group">
        <svg class="header-logo-svg mr-2 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 self-start mt-0.5" width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="512" height="512" rx="256" style="fill: var(--theme-bg);"/>
          <path d="M256 58.5142L427.028 157.257V354.743L256 453.486L84.9725 354.743V157.257L256 58.5142Z" style="fill: var(--theme-text);"/>
          <rect x="173.248" y="256" width="117.029" height="117.029" transform="rotate(-45 173.248 256)" style="fill: var(--theme-bg);"/>
        </svg>
        <div class="flex flex-col">
          <p class="text-base md:text-[1.5rem] leading-tight transition-colors duration-300 mb-1" style="color: var(--theme-text);">
            {author}
          </p>
          <div class="header-subtitle flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
            <span class="text-sm md:text-base font-body font-normal transition-colors duration-300 leading-tight" style="color: var(--theme-text-muted);">
              Product & Experience Executive
            </span>
          </div>
        </div>
      </a>
      {/* Desktop Navigation */}
      <div class="hidden md:flex items-center self-baseline">
        {desktopMenuItems.length > 0 && (
          <ul class="flex gap-3 list-none p-0 m-0">
            {desktopMenuItems.map((item) => {
              const active = isActive(item.url);
              return (
              <li class="text-[1.125rem] font-normal inline-block relative transition-all duration-150">
                    <a
                      class={`prefetch-link px-1 py-1 transition-colors duration-300 ${active ? 'nav-active' : ''}`}
                      style={active ? "color: var(--theme-accent);" : "color: var(--theme-text);"}
                      href={item.url}
                      title={`${item.name} page`}
                      data-prefetch="true"
                      aria-current={active ? "page" : undefined}
                    >
                  {item.name}
                </a>
              </li>
            );
            })}
          </ul>
        )}
      </div>

      {/* Mobile FAB Menu - Fixed at bottom right */}
      <button
        id="mobile-menu-fab"
        class="mobile-menu-fab md:hidden"
        aria-label="Open menu"
        aria-expanded="false"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
        </svg>
      </button>

      {/* Mobile Bottom Sheet */}
      <div id="mobile-menu-bottomsheet" class="mobile-menu-bottomsheet">
        <div class="mobile-menu-content">
          <ul class="mobile-menu-list">
            <li>
              <a
                class={`mobile-menu-item prefetch-link ${isActive('/') ? 'nav-active' : ''}`}
                style={isActive('/') ? "color: var(--theme-accent);" : "color: var(--theme-text);"}
                href="/"
                title="Home page"
                data-prefetch="true"
                aria-current={isActive('/') ? "page" : undefined}
              >
                Home
              </a>
            </li>
            {menuItems.map((item) => {
              const active = isActive(item.url);
              return (
                <li>
                  <a
                    class={`mobile-menu-item prefetch-link ${active ? 'nav-active' : ''}`}
                    style={active ? "color: var(--theme-accent);" : "color: var(--theme-text);"}
                    href={item.url}
                    title={`${item.name} page`}
                    data-prefetch="true"
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
            <li>
              <button
                id="mobile-reset-theme-btn"
                class="mobile-menu-item mobile-reset-theme-btn"
                style="color: var(--theme-text);"
                aria-label="Reset to default theme"
              >
                Reset Theme
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</header>
```

- [ ] **Step 2: Simplify the frontmatter**

Update the frontmatter (lines 1-30). Remove `subtitleParts` and the `Fragment` import since the subtitle is now a single static string:

```astro
---
const menuItems = [
  { name: "Deep Dives", url: "/deepdives/" },
  { name: "Experience", url: "/timeline/" },
  { name: "Blog", url: "/blog/" },
  { name: "Shelf", url: "/library/" },
  { name: "About", url: "/about/" },
];

// Desktop menu items (without About)
const desktopMenuItems = menuItems.filter(item => item.name !== "About");

const author = "Maxence Mauduit";

// Get current pathname
const currentPath = Astro.url.pathname;

// Function to check if a menu item is active
function isActive(url: string): boolean {
  if (url === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(url);
}
---
```

- [ ] **Step 3: Add scroll listener script**

Add this script block at the end of the file (after the existing `</script>` that handles the mobile menu). This script handles the scroll-aware collapse with hysteresis:

**Keep the existing `<style>` block (lines 150-312) unchanged.** Only the template and frontmatter change.

```html
<script>
  // Store current scroll handler so we can clean up on re-init
  let currentScrollHandler = null;

  function initStickyHeader() {
    const header = document.querySelector('.header-sticky');
    if (!header) return;

    // Clean up previous scroll listener if any
    if (currentScrollHandler) {
      window.removeEventListener('scroll', currentScrollHandler);
      currentScrollHandler = null;
    }

    // Only apply sticky behavior on desktop
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) {
      header.classList.remove('header-scrolled');
      return;
    }

    const COLLAPSE_THRESHOLD = 50;
    const EXPAND_THRESHOLD = 20;
    let isScrolled = false;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      if (!isScrolled && scrollY > COLLAPSE_THRESHOLD) {
        header.classList.add('header-scrolled');
        isScrolled = true;
      } else if (isScrolled && scrollY <= EXPAND_THRESHOLD) {
        header.classList.remove('header-scrolled');
        isScrolled = false;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    // Set initial state based on current scroll position
    if (window.scrollY > COLLAPSE_THRESHOLD) {
      header.classList.add('header-scrolled');
      isScrolled = true;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    currentScrollHandler = onScroll;

    // Cleanup on page transition
    document.addEventListener('astro:before-swap', () => {
      window.removeEventListener('scroll', onScroll);
      currentScrollHandler = null;
    }, { once: true });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyHeader);
  } else {
    initStickyHeader();
  }

  // Re-initialize on page transitions
  document.addEventListener('astro:page-load', () => {
    setTimeout(initStickyHeader, 50);
  });

  // Re-initialize on resize (desktop <-> mobile transition)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initStickyHeader, 150);
  });
</script>
```

- [ ] **Step 4: Verify the dev server runs**

Run: `npx astro dev 2>&1 | head -10` (start and check for errors, then Ctrl+C)
Expected: Server starts without component errors

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "Restructure header with sticky scroll-collapse behavior on desktop"
```

---

### Task 3: Replace Footer.astro with unified closing section

**Files:**
- Modify: `src/components/layout/Footer.astro`

- [ ] **Step 1: Rewrite Footer.astro entirely**

Replace the full contents of `src/components/layout/Footer.astro` with the code below.

Note: The email link uses a custom `border-bottom` style (not the global `::after` expanding underline) because the global animation is designed for inline prose links. A static underline with hover color change is more appropriate for a standalone CTA email address.

```astro
---
import AnimatedContent from '../ui/AnimatedContent.astro';

const currentYear = new Date().getFullYear();
const author = "Maxence Mauduit";
---

<footer class="w-full" role="contentinfo">
  <div class="max-w-2xl mx-auto px-4 py-16 text-center">
    {/* Top separator */}
    <hr class="border-t mb-16" style="border-color: var(--theme-border);" />

    <AnimatedContent delay={0}>

    {/* Conversational CTA */}
    <p class="text-base md:text-lg font-body leading-relaxed" style="color: var(--theme-text);">
      If you're navigating complex product decisions or scaling challenges,
      I'm always happy to exchange perspectives — reach out at{' '}
      <a href="mailto:contact@mmaxence.me" class="footer-email-link" style="color: var(--theme-text);">
        contact@mmaxence.me
      </a>
    </p>

    {/* Social icons */}
    <div class="flex items-center justify-center gap-4 mt-8">
      <a
        href="https://www.linkedin.com/in/mmaxence/"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-social-link"
        title="LinkedIn"
        aria-label="LinkedIn profile"
        style="color: var(--theme-text);"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a
        href="https://github.com/mmaxence"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-social-link"
        title="GitHub"
        aria-label="GitHub profile"
        style="color: var(--theme-text);"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>

    {/* Copyright */}
    <p class="mt-8 text-sm" style="color: var(--theme-text-muted);">
      &copy; {currentYear} {author}
    </p>
    </AnimatedContent>
  </div>
</footer>

<style>
  .footer-email-link {
    text-decoration: none;
    border-bottom: 1px solid var(--theme-border);
    transition: border-color 0.3s ease;
  }

  .footer-email-link:hover {
    border-bottom-color: var(--theme-text);
  }

  /* Override the global link ::after pseudo-element for footer email */
  .footer-email-link::after {
    display: none !important;
  }

  .footer-social-link {
    opacity: 0.6;
    transition: opacity 0.3s ease;
    border: none;
    text-decoration: none;
  }

  .footer-social-link:hover {
    opacity: 1;
    background-color: transparent;
  }

  /* Override global link ::after for social icons */
  .footer-social-link::after {
    display: none !important;
  }
</style>
```

- [ ] **Step 2: Verify dev server renders the footer**

Run: `npx astro dev 2>&1 | head -10`
Expected: No errors, server starts normally

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "Replace banner and footer with unified conversational closing section"
```

---

### Task 4: Fix index.astro hero spacing

**Files:**
- Modify: `src/pages/index.astro:31`

- [ ] **Step 1: Remove negative margin from hero section**

The hero section currently has `style="margin-top: -4rem;"` to compensate for the non-sticky header. With the sticky header, this pulls the hero under the header. Remove the negative margin.

Change line 31 from:
```html
<section class="min-h-screen flex flex-col items-center justify-center px-3 md:px-0" style="margin-top: -4rem;">
```
To:
```html
<section class="min-h-screen flex flex-col items-center justify-center px-3 md:px-0">
```

- [ ] **Step 2: Verify the homepage renders correctly**

Run: `npx astro dev 2>&1 | head -10`
Expected: Server starts, homepage hero is not obscured by header

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Remove hero negative margin for sticky header compatibility"
```

---

### Task 5: Visual verification and polish

**Files:**
- Possibly: `src/components/layout/Header.astro`, `src/components/layout/Footer.astro`, `src/styles/global.css`

- [ ] **Step 1: Start dev server and test all pages**

Run: `npx astro dev`

Manually verify in browser:
1. **Homepage** (`/`): Header shows full subtitle at top, collapses on scroll, re-expands near top. Hero not obscured. Footer shows conversational CTA centered with social icons.
2. **Blog** (`/blog/`): Sticky header works, footer renders.
3. **Deep Dives** (`/deepdives/`): Same checks.
4. **Timeline** (`/timeline/`): Same checks.
5. **Library** (`/library/`): Same checks.
6. **About** (`/about/`): Same checks.
7. **Blog post** (`/blog/[any-slug]`): Same checks.

- [ ] **Step 2: Test theme compatibility**

In browser console, test theme switching:
```js
window.applyRandomTheme()
```
Verify: header background matches theme, border color adapts, footer text colors are correct. Click "Reset" toast to verify default theme restores cleanly.

- [ ] **Step 3: Test mobile viewport**

Resize browser to mobile width (< 768px):
- Header should NOT be sticky (scrolls away)
- FAB menu still works
- Footer closing section renders centered and readable
- Subtitle is hidden

- [ ] **Step 4: Test page transitions**

Navigate between pages using nav links. Verify:
- Header scroll state resets/recalculates on navigation
- No duplicate scroll listeners (check no jank)
- Footer renders on every page

- [ ] **Step 5: Run Astro build to check for errors**

Run: `npx astro build 2>&1 | tail -20`
Expected: Build completes with no errors

- [ ] **Step 6: Commit any polish fixes**

```bash
git add -A
git commit -m "Polish header and footer after visual verification"
```

(Skip this commit if no changes were needed.)
