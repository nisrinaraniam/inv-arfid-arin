import React from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../data/wedding';

export const ThankYou: React.FC = () => {
  return (
    <footer className="personal-thankyou relative text-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/assets/monogram-aa.png"
          alt="Monogram A & A"
          draggable={false}
          className="w-28 md:w-36 h-auto mx-auto mb-8 -mt-3 pointer-events-none select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
        />
        <p className="font-display text-xl md:text-3xl text-foreground/80 mb-10 leading-relaxed">
          Your presence is our greatest joy.
        </p>
        <p className="text-[13px] text-foreground/60 font-helvetica mb-3">With love,</p>
        <p className="font-doulaise text-6xl md:text-7xl text-foreground mb-4 leading-tight">
          {wedding.groom.nickname}{' '}
          <span className="text-3xl md:text-4xl text-foreground/50">&</span>{' '}
          {wedding.bride.nickname}
        </p>
        <p className="text-[13px] text-foreground/50 font-helvetica tracking-wide">
          5 December 2026
        </p>
        <p className="text-sm text-foreground/40 mt-16 font-helvetica">
          custom invitation by{' '}
          <a
            href="https://riungin.id"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            riungin.id
          </a>
        </p>
      </motion.div>
    </footer>
  );
};
