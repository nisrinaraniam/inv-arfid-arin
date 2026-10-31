import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  isMuted: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onToggle, isMuted }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-background/80 backdrop-blur-md border border-foreground/20 text-foreground flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      {isMuted ? <VolumeX className="w-5 h-5 opacity-70" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
};
