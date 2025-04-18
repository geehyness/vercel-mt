'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useBible from '@/hooks/useBible';
import { writeClient } from '@/lib/sanity/client';
import styles from './style.module.css';

export default function NewDiscussionPage() {
  const router = useRouter();
  const { user: appUser } = useAuth();
  const { bible, loading: bibleLoading, getVerseText } = useBible();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    biblePassage: {
      book: '',
      chapter: 0,
      verseStart: 0,
      verseEnd: undefined as number | undefined,
      text: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Bible selector state
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedVerseStart, setSelectedVerseStart] = useState<number | null>(null);
  const [selectedVerseEnd, setSelectedVerseEnd] = useState<number | null>(null);

  // Available options
  const availableBooks = bible ? Object.keys(bible) : [];
  const availableChapters = selectedBook && bible ? Object.keys(bible[selectedBook]).map(Number) : [];
  const availableVerses = selectedBook && selectedChapter && bible
    ? Object.keys(bible[selectedBook][selectedChapter.toString()]).map(Number)
    : [];

  const handlePassageSelect = () => {
    if (!selectedBook || !selectedChapter || !selectedVerseStart) {
      setError('Please select a book, chapter, and starting verse');
      return;
    }

    const verseText = getVerseText(selectedBook, selectedChapter.toString(), selectedVerseStart.toString());
    const endVerseText = selectedVerseEnd
      ? getVerseText(selectedBook, selectedChapter.toString(), selectedVerseEnd.toString())
      : null;

    setFormData({
      ...formData,
      biblePassage: {
        book: selectedBook,
        chapter: selectedChapter,
        verseStart: selectedVerseStart,
        verseEnd: selectedVerseEnd || undefined,
        text: `${selectedBook} ${selectedChapter}:${selectedVerseStart}${
          selectedVerseEnd ? `-${selectedVerseEnd}` : ''
        } - ${verseText}${endVerseText ? ` ... ${endVerseText}` : ''}`
      }
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    // 1. Validate user exists and has required fields
    if (!appUser) {
      setError('You must be logged in to create a discussion');
      setIsSubmitting(false);
      return;
    }
  
    if (!appUser._id || !appUser.name || !appUser.email) {
      setError('Your user profile is incomplete. Please update your profile.');
      setIsSubmitting(false);
      return;
    }
  
    // 2. Verify the user exists in Sanity
    try {
      const userExists = await writeClient.fetch(
        `defined(*[_type == "user" && _id == $userId][0]._id)`,
        { userId: appUser._id }
      );
  
      if (!userExists) {
        // Create the user document if it doesn't exist
        await writeClient.create({
          _type: 'user',
          _id: appUser._id,
          name: appUser.name,
          email: appUser.email,
          // Add other required fields from your user schema
          role: 'member' // default role
        });
      }
  
      // 3. Create the discussion with proper author reference
      const result = await writeClient.create({
        _type: 'discussion',
        title: formData.title,
        content: formData.content,
        biblePassage: {
          book: formData.biblePassage.book,
          chapter: formData.biblePassage.chapter,
          verseStart: formData.biblePassage.verseStart,
          verseEnd: formData.biblePassage.verseEnd,
          text: formData.biblePassage.text
        },
        author: {
          _type: 'reference',
          _ref: appUser._id
        },
        // Add authorName and authorEmail for easy querying
        authorName: appUser.name,
        authorEmail: appUser.email,
        isFeatured: false,
        createdAt: new Date().toISOString()
      });
  
      router.push(`/community/discussions/${result._id}`);
    } catch (err: unknown) {
      console.error('Error creating discussion:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to create discussion. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>New Discussion</h1>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Bible Reference Selector */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <span className={styles.requiredField}>Bible Reference</span>
          </label>

          <div className={styles.bibleSelector}>
            <select
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value);
                setSelectedChapter(null);
                setSelectedVerseStart(null);
                setSelectedVerseEnd(null);
              }}
              className={styles.input}
              disabled={bibleLoading}
            >
              <option value="">Select Book</option>
              {availableBooks.map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>

            <select
              value={selectedChapter || ''}
              onChange={(e) => {
                setSelectedChapter(Number(e.target.value));
                setSelectedVerseStart(null);
                setSelectedVerseEnd(null);
              }}
              className={styles.input}
              disabled={!selectedBook}
            >
              <option value="">Chapter</option>
              {availableChapters.map(chapter => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>

            <select
              value={selectedVerseStart || ''}
              onChange={(e) => {
                setSelectedVerseStart(Number(e.target.value));
                setSelectedVerseEnd(null);
              }}
              className={styles.input}
              disabled={!selectedChapter}
            >
              <option value="">Verse Start</option>
              {availableVerses.map(verse => (
                <option key={`start-${verse}`} value={verse}>{verse}</option>
              ))}
            </select>

            <select
              value={selectedVerseEnd || ''}
              onChange={(e) => setSelectedVerseEnd(Number(e.target.value))}
              className={styles.input}
              disabled={!selectedVerseStart}
            >
              <option value="">Verse End (optional)</option>
              {availableVerses
                .filter(v => v >= (selectedVerseStart || 0))
                .map(verse => (
                  <option key={`end-${verse}`} value={verse}>{verse}</option>
                ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handlePassageSelect}
            disabled={!selectedVerseStart}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Confirm Passage
          </button>

          {formData.biblePassage.text && (
            <div className={styles.selectedPassage}>
              <p className={styles.passageTitle}>Selected Passage:</p>
              <p className={styles.passageText}>{formData.biblePassage.text}</p>
            </div>
          )}
        </div>

        {/* Discussion Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <span className={styles.requiredField}>Discussion Title</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className={styles.input}
            required
          />
        </div>

        {/* Discussion Content */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Details (Optional)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className={`${styles.input} ${styles.textarea}`}
            rows={6}
            placeholder="Add any additional context or questions about this passage..."
          />
        </div>

        {/* Submit Button */}
        <div className={styles.formGroup}>
          <button
            type="submit"
            disabled={isSubmitting || !formData.biblePassage.book || !formData.title}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            {isSubmitting ? 'Creating Discussion...' : 'Create Discussion'}
          </button>
        </div>
      </form>
    </div>
  );
}