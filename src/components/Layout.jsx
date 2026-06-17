import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ── TOPBAR ────────────────────────────────────────────────────────────────────
export function Topbar() {
  const { store } = useApp();
  return (
    <div style={{ background: 'var(--sf)', borderBottom: '1px solid var(--bd)', height: 34, display: 'flex', alignItems: 'center' }}>
      <div className="W" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--mu)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gr)', animation: 'pls 2s infinite' }} />
          Same-Day Pickup Available — Mississauga
        </div>
        <a href={`tel:+${store.phone_raw}`} style={{ fontSize: 11, color: 'var(--o)', fontWeight: 600 }}>
          📞 {store.phone}
        </a>
      </div>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'quote', label: 'Get a Quote' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const { cart, store } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const count = cart.length;

  const URL_MAP = { 'home':'/', 'products':'/products', 'cart':'/cart', 'checkout':'/checkout', 'success':'/order-confirmed', 'quote':'/quote', 'contact':'/contact', 'admin':'/admin', 'faq':'/faq', 'shipping':'/shipping', 'returns':'/returns', 'terms':'/terms', 'turnaround':'/turnaround', 'order-status':'/order-status', 'privacy':'/privacy' };
  function navGo(p) { setOpen(false); document.body.style.overflow = ''; navigate(URL_MAP[p] || '/'+p); }
  function toggleHam() { setOpen(o => { document.body.style.overflow = !o ? 'hidden' : ''; return !o; }); }

  const Logo = () => (
    <div onClick={() => navGo('home')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
      <div style={{
        width: 40, height: 40, background: store.logo_img ? 'transparent' : 'var(--o)',
        clipPath: store.logo_img ? 'none' : 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 16, color: '#000',
        flexShrink: 0, borderRadius: store.logo_img ? 8 : 0, overflow: 'hidden',
      }}>
        {store.logo_img ? <img src={store.logo_img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : (store.logo_text || 'N')}
      </div>
      <div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '.05em' }}>{store.name}</div>
        <div style={{ fontSize: 10, color: 'var(--mu)', letterSpacing: '.1em', marginTop: -2 }}>{store.tagline}</div>
      </div>
    </div>
  );

  return (
    <>
      <nav style={{ background: 'rgba(12,12,14,.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--bd)', position: 'sticky', top: 0, zIndex: 300 }}>
        <div className="W" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desk-nav">
            {NAV.map(l => (
              <span key={l.id} onClick={() => navGo(l.id)} style={{
                padding: '8px 13px', fontSize: 13, fontWeight: 500, borderRadius: 7, transition: 'all .15s', cursor: 'pointer',
                color: location.pathname === (l.id === 'home' ? '/' : '/'+l.id) ? 'var(--tx)' : 'var(--mu)',
                background: location.pathname === (l.id === 'home' ? '/' : '/'+l.id) ? 'var(--s2)' : 'transparent',
              }}>{l.label}</span>
            ))}
          </div>
          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div onClick={() => navGo('cart')} style={{
              position: 'relative', width: 38, height: 38, background: 'var(--s2)',
              border: '1px solid var(--bd)', borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 17, cursor: 'pointer', transition: 'border-color .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--o)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bd)'}
            >
              🛒
              {count > 0 && <div style={{ position: 'absolute', top: -7, right: -7, background: 'var(--o)', color: '#000', fontSize: 10, fontWeight: 800, width: 19, height: 19, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</div>}
            </div>
            <button onClick={() => navGo('checkout')} className="btn btn-primary" style={{ fontSize: 12, padding: '9px 16px' }} id="ck-btn-desk">Order Now</button>
            {/* Ham */}
            <button onClick={toggleHam} style={{ display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 8, borderRadius: 7, background: 'var(--s2)', border: '1px solid var(--bd)' }} className="ham-btn">
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 20, height: 2, background: 'var(--tx)', borderRadius: 2, transition: 'all .25s', ...(open ? [{ transform: 'rotate(45deg) translate(5px,5px)' }, { opacity: 0 }, { transform: 'rotate(-45deg) translate(5px,-5px)' }][i] : {}) }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mob-nav${open ? ' open' : ''}`}>
        <span onClick={toggleHam} style={{ position: 'absolute', top: 20, right: 24, fontSize: 26, color: 'var(--mu)', cursor: 'pointer', padding: 10 }}>✕</span>
        {NAV.map(l => (
          <span key={l.id} onClick={() => navGo(l.id)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'clamp(28px,8vw,48px)', textTransform: 'uppercase', color: 'var(--tx)', padding: '10px 40px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--o)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--tx)'}
          >{l.label}</span>
        ))}
        <button onClick={() => navGo('cart')} style={{ marginTop: 16, background: 'var(--o)', color: '#000', padding: '11px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', border: 'none', fontFamily: "'DM Sans',sans-serif" }}>
          🛒 Cart {count > 0 && `(${count})`}
        </button>
      </div>

      <style>{`
        .desk-nav { display: flex; }
        .ham-btn { display: none; }
        #ck-btn-desk { display: inline-flex; }
        @media(max-width:1060px) { .desk-nav { display:none !important; } .ham-btn { display:flex !important; } #ck-btn-desk { display:none !important; } }
      `}</style>
    </>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  ['All Products','products'],['Get a Quote','quote'],['FAQ','faq'],
  ['Turnaround Time','turnaround'],['Shipping Policy','shipping'],
  ['Return Policy','returns'],['Terms & Conditions','terms'],['Contact Us','contact'],
];

export function Footer() {
  const { store, cats } = useApp();
  const navigate = useNavigate();
  function go(p) {
    const map = { home:'/', products:'/products', cart:'/cart', checkout:'/checkout', quote:'/quote', contact:'/contact', admin:'/admin', faq:'/faq', shipping:'/shipping', returns:'/returns', terms:'/terms', turnaround:'/turnaround', about:'/about', 'order-status':'/order-status', 'privacy':'/privacy' };
    navigate(map[p] || '/' + p);
  }
  const GTA = ['Mississauga','Toronto','Brampton','Oakville','Burlington','Vaughan','Markham','Richmond Hill','Etobicoke','North York','Scarborough','Milton','Georgetown','Pickering','Ajax','Hamilton'];
  return (
    <footer style={{ background: 'var(--dk)', borderTop: '1px solid var(--bd)', padding: '54px 0 0' }}>
      <div className="W">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.3fr', gap: 44, marginBottom: 36 }} className="ft-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 13 }}>
              <div style={{ width: 36, height: 36, background: store.logo_img ? 'transparent' : 'var(--o)', clipPath: store.logo_img ? 'none' : 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 14, color: '#000', flexShrink: 0, borderRadius: store.logo_img ? 8 : 0, overflow: 'hidden' }}>
                {store.logo_img ? <img src={store.logo_img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : (store.logo_text || 'N')}
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '.05em' }}>{store.name}</div>
                <div style={{ fontSize: 10, color: 'var(--mu)', letterSpacing: '.1em' }}>{store.tagline}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.78, maxWidth: 265, marginBottom: 6 }}>GTA trusted print partner since 2010. Quality, fast turnaround, unbeatable prices.</p>
            <p style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.7, maxWidth: 265, marginBottom: 16 }}>📍 Free pickup in Mississauga · 🇨🇦 Ships Canada-wide</p>
            <div style={{ display: 'flex', gap: 7 }}>
              {[['IG', store.social_ig], ['fb', store.social_fb]].filter(([,h]) => h).map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer" style={{ width: 33, height: 33, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mu)', fontSize: 11, fontWeight: 800 }}>{l}</a>
              ))}
            </div>
          </div>
          {/* Products */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 12 }}>Products</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {cats.slice(0, 8).map(c => (
                <li key={c.id} onClick={() => navigate('/products/' + c.id)} style={{ fontSize: 12, color: 'var(--mu)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--tx)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--mu)'}
                >{c.l}</li>
              ))}
            </ul>
          </div>
          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 12 }}>Quick Links</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[['Home','home'],['All Products','products'],['Get a Quote','quote'],['Track Order','order-status'],['About Us','about'],['Contact Us','contact'],['FAQ','faq'],['Turnaround Times','turnaround'],['Shipping Policy','shipping']].map(([l, p]) => (
                <li key={l} onClick={() => go(p)} style={{ fontSize: 12, color: 'var(--mu)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--tx)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--mu)'}
                >{l}</li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 12 }}>Contact</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', gap: 9 }}><span style={{ color: 'var(--o)' }}>📍</span><span>{store.address}<br />{store.city}</span></li>
              <li style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', gap: 9 }}><span style={{ color: 'var(--o)' }}>📞</span><a href={'tel:+' + store.phone_raw} style={{ color: 'var(--mu)' }}>{store.phone}</a></li>
              <li style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', gap: 9 }}><span style={{ color: 'var(--o)' }}>✉️</span><span>{store.email}</span></li>
            </ul>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--o)', marginTop: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>Hours</div>
            <div style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{store.hours}</div>
          </div>
        </div>

        {/* GTA Cities — SEO row */}
        <div style={{ borderTop: '1px solid var(--bd)', padding: '16px 0' }}>
          <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 7, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Serving GTA — Free Pickup · Canada-Wide Shipping</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {GTA.map((city, i) => (
              <span key={city} style={{ fontSize: 11, color: 'var(--mu)' }}>
                {i > 0 && <span style={{ color: 'var(--bd)', margin: '0 5px' }}>·</span>}
                {city}
              </span>
            ))}
            <span style={{ fontSize: 11, color: 'var(--mu)' }}><span style={{ color: 'var(--bd)', margin: '0 5px' }}>·</span>All of Canada</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--bd)', padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--mu)', flexWrap: 'wrap', gap: 10 }}>
          <span>{store.footer_copy}</span>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['Terms','terms'],['Privacy','privacy'],['Shipping','shipping'],['Returns','returns'],['FAQ','faq'],['About','about'],['Contact','contact']].map(([l, p]) => (
              <span key={l} onClick={() => go(p)} style={{ cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--tx)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--mu)'}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:1060px){.ft-grid{grid-template-columns:1fr 1fr !important;gap:28px !important}}
        @media(max-width:640px){.ft-grid{grid-template-columns:1fr !important}}
      `}</style>
    </footer>
  );
}

// ── FLOATING BUTTONS (WhatsApp + Back to Top) ──────────────────────────────────
export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const btnBase = { position: 'fixed', right: 20, width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 20px rgba(0,0,0,.35)', zIndex: 999, transition: 'transform .2s', textDecoration: 'none' };
  return (
    <>
      <a href="https://wa.me/14379979921?text=Hi%20Nexa%20Customs%2C%20I%20have%20a%20print%20inquiry"
        target="_blank" rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{ ...btnBase, bottom: showTop ? 86 : 24, background: '#25D366' }}
        onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          style={{ ...btnBase, bottom: 24, background: 'var(--o)', color: '#000', fontWeight: 900, fontSize: 18 }}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
          ↑
        </button>
      )}
    </>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div id="toast">{toast}</div>;
}
