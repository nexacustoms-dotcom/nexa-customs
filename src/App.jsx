import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar, Navbar, Footer, Toast, FloatingButtons } from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductCard from './components/ProductCard';
import AdminPage from './pages/AdminPage';
import CookieBanner from './components/CookieBanner';
import { renderBody } from './lib/richText';
import ProofPage from './pages/ProofPage';
import BlogIndexPage from './pages/BlogIndexPage';
import LocationServicePage, { getLocationPageSlugs } from './pages/LocationServicePage';
import ICONS from './components/Icons';
import { CartPage, CheckoutPage, SuccessPage, QuotePage, ContactPage, OrderStatusPage } from './pages/TransactionalPages';
import { usePageSEO } from './hooks/usePageSEO';

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
  const { builtinPages, pages, cats } = useApp();
  const navigate = useNavigate();
  const p = builtinPages?.[slug] || pages?.find(pg => pg.slug === slug);
  if (!p) return <NotFoundPage />;
  const relatedCat = cats?.find(c => c.id === p.relatedCat);
  return (
    <div className="W" style={{ padding: '48px 28px 80px', maxWidth: 820 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--mu)', marginBottom: 20 }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span style={{ color: 'var(--tx)' }}>{p.title}</span>
      </div>
      {/* Header */}
      <div style={{ marginBottom: 36, paddingBottom: 24, borderBottom: '1px solid var(--bd)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 10 }}>
          {slug === 'shipping' ? 'Shipping & Delivery' : slug === 'returns' ? 'Returns & Refunds' : slug === 'faq' ? 'Help Center' : slug === 'terms' ? 'Legal' : slug === 'turnaround' ? 'Production Times' : 'Nexa Customs'}
        </div>
        <h1 className="D" style={{ fontSize: 'clamp(30px,4.4vw,52px)', marginBottom: 10, lineHeight: 1.1 }}>{p.title}</h1>

      </div>
      {/* Body */}
      {(p.body || p.content) && renderBody(p.body || p.content)}
      {p.faqs && p.faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
      {/* Related products CTA — turns a blog reader into a buyer */}
      {relatedCat && (
        <div style={{ marginTop: 40, padding: '22px 26px', background: 'linear-gradient(135deg, rgba(249,115,22,.1), rgba(249,115,22,.03))', border: '1px solid rgba(249,115,22,.25)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 6 }}>Ready to order?</div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Shop {relatedCat.l} — free proof, fast turnaround</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/products/${relatedCat.id}`)}>Browse {relatedCat.l} →</button>
        </div>
      )}
      {/* Footer CTA */}
      <div style={{ marginTop: 24, padding: '20px 24px', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Have a question?</div>
          <div style={{ fontSize: 12, color: 'var(--mu)' }}>Our team is here to help Mon–Fri 10AM–8PM</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="tel:+14379979921" style={{ padding: '9px 18px', borderRadius: 8, background: 'var(--o)', color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}><span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 6 }}>{ICONS.phone(14)}</span>(437) 997-9921</a>
          <a href="mailto:info@nexacustoms.ca" style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--bd)', color: 'var(--tx)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}><span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 6 }}>{ICONS.mail(14)}</span>Email Us</a>
        </div>
      </div>
    </div>
  );
}

function CustomPageRoute() {
  const { slug } = useParams();
  return <PolicyPage slug={slug} />;
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
      <div style={{ display: "flex", justifyContent: "center", color: "var(--mu)" }}>{ICONS.search(56)}</div>
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
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center", color: "var(--mu)" }}>{ICONS.printer(44)}</div>
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
      // also refresh when Admin settings arrive and the product turns out to be hidden
      if (!curProd || curProd.id !== prod.id || !!curProd.disabled !== !!prod.disabled) setCurProd(prod);
    } else if (waited) {
      navigate('/products', { replace: true });
    }
  }, [productSlug, prods, waited]);

  if (!curProd && !waited) return <LoadingSpinner text="Loading product…" />;

  // Hidden in Admin: nobody can order it and search engines are told not to index it
  // (usePageSEO sets noindex for the same condition).
  const hidden = prods.find(p => p.id === productSlug);
  if (hidden?.disabled) return <ProductUnavailable prod={hidden} />;

  return <ProductDetailPage />;
}

function ProductUnavailable({ prod }) {
  const { cats } = useApp();
  const navigate = useNavigate();
  const cat = cats.find(c => c.id === prod.cat);
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14, padding: 40 }}>
      <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>This product is no longer available</h1>
      <p style={{ fontSize: 14, color: 'var(--mu)', maxWidth: 520, lineHeight: 1.6 }}>
        We have moved on from this item, but we can still help. Browse our other products or send us a quote request for something custom.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {cat && !cat.hidden && <button className="btn btn-primary" onClick={() => navigate(`/products/${cat.id}`)}>Browse {cat.l}</button>}
        <button className="btn btn-primary" onClick={() => navigate('/products')}>All Products</button>
        <button className="btn btn-ghost" onClick={() => navigate("/quote")}>Get a Quote</button>
      </div>
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
  usePageSEO();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!noNav && <header>
        <Topbar />
        <Navbar />
      </header>}
      <main style={{ flex: 1 }}>{children}</main>
      {!noNav && <Footer />}
      <Toast />
      <FloatingButtons />
    </div>
  );
}

// ── ROUTES ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <CookieBanner />
      <Routes>
        {/* Admin — no nav */}
        <Route path="/admin" element={<Layout noNav><AdminPage /></Layout>} />

        {/* Main pages */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:catSlug" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:catSlug/:productSlug" element={<Layout><ProductPageWrapper /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/order-confirmed" element={<Layout><SuccessPage /></Layout>} />
        <Route path="/order-status" element={<Layout><OrderStatusPage /></Layout>} />
        <Route path="/proof/:token" element={<Layout><ProofPage /></Layout>} />
        <Route path="/quote" element={<Layout><QuotePage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogIndexPage /></Layout>} />
        {getLocationPageSlugs().map(slug => (
          <Route key={slug} path={`/${slug}`} element={<Layout><LocationServicePage slug={slug} /></Layout>} />
        ))}

        {/* Policy pages */}
        <Route path="/faq" element={<Layout><PolicyPage slug="faq" /></Layout>} />
        <Route path="/shipping" element={<Layout><PolicyPage slug="shipping" /></Layout>} />
        <Route path="/returns" element={<Layout><PolicyPage slug="returns" /></Layout>} />
        <Route path="/terms" element={<Layout><PolicyPage slug="terms" /></Layout>} />
        <Route path="/privacy" element={<Layout><PolicyPage slug="privacy" /></Layout>} />
        <Route path="/turnaround" element={<Layout><PolicyPage slug="turnaround" /></Layout>} />
        <Route path="/about" element={<Layout><PolicyPage slug="about" /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><CustomPageRoute /></Layout>} />
        <Route path="/p/:slug" element={<Layout><CustomPageRoute /></Layout>} />

        {/* 404 */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </>
  );
}


// ── ERROR BOUNDARY ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40, background: '#0c0c0e', color: '#fff' }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center", color: "#f59e0b" }}>{ICONS.warning(56)}</div>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#888', maxWidth: 400, lineHeight: 1.7, marginBottom: 28 }}>
            We encountered an unexpected error. Please refresh the page or contact us at{' '}
            <a href="tel:+14379979921" style={{ color: '#f97316' }}>(437) 997-9921</a> if the problem persists.
          </p>
          <button onClick={() => window.location.reload()}
            style={{ padding: '12px 28px', background: '#f97316', color: '#000', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
    </ErrorBoundary>
  );
}
