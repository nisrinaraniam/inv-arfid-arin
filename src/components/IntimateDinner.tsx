import React from 'react';
import { wedding } from '../data/wedding';

export const IntimateDinner: React.FC = () => {
  return (
    <section id="acara" className="personal-dinner">
      <div className="personal-curtain" aria-hidden="true" />
      <div className="personal-dinner-content">
        <p className="personal-eyebrow">Celebrate with us</p>
        <h2 className="personal-dinner-title">
          Intimate<br />Dinner
        </h2>
        <div className="personal-event-date">
          <span>Saturday</span>
          <strong>05</strong>
          <span>December 2026</span>
        </div>
        <div className="personal-rule" />
        <p className="personal-time">
          19.00 <small>WITA</small>
        </p>
        <p className="personal-venue-short">Grand Ballroom</p>
        <p className="personal-venue-name">
          Hotel Aruna Senggigi<br />Resort & Convention
        </p>
        <p className="personal-address">{wedding.address}</p>
        <a
          className="pearl-button"
          href={wedding.map}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Open in Google Maps</span>
        </a>
        <img
          className="personal-resort-illustration"
          src="/assets/aruna-resort-watercolor.png"
          alt="Watercolor illustration of the pool at Aruna Senggigi Resort"
          width={1586}
          height={992}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
};
