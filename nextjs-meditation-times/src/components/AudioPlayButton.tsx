'use client';

import { useAudioPlayer } from '@/context/AudioPlayerContext';
import post from '@/sanity/schemas/post';
import { useCallback, useEffect, useState } from 'react';

interface AudioPlayButtonProps {
  src: string;
  title: string;
  artist?: string;
  artworkUrl?: string;
  yearWeek: string
}

export default function AudioPlayButton({ src, title, yearWeek, artist, artworkUrl }: AudioPlayButtonProps) {
  const { currentTrack, isPlaying, loadAndPlay, pause, play, error } = useAudioPlayer();
  const [localError, setLocalError] = useState<string | null>(null);
  const isThisTrackPlaying = isPlaying && currentTrack?.src === src;
  const isThisTrackLoaded = currentTrack?.src === src;

  // Fixed useEffect syntax
  useEffect(() => {
    if (!src) {
      setLocalError('No audio source provided');
      return;
    }

    try {
      new URL(src);
      setLocalError(null);
    } catch (e) {
      setLocalError('Invalid audio URL format');
      console.error('Invalid audio URL:', src, e);
    }
  }, [src]);

  const handleButtonClick = useCallback(() => {
    if (!src || localError) return;
  
    if (isThisTrackLoaded) {
      isPlaying ? pause() : play();
    } else {
      loadAndPlay({
        src: src.trim(),
        title,
        artist,
        artworkUrl,
        postSlug: yearWeek // Make sure this is passed correctly
      });
    }
  }, [yearWeek, src, title, artist, artworkUrl, isThisTrackLoaded, isPlaying, loadAndPlay, pause, play, localError]);

  if (!src) return null;

  return (
    <div className="audio-button-container" style={{ margin: '1.5rem 0' }}>
      <p className="audio-file-name" style={{ marginBottom: '0.5rem', fontSize: '1rem', color: '#555' }}>
        AI Analysis: <strong>{title || 'Untitled Audio'}</strong>
      </p>

      {(error || localError) && (
        <p className="audio-error-message" style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Error: {error || localError}
        </p>
      )}

      <button
        onClick={handleButtonClick}
        className="audio-play-button"
        disabled={!!localError}
      >
        {localError ? 'Invalid Audio' :
          isThisTrackPlaying ? 'Pause Analysis' :
          isThisTrackLoaded ? 'Resume Analysis' : 'Play Analysis'}
      </button>

      <style jsx>{`
        .audio-button-container {
          margin-top: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
        }
        .audio-file-name strong {
          color: #333;
        }
        .audio-play-button {
          background: #28a745;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s ease;
        }
        .audio-play-button:hover:not(:disabled) {
          background: #218838;
        }
        .audio-play-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        .audio-error-message {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}