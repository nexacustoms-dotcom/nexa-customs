// Turns the plain text you type in Admin → Pages into formatted page content.
//
//   # Main heading            ## Section heading        ### Sub-heading        #### Small heading
//   **bold**                  *italic*                  [link text](https://example.com)
//   - bullet item             1. numbered item          ---  (a divider line)
//   >>> highlighted box      ![Image](https://…)       | table | rows |
//
// Blank lines separate blocks. Nothing here can run scripts: text is always escaped by React and
// links are limited to https, http, mailto, tel, on-site (/…) and #anchors.

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
const INLINE = /\*\*([^*\n]+?)\*\*|\*([^*\s][^*\n]*?)\*|\[([^\]\n]+)\]\((\S+?)\)/g;

export function renderInline(text) {
  const str = String(text ?? '');
  const out = [];
  let last = 0, k = 0, m;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(str)) !== null) {
    if (m.index > last) out.push(str.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={k++} style={{ color: 'var(--tx)', fontWeight: 700 }}>{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      out.push(<em key={k++}>{m[2]}</em>);
    } else if (SAFE_HREF.test(m[4])) {
      const external = !(m[4].startsWith('mailto:') || m[4].startsWith('tel:') || m[4].startsWith('/') || m[4].startsWith('#'));
      out.push(<a key={k++} href={m[4]} target={external ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: 'var(--o)', textDecoration: 'underline' }}>{m[3]}</a>);
    } else {
      out.push(m[0]);   // unsafe link address: show it as plain text instead of making it clickable
    }
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}

const HEADING = { 1: { tag: 'h2', size: 34, top: 44, border: false }, 2: { tag: 'h2', size: 24, top: 36, border: true }, 3: { tag: 'h3', size: 19, top: 28, border: false }, 4: { tag: 'h4', size: 16, top: 22, border: false } };

export function renderBody(text) {
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];                     // [{ type, ...}]
  let para = [], list = null, table = null, callout = null;

  const flush = () => {
    if (para.length) { blocks.push({ type: 'p', text: para.join('\n') }); para = []; }
    if (list) { blocks.push(list); list = null; }
    if (table) { blocks.push({ type: 'table', rows: table }); table = null; }
    if (callout) { blocks.push({ type: 'callout', text: callout.join('\n') }); callout = null; }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { flush(); continue; }

    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) { flush(); blocks.push({ type: 'h', level: h[1].length, text: h[2].trim() }); continue; }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { flush(); blocks.push({ type: 'hr' }); continue; }

    const img = line.trim().match(/^!\[([^\]]*)\]\((\S+)\)$/);
    if (img) { flush(); blocks.push({ type: 'img', alt: img[1], src: img[2] }); continue; }

    if (line.startsWith('>>> ')) { flush(); callout = [line.slice(4)]; continue; }
    if (callout) { callout.push(line); continue; }

    if (line.trim().startsWith('|')) {
      if (para.length || list) flush();
      (table = table || []).push(line);
      continue;
    }
    if (table) flush();

    const ul = line.match(/^\s*[-*•]\s+(.+)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ul || ol) {
      const ordered = !!ol;
      if (para.length) flush();
      if (list && list.ordered !== ordered) flush();
      list = list || { type: 'list', ordered, items: [] };
      list.items.push((ul || ol)[1]);
      continue;
    }
    if (list) flush();
    para.push(line);
  }
  flush();

  return blocks.map((b, i) => {
    switch (b.type) {
      case 'h': {
        const c = HEADING[b.level]; const Tag = c.tag;
        return <Tag key={i} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: c.size, lineHeight: 1.15, marginTop: c.top, marginBottom: 14, color: 'var(--tx)', ...(c.border ? { paddingBottom: 8, borderBottom: '1px solid var(--bd)' } : {}) }}>{renderInline(b.text)}</Tag>;
      }
      case 'hr': return <hr key={i} style={{ border: 0, borderTop: '1px solid var(--bd)', margin: '28px 0' }} />;
      case 'img': return <img key={i} src={b.src} alt={b.alt} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 14, border: '1px solid var(--bd)', boxShadow: '0 8px 24px rgba(0,0,0,.18)', marginBottom: 20 }} />;
      case 'callout': return <div key={i} style={{ padding: '14px 18px', background: 'rgba(249,115,22,.06)', borderLeft: '3px solid var(--o)', borderRadius: '0 8px 8px 0', marginBottom: 16, fontSize: 13, color: 'var(--mu)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{renderInline(b.text)}</div>;
      case 'list': {
        const Tag = b.ordered ? 'ol' : 'ul';
        return <Tag key={i} style={{ margin: '0 0 18px', paddingLeft: 24, fontSize: 14, color: 'var(--mu)', lineHeight: 1.85 }}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{renderInline(it)}</li>)}</Tag>;
      }
      case 'table': {
        const body = b.rows.filter(l => l.trim() && !/^\s*\|[\s:|-]+\|?\s*$/.test(l));
        return (
          <div key={i} style={{ overflowX: 'auto', marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <tbody>
                {body.map((row, ri) => {
                  const cells = row.split('|').filter(c => c.trim());
                  return (
                    <tr key={ri} style={{ borderBottom: '1px solid var(--bd)', background: ri === 0 ? 'var(--s2)' : 'transparent' }}>
                      {cells.map((cell, ci) => ri === 0
                        ? <th key={ci} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--mu)' }}>{renderInline(cell.trim())}</th>
                        : <td key={ci} style={{ padding: '10px 14px', color: ci === 0 ? 'var(--tx)' : 'var(--mu)' }}>{renderInline(cell.trim())}</td>)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      default: {
        const lede = i === 0;       // an opening paragraph is shown a little larger, like an article intro
        return <p key={i} style={{ fontSize: lede ? 16 : 14, color: lede ? 'var(--tx)' : 'var(--mu)', lineHeight: 1.85, marginBottom: 16, whiteSpace: 'pre-line', fontWeight: lede ? 500 : 400 }}>{renderInline(b.text)}</p>;
      }
    }
  });
}
