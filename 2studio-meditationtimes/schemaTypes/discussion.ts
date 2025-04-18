import { defineField, defineType } from 'sanity'
import  reply  from './reply'
import { CommentIcon } from '@sanity/icons'

export default defineType({
  name: 'discussion',
  title: 'Bible Discussion',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Discussion Title',
      type: 'string',
      validation: Rule => Rule.required().max(120)
    }),
    defineField({
      name: 'content',
      title: 'Detailed Explanation',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'biblePassage',
      title: 'Bible Reference',
      type: 'object',
      fields: [
        defineField({
          name: 'book',
          type: 'string',
          validation: Rule => Rule.required(),
          options: {
            list: [
              // Add all books of the Bible here
              { title: 'Genesis', value: 'Genesis' },
              { title: 'Exodus', value: 'Exodus' },
              // ... rest of the books
            ]
          }
        }),
        defineField({
          name: 'chapter',
          type: 'number',
          validation: Rule => Rule.required().min(1).max(150)
        }),
        defineField({
          name: 'verseStart',
          type: 'number',
          validation: Rule => Rule.required().min(1).max(176)
        }),
        defineField({
          name: 'verseEnd',
          type: 'number',
          validation: Rule => Rule.min(1).max(176)
        })
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Discussion',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'replies',
      title: 'Replies',
      type: 'array',
      of: [reply],
      validation: Rule => Rule.max(100) // Reduced from 500 to 100
    })
  ],
  preview: {
    select: {
      title: 'title',
      book: 'biblePassage.book',
      chapter: 'biblePassage.chapter',
      verseStart: 'biblePassage.verseStart',
      verseEnd: 'biblePassage.verseEnd',
      authorName: 'author.name', // Assuming your user type has a name field
      featured: 'isFeatured'
    },
    prepare({ title, book, chapter, verseStart, verseEnd, authorName, featured }) {
      const passage = verseEnd 
        ? `${book} ${chapter}:${verseStart}-${verseEnd}`
        : `${book} ${chapter}:${verseStart}`
      
      return {
        title,
        subtitle: `${authorName} • ${passage} ${featured ? '🌟' : ''}`,
        media: CommentIcon
      }
    }
  }
})