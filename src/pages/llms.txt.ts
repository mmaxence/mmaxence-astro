import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const blogPosts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const libraryBooks = (await getCollection('library'))
    .filter((book) => !book.data.draft)
    .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  const blogList = blogPosts
    .map((post) => `- [${post.data.title}](https://mmaxence.me/blog/${post.slug}/): ${post.data.description || ''}`)
    .join('\n');

  const libraryList = libraryBooks
    .map((book) => `- [${book.data.title}](https://mmaxence.me/library/${book.slug}/) by ${book.data.book_author || 'Unknown'}: ${book.data.description || ''}`)
    .join('\n');

  const content = `# Maxence Mauduit

> Product & Experience Executive with 13+ years shaping monetization and platform products, building independent teams, and maintaining experience coherence under growth pressure.

## About

Maxence Mauduit is a Product Design Leader (CDO) at Buzzvil in Seoul, South Korea. He specializes in building interaction systems that bridge complex business logic and high-performance user experiences. He works at the intersection of product definition, interaction design, and execution systems.

His strength is taking problems that are still undefined, strategically sensitive, or technically constrained, and turning them into products teams can actually build and scale.

## Key Pages

- [Home](https://mmaxence.me/): Overview of expertise, experience, and approach
- [Experience Timeline](https://mmaxence.me/timeline/): Detailed career timeline and impact
- [Blog](https://mmaxence.me/blog/): Articles on product design, leadership, and design systems
- [Library / Shelf](https://mmaxence.me/library/): Curated book reviews on design, leadership, and strategy
- [About](https://mmaxence.me/about/): About this website and its tech stack
- [Resume](https://mmaxence.me/images/Maxence-Mauduit_Resume-2026.pdf): PDF resume

## Blog Articles

${blogList}

## Book Reviews

${libraryList}

## Contact

- Website: https://mmaxence.me
- LinkedIn: https://www.linkedin.com/in/mmaxence/
- GitHub: https://github.com/mmaxence

## Optional

- [Full LLM-optimized content](/llms-full.txt): Complete article content for deeper context
- [RSS Feed](/rss.xml): Subscribe to new articles
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
