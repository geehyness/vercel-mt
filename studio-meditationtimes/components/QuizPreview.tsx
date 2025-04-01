// components/QuizPreview.tsx
export function QuizPreview({ value }) {
    return (
      <div>
        {value?.map((q, i) => (
          <Card key={i} marginBottom={3} padding={3} border>
            <p><strong>Q{i+1}:</strong> {q.question}</p>
            <ul>
              {q.options?.map((opt, j) => (
                <li key={j} style={{ 
                  color: j === q.correctAnswer ? 'green' : 'inherit'
                }}>
                  {opt}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    )
  }
  
  // In your schema:
  {
    name: 'quiz',
    type: 'array',
    components: {
      input: QuizPreview
    }
  }