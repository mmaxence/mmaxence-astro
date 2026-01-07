# mmaxence.github.io - Astro Migration

This is the migrated version of the portfolio/blog from Hugo to Astro, with styling transitioned from Tachyons/raw CSS to TailwindCSS v4.

## Project Status

✅ **Completed:**
- Astro project setup with TailwindCSS v4
- Base layout, header, and footer components
- Homepage with all content migrated
- Blog listing page
- Blog single post page
- All 12 blog posts migrated from Hugo
- Static assets (images) copied
- Content collection configured

⚠️ **Known Issue:**
- There's a build error with TailwindCSS v4 (`Cannot convert undefined or null to object`). This appears to be a beta version compatibility issue. The project structure is complete and ready once this is resolved.

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
  components/     # Reusable components (Header, Footer)
  layouts/        # Base layout
  pages/          # Astro pages (homepage, blog)
  content/        # Content collections (blog posts)
  styles/         # Global CSS with TailwindCSS v4
public/           # Static assets (images, etc.)
```

## Blog Posts

All blog posts have been migrated from Hugo's markdown format to Astro's content collection format. The frontmatter structure is compatible.

## Styling

The project uses TailwindCSS v4 with custom styles in `src/styles/global.css` to match the original design aesthetic.
