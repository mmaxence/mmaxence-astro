import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

const SITE_URL = 'https://mmaxence.me';

export async function getStaticPaths() {
  const entries = await getCollection('blog');
  return entries
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({
      params: { slug: entry.slug },
      props: { entry },
    }));
}

function yamlQuote(s: string): string {
  return JSON.stringify(s);
}

function yamlArray(items: string[]): string {
  return `[${items.map(yamlQuote).join(', ')}]`;
}

function buildRawMarkdown(entry: CollectionEntry<'blog'>): string {
  const canonical = `${SITE_URL}/blog/${entry.slug}/`;
  const date = entry.data.date.toISOString();
  const lines: string[] = ['---'];
  lines.push(`title: ${yamlQuote(entry.data.title)}`);
  lines.push(`date: ${date}`);
  if (entry.data.description) {
    lines.push(`description: ${yamlQuote(entry.data.description)}`);
  }
  if (entry.data.tags && entry.data.tags.length > 0) {
    lines.push(`tags: ${yamlArray(entry.data.tags)}`);
  }
  if (entry.data.featured_image) {
    const img = entry.data.featured_image.startsWith('http')
      ? entry.data.featured_image
      : `${SITE_URL}${entry.data.featured_image.startsWith('/') ? '' : '/'}${entry.data.featured_image}`;
    lines.push(`featured_image: ${yamlQuote(img)}`);
  }
  lines.push(`canonical: ${canonical}`);
  lines.push('---');
  lines.push('');
  const body = entry.body.replace(/^(?:[ \t]*\r?\n)+/, '');
  return `${lines.join('\n')}\n${body}`;
}

export const GET: APIRoute = ({ props }) => {
  const entry = props.entry as CollectionEntry<'blog'>;
  const text = buildRawMarkdown(entry);
  const canonical = `${SITE_URL}/blog/${entry.slug}/`;
  return new Response(text, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      Link: `<${canonical}>; rel="canonical"`,
      'X-Token-Count': String(Math.ceil(text.length / 4)),
      'Cache-Control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400',
    },
  });
};
