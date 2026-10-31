import React, { useEffect, useRef, useState } from 'react';
import { Opener } from '../components/Opener';
import { Hero } from '../components/Hero';
import { QuoteVideo } from '../components/QuoteVideo';
import { Family } from '../components/Family';
import { PearlScratch } from '../components/PearlScratch';
import { LoveStory } from '../components/LoveStory';
import { Countdown } from '../components/Countdown';
import { IntimateDinner } from '../components/IntimateDinner';
import { Gallery } from '../components/Gallery';
import { DressCode } from '../components/DressCode';
import { WeddingGift } from '../components/WeddingGift';
import { Rsvp } from '../components/Rsvp';
import { ThankYou } from '../components/ThankYou';
import { MusicPlayer } from '../components/MusicPlayer';

export const InvitationPage: React.FC = () => {
  const isReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const [showOpener, setShowOpener] = useState(!isReduced);
  const [showHeroText, setShowHeroText] = useState(isReduced);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/__l5e/assets-v1/2fca3877-3b8f-4d30-80c3-ee4bab23b409/until-were-gone-opt.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      });
    } else {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <React.Fragment>
      {showOpener && (
        <Opener
          onEnter={() => setShowOpener(false)}
          onStartMusic={startMusic}
          onShowHeroText={() => setShowHeroText(true)}
        />
      )}

      <main className="bg-background text-foreground overflow-x-clip">
        <Hero showText={showHeroText} />
        <QuoteVideo />
        <Family />
        <PearlScratch />
        <LoveStory />
        <Countdown />
        <IntimateDinner />
        <Gallery />
        <DressCode />
        <WeddingGift />
        <Rsvp />
        <ThankYou />
      </main>

      {isPlaying && (
        <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} isMuted={isMuted} />
      )}
    </React.Fragment>
  );
};
