// components/InteractiveQuiz.tsx
"use client";
import { useState } from 'react';

export function InteractiveQuiz({ questions }) {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  const handleSubmit = () => {
    const correct = questions.filter((q, i) => 
      answers[i] === q.correctAnswer
    ).length;
    setScore(correct);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="border p-4 rounded-lg">
          <h3 className="font-medium mb-3">Q{i+1}: {q.question}</h3>
          <div className="space-y-2">
            {q.options.map((opt, j) => (
              <label key={j} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q${i}`}
                  onChange={() => {
                    const newAnswers = [...answers];
                    newAnswers[i] = j;
                    setAnswers(newAnswers);
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button 
        onClick={handleSubmit}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Check Score
      </button>
      {score !== null && (
        <p>You scored {score}/{questions.length}</p>
      )}
    </div>
  );
}