import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const blogPosts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/blog/${post.slug}/`,
    }));

  const deepdivePosts = (await getCollection('deepdives'))
    .filter((post) => !post.data.draft)
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/deepdives/${post.slug}/`,
    }));

  const items = [...blogPosts, ...deepdivePosts].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    title: 'Maxence Mauduit — Blog & Deep Dives',
    description: 'Product Design Leader (CDO) writing about product design, interaction systems, leadership, and design systems.',
    site: context.site!,
    items,
    customData: `<language>en-us</language>`,
  });
}
