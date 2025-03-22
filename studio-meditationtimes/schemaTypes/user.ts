export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
        validation: (Rule: any) => Rule.required().email(),
      },
      {
        name: 'password',
        title: 'Password',
        type: 'string',
        hidden: true,
      },
      {
        name: 'emailVerified',
        title: 'Email Verified',
        type: 'datetime',
        hidden: true,
      },
      {
        name: 'role',
        title: 'Role',
        type: 'string',
        options: {
          list: [
            {title: 'User', value: 'user'},
            {title: 'Admin', value: 'admin'}
          ]
        },
        initialValue: 'user'
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        readOnly: true,
        initialValue: (new Date()).toISOString()
      }
    ]
  }