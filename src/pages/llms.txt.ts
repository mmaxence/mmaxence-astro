import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const blogPosts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const deepdivePosts = (await getCollection('deepdives'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const libraryBooks = (await getCollection('library'))
    .filter((book) => !book.data.draft)
    .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  const blogList = blogPosts
    .map((post) => `- [${post.data.title}](https://mmaxence.me/blog/${post.slug}/): ${post.data.description || ''}`)
    .join('\n');

  const deepdiveList = deepdivePosts
    .map((post) => `- [${post.data.title}](https://mmaxence.me/deepdives/${post.slug}/): ${post.data.description || ''}`)
    .join('\n');

  const libraryList = libraryBooks
    .map((book) => `- [${book.data.title}](https://mmaxence.me/library/${book.slug}/) by ${book.data.book_author || 'Unknown'}: ${book.data.description || ''}`)
    .join('\n');

  const content = `# Maxence Mauduit

> Product designer and Chief Design Officer at Buzzvil (Seoul). 15 years in product design, 12 at Buzzvil. Designs in code and builds agent-consumable design systems and the tooling on top of them. Focus: AI-native design, interaction systems, design-in-code.

## About

Maxence Mauduit is a product designer and Chief Design Officer at Buzzvil in Seoul, South Korea. Fifteen years in product design, twelve at Buzzvil, across product, system, and brand. He designs in code, and builds the systems that people and AI agents compose within.

Most recently he made Buzzvil's design system consumable by agents, built the composition tooling on top of it, and shipped the first agent-assembled ad campaign to a live advertiser. The interaction-based ad formats he designed outperformed standard ads by roughly 3x on click-to-purchase and 4x on ROAS, with advertiser campaign volume up 28x year over year.

He has led the company-critical pivots and built the team that scaled Buzzvil toward IPO readiness, and remains a hands-on IC. He works in React, TypeScript, and Tailwind, with agent-based and MCP workflows. His strength is taking problems that are still undefined, strategically sensitive, or technically constrained, and turning them into products teams can actually build and scale.

## Machine-readable variants

- Full prose corpus (Markdown): https://mmaxence.me/llms-full.txt
- Per-post Markdown: append \`.md\` to any /blog or /deepdives URL.
  Example: https://mmaxence.me/deepdives/ai-native-design-workflow-playbook.md

## Key Pages

- [Home](https://mmaxence.me/): Overview of expertise, experience, and approach
- [Experience Timeline](https://mmaxence.me/timeline/): Detailed career timeline and impact
- [Deep Dives](https://mmaxence.me/deepdives/): In-depth case studies on product design, systems thinking, and agentic experiences
- [Blog](https://mmaxence.me/blog/): Articles on product design, leadership, and design systems
- [Library / Shelf](https://mmaxence.me/library/): Curated book reviews on design, leadership, and strategy
- [About](https://mmaxence.me/about/): About this website and its tech stack
- [Resume](https://mmaxence.me/images/Maxence-Mauduit_Resume-2026.pdf): PDF resume

## Deep Dives

${deepdiveList}

## Blog Articles

${blogList}

## Book Reviews

${libraryList}

## Contact

- Website: https://mmaxence.me
- Email: contact@mmaxence.me
- LinkedIn: https://www.linkedin.com/in/mmaxence/
- GitHub: https://github.com/mmaxence
- X: https://x.com/mmaxence
- Substack: https://mmaxence.substack.com
- Medium: https://mmaxence.medium.com

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
