export default {
    name: 'discussion',
    title: 'Discussion',
    type: 'document',
    fields: [
      // ... your existing fields
      {
        name: 'user',
        title: 'User',
        type: 'reference',
        to: [{ type: 'user' }], // Make sure you have a user type
        validation: Rule => Rule.required()
      }
    ],
    // Add this for permissions
    __experimental_actions: ['create', 'update', 'delete', 'publish'],
  };