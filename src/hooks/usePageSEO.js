import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DOMAIN = 'https://nexacustoms.ca';
const BASE   = 'Nexa Customs — GTA Print Shop · Mississauga';

const TITLES = {
  '/':               'Nexa Customs — Print Shop · Signs · Vehicle Wraps · GTA & Canada',
  '/products':       'All Print Products — Nexa Customs · GTA Print Shop',
  '/quote':          'Get a Free Print Quote — Nexa Customs GTA',
  '/contact':        'Contact Nexa Customs — (437) 997-9921 · Mississauga GTA',
  '/about':          'About Nexa Customs Inc. — GTA Print Shop Since 2010',
  '/faq':            'FAQ — Nexa Customs Print Shop GTA',
  '/shipping':       'Shipping Policy — Canada-Wide Shipping — Nexa Customs',
  '/returns':        'Return Policy — Nexa Customs',
  '/terms':          'Terms & Conditions — Nexa Customs',
  '/turnaround':     'Turnaround Times — Rush & Same-Day Printing — Nexa Customs',
  '/cart':           'Your Cart — Nexa Customs',
  '/checkout':       'Checkout — Nexa Customs',
  '/order-confirmed':'Order Confirmed! — Nexa Customs',
  '/order-status':   'Track Your Order — Nexa Customs',
};

const DESCRIPTIONS = {
  '/':           "Nexa Customs — GTA's trusted print shop in Mississauga. Business cards, vinyl banners, vehicle wraps, stickers & more. Free proof, same-day pickup, ships Canada-wide. (437) 997-9921.",
  '/products':   'Browse 80+ print products at Nexa Customs. Business cards, banners, vehicle wraps, stickers, signs & more. Serving Toronto, Mississauga, Brampton, Oakville and all of Canada.',
  '/quote':      'Get a free custom print quote from Nexa Customs. Serving GTA — Toronto, Mississauga, Brampton, Oakville. Ships Canada-wide. Response within 1 business day.',
  '/contact':    'Contact Nexa Customs at (437) 997-9921. Located in Mississauga, serving all of GTA. Free pickup or Canada-wide shipping available.',
  '/about':      "Nexa Customs Inc. — GTA's trusted print shop since 2010. Serving Toronto, Mississauga, Brampton, Oakville, Burlington and shipping Canada-wide. Quality guaranteed.",
  '/faq':        'Frequently asked questions about Nexa Customs print services. File formats, turnaround times, GTA pickup, Canada shipping, proofs and more.',
  '/shipping':   'Nexa Customs offers free pickup in Mississauga (GTA) and ships Canada-wide via Canada Post and FedEx. Fast, reliable delivery to all provinces.',
  '/order-status': 'Track your Nexa Customs print order in real time. Enter your order number to see production status — received, printing, ready, or shipped.',
};

const CAT_TITLES = {
  'business-cards':   'Business Cards Printing GTA — Mississauga, Toronto, Brampton — Nexa Customs',
  'signs-banners':    'Vinyl Banners & Signs GTA — Mississauga, Toronto, Brampton — Nexa Customs',
  'vehicle-graphics': 'Vehicle Wraps GTA — Toronto, Mississauga, Brampton — Nexa Customs',
  'labels-stickers':  'Custom Labels & Stickers GTA — Nexa Customs',
  'flyers-postcards': 'Flyers & Postcards Printing GTA — Nexa Customs',
  'marketing':        'Marketing Materials Printing GTA — Nexa Customs',
  'stationery':       'Business Stationery GTA — Nexa Customs',
  'restaurant':       'Restaurant Printing GTA — Menus, Table Tents — Nexa Customs',
  'foam-boards':      'Foam Boards & Display Signs GTA — Nexa Customs',
  'real-estate':      'Real Estate Signs GTA — Mississauga, Toronto, Brampton — Nexa Customs',
  'calendars':        'Custom Calendars Printing GTA — Nexa Customs',
  'posters-canvas':   'Posters & Canvas Prints GTA — Nexa Customs',
};

const CAT_DESCS = {
  'business-cards':   'Professional business cards printing in Mississauga, Toronto, Brampton & GTA. Starting $24.32 for 250 cards. Free proof, same-day pickup, ships Canada-wide.',
  'signs-banners':    'Custom vinyl banners and signs in GTA. Serving Toronto, Mississauga, Brampton, Oakville. Indoor/outdoor, custom sizes, rush available.',
  'vehicle-graphics': 'Professional vehicle wraps and fleet graphics in Toronto, Mississauga, Brampton GTA. Full wraps, partial wraps, truck lettering. Free consultation.',
  'labels-stickers':  'Custom labels and stickers in GTA. Die-cut, roll labels, BOPP waterproof, clear labels. Serving Toronto, Mississauga, Brampton. Ships Canada-wide.',
  'flyers-postcards': 'Flyers and postcards printing in GTA. Starting 1,000 flyers from $99. Serving Toronto, Mississauga, Brampton. Ships Canada-wide.',
  'real-estate':      'Real estate signs and printing in GTA. Yard signs, riders, feature sheets. Serving Toronto, Mississauga, Brampton, Oakville realtors.',
};

// Ensures a <meta> or <link> tag exists, creates it if missing
function ensureTag(selector, tag, attrs) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

export function usePageSEO() {
  const location = useLocation();
  const { curProd } = useApp();

  useEffect(() => {
    const path = location.pathname;
    let title  = BASE;
    let desc   = DESCRIPTIONS['/'];
    let canonical = DOMAIN + path;

    if (TITLES[path]) {
      title = TITLES[path];
      desc  = DESCRIPTIONS[path] || desc;
    } else if (path.startsWith('/products/') && curProd) {
      title = `${curProd.name} — Nexa Customs · GTA Print Shop`;
      desc  = curProd.desc
        ? `${curProd.desc} Order online. Free proof. Same-day pickup in Mississauga GTA or ships Canada-wide. Call (437) 997-9921.`
        : DESCRIPTIONS['/'];
    } else if (path.startsWith('/products/')) {
      const catSlug = path.split('/')[2];
      title = CAT_TITLES[catSlug] || `${catSlug.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())} — Nexa Customs GTA`;
      desc  = CAT_DESCS[catSlug] || DESCRIPTIONS['/products'];
    }

    // Never index transactional / private pages
    const noIndexPaths = ['/cart', '/checkout', '/order-confirmed', '/admin'];
    const shouldIndex  = !noIndexPaths.some(p => path.startsWith(p));

    document.title = title;

    // Canonical — always points to nexacustoms.ca (never vercel URL)
    const canonEl = ensureTag('link[rel="canonical"]', 'link', { rel: 'canonical' });
    canonEl.setAttribute('href', canonical);

    // Robots
    const robotsEl = ensureTag('meta[name="robots"]', 'meta', { name: 'robots' });
    robotsEl.setAttribute('content', shouldIndex ? 'index, follow' : 'noindex, nofollow');

    // OG / Twitter
    const set = (sel, tag, initAttrs, attr, val) => {
      ensureTag(sel, tag, initAttrs).setAttribute(attr, val);
    };
    set('meta[name="description"]',       'meta', { name:'description' },              'content', desc);
    set('meta[property="og:title"]',      'meta', { property:'og:title' },             'content', title);
    set('meta[property="og:description"]','meta', { property:'og:description' },       'content', desc);
    set('meta[property="og:url"]',        'meta', { property:'og:url' },               'content', canonical);
    set('meta[name="twitter:title"]',     'meta', { name:'twitter:title' },            'content', title);
    set('meta[name="twitter:description"]','meta',{ name:'twitter:description' },      'content', desc);

  }, [location.pathname, curProd?.id]);
}
