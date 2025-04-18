'use client';

import { createContext, useContext, useState, ReactNode, useRef, useEffect, useCallback } from 'react';

interface AudioTrack {
    src: string;
    title: string;
    artist?: string;
    artworkUrl?: string;
    postSlug: string; // Add this new property
  }

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loadAndPlay: (track: AudioTrack) => void;
  pause: () => void;
  play: () => void;
  seekTo: (time: number) => void;
  stop: () => void;
  error: string | null;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Event handlers
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setError(null);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    audioRef.current && setCurrentTime(audioRef.current.currentTime);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      setCurrentTime(0);
      setError(null);
    }
  }, []);

  const handleError = useCallback((e: Event) => {
    const audio = audioRef.current;
    console.error('Audio error:', e.type, audio?.error);
    
    let userMessage = 'An unknown audio error occurred.';
    switch (audio?.error?.code) {
      case 1: userMessage = 'Playback aborted. Please try again.'; break;
      case 2: userMessage = 'Network error. Could not download audio.'; break;
      case 3: userMessage = 'Audio corrupted or format not supported.'; break;
      case 4: userMessage = 'Audio not found or format not supported.'; break;
      default: userMessage = `Audio error ${audio?.error?.code || ''}.`;
    }

    setError(userMessage);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentTrack(null);
  }, []);

  // Event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const events = {
      play: handlePlay,
      pause: handlePause,
      timeupdate: handleTimeUpdate,
      ended: handleEnded,
      loadedmetadata: handleLoadedMetadata,
      error: handleError
    };

    Object.entries(events).forEach(([event, handler]) => 
      audio.addEventListener(event, handler)
    );

    return () => {
      Object.entries(events).forEach(([event, handler]) => 
        audio.removeEventListener(event, handler)
      );
    };
  }, [handlePlay, handlePause, handleTimeUpdate, handleEnded, handleLoadedMetadata, handleError]);

  // Media session
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !('mediaSession' in navigator)) return; // Fixed missing parenthesis

    if (!currentTrack) {
      navigator.mediaSession.metadata = null;
      ['play', 'pause', 'seekbackward', 'seekforward', 'seekto'].forEach(action => 
        navigator.mediaSession.setActionHandler(action, null)
      );
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist || 'Analysis',
      artwork: currentTrack.artworkUrl ? [{
        src: currentTrack.artworkUrl,
        sizes: '512x512',
        type: 'image/png'
      }] : []
    });

    const mediaHandlers = {
      play: () => audio.play(),
      pause: () => audio.pause(),
      seekbackward: (details: any) => {
        audio.currentTime = Math.max(audio.currentTime - (details.seekOffset || 10), 0);
      },
      seekforward: (details: any) => {
        audio.currentTime = Math.min(audio.currentTime + (details.seekOffset || 10), audio.duration);
      },
      seekto: (details: any) => {
        if (details.seekTime !== undefined) {
          audio.currentTime = details.seekTime;
        }
      }
    };

    Object.entries(mediaHandlers).forEach(([action, handler]) => 
      navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler)
    );

    return () => {
      navigator.mediaSession.metadata = null;
    };
  }, [currentTrack]);

  // Control methods
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, []);

  const loadAndPlay = useCallback((track: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio || !track?.src) {
      setError(track?.src ? 'Audio element unavailable' : 'Missing audio source');
      return;
    }

    try {
      new URL(track.src);
    } catch (e) {
      setError('Invalid audio URL format');
      return;
    }

    audio.pause();
    audio.src = track.src;
    audio.load();

    audio.play().catch((error: DOMException) => {
      setIsPlaying(false);
      setError(error.name === 'NotAllowedError' 
        ? 'Playback requires user interaction' 
        : 'Failed to start playback'
      );
    });

    setCurrentTrack(track);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setError(null);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (audio && currentTrack && !isPlaying) {
      audio.play().catch((error: DOMException) => {
        setIsPlaying(false);
        setError(error.name === 'NotAllowedError' 
          ? 'Playback requires user interaction' 
          : 'Failed to resume playback'
        );
      });
    }
  }, [currentTrack, isPlaying]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
  }, [duration]);

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      loadAndPlay,
      pause,
      play,
      seekTo,
      stop,
      error
    }}>
      <audio ref={audioRef} style={{ display: 'none' }} crossOrigin="anonymous" />
      {children}
    </AudioPlayerContext.Provider>
  );
};

// Export the hook properly
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};