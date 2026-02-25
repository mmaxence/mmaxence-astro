import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    featured_image: z.string().optional(),
    credential: z.string().optional(),
    credentiallink: z.string().optional(),
    related_video: z.string().optional(),
    related_video_context: z.string().optional(),
  }),
});

const library = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    featured_image: z.string().optional(),
    author: z.string().optional(),
    book_author: z.string().optional(),
    book_category: z.string().optional(),
    book_year: z.string().optional(),
    amazon_link: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, library };

