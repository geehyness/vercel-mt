import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'reply',
  title: 'Discussion Reply',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Reply Content',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().max(1000),
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: 'Replies won\'t show until approved by a moderator',
      initialValue: false,
      readOnly: ({ currentUser }) =>
        !(currentUser?.roles?.some(role => ['administrator', 'editor'].includes(role.name))),
    }),
    defineField({
      name: 'discussion',
      title: 'Discussion',
      type: 'reference',
      to: [{ type: 'discussion' }],
      validation: Rule => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      content: 'content',
      discussionTitle: 'discussion.title',
      approved: 'approved',
      createdAt: 'createdAt',
      authorName: 'author.name',
    },
    prepare({ content, discussionTitle, approved, createdAt, authorName }) {
      const MAX_PREVIEW = 40;
      const truncatedContent = content?.length > MAX_PREVIEW
        ? content.substring(0, MAX_PREVIEW) + '...'
        : content;

      return {
        title: `${authorName || 'Anonymous'} replied to "${discussionTitle || 'Untitled Discussion'}"`,
        subtitle: `${createdAt ? new Date(createdAt).toLocaleString() : 'Unknown Date'} - ${truncatedContent || '(No content)'}`,
        media: approved ? '✅' : '⏳',
      };
    },
  },
  orderings: [
    {
      title: 'Creation Date, Newest First',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Approval Status',
      name: 'approvalStatus',
      by: [
        { field: 'approved', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
  ],
});