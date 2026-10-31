import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wedding } from '../data/wedding';
import { RsvpConfirmation } from './RsvpConfirmation';
import { LiveWishes } from './LiveWishes';

export const Rsvp: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes');
  const [hasGuest, setHasGuest] = useState<'yes' | 'no'>('no');
  const [childrenCount, setChildrenCount] = useState(0);
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [urlUid, setUrlUid] = useState('');
  const [urlGuest, setUrlGuest] = useState('');

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const guest = p.get('to') || p.get('guest') || p.get('u') || p.get('name') || '';
      const uid = p.get('uid') || '';
      if (guest) {
        setUrlGuest(guest);
        setFullName(guest);
      }
      if (uid) setUrlUid(uid);
    } catch {}

    const handleOpenRsvp = () => {
      setSubmitted(false);
      setOpened(true);
      setExpanded(true);
      setTimeout(() => {
        const el = document.getElementById('rsvp');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            const inp = el.querySelector("input[type='text'], input") as HTMLInputElement;
            if (inp) inp.focus();
          }, 750);
        }
      }, 50);
    };

    window.addEventListener('open-rsvp', handleOpenRsvp);
    if (window.location.hash === '#rsvp') handleOpenRsvp();
    return () => window.removeEventListener('open-rsvp', handleOpenRsvp);
  }, []);

  const totalGuests = 1 + (hasGuest === 'yes' ? 1 : 0);

  const handleOpenEnvelope = () => {
    if (!opened) {
      setOpened(true);
      setTimeout(() => setExpanded(true), 700);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    setIsPending(true);

    const entry = {
      full_name: fullName.trim(),
      attendance,
      guest_count: attendance === 'yes' ? totalGuests + childrenCount : 1,
      adult_count: attendance === 'yes' ? totalGuests : 1,
      children_count: attendance === 'yes' ? childrenCount : 0,
      message: message.trim() || undefined,
      uid: urlUid,
      saved_at: new Date().toISOString(),
    };

    // 1. Simpan lokal
    try {
      const existing = JSON.parse(localStorage.getItem('arfid-arin:rsvps:v1') || '[]');
      const updated = Array.isArray(existing) ? existing : [];
      updated.push(entry);
      localStorage.setItem('arfid-arin:rsvps:v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('rsvp-updated', { detail: entry }));
    } catch {}

    // 2. Sinkronkan ke Google Apps Script (Spreadsheet)
    const gasUrl = wedding.gasEndpoint || (typeof window !== 'undefined' ? (window as any).RSVP_GAS_URL : '');
    if (gasUrl && typeof gasUrl === 'string' && gasUrl.startsWith('http') && !gasUrl.includes('GANTI_DENGAN_ID_DEPLOYMENT')) {
      try {
        const payload = {
          name: fullName.trim(),
          rsvpStatus: attendance === 'yes' ? 'attending' : 'not_attending',
          pax: attendance === 'yes' ? totalGuests + childrenCount : 0,
          origin: '',
          rsvp_message: message.trim() || '',
          uid: urlUid,
        };

        await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      } catch (gasErr) {
        console.warn('Google Apps Script notice (data preserved locally):', gasErr);
      }
    }

    setIsPending(false);
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="relative z-10 -mt-[30px] pt-0 pb-20 md:pb-28 bg-foreground">
      <img
        src="/__l5e/assets-v1/f0524b40-95c5-4ff9-a7e2-e65fd22cdb46/rsvp-top-border.png"
        alt=""
        draggable={false}
        className="block w-full h-auto pointer-events-none select-none"
      />

      <div className="px-6 pt-10 md:pt-16">
        <div className="max-w-2xl mx-auto pt-[60px]">
          {submitted ? (
            <RsvpConfirmation attendance={attendance} onEdit={() => setSubmitted(false)} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-10 flex flex-col items-center">
                <h2 className="font-display text-5xl md:text-7xl text-background">RSVP</h2>
                <p className="text-background/80 text-[15px] font-sans leading-relaxed max-w-md mt-4">
                  Your presence will make our celebration truly complete. Please kindly confirm your
                  attendance for the Intimate Dinner of Arfid & Arin.
                </p>
                {urlGuest && (
                  <div className="rsvp-guest-tag mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-background/25 bg-background/10">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-background/70">
                      Kepada Yth:
                    </span>
                    <span className="font-display text-[16px] font-medium text-background">
                      {urlGuest}
                    </span>
                  </div>
                )}
              </div>

              {/* Envelope Button */}
              <button
                type="button"
                onClick={handleOpenEnvelope}
                aria-label="Open RSVP envelope"
                aria-expanded={expanded}
                disabled={opened}
                className="relative block mx-auto w-[260px] md:w-[340px] aspect-square mb-10 cursor-pointer disabled:cursor-default"
              >
                <img
                  src="/__l5e/assets-v1/92975728-5ff1-4e43-bd99-fd8116d4ab6d/rsvp-envelope-cerrado.png"
                  alt=""
                  draggable={false}
                  className={`absolute inset-0 w-full h-full object-contain object-bottom transition-all duration-700 ${
                    opened ? 'opacity-0 scale-95' : 'opacity-100 hover:scale-[1.03]'
                  }`}
                />
                <img
                  src="/__l5e/assets-v1/66d85f68-15cb-430b-91c5-0bb336c4c7ea/rsvp-envelope-abierto.png"
                  alt=""
                  draggable={false}
                  className={`absolute inset-0 w-full h-full object-contain object-bottom transition-opacity duration-700 ${
                    opened ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {!opened && (
                  <span className="absolute -bottom-7 left-0 right-0 text-center text-[10px] tracking-[0.32em] uppercase text-background/80">
                    Tap to open
                  </span>
                )}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-8 text-center"
                  >
                    {/* Honeypot */}
                    <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={websiteHoneypot}
                        onChange={(e) => setWebsiteHoneypot(e.target.value)}
                      />
                    </div>

                    {/* Nama Tamu */}
                    <div>
                      <label
                        htmlFor="rsvp-name"
                        className="text-background font-sans text-[11px] tracking-[0.25em] uppercase"
                      >
                        Your Name
                      </label>
                      <input
                        id="rsvp-name"
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-2 w-full max-w-md mx-auto block bg-transparent border-b border-background/30 text-background placeholder:text-background/40 focus:border-background/70 font-display text-center py-2 text-xl outline-none"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Tombol Konfirmasi Kehadiran ("Hadir" / "Tidak Hadir") */}
                    <div className="rsvp-attend-group">
                      <label className="text-background font-sans text-[11px] tracking-[0.25em] uppercase block mb-3 text-center">
                        Konfirmasi Kehadiran / Will You Attend?
                      </label>
                      <div
                        className="rsvp-attend-selector flex items-center justify-center gap-3 sm:gap-4"
                        role="radiogroup"
                        aria-label="Konfirmasi Kehadiran"
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={attendance === 'yes'}
                          onClick={() => setAttendance('yes')}
                          className={`rsvp-attend-btn ${attendance === 'yes' ? 'is-selected' : ''}`}
                        >
                          <span className="rsvp-attend-icon">
                            {attendance === 'yes' ? '✓' : '○'}
                          </span>
                          <span className="rsvp-attend-text">
                            <strong>Hadir</strong>
                            <small>Joyfully Accept</small>
                          </span>
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={attendance === 'no'}
                          onClick={() => setAttendance('no')}
                          className={`rsvp-attend-btn ${attendance === 'no' ? 'is-selected' : ''}`}
                        >
                          <span className="rsvp-attend-icon">
                            {attendance === 'no' ? '✕' : '○'}
                          </span>
                          <span className="rsvp-attend-text">
                            <strong>Tidak Hadir</strong>
                            <small>Regretfully Decline</small>
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Jika Hadir: Plus-One & Children */}
                    {attendance === 'yes' && (
                      <React.Fragment>
                        <div className="rsvp-plusone-group mt-6">
                          <label className="text-background font-sans text-[11px] tracking-[0.25em] uppercase block mb-3 text-center">
                            Membawa Tamu Tambahan? / Guest
                          </label>
                          <div className="rsvp-attend-selector flex items-center justify-center gap-3 sm:gap-4">
                            <button
                              type="button"
                              role="radio"
                              aria-checked={hasGuest === 'yes'}
                              onClick={() => setHasGuest('yes')}
                              className={`rsvp-attend-btn rsvp-attend-subbtn ${
                                hasGuest === 'yes' ? 'is-selected' : ''
                              }`}
                            >
                              <span className="rsvp-attend-icon">
                                {hasGuest === 'yes' ? '✓' : '○'}
                              </span>
                              <span className="rsvp-attend-text">
                                <strong>Bawa Pasangan / Tamu</strong>
                                <small>Yes, with a guest</small>
                              </span>
                            </button>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={hasGuest === 'no'}
                              onClick={() => setHasGuest('no')}
                              className={`rsvp-attend-btn rsvp-attend-subbtn ${
                                hasGuest === 'no' ? 'is-selected' : ''
                              }`}
                            >
                              <span className="rsvp-attend-icon">
                                {hasGuest === 'no' ? '✓' : '○'}
                              </span>
                              <span className="rsvp-attend-text">
                                <strong>Hadir Sendiri</strong>
                                <small>Attending alone</small>
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Children Counter (Max 1) */}
                        <div>
                          <label className="text-background font-sans text-[11px] tracking-[0.25em] uppercase">
                            Children
                          </label>
                          <div className="mt-2 flex items-center justify-center gap-5">
                            <button
                              type="button"
                              aria-label="Decrease child count"
                              onClick={() => setChildrenCount((c) => Math.max(0, c - 1))}
                              disabled={childrenCount === 0}
                              className="w-9 h-9 rounded-full border border-background/40 text-background font-display text-lg leading-none flex items-center justify-center hover:bg-background/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <span className="font-display text-[14px] text-background min-w-[110px] text-center select-none">
                              {childrenCount === 0 ? 'No children' : '1 child'}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase child count"
                              onClick={() => setChildrenCount((c) => Math.min(1, c + 1))}
                              disabled={childrenCount >= 1}
                              className="w-9 h-9 rounded-full border border-background/40 text-background font-display text-lg leading-none flex items-center justify-center hover:bg-background/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    )}

                    {/* Wishes */}
                    <div>
                      <label
                        htmlFor="rsvp-message"
                        className="text-background font-sans text-[11px] tracking-[0.25em] uppercase"
                      >
                        Wishes for the Couple
                      </label>
                      <textarea
                        id="rsvp-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-2 w-full max-w-md mx-auto block bg-transparent border border-background/25 rounded-lg text-background placeholder:text-background/40 focus:border-background/60 min-h-[110px] font-display text-center p-3 outline-none"
                        placeholder="Share your warm wishes and blessings for us"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="group inline-flex flex-col items-center text-background disabled:opacity-60 cursor-pointer"
                      >
                        <span className="border border-background/40 p-[3px] transition-colors group-hover:border-background/70">
                          <span className="block border border-background/20 px-10 py-3 text-[10px] tracking-[0.32em] uppercase transition-colors group-hover:bg-background group-hover:text-foreground font-medium">
                            {isPending ? 'Sending…' : 'Send RSVP'}
                          </span>
                        </span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Live Wishes Section */}
          <LiveWishes />
        </div>
      </div>
    </section>
  );
};
