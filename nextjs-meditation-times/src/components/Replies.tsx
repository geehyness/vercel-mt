'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

interface Reply {
  _id: string;
  content: string;
  _createdAt: string;
  author: {
    _id: string;
    name: string;
  };
}

interface RepliesProps {
  discussionId: string;
  discussionAuthorId: string;
}

export default function Replies({ discussionId, discussionAuthorId }: RepliesProps) {
  const { user, isAuthenticated } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(true);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(`/api/replies?discussionId=${discussionId}`);
        const data = await response.json();
        if (response.ok) {
          setReplies(data.replies);
        } else {
          throw new Error(data.message || 'Failed to fetch replies');
        }
      } catch (error) {
        console.error('Error fetching replies:', error);
        setStatus({ type: 'error', message: 'Error loading replies' });
      } finally {
        setLoadingReplies(false);
      }
    };

    fetchReplies();
  }, [discussionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
  
    try {
      if (!isAuthenticated || !user?._id) {
        throw new Error('You must be logged in to reply');
      }
  
      const response = await fetch('/api/replies', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Explicitly request JSON response
        },
        body: JSON.stringify({
          discussionId,
          content: replyContent,
          authorId: user._id
        }),
      });
  
      // First check if the response is OK
      if (!response.ok) {
        const errorData = await response.text(); // Get raw response first
        throw new Error(errorData || 'Failed to submit reply');
      }
  
      // Then try to parse as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid server response');
      }
  
      // Optimistic update
      setReplies(prev => [{
        _id: data.reply._id || Date.now().toString(), // Fallback ID if missing
        content: replyContent,
        _createdAt: new Date().toISOString(),
        author: { _id: user._id, name: user.name || 'Anonymous' }
      }, ...prev]);
  
      setStatus({ type: 'success', message: data.message || 'Reply submitted!' });
      setReplyContent('');
      
    } catch (error: any) {
      console.error('Reply submission error:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to submit reply' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="replies-section">
      <h2 className="replies-title">Replies ({replies.length})</h2>

      {loadingReplies ? (
        <div className="loading-indicator">Loading replies...</div>
      ) : replies.length > 0 ? (
        <ul className="replies-list">
          {replies.map((reply) => (
            <li key={reply._id} className="reply-item">
              <div className="reply-header">
                <span className="reply-author">
                  {reply.author.name}
                  {reply.author._id === discussionAuthorId && (
                    <span className="author-badge">Author</span>
                  )}
                </span>
                <time className="reply-date">
                  {new Date(reply._createdAt).toLocaleString()}
                </time>
              </div>
              <div className="reply-content">{reply.content}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-replies">No replies yet. Be the first to respond!</p>
      )}

      <form onSubmit={handleSubmit} className="reply-form">
        <div className="form-group">
          <label htmlFor="reply-content" className="form-label">
            Your Reply
          </label>
          <textarea
            id="reply-content"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
            rows={4}
            maxLength={1000}
            disabled={isSubmitting || !isAuthenticated}
            placeholder={isAuthenticated ? 'Share your thoughts...' : 'Sign in to reply'}
            className="reply-textarea"
          />
        </div>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        {!isAuthenticated ? (
          <p className="auth-prompt">
            <Link href="/auth/signin" className="auth-link">
              Sign in
            </Link> to post a reply
          </p>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </button>
        )}
      </form>

      <style jsx>{`
        .replies-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eaeaea;
        }
        .replies-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        .replies-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }
        .reply-item {
          padding: 1.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .reply-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          gap: 0.75rem;
        }
        .reply-author {
          font-weight: 600;
          color: #333;
        }
        .author-badge {
          background: #e0f2fe;
          color: #0369a1;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin-left: 0.5rem;
        }
        .reply-date {
          font-size: 0.875rem;
          color: #666;
        }
        .reply-content {
          line-height: 1.6;
          color: #333;
          white-space: pre-wrap;
        }
        .reply-form {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 2rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #444;
        }
        .reply-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          resize: vertical;
          min-height: 120px;
        }
        .status-message {
          padding: 0.75rem;
          margin: 1rem 0;
          border-radius: 6px;
        }
        .status-message.success {
          background: #d1fae5;
          color: #065f46;
        }
        .status-message.error {
          background: #fee2e2;
          color: #b91c1c;
        }
        .auth-prompt {
          color: #666;
          margin: 1rem 0;
        }
        .auth-link {
          color: #2563eb;
          font-weight: 500;
          text-decoration: underline;
        }
        .submit-button {
          background: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-button:hover {
          background: #1d4ed8;
        }
        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .no-replies {
          color: #666;
          font-style: italic;
          margin-bottom: 2rem;
        }
        .loading-indicator {
          color: #666;
          margin-bottom: 2rem;
        }
      `}</style>
    </section>
  );
}