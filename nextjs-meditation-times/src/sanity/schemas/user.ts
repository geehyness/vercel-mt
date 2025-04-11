// src/sanity/schemas/user.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Display Name',
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
      hidden: true, // Hide this field in the Sanity Studio
      validation: Rule => Rule.required() // Password should be required during creation via API
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image'
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'user',
      options: {
        list: [
          { title: 'User', value: 'user' },
          { title: 'Moderator', value: 'moderator' },
          { title: 'Admin', value: 'admin' }
        ]
      }
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