  // hooks/useBible.ts
  import { useState, useEffect } from 'react';

  type BibleBook = {
    [chapter: string]: {
      [verse: string]: string;
    };
  };

  type BibleData = {
    [book: string]: BibleBook;
  };

  export default function useBible() {
    const [bible, setBible] = useState<BibleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadBible = async () => {
        try {
          const response = await fetch('/bible/NIV_bible.json');
          if (!response.ok) throw new Error('Failed to load Bible data');
          const data = await response.json();
          setBible(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      };

      loadBible();
    }, []);

    const getVerseText = (
      book: string,
      chapter: string,
      verseStart: string,
      verseEnd?: string
    ): string | null => {
      if (!bible || !bible[book] || !bible[book][chapter]) return null;

      if (verseEnd && verseEnd !== verseStart) {
        const verses = [];
        for (let v = +verseStart; v <= +verseEnd; v++) {
          const verse = v.toString();
          if (bible[book][chapter][verse]) {
            verses.push(`${verse}. ${bible[book][chapter][verse]}`);
          }
        }
        return verses.join('\n');
      }

      return bible[book][chapter][verseStart] || null;
    };

    return { bible, loading, error, getVerseText };
  }