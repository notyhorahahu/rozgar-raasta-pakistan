import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(['freelancing', 'career', 'student', 'skills', 'earning', 'business', 'ai-tools']),
		tags: z.array(z.string()).default([]),
		date: z.coerce.date(),
		updated: z.coerce.date(),
		author: z.string().default('Rozgar Raasta Team'),
		featured: z.boolean().default(false),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		video: z.string().optional(),
		videoTitle: z.string().optional(),
		videoChannel: z.string().optional(),
		videoUrl: z.string().optional(),
		videoNote: z.string().optional(),
	}),
});

export const collections = { guides };
