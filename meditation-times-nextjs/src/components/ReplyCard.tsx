interface ReplyCardProps {
  content: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  isAuthor?: boolean
}

export default function ReplyCard({
  content,
  authorName,
  authorAvatar,
  createdAt,
  isAuthor = false
}: ReplyCardProps) {
  return (
    <div className={`p-4 mb-4 rounded-lg border ${isAuthor ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start gap-3">
        {authorAvatar && (
          <img 
            src={authorAvatar} 
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">{authorName}</span>
              {isAuthor && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Author
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-800 whitespace-pre-line">{content}</p>
        </div>
      </div>
    </div>
  )
}