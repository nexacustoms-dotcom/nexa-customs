// Analytics + Google Ads are OFF until the visitor accepts. Nothing from Google loads before that.
const KEY = 'nxt_consent';
const GA_ID = 'G-LFLXPRJTF9';
const ADS_ID = 'AW-166288554686';
let loaded = false;

export function getConsent() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

function clearAnalyticsCookies() {
  try {
    const host = location.hostname;
    const domains = [host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').map(c => c.split('=')[0].trim())
      .filter(n => /^(_ga|_gid|_gat|_gcl_|_gac_|__gads|__gpi|FPID)/.test(n))
      .forEach(n => domains.forEach(d => { document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`; }));
  } catch {}
}

export function loadAnalytics() {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  window[`ga-disable-${GA_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.gtag('config', GA_ID);
  window.gtag('config', ADS_ID);
}

export function setConsent(analytics) {
  try { localStorage.setItem(KEY, JSON.stringify({ analytics: !!analytics, ts: Date.now() })); } catch {}
  if (analytics) { loadAnalytics(); return; }
  // Withdrawn / rejected: stop tracking now and remove the cookies
  window[`ga-disable-${GA_ID}`] = true;
  window.gtag = undefined;
  clearAnalyticsCookies();
}

export function initConsent() {
  const c = getConsent();
  if (c?.analytics) loadAnalytics();
}
