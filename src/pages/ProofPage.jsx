import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp, sendEmailJS, sendTelegram } from '../context/AppContext';
import { buildEmail, buildAlertEmail, alertRecipients } from '../lib/emailBuilder';

const fmtDate = d => (d ? new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');
const isPdf = u => /\.pdf(\?|$)/i.test(u || '');

export default function ProofPage() {
  const { token } = useParams();
  const { cfg, notify, store } = useApp();
  const [state, setState] = useState('loading');           // loading | ready | notfound | error
  const [proof, setProof] = useState(null);
  const [mode, setMode] = useState(null);                  // null | approve | changes
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);                  // { decision }

  async function rpc(fn, args) {
    const url = cfg.supaUrl(), key = cfg.supaKey();
    if (!url || !key) throw new Error('not configured');
    const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error('http ' + res.status);
    return res.json();
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const p = await rpc('get_proof', { p_token: token });
        if (!alive) return;
        if (!p || !p.order_number) { setState('notfound'); return; }
        setProof(p); setName(p.customer_name || ''); setState('ready');
      } catch { if (alive) setState('error'); }
    })();
    return () => { alive = false; };
  }, [token]);

  async function notifyEveryone(result, decision, typedName, typedNote) {
    try {
      const approved = decision === 'approved';
      const svc = cfg.ejsSvc(), ekey = cfg.ejsKey(), statusTpl = cfg.ejsStatusTpl(), shopTpl = cfg.ejsTpl();
      const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
      const key = approved ? 'Proof Approved' : 'Changes Requested';

      // 1) thank-you email to the customer
      if (result.customer_email && svc && ekey && statusTpl && notify.messages[key]?.enabled !== false) {
        const built = buildEmail(notify, key, { order_number: result.order_number, order_date: today, customer_name: result.customer_name || typedName, customer_email: result.customer_email, total: null, note: typedNote, logoUrl: store?.logo_img || '' });
        sendEmailJS(svc, statusTpl, ekey, {
          to_email: result.customer_email, from_name: notify.brand.senderName || 'Nexa Customs', reply_to: notify.brand.replyTo || 'info@nexacustoms.ca',
          customer_name: result.customer_name || 'there', order_number: result.order_number, subject: built.subject, email_html: built.html,
          status_headline: built.headline, status_message: built.message, logo_url: store?.logo_img || '', order_date: today, order_total: '',
          items_html: '', breakdown_html: '', customer_info_html: '', tracking_line: '',
        }).catch(e => console.error('Proof confirmation email failed:', e.message));
      }

      // 2) alert to you (email + Telegram), unless switched off in Admin → Notifications
      if (notify.alerts.onProof !== false) {
        const title = `${approved ? 'Proof APPROVED' : 'Changes requested'} — ${result.order_number}`;
        const text = approved ? `${typedName} approved the proof.` : typedNote;
        const params = {
          to_email: alertRecipients(notify, cfg.ejsTo()), from_name: result.customer_name || typedName, from_email: result.customer_email || '', reply_to: result.customer_email || '',
          customer_name: result.customer_name || typedName, customer_email: result.customer_email || '', order_number: result.order_number,
          decision: approved ? `Approved by ${typedName}` : 'Changes requested', notes: text, message: text, subject: title,
        };
        params.email_html = buildAlertEmail(title, params, notify);
        if (svc && shopTpl && ekey) sendEmailJS(svc, shopTpl, ekey, params).catch(e => console.error('Proof alert email failed:', e.message));
        const tok = cfg.tgToken(), cid = cfg.tgChat();
        if (tok && cid) sendTelegram(tok, cid, `📝 ${title}\nCustomer: ${params.customer_name}${approved ? '' : '\nWhat they want changed: ' + typedNote}`);
      }
    } catch (e) { console.error('Proof notifications failed:', e); }
  }

  async function submit(decision) {
    setError('');
    if (decision === 'approved' && (name.trim().length < 2 || !checked)) { setError('Please type your name and tick the box to approve.'); return; }
    if (decision === 'changes_requested' && note.trim().length < 3) { setError('Please tell us what you would like changed.'); return; }
    setBusy(true);
    try {
      const r = await rpc('submit_proof', { p_token: token, p_decision: decision, p_name: name.trim(), p_note: decision === 'changes_requested' ? note.trim() : '' });
      if (!r?.ok) {
        const e = r?.error;
        if (e === 'approved' || e === 'changes_requested') setError('A decision has already been recorded for this proof.');
        else if (e === 'superseded') setError('A newer proof has been sent to you. Please use the link in the latest email.');
        else if (e === 'name_required') setError('Please type your name to approve.');
        else if (e === 'note_required') setError('Please tell us what you would like changed.');
        else setError('Sorry, we could not record that. Please reply to your proof email instead.');
        setBusy(false); return;
      }
      setDone({ decision });
      notifyEveryone(r, decision, name.trim() || r.customer_name || 'Customer', note.trim());
    } catch {
      setError('Connection problem. Please check your internet and try again, or reply to your proof email.');
    }
    setBusy(false);
  }

  const card = { background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl, 14px)', padding: 22 };
  const phone = store?.phone || '(437) 997-9921';
  const btn = { padding: '13px 22px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' };

  if (state === 'loading') return <div className="W" style={{ padding: '70px 0', textAlign: 'center', color: 'var(--mu)' }}>Loading your proof…</div>;
  if (state === 'notfound' || state === 'error') {
    return (
      <div className="W" style={{ padding: '70px 0', maxWidth: 560, textAlign: 'center' }}>
        <h1 className="D" style={{ fontSize: 30, marginBottom: 12 }}>{state === 'notfound' ? 'We couldn’t find this proof' : 'This page isn’t available right now'}</h1>
        <p style={{ color: 'var(--mu)', lineHeight: 1.7 }}>The link may be incomplete or out of date. Please use the link in your most recent proof email, reply to that email, or call us at {phone}.</p>
      </div>
    );
  }

  const decided = proof.status === 'approved' || proof.status === 'changes_requested';
  const superseded = proof.status === 'superseded';

  return (
    <div className="W" style={{ padding: '36px 0 70px', maxWidth: 920 }}>
      <div style={{ fontSize: 12, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Order {proof.order_number}{proof.version > 1 ? ` · Proof version ${proof.version}` : ''}</div>
      <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 8 }}>Your proof{proof.customer_name ? `, ${String(proof.customer_name).split(' ')[0]}` : ''}</h1>
      <p style={{ color: 'var(--mu)', lineHeight: 1.7, maxWidth: 680, marginBottom: 22 }}>
        Please check it carefully: spelling, phone numbers and addresses, colours, sizes and image quality. When you’re happy, approve it below. If something needs to change, tell us exactly what and we’ll send a new proof.
      </p>

      {/* The proof itself */}
      <div style={{ ...card, padding: 14, marginBottom: 14, background: '#f3f3f1' }}>
        {isPdf(proof.file_url)
          ? <iframe title="Proof" src={proof.file_url} style={{ width: '100%', height: '72vh', minHeight: 420, border: 0, background: '#fff', display: 'block' }} />
          : <img src={proof.file_url} alt={`Proof for order ${proof.order_number}`} style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }} />}
      </div>
      <div style={{ fontSize: 13, marginBottom: 26 }}>
        <a href={proof.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--o)' }}>Open the proof full size ↗</a>
        <span style={{ color: 'var(--mu)' }}> · on a phone, use this link to zoom in</span>
      </div>

      {superseded && (
        <div style={{ ...card, borderColor: 'var(--o)' }} role="status">
          <strong>A newer proof has been sent for this order.</strong>
          <p style={{ color: 'var(--mu)', marginTop: 6, lineHeight: 1.7 }}>This proof has been replaced. Please use the link in the most recent email from us.</p>
        </div>
      )}

      {(decided || done) && (
        <div style={{ ...card, borderColor: (done?.decision || proof.status) === 'approved' ? '#22c55e' : 'var(--o)' }} role="status">
          {(done?.decision || proof.status) === 'approved' ? (
            <>
              <div className="D" style={{ fontSize: 24, marginBottom: 6 }}>✓ Proof approved</div>
              <p style={{ color: 'var(--mu)', lineHeight: 1.7 }}>
                {done ? 'Thank you. We’ve recorded your approval and will move your order into production. A confirmation is on its way to your email.'
                  : `Approved${proof.decided_name ? ' by ' + proof.decided_name : ''} on ${fmtDate(proof.decided_at)}. Your order is moving into production.`}
              </p>
            </>
          ) : (
            <>
              <div className="D" style={{ fontSize: 24, marginBottom: 6 }}>Changes requested</div>
              <p style={{ color: 'var(--mu)', lineHeight: 1.7 }}>
                {done ? 'Thank you. We’ve received your changes and will send you an updated proof.' : `Received on ${fmtDate(proof.decided_at)}. We’ll send you an updated proof.`}
              </p>
              {(proof.note || note) && <blockquote style={{ margin: '12px 0 0', padding: '10px 14px', borderLeft: '3px solid var(--o)', background: 'var(--s2)', color: 'var(--tx)', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 14 }}>{proof.note || note}</blockquote>}
            </>
          )}
          <p style={{ color: 'var(--mu)', fontSize: 13, marginTop: 14 }}>Need to add something? Reply to your email or call {phone}.</p>
        </div>
      )}

      {!decided && !done && !superseded && (
        <div style={card}>
          {!mode && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => { setMode('approve'); setError(''); }} style={{ ...btn, background: '#16a34a', color: '#fff', border: '1px solid #16a34a', flex: '1 1 240px' }}>✓ Approve this proof</button>
              <button onClick={() => { setMode('changes'); setError(''); }} style={{ ...btn, background: 'transparent', color: 'var(--tx)', border: '1px solid var(--bd)', flex: '1 1 240px' }}>✎ I need changes</button>
            </div>
          )}

          {mode === 'approve' && (
            <div>
              <div className="D" style={{ fontSize: 22, marginBottom: 10 }}>Approve this proof</div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Type your full name</label>
              <input className="finp" value={name} onChange={e => setName(e.target.value)} maxLength={120} autoComplete="name" style={{ marginBottom: 14, width: '100%' }} />
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.6, marginBottom: 16, cursor: 'pointer' }}>
                <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ marginTop: 4 }} />
                <span>I have checked the spelling, colours, sizes and layout, and I approve this proof for printing.</span>
              </label>
              {error && <div role="alert" style={{ color: '#f87171', fontSize: 14, marginBottom: 12 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button disabled={busy} onClick={() => submit('approved')} style={{ ...btn, background: '#16a34a', color: '#fff', border: '1px solid #16a34a', opacity: busy ? .6 : 1 }}>{busy ? 'Sending…' : 'Confirm approval'}</button>
                <button disabled={busy} onClick={() => { setMode(null); setError(''); }} style={{ ...btn, background: 'transparent', color: 'var(--mu)', border: '1px solid var(--bd)' }}>Back</button>
              </div>
            </div>
          )}

          {mode === 'changes' && (
            <div>
              <div className="D" style={{ fontSize: 22, marginBottom: 10 }}>What would you like changed?</div>
              <textarea className="ftxt" rows={6} value={note} onChange={e => setNote(e.target.value)} maxLength={2000} placeholder="For example: make the logo larger, correct the phone number to …, change the blue to …" style={{ width: '100%', marginBottom: 6 }} />
              <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 14 }}>{note.length}/2000 · Be as specific as you can so we get it right the next time.</div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Your name</label>
              <input className="finp" value={name} onChange={e => setName(e.target.value)} maxLength={120} autoComplete="name" style={{ marginBottom: 14, width: '100%' }} />
              {error && <div role="alert" style={{ color: '#f87171', fontSize: 14, marginBottom: 12 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button disabled={busy} onClick={() => submit('changes_requested')} style={{ ...btn, background: 'var(--o)', color: '#000', border: '1px solid var(--o)', opacity: busy ? .6 : 1 }}>{busy ? 'Sending…' : 'Send my changes'}</button>
                <button disabled={busy} onClick={() => { setMode(null); setError(''); }} style={{ ...btn, background: 'transparent', color: 'var(--mu)', border: '1px solid var(--bd)' }}>Back</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
