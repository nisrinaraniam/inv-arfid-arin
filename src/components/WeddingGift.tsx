import React, { useState } from 'react';
import { wedding } from '../data/wedding';

export const WeddingGift: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(wedding.bank.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="wedding-gift" className="relative py-16 px-6 text-center overflow-hidden">
      <div className="personal-gift-card">
        <img
          src="/assets/hotel-pearl-frame-DwCN7mtx.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
        />
        <div className="personal-gift-content">
          <p className="personal-eyebrow">Wedding Gift</p>
          <h2 className="personal-gift-title">Wedding Gift</h2>
          <p className="personal-gift-quote">
            Your presence and prayers are the greatest gifts of all.
          </p>
          <p className="personal-gift-desc">
            However, if you wish to honor us with a gift, a wedding registry has been set up below.
          </p>

          <div className="personal-gift-bank-box">
            <p className="personal-gift-bank-name">{wedding.bank.bankName}</p>
            <p className="personal-gift-bank-num">{wedding.bank.accountNumber}</p>
            <p className="personal-gift-bank-holder">a/n {wedding.bank.accountHolder}</p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="pearl-button cursor-pointer transition-all duration-300 active:scale-95"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
              {copied ? 'Nomor Rekening Tersalin ✓' : 'Salin No. Rekening'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
