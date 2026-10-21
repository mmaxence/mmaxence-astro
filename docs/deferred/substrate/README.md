# Substrate, deferred

Paused at Max's request on October 7, 2026. The newsletter is not actively maintained. This archive is outside `src/` and `public/`, so it is not compiled or shipped with the website.

## Preserved

- `SubstrateCTA.astro.txt`: exact component source, including both homepage and article variants, original copy, subscribe URL and styling.
- `restore-placements.patch`: only the removed integration lines, captured against the working tree at the time of removal. It does not roll back other portfolio changes.

## Removed from this version

- Homepage newsletter section and import (`src/pages/index.astro`).
- Blog and Deep Dive article CTAs and imports (`src/pages/blog/[...slug].astro`, `src/pages/deepdives/[...slug].astro`).
- Footer Substrate link (`src/components/layout/Footer.astro`).
- Substack profile URL in Person JSON-LD (`src/layouts/BaseLayout.astro`).
- Substack contact in the machine-readable profile (`src/pages/llms.txt.ts`).

Unrelated editorial references to the Substack platform and Lenny's Newsletter remain. The site's RSS feed also remains; it serves published articles independently of Substrate.

## Restore deliberately

1. Confirm the newsletter is active again and review the archived monthly/free promises and subscription destination.
2. Copy `SubstrateCTA.astro.txt` to `src/components/ui/SubstrateCTA.astro`. Its relative AnimatedContent import resolves at that original location.
3. From the repository root, run `git apply --check docs/deferred/substrate/restore-placements.patch`. If the surrounding code has changed, reinsert the placements manually using the patch as a reference; do not overwrite whole files.
4. Apply the patch after reviewing the placements. Adapt the archived design to the site's current visual language.
5. Run `npm run build` and check the homepage, an article, a Deep Dive, the footer, JSON-LD and `/llms.txt` before publishing.

This is a source archive, not a scheduled relaunch or a hidden live signup.
