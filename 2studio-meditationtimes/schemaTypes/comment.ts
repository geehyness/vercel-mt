import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().max(500),
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: 'Comments won\'t show on the site until approved.',
      initialValue: false,
      readOnly: ({ currentUser }) =>
        !(currentUser?.roles?.some(role => ['administrator', 'editor'].includes(role.name))),
      options: {
        layout: 'checkbox',
      },
    }),
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: Rule => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Today',
      },
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      comment: 'comment',
      postTitle: 'post.title',
      approved: 'approved',
      createdAt: '_createdAt',
      userName: 'user.name',
    },
    prepare({ comment, postTitle, approved, createdAt, userName }) {
      const MAX_COMMENT_PREVIEW = 40;
      const truncatedComment = comment?.length > MAX_COMMENT_PREVIEW
        ? comment.substring(0, MAX_COMMENT_PREVIEW) + '...'
        : comment;

      return {
        title: `${userName || 'Anonymous'} on "${postTitle || 'Untitled Post'}"`,
        subtitle: `${createdAt ? new Date(createdAt).toLocaleString() : 'Unknown Date'} - ${truncatedComment || '(No comment text)'}`,
        media: approved ? '✅' : '⏳',
      };
    },
  },
  initialValue: {
    createdAt: new Date().toISOString(),
    approved: false,
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
