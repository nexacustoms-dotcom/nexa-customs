import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar, Navbar, Footer, Toast } from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductCard from './components/ProductCard';
import AdminPage from './pages/AdminPage';
import LabelsStickersPage from './pages/LabelsStickersPage';
import { CartPage, CheckoutPage, SuccessPage, QuotePage, ContactPage } from './pages/TransactionalPages';

// ── POLICY DATA ───────────────────────────────────────────────────────────────
const POLICY = {
  faq: {
    title: 'Frequently Asked Questions',
    faqs: [
      { q: 'What file formats do you accept?', a: 'We accept PDF, AI, EPS, PSD, PNG (300dpi+), and high-res JPG. PDF is preferred for print-ready files.' },
      { q: 'Do you offer design services?', a: 'Yes! Free basic layout adjustments and affordable custom design. Email info@nexacustoms.ca with details.' },
      { q: 'What is your standard turnaround time?', a: 'Standard is 5–7 business days from proof approval. Rush (2–3 days) and Express (same/next day) available at a surcharge.' },
      { q: 'Do you ship across Canada?', a: 'Yes. We ship via Canada Post and courier. Local pickup is always free at our Mississauga location.' },
      { q: 'What is your quality guarantee?', a: 'If there is a print defect on our end, we reprint at no charge. We send a free proof before every order.' },
      { q: 'Can I get a proof before printing?', a: 'Absolutely — a digital PDF proof is free with every order. We print only after you approve it.' },
      { q: 'What is the minimum order?', a: 'Business cards start at 100. Banners at 1 piece. Stickers at 10. Check each product page for specifics.' },
      { q: 'Do you do same-day rush orders?', a: 'Yes! Call (437) 997-9921 to confirm availability before ordering.' },
      { q: 'Can you match Pantone colours?', a: 'We print in CMYK. Provide your Pantone or hex codes and we adjust your proof accordingly.' },
      { q: 'How do I send my artwork?', a: 'After placing your order, email files to info@nexacustoms.ca with your order number in the subject line.' },
    ],
  },
  turnaround: { title: 'Turnaround Times', body: 'Standard turnaround is 5–7 business days from proof approval.\n\nRush (2–3 business days) and Express (same/next day) options are available at an additional fee applied at checkout.\n\nTurnaround begins after artwork approval, not order placement. Complex projects may require additional time.\n\nSame-day pickup available for orders placed before 10:30 AM with artwork approved by noon.' },
  shipping: { title: 'Shipping Policy', body: 'We ship across Ontario and Canada via Canada Post and FedEx/UPS courier.\n\nFree local pickup at 6033 Shawson Dr, Unit 40, Mississauga (Mon–Fri 9AM–6PM).\n\nFlat-rate shipping: Canada Post $18 · Courier $45\n\nNexa Customs is not responsible for carrier delays once the package is in transit. Contact us within 5 business days if your order arrives damaged.' },
  returns: { title: 'Return Policy', body: 'Due to the custom-printed nature of our products, we do not accept returns or exchanges.\n\nIf there is a manufacturing defect or error on our part, we will reprint at no charge.\n\nClaims must be made within 5 business days of delivery. Email info@nexacustoms.ca with photos.\n\nWe cannot reprint for customer-supplied artwork errors — this is why we always send a free proof first.' },
  terms: { title: 'Terms & Conditions', body: 'By placing an order with Nexa Customs Inc., you agree to the following:\n\n1. Artwork Rights: You confirm you own or have rights to all artwork submitted.\n\n2. Colour Accuracy: Colours may vary slightly from screen due to CMYK printing. Review your proof carefully.\n\n3. Payment: All prices are in CAD. Orders are confirmed once payment is received or invoice is approved.\n\n4. Turnaround: Production begins after proof approval.\n\n5. Liability: Nexa Customs liability is limited to the value of the order.' },
};

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--bd)' }}>
      <button className="faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span style={{ fontSize: 18, color: 'var(--o)', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>⌄</span>
      </button>
      {open && <div style={{ padding: '0 4px 16px', fontSize: 14, color: 'var(--mu)', lineHeight: 1.82 }}>{a}</div>}
    </div>
  );
}

function PolicyPage({ slug }) {
  const p = POLICY[slug];
  if (!p) return <NotFoundPage />;
  return (
    <div className="W" style={{ padding: '40px 28px 76px', maxWidth: 820 }}>
      <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,50px)', marginBottom: 28 }}>{p.title}</h1>
      {p.body && p.body.split('\n\n').map((para, i) => (
        <p key={i} style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.85, marginBottom: 16, whiteSpace: 'pre-line' }}>{para}</p>
      ))}
      {p.faqs && p.faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
    </div>
  );
}

function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, color: 'var(--mu)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--bd)', borderTop: '3px solid var(--o)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: 13 }}>{text}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16, padding: 40 }}>
      <div style={{ fontSize: 64 }}>🔍</div>
      <h1 className="D" style={{ fontSize: 48 }}>Page Not Found</h1>
      <p style={{ fontSize: 14, color: 'var(--mu)' }}>The page you are looking for does not exist.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>← Back to Home</button>
    </div>
  );
}

// ── CATEGORY PAGE ─────────────────────────────────────────────────────────────
function CategoryPage() {
  const { catSlug } = useParams();
  const { cats, prods, syncing } = useApp();
  const navigate = useNavigate();
  const [waited, setWaited] = useState(false);

  // Give Supabase sync time to load before showing 404
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const cat = cats.find(c => c.id === catSlug);
  const catProds = prods.filter(p => p.cat === catSlug && !p.disabled);

  if (!cat && !waited) return <LoadingSpinner text="Loading category…" />;
  if (!cat) return <NotFoundPage />;

  return (
    <div>
      <div style={{ background: 'var(--dk)', borderBottom: '1px solid var(--bd)', padding: '44px 0', textAlign: 'center' }}>
        <div className="W">
          <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 10 }}>
            <span onClick={() => navigate('/products')} style={{ cursor: 'pointer', color: 'var(--o)' }}>All Products</span>
            <span style={{ margin: '0 6px' }}>›</span>
            <span>{cat.l}</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            {cat.img
              ? <img src={cat.img} alt={cat.l} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--bd)' }} />
              : <span style={{ fontSize: 52 }}>{cat.i}</span>}
          </div>
          <h1 className="D" style={{ fontSize: 'clamp(32px,5vw,58px)', marginBottom: 8 }}>{cat.l}</h1>
          <p style={{ fontSize: 13, color: 'var(--mu)' }}>{catProds.length} products available</p>
        </div>
      </div>
      <div className="W" style={{ padding: '28px 28px 72px' }}>
        {catProds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🖨️</div>
            <div>No products in this category yet.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
            {catProds.map(p => (
              <ProductCard key={p.id} prod={p} onOpen={() => navigate(`/products/${catSlug}/${p.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PRODUCT DETAIL PAGE WRAPPER ───────────────────────────────────────────────
function LabelsStickersWrapper() {
  const { productSlug } = useParams();
  return <LabelsStickersPage productId={productSlug} />;
}

function ProductPageWrapper() {
  const { productSlug } = useParams();
  const { prods, setCurProd, curProd } = useApp();
  const navigate = useNavigate();
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prod = prods.find(p => p.id === productSlug);
    if (prod) {
      setCurProd(prod);
    } else if (waited) {
      navigate('/products', { replace: true });
    }
  }, [productSlug, prods.length, waited]);

  if (!curProd && !waited) return <LoadingSpinner text="Loading product…" />;

  return <ProductDetailPage />;
}

// ── CUSTOM PAGE ───────────────────────────────────────────────────────────────
function CustomPageRoute() {
  const { slug } = useParams();
  const { pages } = useApp();
  const pg = pages.find(p => p.slug === slug);
  if (!pg) return <NotFoundPage />;
  return (
    <div className="W" style={{ padding: '40px 28px 76px', maxWidth: 860 }}>
      <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,50px)', marginBottom: 28 }}>{pg.title}</h1>
      <div style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: pg.content }} />
    </div>
  );
}

// ── SCROLL TO TOP ON ROUTE CHANGE ─────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

// ── LAYOUT ────────────────────────────────────────────────────────────────────
function Layout({ children, noNav }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!noNav && <Topbar />}
      {!noNav && <Navbar />}
      <main style={{ flex: 1 }}>{children}</main>
      {!noNav && <Footer />}
      <Toast />
    </div>
  );
}

// ── ROUTES ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin — no nav */}
        <Route path="/admin" element={<Layout noNav><AdminPage /></Layout>} />

        {/* Main pages */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/labels-stickers" element={<Layout><LabelsStickersPage productId="sheet-stickers" /></Layout>} />
        <Route path="/products/labels-stickers/:productSlug" element={<Layout><LabelsStickersWrapper /></Layout>} />
        <Route path="/products/:catSlug" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:catSlug/:productSlug" element={<Layout><ProductPageWrapper /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/order-confirmed" element={<Layout><SuccessPage /></Layout>} />
        <Route path="/quote" element={<Layout><QuotePage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

        {/* Policy pages */}
        <Route path="/faq" element={<Layout><PolicyPage slug="faq" /></Layout>} />
        <Route path="/shipping" element={<Layout><PolicyPage slug="shipping" /></Layout>} />
        <Route path="/returns" element={<Layout><PolicyPage slug="returns" /></Layout>} />
        <Route path="/terms" element={<Layout><PolicyPage slug="terms" /></Layout>} />
        <Route path="/turnaround" element={<Layout><PolicyPage slug="turnaround" /></Layout>} />

        {/* Admin-created custom pages */}
        <Route path="/p/:slug" element={<Layout><CustomPageRoute /></Layout>} />

        {/* 404 */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
