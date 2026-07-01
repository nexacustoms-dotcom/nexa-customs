import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar, Navbar, Footer, Toast, FloatingButtons } from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductCard from './components/ProductCard';
import AdminPage from './pages/AdminPage';
import { CartPage, CheckoutPage, SuccessPage, QuotePage, ContactPage, OrderStatusPage } from './pages/TransactionalPages';
import { usePageSEO } from './hooks/usePageSEO';

// ── COMPONENTS ────────────────────────────────────────────────────────────────
// Parses [text](url) into a real clickable link inside paragraph text.
// Everything else in the paragraph is left as plain text.
function renderInlineLinks(text) {
  const re = /\[([^\]]+)\]\((\S+?)\)/g;
  const parts = [];
  let last = 0, m, i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<a key={i++} href={m[2]} target={m[2].startsWith('mailto:') || m[2].startsWith('tel:') ? undefined : '_blank'} rel="noopener noreferrer" style={{ color: 'var(--o)', textDecoration: 'underline' }}>{m[1]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

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
  const { builtinPages, pages } = useApp();
  const p = builtinPages?.[slug] || pages?.find(pg => pg.slug === slug);
  if (!p) return <NotFoundPage />;
  return (
    <div className="W" style={{ padding: '48px 28px 80px', maxWidth: 820 }}>
      {/* Header */}
      <div style={{ marginBottom: 36, paddingBottom: 24, borderBottom: '1px solid var(--bd)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 10 }}>
          {slug === 'shipping' ? 'Shipping & Delivery' : slug === 'returns' ? 'Returns & Refunds' : slug === 'faq' ? 'Help Center' : slug === 'terms' ? 'Legal' : slug === 'turnaround' ? 'Production Times' : 'Nexa Customs'}
        </div>
        <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,48px)', marginBottom: 10 }}>{p.title}</h1>
        <p style={{ fontSize: 13, color: 'var(--mu)' }}>Last updated: June 2026 · Nexa Customs Inc. · Mississauga, Ontario</p>
      </div>
      {/* Body */}
      {(p.body || p.content) && (p.body || p.content).split('\n\n').map((para, i) => {
        // Section header: lines starting with ##
        if (para.startsWith('## ')) {
          return <h2 key={i} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, marginTop: 32, marginBottom: 12, color: 'var(--tx)', paddingBottom: 8, borderBottom: '1px solid var(--bd)' }}>{para.slice(3)}</h2>;
        }
        // Image: a paragraph that is just ![alt text](image url)
        const imgMatch = para.trim().match(/^!\[([^\]]*)\]\((\S+)\)$/);
        if (imgMatch) {
          return <img key={i} src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--bd)', marginBottom: 20 }} />;
        }
        // Info box: lines starting with >>>
        if (para.startsWith('>>> ')) {
          return <div key={i} style={{ padding: '14px 18px', background: 'rgba(249,115,22,.06)', borderLeft: '3px solid var(--o)', borderRadius: '0 8px 8px 0', marginBottom: 16, fontSize: 13, color: 'var(--mu)', lineHeight: 1.8 }}>{para.slice(4)}</div>;
        }
        // Table rows: lines starting with |
        if (para.includes('\n') && para.split('\n').every(l => l.trim().startsWith('|'))) {
          const rows = para.split('\n').filter(l => l.trim() && !l.includes('---'));
          return (
            <div key={i} style={{ overflowX: 'auto', marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                {rows.map((row, ri) => {
                  const cells = row.split('|').filter(c => c.trim());
                  const isHeader = ri === 0;
                  return (
                    <tr key={ri} style={{ borderBottom: '1px solid var(--bd)', background: isHeader ? 'var(--s2)' : 'transparent' }}>
                      {cells.map((cell, ci) => isHeader
                        ? <th key={ci} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--mu)' }}>{cell.trim()}</th>
                        : <td key={ci} style={{ padding: '10px 14px', color: ci === 0 ? 'var(--tx)' : 'var(--mu)' }}>{cell.trim()}</td>
                      )}
                    </tr>
                  );
                })}
              </table>
            </div>
          );
        }
        return <p key={i} style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.85, marginBottom: 16, whiteSpace: 'pre-line' }}>{renderInlineLinks(para)}</p>;
      })}
      {p.faqs && p.faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
      {/* Footer CTA */}
      <div style={{ marginTop: 48, padding: '20px 24px', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Have a question?</div>
          <div style={{ fontSize: 12, color: 'var(--mu)' }}>Our team is here to help Mon–Fri 9AM–6PM</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="tel:+14379979921" style={{ padding: '9px 18px', borderRadius: 8, background: 'var(--o)', color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>📞 (437) 997-9921</a>
          <a href="mailto:info@nexacustoms.ca" style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--bd)', color: 'var(--tx)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>✉️ Email Us</a>
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
      {!noNav && <Topbar />}
      {!noNav && <Navbar />}
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
        <Route path="/quote" element={<Layout><QuotePage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

        {/* Policy pages */}
        <Route path="/faq" element={<Layout><PolicyPage slug="faq" /></Layout>} />
        <Route path="/shipping" element={<Layout><PolicyPage slug="shipping" /></Layout>} />
        <Route path="/returns" element={<Layout><PolicyPage slug="returns" /></Layout>} />
        <Route path="/terms" element={<Layout><PolicyPage slug="terms" /></Layout>} />
        <Route path="/privacy" element={<Layout><PolicyPage slug="privacy" /></Layout>} />
        <Route path="/turnaround" element={<Layout><PolicyPage slug="turnaround" /></Layout>} />
        <Route path="/about" element={<Layout><PolicyPage slug="about" /></Layout>} />
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
          <div style={{ fontSize: 64, marginBottom: 20 }}>⚠️</div>
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
