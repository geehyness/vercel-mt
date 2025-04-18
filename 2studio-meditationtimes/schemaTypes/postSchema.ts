// schemas/post.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'yearWeek',
      title: 'Year-Week',
      type: 'string',
      validation: (Rule) => Rule.required()
        .regex(/^\d{4}w(?:0[1-9]|[1-4][0-9]|5[0-3])$/, 'Year-Week must be in format YYYYwWW (e.g., 2021w12)'),
      description: 'Year-Week in format YYYYwWW (e.g., 2021w12)',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: (Rule) => Rule.required(),
      options: {
        disableNew: true,
      },
    }),
     // Add the new audio file field
    defineField({
      name: 'aiAudioAnalysis',
      title: 'AI Audio Analysis',
      type: 'file', // Use the file type
      description: 'Upload an audio file containing the AI analysis of the post content.',
      options: {
         accept: 'audio/mpeg,audio/wav,audio/ogg,audio/aac', // Restrict to common audio types
      },
      // Optional: Add validation, e.g., max file size Rule.maxFileSize(50000000) // 50MB
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      yearWeek: 'yearWeek',
      // You could add aiAudioAnalysis here if you wanted to see if it exists in preview
      // aiAudioAnalysis: 'aiAudioAnalysis',
    },
    prepare(selection) {
      const { author, yearWeek, title } = selection;
      // Add an indicator in the subtitle if audio is present (optional)
      // const hasAudio = selection.aiAudioAnalysis?.asset;
      return {
        ...selection,
        title: `${yearWeek}: ${title}`,
        subtitle: author && `by ${author}`,
      };
    },
  },
  orderings: [
    {
      title: 'Year-Week, Newest First',
      name: 'yearWeekDesc',
      by: [{ field: 'yearWeek', direction: 'desc' }],
    },
     {
      title: 'Creation Date, Newest First',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ]
})