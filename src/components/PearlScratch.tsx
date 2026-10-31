import React from 'react';
import { motion } from 'framer-motion';

export const PearlScratch: React.FC = () => {
  return (
    <section className="scratch-section relative px-6 py-12 text-center overflow-hidden">
      <div className="max-w-md mx-auto relative flex flex-col items-center">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-background/40 shadow-xl mb-4">
          <img
            src="/assets/couple/couple-hill-run.jpg"
            alt="Arfid and Arin on the hill"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-display text-lg text-foreground/80 italic">
          Two souls, one beautiful journey.
        </p>
      </div>
    </section>
  );
};
