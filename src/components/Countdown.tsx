import React, { useEffect, useState } from 'react';
import { wedding } from '../data/wedding';

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(wedding.start).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const openGoogleCalendar = () => {
    const title = `Intimate Dinner ${wedding.groom.nickname} & ${wedding.bride.nickname}`;
    const desc = `Intimate Dinner of Arfid & Arin, Saturday, 5 December 2026 at 7:00 PM WITA.`;
    const loc = wedding.address;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=20261205T190000/20261205T230000&ctz=Asia/Makassar&location=${encodeURIComponent(
      loc
    )}&details=${encodeURIComponent(desc)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="countdown" className="relative py-16 px-6 text-center overflow-hidden">
      <div className="max-w-xl mx-auto relative z-10">
        <p className="personal-eyebrow">Counting Down</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8">
          To The Celebration
        </h2>

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-10">
          <div className="p-3 rounded-lg border border-foreground/20 bg-foreground/5 flex flex-col items-center">
            <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-foreground/70 mt-1">
              Days
            </span>
          </div>
          <div className="p-3 rounded-lg border border-foreground/20 bg-foreground/5 flex flex-col items-center">
            <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-foreground/70 mt-1">
              Hours
            </span>
          </div>
          <div className="p-3 rounded-lg border border-foreground/20 bg-foreground/5 flex flex-col items-center">
            <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-foreground/70 mt-1">
              Mins
            </span>
          </div>
          <div className="p-3 rounded-lg border border-foreground/20 bg-foreground/5 flex flex-col items-center">
            <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-foreground/70 mt-1">
              Secs
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={openGoogleCalendar}
          className="pearl-button cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
            Add to Google Calendar
          </span>
        </button>
      </div>
    </section>
  );
};
