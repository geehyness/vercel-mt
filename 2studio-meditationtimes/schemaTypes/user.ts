import { defineField, defineType } from 'sanity'

export interface User {
  _id: string
  _createdAt: string
  name?: string
  email?: string
  avatar?: {
    asset: {
      url: string
    }
  }
  bibleVersion?: string
  testimony?: string
  prayerRequests?: string
  role?: string
}

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
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
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: true,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'avatar',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'bibleVersion',
      title: 'Preferred Bible Version',
      type: 'string',
      initialValue: 'NIV',
      options: {
        list: [
          { title: 'NIV', value: 'NIV' },
          { title: 'ESV', value: 'ESV' },
          { title: 'KJV', value: 'KJV' },
          { title: 'NKJV', value: 'NKJV' },
          { title: 'NASB', value: 'NASB' }
        ]
      }
    }),
    defineField({
      name: 'testimony',
      title: 'Personal Testimony',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'prayerRequests',
      title: 'Current Prayer Requests',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'member',
      options: {
        list: [
          { title: 'Member', value: 'member' },
          { title: 'Bible Study Leader', value: 'leader' },
          { title: 'Sunday School Teacher', value: 'teacher' },
          { title: 'Pastor', value: 'pastor' }
        ]
      },
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'avatar'
    }
  }
})