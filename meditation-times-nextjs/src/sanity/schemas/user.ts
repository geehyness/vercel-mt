import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'firebaseUid',
      title: 'Firebase UID',
      type: 'string',
      validation: Rule => Rule.required(),
      // hidden: true <--- REMOVED THIS LINE
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'User', value: 'user' },
          { title: 'Teacher', value: 'teacher' },
          { title: 'Admin', value: 'admin' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'user'
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'avatar',
      role: 'role'
    },
    prepare(selection) {
      const { title, subtitle, media, role } = selection;
      return {
        title: title,
        subtitle: `${subtitle} (${role})`,
        media: media
      };
    }
  }
});