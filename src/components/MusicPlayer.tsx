import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  isMuted: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onToggle, isMuted }) => {
  const active = isPlaying && !isMuted;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onClick={onToggle}
      className="group fixed bottom-5 right-5 z-40 rounded-full border border-foreground/30 p-[3px] bg-background/85 backdrop-blur-md transition-all duration-300 hover:border-foreground/60 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
      aria-label={active ? 'Mute music' : 'Play music'}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/85 border border-foreground/15">
        {active ? (
          <Volume2 className="h-[18px] w-[18px]" strokeWidth={1.4} />
        ) : (
          <VolumeX className="h-[18px] w-[18px] opacity-70" strokeWidth={1.4} />
        )}
      </span>
    </motion.button>
  );
};
