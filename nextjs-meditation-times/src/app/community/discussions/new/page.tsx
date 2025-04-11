// src/app/community/discussions/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useBible from '@/hooks/useBible';
import { writeClient } from '@/lib/sanity.client';

/*interface BiblePassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text?: string;
}*/

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

    if (!appUser) {
      setError('You must be logged in to create a discussion');
      setIsSubmitting(false);
      return;
    }

    if (!formData.title) {
      setError('Discussion title is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.biblePassage.book) {
      setError('Please select a Bible passage');
      setIsSubmitting(false);
      return;
    }

    try {
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
        authorRef: appUser._id,
        authorName: appUser.name,
        authorEmail: appUser.email,
        createdAt: new Date().toISOString(),
        isFeatured: false
      });

      router.push(`/community/discussions/${result._id}`);
    } catch (err: unknown) {
      console.error('Error creating discussion:', err);
      setError('Failed to create discussion');
    } finally {
      setIsSubmitting(false);
    }
  };
//<TokenDebug/>
  return (
    <div className="max-w-2xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-6">New Discussion</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bible Reference Selector */}
        <div className="space-y-2">
          <label className="block mb-2 font-medium">Bible Reference*</label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value);
                setSelectedChapter(null);
                setSelectedVerseStart(null);
                setSelectedVerseEnd(null);
              }}
              className="p-2 border rounded"
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
              className="p-2 border rounded"
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
              className="p-2 border rounded"
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
              className="p-2 border rounded"
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
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Confirm Passage
          </button>

          {formData.biblePassage.text && (
            <div className="p-3 mt-2 bg-gray-50 border rounded">
              <p className="font-semibold">Selected Passage:</p>
              <p>{formData.biblePassage.text}</p>
            </div>
          )}
        </div>

        {/* Discussion Title */}
        <div>
          <label className="block mb-2 font-medium">Discussion Title*</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Discussion Content */}
        <div>
          <label className="block mb-2 font-medium">Details</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.biblePassage.book}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Creating...' : 'Create Discussion'}
        </button>
      </form>
    </div>
  );
}