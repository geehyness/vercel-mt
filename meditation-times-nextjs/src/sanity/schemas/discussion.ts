import { defineField, defineType } from 'sanity'
import { reply } from './reply'
import { CommentIcon } from '@sanity/icons'

const discussionSchema = defineType({
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
          validation: Rule => Rule.required().error('Book is required'),
          options: {
            list: bibleBooks
          }
        }),
        defineField({
          name: 'chapter',
          type: 'number',
          validation: Rule => [
            Rule.required().error('Chapter is required'),
            Rule.min(1).error('Chapter must be at least 1'),
            Rule.max(150).error('Chapter cannot exceed 150')
          ]
        }),
        defineField({
          name: 'verseStart',
          type: 'number',
          validation: Rule => [
            Rule.required().error('Starting verse is required'),
            Rule.min(1).error('Verse must be at least 1'),
            Rule.max(176).error('Verse cannot exceed 176')
          ]
        }),
        defineField({
          name: 'verseEnd',
          type: 'number',
          validation: Rule => [
            Rule.min(1).error('Verse must be at least 1'),
            Rule.max(176).error('Verse cannot exceed 176')
          ].concat(Rule.custom((value, context) => {
            const { verseStart } = context.parent as { verseStart?: number }
            if (value && verseStart && value < verseStart) {
              return 'End verse must be greater than start verse'
            }
            return true
          }))
        })
      ],
      validation: Rule => Rule.required().error('Bible passage is required')
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required().error('Author is required')
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
      of: [reply],
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
    },
    {
      title: 'Most Replies',
      name: 'replyCountDesc',
      by: [{ field: 'replies.length', direction: 'desc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      book: 'biblePassage.book',
      chapter: 'biblePassage.chapter',
      verseStart: 'biblePassage.verseStart',
      verseEnd: 'biblePassage.verseEnd',
      authorName: 'author.name',
      featured: 'isFeatured',
      replyCount: 'count(replies)'
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
        replyCount
      } = selection
      
      const passage = verseEnd 
        ? `${book} ${chapter}:${verseStart}-${verseEnd}`
        : `${book} ${chapter}:${verseStart}`
      
      return {
        title,
        subtitle: `${authorName || 'Unknown author'} • ${passage} ${featured ? '🌟' : ''} ${replyCount ? `(${replyCount} replies)` : ''}`,
        media: CommentIcon
      }
    }
  }
})

export default discussionSchema