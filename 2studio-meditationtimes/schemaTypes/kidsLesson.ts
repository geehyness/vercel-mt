// sanity/schemas/kidsLesson.ts
import { defineType } from 'sanity';

export default defineType({
  name: 'kidsLesson',
  title: 'Kids Lesson',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'biblePassage',
      title: 'Bible Passage',
      type: 'reference',
      to: [{ type: 'biblePassage' }],
    },
    {
      name: 'teacherNotes',
      title: 'Teacher Notes',
      type: 'text',
      rows: 4,
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});