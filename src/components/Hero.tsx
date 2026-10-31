import React, { useEffect, useState } from 'react';
import { wedding } from '../data/wedding';

interface HeroProps {
  showText: boolean;
}

export const Hero: React.FC<HeroProps> = ({ showText }) => {
  const [urlGuest, setUrlGuest] = useState('');

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const name = p.get('to') || p.get('guest') || p.get('u') || p.get('name') || '';
      setUrlGuest(name);
    } catch {}
  }, []);

  const scrollToRsvp = () => {
    window.dispatchEvent(new CustomEvent('open-rsvp'));
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-background">
      <div className="absolute inset-0 bg-background" />
      <img
        src="/__l5e/assets-v1/e4c841be-b806-4cde-b447-86c587fc090b/hero-frame.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        draggable={false}
      />
      <div
        className={`relative z-20 flex flex-col items-center justify-center flex-1 text-center px-6 transition-opacity duration-[2000ms] ease-out ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="font-display text-foreground text-[17px] md:text-[19px] tracking-wide leading-snug">
          <span className="block">With Joyful</span>
          <span className="block">Hearts</span>
        </p>

        {urlGuest && (
          <div className="hero-guest-box my-3 px-5 py-2 rounded-full border border-foreground/25 bg-foreground/5 inline-flex flex-col items-center">
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-foreground/70">
              Dear Special Guest:
            </span>
            <span className="font-display text-[18px] md:text-[20px] font-semibold text-foreground mt-0.5">
              {urlGuest}
            </span>
          </div>
        )}

        <div className="mt-8 md:mt-10 flex flex-col items-center">
          <h1 className="font-ballet text-foreground text-[50px] md:text-[64px] leading-[0.95]">
            {wedding.groom.nickname}
          </h1>
          <p className="font-display text-foreground text-lg md:text-xl leading-none my-2.5 md:my-3.5">
            &
          </p>
          <h1 className="font-ballet text-foreground text-[50px] md:text-[64px] leading-[0.95]">
            {wedding.bride.nickname}
          </h1>
        </div>

        <p className="font-display text-foreground text-lg md:text-xl mt-6 md:mt-8 tracking-wide">
          05.12.2026
        </p>

        <div className="mt-5 md:mt-6 flex flex-col items-center">
          <p className="font-display text-foreground text-xl md:text-2xl tracking-wide leading-snug">
            Intimate Dinner
          </p>
          <p className="font-display text-foreground text-[11px] md:text-xs uppercase tracking-[0.25em] mt-1">
            Senggigi, Lombok
          </p>
        </div>

        <div className="mt-6 md:mt-8">
          <button
            type="button"
            onClick={scrollToRsvp}
            className="hero-rsvp-btn pearl-button cursor-pointer transition-all duration-300 active:scale-95"
          >
            <span className="text-[10.5px] md:text-[11.5px] tracking-[0.24em] uppercase font-medium">
              Go to RSVP
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
