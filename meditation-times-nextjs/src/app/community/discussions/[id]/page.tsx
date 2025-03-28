import { getDiscussionWithReplies } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import ReplyCard from '@/components/ReplyCard'
import ReplyForm from '@/components/ReplyForm'

interface DiscussionPageProps {
  params: { id: string }
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const discussion = await getDiscussionWithReplies(params.id)
  
  if (!discussion) {
    return notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <article className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{discussion.question}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {discussion.user?.avatar && (
            <img 
              src={discussion.user.avatar} 
              alt={discussion.userName}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span>Posted by {discussion.userName}</span>
          <span>•</span>
          <span>{new Date(discussion.createdAt).toLocaleString()}</span>
        </div>

        {discussion.passageText && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">{discussion.biblePassage}</h3>
            <p className="text-gray-700 whitespace-pre-line">{discussion.passageText}</p>
          </div>
        )}

        <div className="prose max-w-none mb-8 whitespace-pre-line">
          {discussion.details}
        </div>
      </article>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Replies ({discussion.replies?.length || 0})
        </h2>
        {discussion.replies?.length > 0 ? (
          <div className="space-y-4">
            {discussion.replies.map((reply) => (
              <ReplyCard
                key={reply._id}
                content={reply.content}
                authorName={reply.userName || reply.user?.name}
                authorAvatar={reply.user?.avatar}
                createdAt={reply.createdAt}
                isAuthor={reply.user?._id === discussion.user?._id}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No replies yet. Be the first to respond!</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Add Your Reply</h2>
        <ReplyForm discussionId={params.id} />
      </section>
    </div>
  )
}