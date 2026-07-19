import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DOMAIN = 'https://nexacustoms.ca';
const BASE   = 'Nexa Customs — GTA Print Shop · Mississauga';

const TITLES = {
  '/':               'Nexa Customs — Print Shop · Signs · Vehicle Wraps · GTA & Canada',
  '/products':       'All Print Products — Nexa Customs · GTA Print Shop',
  '/blog':           'Blog — Nexa Customs GTA Print Shop',
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
  '/privacy':        'Privacy Policy — Nexa Customs',
};

// All descriptions trimmed to 120–158 chars (sweet spot for Google & Bing)
const DESCRIPTIONS = {
  '/':          "GTA's trusted print shop near you in Mississauga. Business cards, banners, wraps & stickers. Same-day pickup, ships across Ontario. (437) 997-9921.",
  '/products':  'Browse 80+ print products near you — business cards, banners, vehicle wraps, stickers & signs. Serving Toronto, Mississauga, Brampton, GTA & Ontario.',
  '/blog':      'Practical guides on print materials, sign regulations, and getting the most out of your order — from the GTA print shop that prints it. Nexa Customs, Mississauga.',
  '/quote':     'Get a free custom print quote from Nexa Customs. Serving Toronto, Mississauga, Brampton, Oakville GTA. Ships Canada-wide. Reply within 1 business day.',
  '/contact':   'Contact Nexa Customs at (437) 997-9921. Located in Mississauga, GTA. Free pickup or Canada-wide shipping. Mon–Fri 9AM–6PM, Sat by appointment.',
  '/about':     "Nexa Customs Inc. — GTA print shop serving Toronto, Mississauga, Brampton & Oakville. Business cards, signs, vehicle wraps & more. Quality guaranteed.",
  '/faq':       'FAQ for Nexa Customs print shop. File formats, turnaround times, GTA pickup, Canada shipping, free proofs and order tracking explained.',
  '/shipping':  'Free pickup in Mississauga. Canada-wide shipping via Canada Post & FedEx. Flat-rate delivery to all provinces. Fast, reliable, trackable.',
  '/returns':   'Nexa Customs quality guarantee — not satisfied, we reprint at no charge. Learn about our return and reprint policy for custom print orders.',
  '/terms':     'Terms & Conditions for Nexa Customs Inc. Custom print orders, artwork, payment terms, turnaround times, liability and cancellation policy.',
  '/privacy':   'Privacy Policy for Nexa Customs Inc. How we collect, use and protect your personal information. PIPEDA compliant. Contact info@nexacustoms.ca.',
  '/turnaround':'Nexa Customs turnaround times: standard 5–7 days, rush 2–3 days, express same/next day. Pickup in Mississauga or ships Canada-wide.',
  '/order-status':'Track your Nexa Customs print order. Enter your order number to see live status — received, in production, ready for pickup or shipped.',
};

const CAT_TITLES = {
  'business-cards':   'Business Cards Printing GTA — Nexa Customs',
  'signs-banners':    'Vinyl Banners & Signs GTA — Nexa Customs',
  'vehicle-graphics': 'Vehicle Wraps GTA — Toronto & Mississauga — Nexa Customs',
  'labels-stickers':  'Custom Labels & Stickers GTA — Nexa Customs',
  'flyers-postcards': 'Flyers & Postcards Printing GTA — Nexa Customs',
  'marketing':        'Marketing Print Materials GTA — Nexa Customs',
  'stationery':       'Business Stationery Printing GTA — Nexa Customs',
  'restaurant':       'Restaurant Printing GTA — Menus & Table Tents',
  'foam-boards':      'Foam Board Signs & Displays GTA — Nexa Customs',
  'real-estate':      'Real Estate Signs GTA — Nexa Customs',
  'calendars':        'Custom Calendar Printing GTA — Nexa Customs',
  'posters-canvas':   'Poster & Canvas Printing GTA — Large Format — Nexa Customs',
};

// All 12 categories — all within 120–158 chars
const CAT_DESCS = {
  'business-cards':   'Affordable business cards near you in Mississauga & GTA. 14pt, 16pt, soft-touch, spot UV & more. Free proof, same-day pickup, ships Canada-wide.',
  'signs-banners':    'Custom vinyl banners & signs near you — GTA sign company for indoor/outdoor signage, retractable stands, custom sizes. Rush available, ships Canada-wide.',
  'vehicle-graphics': 'Vehicle & car wraps near you in Toronto, Mississauga, Brampton & Vaughan. Full/partial wraps, van wraps, window decals, truck lettering. Free quote.',
  'labels-stickers':  'Custom labels & stickers near you in GTA. Die-cut, roll labels, BOPP waterproof, clear & holographic. Serving Toronto, Mississauga, Markham.',
  'flyers-postcards': 'Flyer & postcard printing in GTA. 1,000 flyers from $99. Single & double-sided, gloss or matte. Ships Canada-wide. Rush available.',
  'marketing':        'Marketing materials printing in GTA. Brochures, door hangers, rack cards, table tents. Serving Toronto, Mississauga, Brampton.',
  'stationery':       'Business stationery printing in GTA. Letterhead, envelopes, notepads & NCR forms. Professional quality, fast turnaround, ships Canada-wide.',
  'restaurant':       'Restaurant printing in GTA. Menus, table tents, placemats, coasters & more. Waterproof options available. Rush printing available.',
  'foam-boards':      'Foam board signs & display printing in GTA. Lightweight, rigid, full colour. Indoor signage, trade shows, events. Mississauga pickup.',
  'real-estate':      'Real estate signs & printing in GTA. Yard signs, riders, feature sheets, open house signs. Serving Toronto & GTA realtors.',
  'calendars':        'Custom calendar printing in GTA. Wall calendars, desk calendars, magnetic & pocket calendars. Branded with your logo & photos.',
  'posters-canvas':   'Poster & canvas printing in GTA. Large format, photo prints, art reproductions, canvas wraps. Ships Canada-wide. Rush available.',
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
  const { curProd, pages } = useApp();

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
      // Product desc: keep under 158 chars. Never fall back to the homepage
      // description — that creates duplicate meta descriptions across every
      // product missing its own text.
      const rawDesc = curProd.desc
        ? `${curProd.desc} Free proof, same-day pickup in Mississauga GTA or ships Canada-wide.`
        : `${curProd.name} — custom printing in Mississauga & the GTA. Free proof, same-day pickup or ships Canada-wide. Call (437) 997-9921.`;
      desc = rawDesc.length > 158 ? rawDesc.slice(0, 155) + '...' : rawDesc;
    } else if (path.startsWith('/products/')) {
      const catSlug = path.split('/')[2];
      title = CAT_TITLES[catSlug] || `${catSlug.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())} — Nexa Customs GTA`;
      desc  = CAT_DESCS[catSlug] || DESCRIPTIONS['/products'];
    } else if (path.startsWith('/blog/') || path.startsWith('/p/')) {
      const pageSlug = path.split('/')[2];
      const page = (pages || []).find(pg => pg.slug === pageSlug);
      if (page) {
        title = `${page.title} — Nexa Customs`;
        // Never fall back to the homepage description here — that's exactly
        // the duplicate-meta-description bug already fixed for products.
        if (page.metaDesc) {
          desc = page.metaDesc;
        } else {
          const plain = (page.content || '').replace(/^##.*$/gm, '').replace(/^>>>\s*/gm, '').replace(/[\[\]!()]/g, '').replace(/\s+/g, ' ').trim();
          desc = plain.length > 158 ? plain.slice(0, 155) + '...' : (plain || `${page.title} — a guide from Nexa Customs, GTA print shop.`);
        }
      }
    }

    // Never index transactional / private / disabled-product pages
    const noIndexPaths = ['/cart', '/checkout', '/order-confirmed', '/admin'];
    const isDisabledProduct = path.startsWith('/products/') && curProd?.disabled;
    const shouldIndex  = !noIndexPaths.some(p => path.startsWith(p)) && !isDisabledProduct;

    document.title = title;

    // Canonical — always points to nexacustoms.ca (never vercel URL)
    const canonEl = ensureTag('link[rel="canonical"]', 'link', { rel: 'canonical' });
    canonEl.setAttribute('href', canonical);

    // Robots
    const robotsEl = ensureTag('meta[name="robots"]', 'meta', { name: 'robots' });
    robotsEl.setAttribute('content', shouldIndex ? 'index, follow' : 'noindex, nofollow');

    // Meta + OG + Twitter
    const set = (sel, tag, initAttrs, attr, val) => {
      ensureTag(sel, tag, initAttrs).setAttribute(attr, val);
    };
    set('meta[name="description"]',        'meta', { name:'description' },         'content', desc);
    set('meta[property="og:title"]',       'meta', { property:'og:title' },        'content', title);
    set('meta[property="og:description"]', 'meta', { property:'og:description' },  'content', desc);
    set('meta[property="og:url"]',         'meta', { property:'og:url' },          'content', canonical);
    set('meta[name="twitter:title"]',      'meta', { name:'twitter:title' },       'content', title);
    set('meta[name="twitter:description"]','meta', { name:'twitter:description' }, 'content', desc);

  }, [location.pathname, curProd?.id, pages]);
}
