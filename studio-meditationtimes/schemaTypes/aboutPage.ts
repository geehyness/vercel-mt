// sanity/schemas/aboutPage.ts
import { defineType } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
    },
    {
      name: 'missionTitle',
      title: 'Mission Section Title',
      type: 'string',
    },
    {
      name: 'missionContent',
      title: 'Mission Section Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'whoWeAreTitle',
      title: 'Who We Are Section Title',
      type: 'string',
    },
    {
      name: 'whoWeAreContent',
      title: 'Who We Are Section Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'whatYoullFindTitle',
      title: 'What You\'ll Find Here Section Title',
      type: 'string',
    },
    {
      name: 'whatYoullFindContent',
      title: 'What You\'ll Find Here Section Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    // You can add more fields as needed
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});