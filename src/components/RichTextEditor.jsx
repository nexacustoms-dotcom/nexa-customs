import { useRef, useState } from 'react';

// A text box with a formatting toolbar. It only inserts the simple codes the website understands
// (see src/lib/richText.jsx), so nothing needs to be memorised.

const stripHeading = l => l.replace(/^#{1,4}\s+/, '');

export default function RichTextEditor({ value, onChange, rows = 14, extra = null }) {
  const ref = useRef(null);
  const [help, setHelp] = useState(false);
  const text = value || '';

  function run(fn) {
    const ta = ref.current; if (!ta) return;
    const res = fn(text, ta.selectionStart, ta.selectionEnd);
    onChange(res.text);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(res.start, res.end); });
  }

  // **bold** / *italic* around the selection (click again to remove it)
  const wrap = (mark, placeholder) => () => run((t, s, e) => {
    const sel = t.slice(s, e);
    if (sel && t.slice(s - mark.length, s) === mark && t.slice(e, e + mark.length) === mark) {
      return { text: t.slice(0, s - mark.length) + sel + t.slice(e + mark.length), start: s - mark.length, end: e - mark.length };
    }
    const inner = sel || placeholder;
    return { text: t.slice(0, s) + mark + inner + mark + t.slice(e), start: s + mark.length, end: s + mark.length + inner.length };
  });

  // Apply to every line touched by the selection
  const lines = fn => () => run((t, s, e) => {
    const a = t.lastIndexOf('\n', s - 1) + 1;
    let b = t.indexOf('\n', e); if (b === -1) b = t.length;
    const out = fn(t.slice(a, b).split('\n')).join('\n');
    return { text: t.slice(0, a) + out + t.slice(b), start: a, end: a + out.length };
  });

  const heading = level => lines(ls => {
    const mark = '#'.repeat(level) + ' ';
    const allSame = ls.filter(l => l.trim()).every(l => l.startsWith(mark));
    return ls.map(l => (l.trim() ? (allSame ? stripHeading(l) : mark + stripHeading(l)) : l));
  });
  const bullets = lines(ls => {
    const all = ls.filter(l => l.trim()).every(l => /^\s*[-*•]\s+/.test(l));
    return ls.map(l => (l.trim() ? (all ? l.replace(/^\s*[-*•]\s+/, '') : '- ' + l.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '')) : l));
  });
  const numbers = lines(ls => {
    const all = ls.filter(l => l.trim()).every(l => /^\s*\d+[.)]\s+/.test(l));
    let n = 0;
    return ls.map(l => (l.trim() ? (all ? l.replace(/^\s*\d+[.)]\s+/, '') : `${++n}. ` + l.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '')) : l));
  });
  const box = lines(ls => {
    const all = ls.filter(l => l.trim()).every(l => l.startsWith('>>> '));
    return ls.map(l => (l.trim() ? (all ? l.slice(4) : '>>> ' + l) : l));
  });
  const link = () => run((t, s, e) => {
    const sel = t.slice(s, e) || 'link text';
    const ins = `[${sel}](https://)`;
    const urlStart = s + sel.length + 3;
    return { text: t.slice(0, s) + ins + t.slice(e), start: urlStart, end: urlStart + 8 };
  });
  const divider = () => run((t, s, e) => {
    const ins = '\n\n---\n\n';
    return { text: t.slice(0, s) + ins + t.slice(e), start: s + ins.length, end: s + ins.length };
  });

  const btn = { fontSize: 12, padding: '5px 9px', minWidth: 34 };
  const B = ({ onClick, title, children, style }) => (
    <button type="button" className="abtn" title={title} aria-label={title} onMouseDown={e => e.preventDefault()} onClick={onClick} style={{ ...btn, ...style }}>{children}</button>
  );

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 8 }}>
        <B onClick={wrap('**', 'bold text')} title="Bold (select text first)" style={{ fontWeight: 800 }}>B</B>
        <B onClick={wrap('*', 'italic text')} title="Italic" style={{ fontStyle: 'italic' }}>I</B>
        <span style={{ width: 1, height: 20, background: 'var(--bd)' }} />
        <B onClick={heading(1)} title="Main heading (largest)">H1</B>
        <B onClick={heading(2)} title="Section heading">H2</B>
        <B onClick={heading(3)} title="Sub-heading">H3</B>
        <B onClick={heading(4)} title="Small heading">H4</B>
        <span style={{ width: 1, height: 20, background: 'var(--bd)' }} />
        <B onClick={bullets} title="Bullet list">• List</B>
        <B onClick={numbers} title="Numbered list">1. List</B>
        <B onClick={link} title="Link">Link</B>
        <B onClick={box} title="Highlighted box">Box</B>
        <B onClick={divider} title="Divider line">—</B>
        {extra}
        <button type="button" className="abtn" onClick={() => setHelp(h => !h)} style={{ ...btn, marginLeft: 'auto' }}>{help ? 'Hide help' : 'Formatting help'}</button>
      </div>

      {help && (
        <div style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--mu)', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, padding: '10px 14px', marginBottom: 10 }}>
          <div><strong style={{ color: 'var(--tx)' }}>Bold:</strong> select the words and click <b>B</b>, or type <code>**like this**</code></div>
          <div><strong style={{ color: 'var(--tx)' }}>Headings:</strong> click a line, then H1, H2 or H3, or start the line with <code># </code> <code>## </code> <code>### </code> (one #, two ## or three ###). The page title at the top is already the main H1 of the page.</div>
          <div><strong style={{ color: 'var(--tx)' }}>Lists:</strong> start lines with <code>- </code> for bullets or <code>1. </code> for numbers</div>
          <div><strong style={{ color: 'var(--tx)' }}>Link:</strong> <code>[words to click](https://example.com)</code> · phone: <code>[Call us](tel:+14379979921)</code> · email: <code>[Email](mailto:info@nexacustoms.ca)</code></div>
          <div><strong style={{ color: 'var(--tx)' }}>Highlighted box:</strong> start a line with <code>&gt;&gt;&gt; </code> · <strong style={{ color: 'var(--tx)' }}>Divider:</strong> a line with just <code>---</code></div>
          <div><strong style={{ color: 'var(--tx)' }}>Paragraphs:</strong> leave one blank line between them</div>
        </div>
      )}

      <textarea ref={ref} className="ainp" rows={rows} style={{ resize: 'vertical', lineHeight: 1.6, fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 13 }}
        value={text} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
