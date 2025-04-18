'use client';

import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Import the CSS Module
import styles from './FloatingAudioControls.module.css';

export default function FloatingAudioControls() {
  // Destructure the stop function from the context
  const { currentTrack, isPlaying, currentTime, duration, pause, play, seekTo, stop } = useAudioPlayer();
  const [isOpen, setIsOpen] = useState(false);

  // Automatically open when track starts playing
  useEffect(() => {
    if (currentTrack) {
      setIsOpen(true);
    } else {
      // If track is cleared (e.g., stopped externally), hide the controls
      // Add a small delay to allow animation to start before removing element
      const timer = setTimeout(() => setIsOpen(false), 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [currentTrack]); // Depend on currentTrack

  // Render nothing if no track is loaded and controls are not open (or are animating closed)
  // Keep the div in the DOM if isOpen is true or if currentTrack was just cleared
  // to allow the exit animation.
  // Check currentTrack status after the timeout for a clean unmount.
  if (!currentTrack && !isOpen) {
       // Check if controls were just open and now track is null, maybe delay removal slightly
       // This check might need refinement based on specific animation needs.
       // For now, rely on useEffect delay for hiding.
       return null;
  }


  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'; // Handle potential bad values
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Apply CSS Module class for the outermost container
  // Removed all Tailwind classes here
  return (
    <div className={styles['audio-controls-container']}>
      {/* The floating toggle button is removed */}
      {/* The audio card is shown based on the 'isOpen' state */}
      {isOpen && (
        // Apply CSS Module class for the audio card
        <div className={styles['audio-controls-card']}>
          {/* Apply CSS Module class for the card header */}
          <div className={styles['card-header']}>
            {/* Apply CSS Module class for the track title */}
             <h3>
              <Link
                href={`/post/${currentTrack?.postSlug}`} // Use optional chaining
                className={styles['track-title-link']} // Apply the new class
              >
                {currentTrack?.title} {/* Use optional chaining */}
              </Link>
            </h3>
            {/* Apply CSS Module class for the close button */}
            {/* This button now stops playback and hides the controls */}
            <button
              onClick={() => {
                stop(); // Stop playback using the context function (assumes this clears currentTrack)
                // setIsOpen(false); // useEffect handles hiding based on currentTrack change
              }}
              className={styles['close-button']} // Apply the new class
              aria-label="Stop Playback and Close Audio Controls" // Added for accessibility
            >
              ×
            </button>
          </div>

          {/* Apply CSS Module class for the card body */}
          <div className={styles['card-body']}>
            {/* Apply CSS Module class for the playback controls row */}
            <div className={styles['playback-controls']}>
              {/* Apply CSS Module class for the play/pause button */}
              <button
                onClick={isPlaying ? pause : play}
                className={styles['play-pause-button']} // Apply the new class
                aria-label={isPlaying ? 'Pause' : 'Play'} // Added for accessibility
              >
                {isPlaying ? (
                  <svg className={styles['icon-size']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className={styles['icon-size']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                )}
              </button>

              {/* Apply CSS Module class for the progress container */}
              <div className={styles['progress-container']}>
                {/* Apply CSS Module class for the progress bar input */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className={styles['progress-range']}
                  aria-label="Audio progress"
                />
                {/* Apply CSS Module class for the time display */}
                <div className={styles['time-display']}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}