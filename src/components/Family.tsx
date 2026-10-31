import React from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../data/wedding';

export const Family: React.FC = () => {
  const isReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const renderParents = (text: string) => {
    const [father, mother] = text.split(' & Mrs. ');
    return (
      <p className="personal-parents">
        <span className="personal-parent-line">{father}</span>
        <span className="personal-parent-line">& Mrs. {mother}</span>
      </p>
    );
  };

  return (
    <section id="mempelai" className="personal-family">
      <motion.div
        className="personal-family-curtain"
        aria-hidden="true"
        initial={!isReduced ? { scale: 1.05, opacity: 0.88 } : { opacity: 1 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="personal-family-inner">
        <motion.div
          className="personal-family-header"
          initial={!isReduced ? { opacity: 0, y: -16, filter: 'blur(5px)' } : { opacity: 1 }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="personal-eyebrow">With joyful hearts</p>
          <h2 className="personal-heading">The Couple</h2>
          <p className="personal-intro">
            Together with our families, we joyfully invite you to celebrate our wedding.
          </p>
        </motion.div>

        <div className="personal-couple">
          {/* Sisi Kiri: Mempelai Wanita (Arin) */}
          <motion.div
            className="personal-person personal-person-left"
            initial={!isReduced ? { opacity: 0, x: -30, y: 10, filter: 'blur(6px)' } : { opacity: 1 }}
            whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.05, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              className="personal-nickname"
              initial={!isReduced ? { opacity: 0, x: -18, scale: 0.94 } : { opacity: 1 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.95, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {wedding.bride.nickname}
            </motion.p>
            <motion.span
              className="personal-person-divider"
              aria-hidden="true"
              initial={!isReduced ? { scaleX: 0, opacity: 0 } : { opacity: 0.7 }}
              whileInView={{ scaleX: 1, opacity: 0.7 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            />
            <h3>{wedding.bride.name}</h3>
            {renderParents(wedding.bride.parents)}
          </motion.div>

          {/* Sisi Kanan: Mempelai Pria (Arfid) */}
          <motion.div
            className="personal-person personal-person-right"
            initial={!isReduced ? { opacity: 0, x: 30, y: 10, filter: 'blur(6px)' } : { opacity: 1 }}
            whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.05, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              className="personal-nickname"
              initial={!isReduced ? { opacity: 0, x: 18, scale: 0.94 } : { opacity: 1 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.95, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            >
              {wedding.groom.nickname}
            </motion.p>
            <motion.span
              className="personal-person-divider"
              aria-hidden="true"
              initial={!isReduced ? { scaleX: 0, opacity: 0 } : { opacity: 0.7 }}
              whileInView={{ scaleX: 1, opacity: 0.7 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
            />
            <h3>{wedding.groom.name}</h3>
            {renderParents(wedding.groom.parents)}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
