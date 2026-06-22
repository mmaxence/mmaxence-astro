import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function stripMarkdown(md: string): string {
  return md
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove JSX/component tags
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove images but keep alt text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Convert links to text with URL
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1 ($2)')
    // Remove bold/italic markers
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
    // Remove code blocks but keep content
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, '').replace(/```/g, ''))
    // Remove inline code markers
    .replace(/`([^`]+)`/g, '$1')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

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

  let content = `# Maxence Mauduit — Full Content

> Product designer and Chief Design Officer at Buzzvil (Seoul). 15 years in product design, 12 at Buzzvil. Designs in code and builds agent-consumable design systems and the tooling on top of them. Focus: AI-native design, interaction systems, design-in-code.

Website: https://mmaxence.me
Role: Chief Design Officer at Buzzvil, Seoul, South Korea (hands-on IC)
Focus: AI-native design, interaction systems, design systems, design-in-code (React/TypeScript), agent-consumable tooling

---

## Deep Dives

`;

  for (const post of deepdivePosts) {
    const postDate = post.data.date.toISOString().split('T')[0];
    const bodyText = stripMarkdown(post.body || '');
    content += `### ${post.data.title}

Date: ${postDate}
URL: https://mmaxence.me/deepdives/${post.slug}/
${post.data.description ? `Summary: ${post.data.description}` : ''}

${bodyText}

---

`;
  }

  content += `## Blog Articles

`;

  for (const post of blogPosts) {
    const postDate = post.data.date.toISOString().split('T')[0];
    const bodyText = stripMarkdown(post.body || '');
    content += `### ${post.data.title}

Date: ${postDate}
URL: https://mmaxence.me/blog/${post.slug}/
${post.data.description ? `Summary: ${post.data.description}` : ''}

${bodyText}

---

`;
  }

  content += `## Book Reviews

`;

  for (const book of libraryBooks) {
    const bodyText = stripMarkdown(book.body || '');
    content += `### ${book.data.title}${book.data.book_author ? ` by ${book.data.book_author}` : ''}

URL: https://mmaxence.me/library/${book.slug}/
${book.data.book_year ? `Year: ${book.data.book_year}` : ''}
${book.data.description ? `Summary: ${book.data.description}` : ''}

${bodyText}

---

`;
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
