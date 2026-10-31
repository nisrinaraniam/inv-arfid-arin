import React, { useEffect, useRef, useState } from 'react';

export const QuoteVideo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [desktop, setDesktop] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false));
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const format = desktop ? 'desktop' : 'mobile';

  useEffect(() => {
    const size = window.matchMedia('(min-width: 768px)');
    const onSize = () => {
      setDesktop(size.matches);
      setReady(false);
    };
    const onVisibility = () => setPageVisible(!document.hidden);
    size.addEventListener('change', onSize);
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      size.removeEventListener('change', onSize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;

    if (visible && pageVisible && !pausedByUser) {
      player.muted = true;
      player.play().catch(() => setPlaying(false));
    } else {
      player.pause();
    }
  }, [visible, pageVisible, pausedByUser, format]);

  const toggle = () => {
    setPausedByUser((v) => !v);
  };

  return (
    <section id="quote" ref={sectionRef} className="quote-film" aria-label="A quote about love">
      <img
        className="quote-film-poster"
        src={`/assets/quote/poster-${format}.jpg`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <video
        key={format}
        ref={videoRef}
        className={`quote-film-video${ready ? ' is-ready' : ''}`}
        src={`/assets/quote/arfid-arin-${format}.mp4`}
        poster={`/assets/quote/poster-${format}.jpg`}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="quote-film-shade" aria-hidden="true" />

      <blockquote className="quote-film-copy">
        <p>
          "Meeting you was the best thing that ever happened to me, and loving you is the best decision I've ever made."
        </p>
      </blockquote>

      <button
        type="button"
        className="quote-film-toggle"
        onClick={toggle}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
        aria-pressed={playing}
      >
        <svg width={16} height={16} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          {playing ? (
            <React.Fragment>
              <rect x={5} y={4} width={3} height={12} rx={0.7} />
              <rect x={12} y={4} width={3} height={12} rx={0.7} />
            </React.Fragment>
          ) : (
            <path d="M6 3.5 16 10 6 16.5Z" />
          )}
        </svg>
      </button>
    </section>
  );
};
