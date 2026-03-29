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

  const libraryBooks = (await getCollection('library'))
    .filter((book) => !book.data.draft)
    .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  let content = `# Maxence Mauduit — Full Content

> Product & Experience Executive with 13+ years shaping monetization and platform products, building independent teams, and maintaining experience coherence under growth pressure.

Website: https://mmaxence.me
Role: CDO at Buzzvil, Seoul, South Korea
Focus: Product design leadership, interaction systems, design systems, team building

---

## Blog Articles

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
