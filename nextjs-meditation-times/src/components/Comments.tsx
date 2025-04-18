// components/Comments.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { CommentQueryResult } from '@/app/post/[yearWeek]/page'; // Import the type from the page
import Link from 'next/link';

interface CommentsProps {
  postId: string;
  initialComments: CommentQueryResult[]; // Comments are received as a prop
}

export default function Comments({ postId, initialComments }: CommentsProps) {
  const { user, isAuthenticated } = useAuth();
  // Initialize comments state with the comments passed from the server/page
  const [comments, setComments] = useState<CommentQueryResult[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (!isAuthenticated || !user?._id) {
        setStatusMessage('Error: You must be logged in to comment');
        setIsSubmitting(false);
        return; // Stop execution
      }

       if (!commentText.trim()) {
          setStatusMessage('Error: Comment cannot be empty.');
          setIsSubmitting(false);
          return;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId, // postId received from props
          comment: commentText,
          userId: user._id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // --- Optimistic Update ---
      // Add the new comment to the state immediately.
      // Note: The API/Sanity saves the comment with approved: false by default.
      // This optimistic update shows the user their comment instantly,
      // but it will disappear for other users (and on page refresh)
      // until it is manually approved in the Sanity Studio.
      setComments(prev => [...prev, {
        // Use data returned from the API if available (_id, _createdAt)
        _id: data.comment._id,
        _createdAt: data.comment._createdAt || new Date().toISOString(), // Fallback timestamp
        comment: commentText, // Use the text the user typed
        user: { _id: user._id, name: user.name || 'You' }, // Use logged-in user info
        approved: data.comment.approved ?? true // Optimistically assume true for immediate display
      }]);

      setStatusMessage('Comment submitted successfully!'); // Inform the user
      setCommentText('');

    } catch (error: any) {
      console.error('Comment submission failed:', error);
      setStatusMessage(`Error: ${error.message || 'Failed to submit comment'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="comments-section" aria-labelledby="comments-heading">
      <hr className="comments-divider" />
      {/* Display the number of comments received from the server (approved ones) */}
      <h2 id="comments-heading" className="comments-title">
        Comments ({comments.length})
      </h2>

      {/* Display initial comments received from the server */}
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            // Note: These comments are already filtered by 'approved == true' in the fetch query on the page
            <li key={comment._id} className="comment-item">
              <p className="comment-meta">
                <strong className="comment-author">
                  {comment.user?.name || 'Anonymous'}
                </strong>
                <time dateTime={comment._createdAt} className="comment-date">
                  {/* Format the date */}
                  {new Date(comment._createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </p>
              <p className="comment-body">{comment.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
         // Message shown if no *approved* comments are found
        <p>Be the first to comment!</p>
      )}

      <form onSubmit={handleSubmit} className="comment-form">
        <h3 className="form-title">Leave a Comment</h3>

        {statusMessage && (
          <p className={`status-message ${
            statusMessage.startsWith('Error') ? 'error' : 'success'
          }`}>
            {statusMessage}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="comment-text">Comment:</label>
          <textarea
            id="comment-text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={4}
            maxLength={500}
            disabled={isSubmitting || !isAuthenticated}
            placeholder={isAuthenticated ? 'Write your comment...' : 'Please sign in to comment'}
          />
        </div>

        {!isAuthenticated ? (
          <p className="auth-message">
            Please <Link href="/auth/signin" className="text-indigo-500 hover:underline">sign in</Link> to leave a comment.
            </p>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()} // Disable if submitting or text is empty
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        )}
      </form>

      <style jsx>{`
        /* Maintain all previous styles */
        .comments-section { margin-top: 2rem; padding-top: 1.5rem; }
        .comments-divider { border: none; border-top: 1px solid #e0e0e0; margin: 2rem 0; }
        .comments-title, .form-title { font-size: 1.5rem; margin-bottom: 1rem; color: #333; }
        .comments-list { list-style: none; padding: 0; margin: 0 0 2rem 0; }
        .comment-item { background: #f9f9f9; border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .comment-meta { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #555; }
        .comment-author { font-weight: bold; margin-right: 0.5rem; color: #222; }
        .comment-date { font-size: 0.85rem; color: #777; }
        .comment-body { margin: 0; line-height: 1.6; color: #333; }
        .comment-form { background: #f0f0f0; padding: 1.5rem; border-radius: 5px; margin-top: 1rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: #444; }
        .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; resize: vertical; }
        .submit-button { background: #007bff; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; transition: background 0.2s ease; }
        .submit-button:hover { background: #0056b3; }
        .submit-button:disabled { background: #ccc; cursor: not-allowed; }
        .status-message { padding: 0.75rem; margin-bottom: 1rem; border-radius: 4px; font-weight: bold; }
        .status-message.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status-message.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .auth-message { background: #fff3cd; color: #856404; padding: 0.75rem; border-radius: 4px; margin: 1rem 0; border: 1px solid #ffeeba; }
        .auth-message a { color: #004085; text-decoration: underline; font-weight: bold; }
      `}</style>
    </section>
  );
}