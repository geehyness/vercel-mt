import { defineField, defineType } from 'sanity'

export const reply = defineType({
  name: 'reply',
  title: 'Reply',
  type: 'object',
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'content',
      title: 'Reply Content',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().min(10)
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    })
  ],
  preview: {
    select: {
      content: 'content',
      user: 'user.name'
    },
    prepare({ content, user }) {
      return {
        title: `${user}'s reply`,
        subtitle: content?.substring(0, 50) + (content?.length > 50 ? '...' : ''),
        media: () => '💬'
      }
    }
  }
})