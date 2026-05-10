import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar, Navbar, Footer, Toast } from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';
import { CartPage, CheckoutPage, SuccessPage, QuotePage, ContactPage } from './pages/TransactionalPages';

// ── POLICY PAGES ──────────────────────────────────────────────────────────────
const POLICY = {
  faq: {
    title: 'Frequently Asked Questions',
    faqs: [
      { q: 'What file formats do you accept?', a: 'We accept PDF, AI, EPS, PSD, PNG (300dpi+), and high-res JPG. PDF is preferred for print-ready files. If you need design help, we offer that too — just ask.' },
      { q: 'Do you offer design services?', a: 'Yes! We offer free basic layout adjustments and affordable custom design. Email info@nexacustoms.ca with your project details.' },
      { q: 'What is your standard turnaround time?', a: 'Standard is 5–7 business days from proof approval. Rush (2–3 days) and Express (same/next day) options are available at a surcharge. Turnaround begins after artwork approval.' },
      { q: 'Do you ship across Canada?', a: 'Yes. We ship via Canada Post and courier across Ontario and Canada. Local pickup is always free at our Mississauga location.' },
      { q: 'What is your reprint/quality guarantee?', a: 'If there is a print defect or error on our end, we reprint at no charge. We cannot reprint for customer-supplied artwork errors — this is why we always send a proof first.' },
      { q: 'Can I get a proof before printing?', a: 'Absolutely. A digital PDF proof is included free with every order. We only go to press after you approve it.' },
      { q: 'What is your minimum order quantity?', a: 'It depends on the product. Business cards start at 100, banners at 1 piece, stickers at 10, and so on. Check the product page for specific minimums.' },
      { q: 'Do you do rush same-day orders?', a: 'Yes! Express same-day or next-day service is available. Call us at (437) 997-9921 to confirm availability before placing your order.' },
      { q: 'Can you match my brand colours (Pantone)?', a: 'We print in CMYK. We will do our best to match your brand colours — provide your Pantone or hex codes and we will adjust your proof accordingly.' },
      { q: 'How do I submit my artwork after ordering?', a: 'After placing your order, email your files to info@nexacustoms.ca with your order number in the subject line.' },
    ],
  },
  turnaround: {
    title: 'Turnaround Times',
    body: `Standard turnaround is 5–7 business days from proof approval.\n\nRush (2–3 business days) and Express (same/next day) options are available at an additional fee applied at checkout.\n\nTurnaround begins after artwork approval, not order placement. Complex projects (vehicle wraps, large-format murals) may require additional time — we'll confirm your timeline when you order.\n\nSame-day pickup is available for orders placed before 10:30 AM with artwork approved by noon.`,
  },
  shipping: {
    title: 'Shipping Policy',
    body: `We ship across Ontario and Canada via Canada Post and FedEx/UPS courier.\n\nFree local pickup at 6033 Shawson Dr, Unit 40, Mississauga (Mon–Fri 9AM–6PM, Sat by appointment).\n\nFlat-rate shipping: Canada Post $18 · Courier $45\n\nOrders are packaged carefully to prevent transit damage. Nexa Customs is not responsible for carrier delays once the package is in transit. If your order arrives damaged, contact us within 5 business days with photos and we will work to resolve it.`,
  },
  returns: {
    title: 'Return Policy',
    body: `Due to the custom-printed nature of our products, we do not accept returns or exchanges.\n\nHowever, if there is a manufacturing defect or an error on our part (colour shift, wrong size, printing fault), we will reprint at no charge.\n\nClaims must be made within 5 business days of delivery. Please email info@nexacustoms.ca with your order number and photos of the issue.\n\nWe are unable to reprint orders where the error originates from customer-supplied artwork (wrong bleed, low resolution, incorrect colours). This is why we always send a free proof before printing.`,
  },
  terms: {
    title: 'Terms & Conditions',
    body: `By placing an order with Nexa Customs Inc., you agree to the following:\n\n1. Artwork Rights: You confirm you own or have rights to all artwork submitted. Nexa Customs is not responsible for copyright or trademark infringement from customer-provided files.\n\n2. Colour Accuracy: Colours may vary slightly from screen previews due to monitor calibration and the CMYK printing process. We always send a proof — please review carefully.\n\n3. Payment: All prices are in CAD and include applicable taxes. Orders are confirmed once payment is received or invoice is approved.\n\n4. Turnaround: Production begins after proof approval. Rush fees apply for accelerated timelines.\n\n5. Liability: Nexa Customs' liability is limited to the value of the order. We are not responsible for consequential damages arising from delays or errors.`,
  },
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--bd)' }}>
      <button className="faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span style={{ fontSize: 18, color: 'var(--o)', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', lineHeight: 1 }}>⌄</span>
      </button>
      {open && <div style={{ padding: '0 4px 16px', fontSize: 13, color: 'var(--mu)', lineHeight: 1.82 }}>{a}</div>}
    </div>
  );
}

function PolicyPage({ slug }) {
  const p = POLICY[slug];
  if (!p) return null;
  return (
    <div className="W" style={{ padding: '40px 28px 76px', maxWidth: 820 }}>
      <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,50px)', marginBottom: 28 }}>{p.title}</h1>
      {p.body && p.body.split('\n\n').map((para, i) => (
        <p key={i} style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.85, marginBottom: 16, whiteSpace: 'pre-line' }}>{para}</p>
      ))}
      {p.faqs && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {p.faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
        </div>
      )}
    </div>
  );
}

// Custom page renderer
function CustomPage({ slug }) {
  const { pages } = useApp();
  const pg = pages.find(p => p.slug === slug);
  if (!pg) return (
    <div className="W" style={{ padding: '60px 28px', textAlign: 'center', color: 'var(--mu)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Page not found</div>
    </div>
  );
  return (
    <div className="W" style={{ padding: '40px 28px 76px', maxWidth: 860 }}>
      <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,50px)', marginBottom: 28 }}>{pg.title}</h1>
      <div style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: pg.content }} />
    </div>
  );
}

const POLICY_SLUGS = ['faq', 'turnaround', 'shipping', 'returns', 'terms'];

function AppInner() {
  const { page, pages } = useApp();

  const isAdmin = page === 'admin';
  const isPolicy = POLICY_SLUGS.includes(page);
  const isCustom = !isAdmin && !isPolicy && pages.some(p => p.slug === page);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdmin && <Topbar />}
      {!isAdmin && <Navbar />}

      <main style={{ flex: 1 }}>
        {page === 'home'     && <HomePage />}
        {page === 'products' && <ProductsPage />}
        {page === 'detail'   && <ProductDetailPage />}
        {page === 'cart'     && <CartPage />}
        {page === 'checkout' && <CheckoutPage />}
        {page === 'success'  && <SuccessPage />}
        {page === 'quote'    && <QuotePage />}
        {page === 'contact'  && <ContactPage />}
        {page === 'admin'    && <AdminPage />}
        {isPolicy            && <PolicyPage slug={page} />}
        {isCustom            && <CustomPage slug={page} />}
      </main>

      {!isAdmin && <Footer />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
