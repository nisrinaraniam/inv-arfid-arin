import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../data/wedding';

export interface WishItem {
  full_name: string;
  message: string;
  attendance: 'yes' | 'no';
  saved_at?: string;
}

export const LiveWishes: React.FC = () => {
  const readLocalWishes = (): WishItem[] => {
    try {
      const raw = JSON.parse(localStorage.getItem('arfid-arin:rsvps:v1') || '[]');
      if (!Array.isArray(raw)) return [];
      return raw
        .filter((item) => item && item.full_name && String(item.full_name).trim())
        .slice()
        .reverse();
    } catch {
      return [];
    }
  };

  const [wishes, setWishes] = useState<WishItem[]>(readLocalWishes);
  const [loading, setLoading] = useState(false);

  const fetchRemote = async () => {
    const gasUrl = wedding.gasEndpoint || (typeof window !== 'undefined' ? (window as any).RSVP_GAS_URL : '');
    if (!gasUrl || typeof gasUrl !== 'string' || !gasUrl.startsWith('http') || gasUrl.includes('GANTI_DENGAN_ID_DEPLOYMENT')) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(gasUrl, { method: 'GET' });
      if (!res.ok) return;
      const remote = await res.json();
      if (Array.isArray(remote) && remote.length > 0) {
        const mapped: WishItem[] = remote
          .map((r: any) => ({
            full_name: r.name || r.full_name,
            message: r.rsvp_message || r.message || '',
            attendance: r.rsvpStatus === 'attending' || r.attendance === 'yes' ? 'yes' : 'no',
            saved_at: r.createdAt || r.created_at || r.saved_at || new Date().toISOString(),
          }))
          .filter((r) => r.full_name);

        setWishes(mapped);
        try {
          localStorage.setItem('arfid-arin:rsvps:v1', JSON.stringify(mapped.slice().reverse()));
        } catch {}
      }
    } catch (err) {
      console.warn('Could not fetch wishes from Google Spreadsheet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemote();
    const sync = () => {
      setWishes(readLocalWishes());
      fetchRemote();
    };
    window.addEventListener('rsvp-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rsvp-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const formatTime = (iso?: string) => {
    if (!iso) return 'Recently';
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) return 'Recently';
    const diff = Math.floor((Date.now() - dt.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (name?: string) => {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'G';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div id="live-wishes" className="live-wishes-wrap">
      <span className="live-wishes-divider-icon" aria-hidden="true">
        ✦
      </span>
      <p className="live-wishes-eyebrow">Prayers & Blessings</p>
      <h3 className="live-wishes-title">Live Wishes</h3>
      <p className="live-wishes-subtitle">
        Warm words and heartfelt prayers from our beloved family and friends.
      </p>

      <div className="live-wishes-count">
        <span aria-hidden="true">✦</span>
        <span>{`${wishes.length} ${wishes.length === 1 ? 'Wish Shared' : 'Wishes Shared'}`}</span>
        {loading && <span className="ml-1 opacity-70 animate-pulse text-[9px]">(syncing…)</span>}
      </div>

      {wishes.length === 0 ? (
        <div className="live-wishes-empty">
          <p className="live-wishes-empty-text">
            Be the first to share your warm wishes and blessings for Arfid & Arin through the RSVP
            form above.
          </p>
        </div>
      ) : (
        <div className="live-wishes-list">
          {wishes.map((item, idx) => {
            const msg =
              item.message && String(item.message).trim()
                ? String(item.message).trim()
                : item.attendance === 'no'
                ? 'Sending warm prayers and heartfelt wishes for a lifetime of love and happiness.'
                : 'We are delighted to celebrate this special moment with Arfid & Arin.';
            const key = (item.saved_at || '') + '-' + idx;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.06, 0.3) }}
                className="live-wish-card"
              >
                <div className="live-wish-header">
                  <div className="live-wish-author">
                    <div className="live-wish-avatar" aria-hidden="true">
                      {getInitials(item.full_name)}
                    </div>
                    <div className="live-wish-meta">
                      <h4 className="live-wish-name">{item.full_name}</h4>
                      <span className="live-wish-time">{formatTime(item.saved_at)}</span>
                    </div>
                  </div>
                  <span
                    className={`live-wish-badge ${
                      item.attendance === 'no' ? 'is-decline' : 'is-attend'
                    }`}
                  >
                    {item.attendance === 'no' ? 'Warm Regards' : 'Will Attend'}
                  </span>
                </div>
                <p className="live-wish-message">“{msg}”</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
