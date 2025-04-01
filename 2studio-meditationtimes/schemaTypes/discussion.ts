import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

// List of all Bible books for the dropdown
const bibleBooks = [
  { title: 'Genesis', value: 'Genesis' },
  { title: 'Exodus', value: 'Exodus' },
  { title: 'Leviticus', value: 'Leviticus' },
  { title: 'Numbers', value: 'Numbers' },
  { title: 'Deuteronomy', value: 'Deuteronomy' },
  // Add all other books here...
]

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
      validation: Rule => [
        Rule.required().error('Title is required'),
        Rule.max(120).warning('Keep titles under 120 characters')
      ]
    }),
    defineField({
      name: 'content',
      title: 'Detailed Explanation',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().error('Content is required')
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
      options: { list: bibleBooks }
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
    }),
    // Add this new field
    defineField({
      name: 'text',
      type: 'string',
      title: 'Passage Text',
      description: 'The actual text of the Bible passage'
    })
  ],
  validation: Rule => Rule.required()
}),
    defineField({
      name: 'authorRef',
      title: 'Author Firebase UID',
      type: 'string',
      validation: Rule => Rule.required().error('Author reference is required')
    }),
    defineField({
      name: 'authorName',
      title: 'Author Display Name',
      type: 'string',
      validation: Rule => Rule.required().error('Author name is required')
    }),
    defineField({
      name: 'authorEmail',
      title: 'Author Email',
      type: 'string',
      validation: Rule => [
        Rule.required().error('Email is required'),
        Rule.email().error('Must be a valid email address')
      ]
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
      validation: Rule => Rule.required().error('Creation date is required')
    }),
    defineField({
      name: 'replies',
      title: 'Replies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'reply' }] }],
      validation: Rule => Rule.max(100).warning('Consider splitting discussions with many replies')
    })
  ],
  orderings: [
    {
      title: 'Newest',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    },
    {
      title: 'Oldest',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      book: 'biblePassage.book',
      chapter: 'biblePassage.chapter',
      verseStart: 'biblePassage.verseStart',
      verseEnd: 'biblePassage.verseEnd',
      authorName: 'authorName',
      featured: 'isFeatured',
      replies: 'replies' // Get the references without expansion
    },
    prepare(selection) {
      const {
        title,
        book,
        chapter,
        verseStart,
        verseEnd,
        authorName,
        featured,
        replies
      } = selection
      
      const passage = verseEnd 
        ? `${book} ${chapter}:${verseStart}-${verseEnd}`
        : `${book} ${chapter}:${verseStart}`
      
      const replyCount = replies?.length || 0
      
      return {
        title,
        subtitle: `${authorName} • ${passage} ${featured ? '🌟' : ''} ${replyCount ? `(${replyCount} replies)` : ''}`,
        media: CommentIcon
      }
    }
  }
})