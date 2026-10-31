import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { wedding } from '../data/wedding';

interface RsvpConfirmationProps {
  attendance: string;
  onEdit?: () => void;
}

export const RsvpConfirmation: React.FC<RsvpConfirmationProps> = ({ attendance, onEdit }) => {
  const openCalendar = () => {
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

  const openMap = () => {
    window.open(wedding.map, '_blank', 'noopener,noreferrer');
  };

  return attendance === 'no' ? (
    <motion.div
      id="rsvp-confirmation"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="rsvp-confirmation-card text-center"
    >
      <h2 className="rsvp-confirm-heading">Thank You</h2>
      <p className="rsvp-confirm-text">
        Thank you for letting us know. Your prayers and warm wishes mean the world to us.
      </p>
      <p className="rsvp-confirm-signature">
        — {wedding.groom.nickname} & {wedding.bride.nickname}
      </p>
      {onEdit && (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={onEdit} className="rsvp-change-link">
            If your plans change, please kindly let us know.
          </button>
        </div>
      )}
    </motion.div>
  ) : (
    <motion.div
      id="rsvp-confirmation"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="rsvp-confirmation-card text-center"
    >
      <h2 className="rsvp-confirm-heading">Thank you for your confirmation.</h2>
      <div className="rsvp-confirm-body">
        <p className="rsvp-confirm-text">
          We are delighted that you will celebrate this special moment with us.
        </p>
        <p className="rsvp-confirm-text">Thank you for being part of our story.</p>
        <p className="rsvp-confirm-label">We look forward to seeing you on:</p>
        <p className="rsvp-confirm-date">Saturday, December 5, 2026 · 19.00 WITA</p>
      </div>
      <p className="rsvp-confirm-signature">
        — {wedding.groom.nickname} & {wedding.bride.nickname}
      </p>
      <div className="rsvp-confirm-actions">
        <button
          type="button"
          onClick={openCalendar}
          className="rsvp-confirm-btn inline-flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </button>
        <button
          type="button"
          onClick={openMap}
          className="rsvp-confirm-btn inline-flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          View Venue
        </button>
      </div>
      <div className="flex justify-center mt-5">
        <button type="button" onClick={onEdit} className="rsvp-change-link">
          If your plans change, please kindly let us know.
        </button>
      </div>
    </motion.div>
  );
};
