import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../data/wedding';

export const Gallery: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    if (selected !== null && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [selected]);

  const close = () => {
    if (dialogRef.current) dialogRef.current.close();
    setSelected(null);
    triggerRef.current?.focus();
  };

  return (
    <section id="galeri" className="personal-gallery">
      {/* Botanical accents */}
      <motion.img
        src="/assets/calla-stem.png"
        alt=""
        aria-hidden="true"
        className="botanical-accent botanical-gallery-corner"
        initial={!isReduced ? { opacity: 0, y: -30, x: 30, rotate: 12 } : { opacity: 0.85 }}
        whileInView={{ opacity: 0.85, y: 0, x: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.img
        src="/assets/calla-stem.png"
        alt=""
        aria-hidden="true"
        className="botanical-accent botanical-gallery-bottom-left"
        initial={!isReduced ? { opacity: 0, y: 40, x: -30, rotate: -12 } : { opacity: 0.85 }}
        whileInView={{ opacity: 0.85, y: 0, x: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="personal-gallery-inner">
        <p className="personal-eyebrow">Arfid & Arin</p>
        <h2 className="personal-heading">Moments in Frames</h2>

        <div className="personal-gallery-grid">
          {wedding.photos.map((p, i) => (
            <motion.button
              key={p.src}
              type="button"
              className={`personal-gallery-item personal-gallery-item-${i + 1}`}
              aria-label={`View photo ${i + 1}`}
              initial={!isReduced ? { opacity: 0, y: 24, scale: 0.97 } : { opacity: 1 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setSelected(i);
              }}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                style={p.pos ? { objectPosition: p.pos } : undefined}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="personal-lightbox"
        aria-label="Arfid and Arin Photo Gallery"
        onCancel={() => {
          setSelected(null);
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setSelected((v) => ((v ?? 0) + 1) % wedding.photos.length);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setSelected((v) => ((v ?? 0) + wedding.photos.length - 1) % wedding.photos.length);
          }
        }}
      >
        <button type="button" className="lightbox-close" onClick={close} aria-label="Close photo">
          ×
        </button>
        {selected !== null && (
          <img src={wedding.photos[selected].src} alt={wedding.photos[selected].alt} />
        )}
        <div className="lightbox-controls">
          <button
            type="button"
            onClick={() => setSelected((v) => ((v ?? 0) + wedding.photos.length - 1) % wedding.photos.length)}
            aria-label="Previous photo"
          >
            ←
          </button>
          <span>{`${(selected ?? 0) + 1} / ${wedding.photos.length}`}</span>
          <button
            type="button"
            onClick={() => setSelected((v) => ((v ?? 0) + 1) % wedding.photos.length)}
            aria-label="Next photo"
          >
            →
          </button>
        </div>
      </dialog>
    </section>
  );
};
