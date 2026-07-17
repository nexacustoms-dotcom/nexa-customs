import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Strip the site's lightweight markup (## headings, >>> callouts, image/table
// syntax) down to plain text for a short card excerpt.
function excerpt(content, max = 150) {
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

export default function BlogIndexPage() {
  const { pages, cats } = useApp();
  const navigate = useNavigate();

  // nav !== false: respects the existing "Show in footer navigation" toggle
  // in Admin as an opt-out, while treating unset (older pages) as visible.
  const posts = (pages || []).filter(p => p.nav !== false && p.content);

  return (
    <div className="W" style={{ padding: '48px 28px 80px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--mu)', marginBottom: 20 }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span style={{ color: 'var(--tx)' }}>Guides & Resources</span>
      </div>

      <div style={{ marginBottom: 36, paddingBottom: 24, borderBottom: '1px solid var(--bd)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 10 }}>
          Nexa Customs
        </div>
        <h1 className="D" style={{ fontSize: 'clamp(30px,4.4vw,52px)', marginBottom: 10, lineHeight: 1.1 }}>Guides & Resources</h1>
        <p style={{ fontSize: 14, color: 'var(--mu)', maxWidth: 640, lineHeight: 1.7 }}>
          Practical guides on print materials, sign regulations, and getting the most out of your order — written by the shop that prints it.
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}>
          No guides published yet — check back soon.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {posts.map(p => {
            const cat = cats?.find(c => c.id === p.relatedCat);
            return (
              <div
                key={p.slug}
                onClick={() => navigate('/p/' + p.slug)}
                style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color .15s, transform .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--o)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {cat && (
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--o)' }}>{cat.l}</div>
                )}
                <div className="D" style={{ fontSize: 19, lineHeight: 1.25 }}>{p.title}</div>
                <p style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.65, flex: 1 }}>{excerpt(p.content)}</p>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--o)' }}>Read guide →</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
