// schemaTypes/quizQuestion.ts
export const quizQuestion = {
    name: 'quizQuestion',
    type: 'object',
    fields: [
      {
        name: 'question',
        title: 'Question',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'options',
        title: 'Answer Options',
        type: 'array',
        of: [{ type: 'string' }],
        validation: Rule => Rule.min(2).max(4)
      },
      {
        name: 'correctAnswer',
        title: 'Correct Option Index',
        type: 'number',
        initialValue: 0,
        validation: Rule => Rule.min(0)
      }
    ]
  }