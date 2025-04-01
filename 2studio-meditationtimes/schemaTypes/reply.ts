import { defineField, defineType } from 'sanity'

export const reply = defineType({
  name: 'reply',
  title: 'Discussion Reply',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Reply Content',
      type: 'text',
      rows: 3,
      validation: Rule => [
        Rule.required().error('Reply content is required'),
        Rule.min(10).error('Replies should be at least 10 characters')
      ]
    }),
    defineField({
      name: 'discussion',
      title: 'Discussion',
      type: 'reference',
      to: [{ type: 'discussion' }],
      validation: Rule => Rule.required().error('Discussion reference is required')
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
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required().error('Creation date is required')
    })
  ],
  preview: {
    select: {
      content: 'content',
      authorName: 'authorName',
      createdAt: 'createdAt'
    },
    prepare(selection) {
      const { content, authorName, createdAt } = selection
      return {
        title: `${authorName}'s reply`,
        subtitle: `${content?.substring(0, 50)}${content?.length > 50 ? '...' : ''} (${new Date(createdAt).toLocaleDateString()})`,
        media: '💬'
      }
    }
  }
})