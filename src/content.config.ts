import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            seoTitle: z.string().min(1).optional(),
            description: z.string(),
            publishDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            author: z.string(),
            category: z.string(),
            image: image(),
            imageAlt: z.string(),
            draft: z.boolean(),
        }),
});

export const collections = { blog };
