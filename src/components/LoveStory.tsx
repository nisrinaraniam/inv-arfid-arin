import React from 'react';
import { motion } from 'framer-motion';
import { loveStory } from '../data/wedding';

export const LoveStory: React.FC = () => {
  const isReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  return (
    <section id="love-story" className="personal-story">
      <div className="personal-story-curtain" aria-hidden="true" />
      
      <div className="personal-story-bouquet-top">
        <motion.img
          src="/assets/calla-bouquet.png"
          alt="Bouquet of Calla Lilies"
          className="personal-story-bouquet"
          initial={!isReduced ? { opacity: 0, scale: 0.85, y: -12 } : { opacity: 1 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="personal-story-header">
        <p className="personal-eyebrow">Our Journey</p>
        <h2 className="personal-heading">Love Story</h2>
        <p className="personal-intro">
          Every step and distance has brought us toward the same destination.
        </p>
      </div>

      <div className="personal-story-timeline">
        {loveStory.map((item, idx) => (
          <motion.div
            key={item.date}
            className="personal-story-item"
            initial={!isReduced ? { opacity: 0, y: 20, x: idx % 2 === 0 ? -10 : 10 } : { opacity: 1 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.06 * idx, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="personal-story-node" aria-hidden="true" />
            <div className="personal-story-content">
              <div className="personal-story-date-badge">{item.date}</div>
              <h3 className="personal-story-title">{item.title}</h3>
              <p className="personal-story-text">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
