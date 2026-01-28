# mmaxence.github.io - Astro Portfolio

A modern portfolio/blog website built with Astro, featuring interactive SVG visuals, responsive design, and a unique random theme system.

## Project Status

✅ **Completed:**
- Astro project setup with TailwindCSS v4
- Base layout, header, and footer components
- Homepage with five interactive section visuals:
  - **What I Do**: Isometric layered system diagram with wave animations
  - **Experience Snapshot**: Dynamic timeline with hover controls and milestone display
  - **How I Work**: Product discovery/delivery cycle visualization
  - **Leadership That Scales**: Exponential growth circles with animated connections
  - **Beyond The Role**: Newton's Cradle pendulum with Work/Life labels
- Blog listing and single post pages
- All blog posts migrated from Hugo
- Static assets (images, resume PDF) included
- Content collection configured
- Random theme system with WCAG AA compliant color combinations
- Mobile-optimized responsive design
- View Transitions for smooth page navigation

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
  components/
    home/          # Homepage-specific components (SectionVisuals, HomeSection)
    layout/        # Header, Footer
    ui/            # Reusable UI components
  layouts/         # Base layout
  pages/           # Astro pages (homepage, blog, about, timeline)
  content/         # Content collections (blog posts)
  data/            # JSON data files (timeline-visual.json)
  styles/          # Global CSS with TailwindCSS v4
public/
  images/          # Static assets (images, resume PDF)
```

## Key Features

### Interactive Visuals
The homepage features five distinct, abstract SVG visuals built with React:
- All visuals are theme-aware and adapt to the random theme system
- Responsive design with mobile optimizations (centered layout, square timeline ratio)
- Smooth animations using `requestAnimationFrame`
- Accessibility: Respects `prefers-reduced-motion` preferences

### Random Theme System
- Click hero shapes to activate random themes
- WCAG AA compliant color combinations
- Themes persist across navigation using View Transitions
- Toast notification for theme reset

### Responsive Design
- Mobile-first approach with breakpoints at 768px
- Timeline visual uses square (1:1) aspect ratio on mobile for better visibility
- All visuals centered on mobile devices
- Touch-friendly interactions

## Blog Posts

All blog posts have been migrated from Hugo's markdown format to Astro's content collection format. The frontmatter structure is compatible.

## Styling

The project uses TailwindCSS v4 with custom styles in `src/styles/global.css`. The design system uses CSS custom properties for theming, allowing dynamic theme switching while maintaining consistent typography and spacing.
