// schemaTypes/biblePassage.ts
export const biblePassage = {
    name: 'biblePassage',
    type: 'document',
    icon: () => '📖',
    fields: [
      {
        name: 'reference',
        title: 'Reference',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'text',
        title: 'Full Text',
        type: 'text',
        rows: 3
      },
      {
        name: 'testament',
        title: 'Testament',
        type: 'string',
        options: {
          list: [
            { title: 'Old Testament', value: 'old' },
            { title: 'New Testament', value: 'new' }
          ],
          layout: 'radio'
        }
      }
    ],
    orderings: [
      {
        title: 'Testament, Reference',
        name: 'testamentReference',
        by: [
          { field: 'testament', direction: 'asc' },
          { field: 'reference', direction: 'asc' }
        ]
      }
    ]
  }