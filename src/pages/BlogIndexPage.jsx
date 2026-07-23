import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Strip the site's lightweight markup down to plain text for a card excerpt.
function excerpt(content, max = 130) {
  if (!content) return '';
  const plain = content
    .replace(/^##\s?.*$/gm, '')
    .replace(/^>>>\s?/gm, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\|/g, ' ')
    .replace(/[-*_#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? plain.slice(0, max).trim() + '…' : plain;
}

// Pull the first embedded image out of a post's content, if it has one.
function leadImage(content) {
  const m = (content || '').match(/!\[[^\]]*\]\(([^)]+)\)/);
  return m ? m[1] : null;
}

// Small printer's registration-mark crosshair — corner accent for the hero.
function CropMark({ style }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', opacity: 0.35, ...style }}>
      <line x1="9" y1="0" x2="9" y2="18" stroke="var(--mu)" strokeWidth="1" />
      <line x1="0" y1="9" x2="18" y2="9" stroke="var(--mu)" strokeWidth="1" />
      <circle cx="9" cy="9" r="4.5" fill="none" stroke="var(--mu)" strokeWidth="1" />
    </svg>
  );
}

// Halftone-dot placeholder for posts without a hero image yet — an actual
// print-production technique, so it reads as on-brand rather than a generic
// stock-photo stand-in.
function HalftoneFill({ tall }) {
  return (
    <div style={{
      width: '100%', height: tall ? 220 : 130, borderRadius: 10,
      background: `radial-gradient(circle, rgba(249,115,22,.38) 1.6px, transparent 1.7px) 0 0/12px 12px, var(--s2)`,
      border: '1px solid var(--bd)', flexShrink: 0,
    }} />
  );
}

function PerfDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '2px 0' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sf)', border: '1px solid var(--bd)', marginLeft: -3 }} />
      <div style={{ flex: 1, borderTop: '1px dashed var(--bd)' }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sf)', border: '1px solid var(--bd)', marginRight: -3 }} />
    </div>
  );
}

export default function BlogIndexPage() {
  const { pages, cats } = useApp();
  const navigate = useNavigate();

  const posts = (pages || []).filter(p => p.nav !== false && p.content);
  const [featured, ...rest] = posts;

  return (
    <div className="W" style={{ padding: '48px 28px 90px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--mu)', marginBottom: 28 }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span style={{ color: 'var(--tx)' }}>Blog</span>
      </div>

      {/* Hero — framed like a proof sheet, with registration marks at the corners */}
      <div style={{ position: 'relative', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: '34px 32px', marginBottom: 44, background: 'var(--sf)' }}>
        <CropMark style={{ top: -9, left: -9 }} />
        <CropMark style={{ top: -9, right: -9 }} />
        <CropMark style={{ bottom: -9, left: -9 }} />
        <CropMark style={{ bottom: -9, right: -9 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--o)' }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--o)' }}>
            On the Press — Nexa Customs Blog
          </span>
        </div>
       <h1 className="D" style={{ fontSize: 'clamp(32px,4.6vw,54px)', marginBottom: 12, lineHeight: 1.05 }}>Guides from the shop floor</h1>
<p style={{ fontSize: 14, color: 'var(--mu)', maxWidth: 600, lineHeight: 1.7 }}>
  Materials, bylaws, and production notes written by the people running the press, not a content agency.
</p>

<h2 style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 700, marginTop: 20, marginBottom: 8, color: 'var(--fg)' }}>
  Print Tips, Design Guides & Business Branding Advice
</h2>
<p style={{ fontSize: 14, color: '#aaa', maxWidth: 620, lineHeight: 1.75, marginBottom: 0 }}>
  {'Real-world printing tips for GTA businesses from choosing the right paper stock to designing banners that convert. Written by the Nexa Customs team in Mississauga, covering '}
  <a href="/products" style={{ color: '#f90', textDecoration: 'none', fontWeight: 500 }}>
    business cards, vehicle wraps, signs, and stickers
  </a>
  {' so you get better print results every time.'}
</p>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}></div>
      ) : (
        <>
          {/* Featured — most recent post gets a wide treatment */}
          {featured && (
            <div
              onClick={() => navigate('/blog/' + featured.slug)}
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: 26, background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 24, marginBottom: 32, cursor: 'pointer', transition: 'border-color .15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--o)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bd)'}
            >
              {leadImage(featured.content)
                ? <img src={leadImage(featured.content)} alt="" style={{ width: '100%', height: '100%', minHeight: 200, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--bd)' }} />
                : <HalftoneFill tall />}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--o)', border: '1px solid rgba(249,115,22,.35)', borderRadius: 5, padding: '2px 7px' }}>Latest</span>
                  {cats?.find(c => c.id === featured.relatedCat) && (
                    <span style={{ fontSize: 11, color: 'var(--mu)' }}>{cats.find(c => c.id === featured.relatedCat).l}</span>
                  )}
                </div>
                <div className="D" style={{ fontSize: 'clamp(22px,2.6vw,30px)', lineHeight: 1.15 }}>{featured.title}</div>
                <p style={{ fontSize: 13.5, color: 'var(--mu)', lineHeight: 1.7 }}>{excerpt(featured.content, 190)}</p>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--o)' }}>Read guide →</div>
              </div>
            </div>
          )}

          {/* Rest of the posts — ticket-style cards with a perforated tear-line */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {rest.map(p => {
              const cat = cats?.find(c => c.id === p.relatedCat);
              const img = leadImage(p.content);
              return (
                <div
                  key={p.slug}
                  onClick={() => navigate('/blog/' + p.slug)}
                  style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color .15s, transform .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--o)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {img
                    ? <img src={img} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--bd)' }} />
                    : <HalftoneFill />}

                  {cat && (
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--o)' }}>{cat.l}</div>
                  )}
                  <div className="D" style={{ fontSize: 18, lineHeight: 1.25 }}>{p.title}</div>
                  <p style={{ fontSize: 12.5, color: 'var(--mu)', lineHeight: 1.6, flex: 1 }}>{excerpt(p.content)}</p>

                  <PerfDivider />
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--o)' }}>Read guide →</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
