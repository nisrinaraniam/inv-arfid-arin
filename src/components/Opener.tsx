import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpenerProps {
  onEnter: () => void;
  onStartMusic: () => void;
  onShowHeroText: () => void;
}

export const Opener: React.FC<OpenerProps> = ({ onEnter, onStartMusic, onShowHeroText }) => {
  const [opened, setOpened] = useState(false);
  const [faded, setFaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    onStartMusic();
    onShowHeroText();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleEnded = () => {
    setFaded(true);
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {!faded && (
        <motion.div
          className="fixed inset-0 z-50 cursor-pointer bg-background overflow-hidden"
          role="button"
          tabIndex={0}
          aria-label="Open wedding invitation"
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: opened ? 0 : 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: opened ? 3.5 : 0 }}
          onAnimationComplete={() => {
            if (opened) handleEnded();
          }}
        >
          <button
            type="button"
            className="local-skip"
            onClick={(e) => {
              e.stopPropagation();
              onStartMusic();
              onShowHeroText();
              handleEnded();
            }}
          >
            Skip animation
          </button>
          
          <img
            src="/__l5e/assets-v1/37c56f47-6e91-4646-8cd4-06cd5d299d87/envelope-oct-poster.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          <video
            ref={videoRef}
            src="/__l5e/assets-v1/a4928157-d40e-4b7f-8147-cdf0e6aa8f3c/envelope-oct.mp4"
            poster="/__l5e/assets-v1/37c56f47-6e91-4646-8cd4-06cd5d299d87/envelope-oct-poster.jpg"
            playsInline
            muted
            onEnded={handleEnded}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
