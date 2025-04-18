// components/LoadAudioOnPage.tsx
'use client';

import { useEffect } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface LoadAudioOnPageProps {
  src: string | null; // Audio file URL
  title: string;
  artist?: string;
  artworkUrl?: string;
}

export default function LoadAudioOnPage({ src, title, artist, artworkUrl }: LoadAudioOnPageProps) {
  const { loadAndPlay, currentTrack } = useAudioPlayer();

  useEffect(() => {
    // Check if we have a source and if it's different from the currently playing track
    if (src && (!currentTrack || currentTrack.src !== src)) {
      loadAndPlay({ src, title, artist, artworkUrl });
    }
     // Optional: If src is null and the current track is the one that WAS playing from this page, stop it
     // This is more complex if you want to allow playing other audio globally
     // else if (!src && currentTrack?.src === /* logic to check if currentTrack is from this post */) {
     //     useAudioPlayer().stop();
     // }

  }, [src, title, artist, artworkUrl, loadAndPlay, currentTrack]); // Add dependencies

  // This component doesn't render anything visible
  return null;
}