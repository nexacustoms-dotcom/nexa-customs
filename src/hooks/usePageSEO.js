import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DOMAIN = 'https://nexacustoms.ca';
const BASE   = 'Nexa Customs — GTA Print Shop · Mississauga';

const TITLES = {
  '/':               'Nexa Customs — Print Shop · Signs & Wraps · Mississauga',
  '/products':       'Custom Printing Mississauga - Banners, Signs & Wraps',
  '/blog':           'Print & Design Tips for GTA Businesses | Nexa Customs',
  '/quote':          'Get a Free Print Quote in Mississauga | Nexa Customs',
  '/contact':        'Contact Our Nexa Customs Print Shop in Mississauga',
  '/about':          "About Nexa Customs — Mississauga's Trusted Print Shop",
  '/faq':            'Frequently Asked Questions — Nexa Customs Mississauga',
  '/shipping':       'Printing & Shipping Policy — Nexa Customs Mississauga',
  '/returns':        'Return Policy — Nexa Customs',
  '/terms':          'Terms & Conditions — Nexa Customs',
  '/turnaround':     'Print Turnaround Times — Same-Day Pickup | Nexa Customs',
  '/cart':           'Your Cart — Nexa Customs',
  '/checkout':       'Checkout — Nexa Customs',
  '/order-confirmed':'Order Confirmed! — Nexa Customs',
  '/order-status':   'Track Your Print Order Status | Nexa Customs Mississauga',
  '/privacy':        'Privacy Policy — Nexa Customs',
};

// All descriptions trimmed to 120–158 chars (sweet spot for Google & Bing)
const DESCRIPTIONS = {
  '/':          "GTA's trusted print shop in Mississauga. Business cards, banners, vehicle wraps & stickers. Free proof, same-day pickup. Ships Canada-wide. Call (437) 997-9921.",
  '/products':  'Shop all custom print products at Nexa Customs - business cards, banners, vehicle wraps, stickers & signs. Free proof, same-day pickup in Mississauga.',
  '/blog':      'Explore print and design tips, business branding guides, and product how-tos from Nexa Customs Mississauga\'s trusted custom print shop serving the GTA.',
  '/quote':     'Request a free custom print quote from Nexa Customs in Mississauga. Business cards, banners & signs - fast turnaround, no obligation, ships Canada-wide',
  '/contact':   "Contact Nexa Customs Mississauga's trusted print shop. Call (437) 997-9921, visit 6033 Shawson Dr, or send a message. Same-day pickup, ships Canada-wide.",
  '/about':     "Learn about Nexa Customs — Mississauga's print shop serving the GTA since 2020. Full-colour printing, vehicle wraps, signs & banners. Quality guaranteed.",
  '/faq':       'Questions about custom printing? Find answers on turnaround times, same-day pickup, file formats, vehicle wraps, and shipping from Nexa Customs Mississauga.',
  '/shipping':  'Nexa Customs ships print orders Canada-wide via Canada Post and FedEx. Free same-day pickup in Mississauga. Flat-rate delivery to all provinces and territories.',
  '/returns':   'Nexa Customs quality guarantee — not satisfied, we reprint at no charge. Learn about our return and reprint policy for custom print orders.',
  '/terms':     'Terms & Conditions for Nexa Customs Inc. Custom print orders, artwork, payment terms, turnaround times, liability and cancellation policy.',
  '/privacy':   'Privacy Policy for Nexa Customs Inc. How we collect, use and protect your personal information. PIPEDA compliant. Contact info@nexacustoms.ca.',
  '/turnaround':'See print turnaround times at Nexa Customs Mississauga. Same-day pickup before 10:30 AM, standard 2–3 days, and rush 24hr printing for GTA businesses.',
  '/order-status':'Check your custom print order status at Nexa Customs. Enter your order ID to track production, pickup, and shipping updates from our Mississauga print shop.',
};

const CAT_TITLES = {
  'business-cards':   'Custom Business Cards Mississauga & GTA | Nexa Customs',
  'signs-banners':    'Custom Signs & Banners Printing | Nexa Customs Mississauga',
  'vehicle-graphics': 'Vehicle Wraps & Fleet Graphics | Nexa Customs Mississauga',
  'labels-stickers':  'Custom Stickers & Labels | Nexa Customs Mississauga GTA',
  'flyers-postcards': 'Custom Flyers & Postcards Printing | Nexa Customs GTA',
  'marketing':        'Custom Marketing Print Materials | Nexa Customs Mississauga',
  'stationery':       'Custom Business Stationery Printing | Nexa Customs GTA',
  'restaurant':       'Restaurant Printing — Menus, Signs & More | Nexa Customs',
  'foam-boards':      'Custom Foam Board Printing | Nexa Customs Mississauga GTA',
  'real-estate':      'Real Estate Printing — Signs & Flyers | Nexa Customs GTA',
  'calendars':        'Custom Calendar Printing | Nexa Customs Mississauga GTA',
  'posters-canvas':   'Custom Posters & Canvas Prints | Nexa Customs Mississauga',
};

// All 12 categories — all within 120–158 chars
const CAT_DESCS = {
  'business-cards':   'Order custom business cards in Mississauga from Nexa Customs. Matte, gloss, soft touch, foil & folded cards. Free proof, same-day pickup, ships Canada-wide. ',
  'signs-banners':    'Order custom signs and banners at Nexa Customs Mississauga. Vinyl banners, retractable banners, foam boards, yard signs & more. Free proof, ships Canada-wide.',
  'vehicle-graphics': 'Custom vehicle wraps, fleet graphics & magnetic signs at Nexa Customs Mississauga. Full-colour, cut vinyl & window graphics for GTA businesses. Free proof.',
  'labels-stickers':  'Custom stickers & labels at Nexa Customs Mississauga. Die-cut, vinyl & waterproof options for GTA businesses. Free proof, same-day pickup, ships Canada-wide.',
  'flyers-postcards': 'Custom flyers and postcards at Nexa Customs Mississauga. Full-colour, double-sided, gloss or matte. Free proof, same-day pickup, ships Canada-wide.',
  'marketing':        'Shop custom marketing print materials at Nexa Customs Mississauga. Brochures, presentation folders, door hangers, flyers & more for GTA businesses. Free proof.',
  'stationery':       'Custom business stationery at Nexa Customs Mississauga. Letterheads, envelopes, notepads & NCR forms for GTA businesses. Free proof, ships Canada-wide.',
  'restaurant':       'Restaurant printing at Nexa Customs Mississauga. Menus, table tents, banners & signage for GTA restaurants. Free proof, same-day pickup, ships Canada-wide.',
  'foam-boards':      'Custom foam board printing at Nexa Customs Mississauga. Rigid display boards for events, retail & trade shows across the GTA. Free proof, ships Canada-wide.',
  'real-estate':      'Real estate printing at Nexa Customs Mississauga. For Sale signs, open house flyers and feature sheets for GTA realtors. Free proof, ships Canada-wide.',
  'calendars':        'Custom branded calendars at Nexa Customs Mississauga. Wall, desk & promotional calendars for GTA businesses. Free proof, same-day pickup, ships Canada-wide.',
  'posters-canvas':   'Custom posters & canvas prints at Nexa Customs Mississauga. Large-format, full-colour printing for GTA businesses and events. Free proof, ships Canada-wide.',
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
