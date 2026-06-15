import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Topbar, Navbar, Footer, Toast } from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductCard from './components/ProductCard';
import AdminPage from './pages/AdminPage';
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
  const { builtinPages, pages } = useApp();
  const p = builtinPages?.[slug] || pages?.find(pg => pg.slug === slug);
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
        <Route path="/turnaround" element={<Layout><PolicyPage slug="turnaround" /></Layout>} />
        <Route path="/about" element={<Layout><PolicyPage slug="about" /></Layout>} />
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
