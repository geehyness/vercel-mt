import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'biblePassage',
  title: 'Bible Passage',
  type: 'document',
  fields: [
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'testament',
      title: 'Testament',
      type: 'string',
      options: {
        list: [
          { title: 'Old Testament', value: 'old' },
          { title: 'New Testament', value: 'new' }
        ],
        layout: 'radio'
      },
      initialValue: 'old'
    })
  ],
  orderings: [
    {
      title: 'By Reference',
      name: 'referenceAsc',
      by: [{ field: 'reference', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'reference',
      subtitle: 'text',
      media: '📖'
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle?.substring(0, 50) + '...',
        media: '📖'
      }
    }
  }
})