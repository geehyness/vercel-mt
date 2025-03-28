// app/kids/page.tsx
import { readClient } from '@/lib/sanity/client'

export default async function KidsPage() {
  const lessons = await readClient.fetch(`
    *[_type == "kidsLesson"] | order(_createdAt desc) {
      _id,
      title,
      "bibleStory": bibleStory->reference,
      targetAge,
      "quizQuestions": count(quiz)
    }
  `)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Kids Corner</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map(lesson => (
          <div key={lesson._id} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {lesson.bibleStory} • Age {lesson.targetAge}
            </p>
            <p className="mt-2">{lesson.quizQuestions} quiz questions</p>
            <Link 
              href={`/kids/lessons/${lesson._id}`}
              className="mt-3 inline-block bg-blue-500 text-white px-3 py-1 rounded"
            >
              Explore
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}