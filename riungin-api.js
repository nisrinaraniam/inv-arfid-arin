export const API_BASE = 'https://api.riungin.id';
export const EVENT_SLUG = 'arfid-arin-intimate-dinner';
const EVENT_URL = `${API_BASE}/api/events/${EVENT_SLUG}`;

export class InvitationApiError extends Error {
  constructor(message, status = 0, code = '') {
    super(message);
    this.name = 'InvitationApiError';
    this.status = status;
    this.code = code;
  }
}

export function getGuestUid(location = (typeof window !== 'undefined' ? window.location : { search: '', pathname: '' })) {
  const query = new URLSearchParams(location.search).get('uid');
  if (query?.trim()) return query.trim();
  const parts = (location.pathname || '').split('/').filter(Boolean);
  if (parts.length !== 1 || /\./.test(parts[0])) return '';
  try { return decodeURIComponent(parts[0]); } catch { return ''; }
}

export function getOrCreateDeviceId(storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
  try {
    let deviceId = storage ? storage.getItem('bw_device_id') : null;
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      if (storage) storage.setItem('bw_device_id', deviceId);
    }
    return deviceId;
  } catch {
    throw new InvitationApiError('Please allow browser storage to open your private invitation.', 0, 'STORAGE_UNAVAILABLE');
  }
}

export function isAccessDenied(error) {
  return error?.status === 403 || error?.status === 404 || error?.code === 'DEVICE_LOCKED';
}

async function request(path, options = {}) {
  const { signal, ...init } = options;
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(EVENT_URL + path, { ...init, cache: 'no-store', signal: controller.signal });
    const raw = await response.text();
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch {
      if (response.ok) throw new InvitationApiError('The service returned an invalid response. Please try again.', response.status, 'INVALID_RESPONSE');
    }
    if (!response.ok || data?.error) {
      throw new InvitationApiError(
        data?.error || 'Your request could not be completed. Please try again.',
        response.status,
        data?.code || (data?.locked ? 'DEVICE_LOCKED' : '')
      );
    }
    return data;
  } catch (error) {
    if (error instanceof InvitationApiError) throw error;
    if (signal?.aborted) throw error;
    throw new InvitationApiError('We could not reach the invitation service. Please check your connection and try again.', 0, 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

export async function loadGuest(uid, deviceId, signal) {
  if (!uid) throw new InvitationApiError('Silakan gunakan tautan undangan personal Anda.', 404, 'MISSING_UID');
  const guest = await request(`/rsvp/${encodeURIComponent(uid)}?deviceId=${encodeURIComponent(deviceId)}`, {
    signal,
    headers: { 'x-device-id': deviceId }
  });
  if (!guest || typeof guest.name !== 'string' || !guest.name.trim() || guest.uid !== uid || !['pending', 'attending', 'not_attending'].includes(guest.rsvpStatus)) {
    throw new InvitationApiError('We could not verify this invitation. Please try again.', 0, 'INVALID_RESPONSE');
  }
  return guest;
}

export function getRsvpPrefill(guest) {
  if (!guest || guest.rsvpStatus === 'pending') return null;
  const pax = Math.max(1, Math.min(3, Number(guest.pax) || 1));
  return {
    attendance: guest.rsvpStatus === 'attending' ? 'yes' : 'no',
    plusOne: pax >= 2 ? 'yes' : 'no',
    children: pax >= 3 ? 1 : 0,
    message: guest.rsvpMessage || ''
  };
}

export async function sendRsvp(guest, deviceId, values) {
  if (!guest?.uid || !deviceId) throw new InvitationApiError('Please reopen your personal invitation link.', 404);
  if (values.website) throw new InvitationApiError('We could not submit your response. Please try again.');
  const attending = values.attendance === 'yes';
  const pax = attending ? Math.max(1, Math.min(3, Number(values.guest_count) || 1)) : 1;
  const body = {
    uid: guest.uid,
    name: guest.name,
    deviceId: deviceId,
    rsvpStatus: attending ? 'attending' : 'not_attending',
    pax: pax,
    rsvp_message: String(values.message || '').trim()
  };
  await request('/rsvp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': deviceId
    },
    body: JSON.stringify(body)
  });
  return {
    ...guest,
    rsvpStatus: body.rsvpStatus,
    pax: body.pax,
    rsvpMessage: body.rsvp_message
  };
}

export async function loadWishes(signal) {
  const rows = await request('/wishes', { signal });
  if (!Array.isArray(rows)) throw new InvitationApiError('Wishes are temporarily unavailable. Please try again.');
  return rows.filter(row => row && typeof row.name === 'string' && typeof row.rsvp_message === 'string' && row.rsvp_message.trim())
    .map(row => ({
      full_name: row.name,
      message: row.rsvp_message,
      attendance: row.rsvpStatus === 'attending' ? 'yes' : row.rsvpStatus === 'not_attending' ? 'no' : null,
      saved_at: row.createdAt || ''
    }))
    .sort((a, b) => (Date.parse(b.saved_at) || 0) - (Date.parse(a.saved_at) || 0));
}

export function createRiunginIntegration(React) {
  const h = React.createElement;
  const GuestContext = React.createContext(null);

  function PrivateInvitation({ children }) {
    const [attempt, setAttempt] = React.useState(0);
    const [state, setState] = React.useState({ status: 'loading' });

    React.useEffect(() => {
      const controller = new AbortController();
      let active = true;
      setState({ status: 'loading' });
      (async () => {
        const uid = getGuestUid();
        if (!uid) throw new InvitationApiError('Silakan gunakan tautan undangan personal Anda.', 404, 'MISSING_UID');
        const deviceId = getOrCreateDeviceId();
        const guest = await loadGuest(uid, deviceId, controller.signal);
        if (active) setState({ status: 'ready', guest, deviceId });
      })().catch(error => {
        if (active) setState({ status: 'error', error });
      });
      return () => { active = false; controller.abort(); };
    }, [attempt]);

    const denyAccess = React.useCallback(error => setState({ status: 'error', error }), []);
    const updateGuest = React.useCallback(guest => setState(current => ({ ...current, guest })), []);

    if (state.status === 'ready') {
      return h(GuestContext.Provider, {
        value: {
          guest: state.guest,
          deviceId: state.deviceId,
          denyAccess,
          updateGuest
        }
      }, children);
    }

    const error = state.error;
    const locked = error?.code === 'DEVICE_LOCKED';
    const missing = error?.code === 'MISSING_UID';
    const notFound = error?.status === 404;
    const denied = isAccessDenied(error);
    const loading = state.status === 'loading';

    const title = loading
      ? 'Opening Your Invitation'
      : locked
        ? 'This Invitation is Already in Use'
        : missing
          ? 'A Personal Invitation Awaits'
          : notFound
            ? 'Invitation Not Found'
            : denied
              ? 'This Invitation is Private'
              : 'Unable to Open Invitation';

    const message = loading
      ? 'Mohon tunggu sebentar, kami sedang memverifikasi tautan undangan personal Anda.'
      : locked
        ? 'Undangan ini bersifat privat dan sudah dibuka di perangkat lain. Silakan buka kembali melalui browser/perangkat pertama Anda atau hubungi pihak pengantin.'
        : missing
          ? 'Silakan gunakan tautan undangan personal yang telah dibagikan oleh pihak pengantin.'
          : notFound
            ? 'Data tamu tidak ditemukan. Mohon periksa kembali tautan Anda atau hubungi pihak pengantin.'
            : denied
              ? 'Silakan hubungi pihak pengantin untuk informasi akses undangan.'
              : error?.message || 'Terjadi kendala koneksi. Silakan periksa koneksi internet Anda dan coba lagi.';

    return h('main', { className: 'private-invitation', 'aria-busy': loading },
      h('div', { className: 'private-invitation-content', role: loading ? 'status' : 'alert' },
        h('p', { className: 'personal-eyebrow' }, 'Arfid & Arin'),
        h('h1', null, title),
        h('p', null, message),
        !loading && !denied && h('button', {
          type: 'button',
          className: 'pearl-button',
          onClick: () => setAttempt(value => value + 1)
        }, h('span', null, 'Coba Lagi'))
      ),
      h('footer', null, 'Developed by ', h('a', {
        href: 'https://riungin.id',
        target: '_blank',
        rel: 'noopener noreferrer'
      }, 'riungin.id'))
    );
  }

  function useGuest() {
    const value = React.useContext(GuestContext);
    if (!value) throw new Error('The invitation must be verified before showing guest content.');
    return value;
  }

  return { PrivateInvitation, useGuest };
}
