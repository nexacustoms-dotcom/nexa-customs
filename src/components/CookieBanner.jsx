import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getConsent, setConsent } from '../lib/consent';

// Shown once, until the visitor chooses. Re-open any time from the footer ("Cookie settings").
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Never show to search-engine pre-rendering or in the admin area
    if (typeof navigator !== 'undefined' && navigator.webdriver) return;
    if (getConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener('nxt-open-consent', reopen);
    return () => window.removeEventListener('nxt-open-consent', reopen);
  }, []);

  if (!open || location.pathname.startsWith('/admin')) return null;
  const choose = analytics => { setConsent(analytics); setOpen(false); };
  const btn = { padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <div role="dialog" aria-label="Cookie choices" style={{
      position: 'fixed', left: 12, right: 12, bottom: 12, zIndex: 9999, maxWidth: 760, margin: '0 auto',
      background: '#17171b', color: '#f4f4f5', border: '1px solid #2c2c33', borderRadius: 12, padding: '16px 18px',
      boxShadow: '0 12px 40px rgba(0,0,0,.45)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
    }}>
      <div style={{ flex: '1 1 300px', fontSize: 13, lineHeight: 1.6, color: '#d4d4d8' }}>
        We use cookies from Google to measure how the site is used and how our ads perform, but only if you agree.
        The site works the same either way. See our{' '}
        <a href="/privacy" onClick={e => { e.preventDefault(); setOpen(false); navigate('/privacy'); }} style={{ color: '#f97316' }}>Privacy Policy</a>.
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => choose(false)} style={{ ...btn, background: 'transparent', color: '#f4f4f5', border: '1px solid #52525b' }}>Reject</button>
        <button onClick={() => choose(true)} style={{ ...btn, background: '#f97316', color: '#000', border: '1px solid #f97316' }}>Accept</button>
      </div>
    </div>
  );
}
