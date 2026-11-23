import { useState, useMemo, useRef } from 'react';
import { useApp, sendEmailJS } from '../context/AppContext';
import { sessionEmail } from '../lib/adminSession';
import { NOTIFICATIONS, PLACEHOLDERS, DEFAULT_NOTIFY, COOKIE_PRESETS, mergeNotify, buildEmail, sampleOrder } from '../lib/emailBuilder';

const PICKUP_KEYS = ['Ready for Pickup', 'Picked Up', 'Printed (pickup)'];

function Toggle({ on, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
      <input type="checkbox" checked={!!on} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="aform-grp" style={{ marginBottom: 10 }}>
      <label className="aform-lbl">{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export default function NotificationsTab() {
  const { notify, setNotify, cfg, showToast, store } = useApp();
  const [draft, setDraft] = useState(() => mergeNotify(notify));
  const [sel, setSel] = useState('confirmation');
  const [device, setDevice] = useState('desktop');
  const [testTo, setTestTo] = useState(() => sessionEmail() || '');
  const [sending, setSending] = useState(false);
  const lastField = useRef('message');

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(mergeNotify(notify)), [draft, notify]);
  const msg = draft.messages[sel];
  const meta = NOTIFICATIONS.find(n => n.key === sel);

  const setBrand = (k, v) => setDraft(d => ({ ...d, brand: { ...d.brand, [k]: v } }));
  const setShow = (k, v) => setDraft(d => ({ ...d, show: { ...d.show, [k]: v } }));
  const setAlert = (k, v) => setDraft(d => ({ ...d, alerts: { ...d.alerts, [k]: v } }));
  const setCookie = (k, v) => setDraft(d => ({ ...d, cookie: { ...d.cookie, [k]: v } }));
  const setMsg = (key, k, v) => setDraft(d => ({ ...d, messages: { ...d.messages, [key]: { ...d.messages[key], [k]: v } } }));

  const previewData = useMemo(() => {
    const o = sampleOrder();
    if (PICKUP_KEYS.includes(sel) || sel === 'Order Received' || sel === 'Proof Sent' || sel === 'Printing') {
      // status emails: no items block, pickup or shipped variants as appropriate
      if (PICKUP_KEYS.includes(sel)) o.delivery = 'pickup';
    }
    o.logoUrl = store?.logo_img || '';
    o.proofUrl = 'https://nexacustoms.ca/proof/sample';   // preview only
    if (sel === 'Proof Approved' || sel === 'Changes Requested') { o.total = null; o.note = 'Please make the logo a little bigger and change the phone number to 416-555-0100.'; }
    return o;
  }, [sel, store?.logo_img]);

  const built = useMemo(() => buildEmail(draft, sel, previewData), [draft, sel, previewData]);

  const ejsReady = !!(cfg.ejsSvc() && cfg.ejsKey() && cfg.ejsStatusTpl());

  function insertPlaceholder(ph) {
    const f = lastField.current;
    if (f === 'subject' || f === 'headline' || f === 'message') setMsg(sel, f, (msg[f] || '') + ph);
  }

  function save() {
    setNotify(draft);
    showToast('✅ Notification settings saved');
  }

  function resetThis() {
    if (!window.confirm('Reset this email to the standard wording?')) return;
    setMsg(sel, 'subject', DEFAULT_NOTIFY.messages[sel].subject);
    setMsg(sel, 'headline', DEFAULT_NOTIFY.messages[sel].headline);
    setMsg(sel, 'message', DEFAULT_NOTIFY.messages[sel].message);
  }
  function resetAll() {
    if (!window.confirm('Reset ALL notification settings to the standard ones? Your saved changes will be lost.')) return;
    setDraft(mergeNotify(null));
  }

  async function sendTest() {
    if (!ejsReady) { showToast('Set up EmailJS first (Admin → Emails): Service ID, Public Key and the status template ID'); return; }
    if (!/^\S+@\S+\.\S+$/.test(testTo)) { showToast('Enter a valid email address to send the test to'); return; }
    setSending(true);
    try {
      await sendEmailJS(cfg.ejsSvc(), cfg.ejsStatusTpl(), cfg.ejsKey(), {
        to_email: testTo,
        from_name: draft.brand.senderName || 'Nexa Customs',
        reply_to: draft.brand.replyTo || 'info@nexacustoms.ca',
        customer_name: 'Alex Morgan',
        order_number: previewData.order_number,
        subject: '[TEST] ' + built.subject,
        email_html: built.html,
        status_headline: built.headline,
        status_message: built.message,
        order_date: previewData.order_date,
        order_total: previewData.total != null ? '$' + previewData.total.toFixed(2) : '',
        items_html: '', breakdown_html: '', customer_info_html: '', tracking_line: '', logo_url: store?.logo_img || '',
      });
      showToast('📧 Test email sent to ' + testTo + ' — check your inbox (and spam)');
    } catch (e) {
      showToast('❌ Test failed: ' + e.message);
    }
    setSending(false);
  }

  const inp = { width: '100%' };
  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Notifications</h2>
      <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 16, lineHeight: 1.6 }}>
        Edit the wording, branding and layout of every customer email, and choose which alerts you receive. The preview on the right shows exactly what the customer will see.
      </p>

      {!ejsReady && (
        <div style={{ background: 'rgba(250,204,21,.08)', border: '1px solid rgba(250,204,21,.3)', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 12.5, lineHeight: 1.7 }}>
          <strong>Emails can't be sent yet.</strong> Add your EmailJS Service ID, Public Key and the status template ID (<code>VITE_EJS_STATUS_TPL</code>) under Admin → Emails. You can still edit and preview everything here.
        </div>
      )}
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 12.5, lineHeight: 1.7 }}>
        <strong>One-time EmailJS step:</strong> in EmailJS, open the template used for these emails, replace its content with just <code>{'{{{email_html}}}'}</code>, and set Subject to <code>{'{{subject}}'}</code>. After that, everything on this page controls your emails. (The ready-made file is <code>docs/emailjs-wrapper-template.html</code>.)
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        {/* ── LEFT: controls ─────────────────────────────────────────── */}
        <div style={{ flex: '1 1 420px', minWidth: 0 }}>
          <div className="acard" style={{ marginBottom: 16 }}>
            <div className="acard-head"><span style={{ fontWeight: 700 }}>Customer emails</span></div>
            <div className="acard-body">
              {NOTIFICATIONS.map(n => (
                <div key={n.key} onClick={() => setSel(n.key)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 10px', marginBottom: 4, cursor: 'pointer', borderRadius: 8,
                  border: '1px solid ' + (sel === n.key ? 'var(--o)' : 'var(--bd)'), background: sel === n.key ? 'rgba(249,115,22,.07)' : 'transparent',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--mu)' }}>{n.when}</div>
                  </div>
                  <span onClick={e => e.stopPropagation()}>
                    <Toggle on={draft.messages[n.key].enabled !== false} onChange={v => setMsg(n.key, 'enabled', v)} label={draft.messages[n.key].enabled !== false ? 'On' : 'Off'} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="acard" style={{ marginBottom: 16 }}>
            <div className="acard-head"><span style={{ fontWeight: 700 }}>Edit: {meta?.label}</span></div>
            <div className="acard-body">
              <Field label="Subject line">
                <input className="ainp" style={inp} value={msg.subject} onFocus={() => { lastField.current = 'subject'; }} onChange={e => setMsg(sel, 'subject', e.target.value)} />
              </Field>
              <Field label="Headline">
                <input className="ainp" style={inp} value={msg.headline} onFocus={() => { lastField.current = 'headline'; }} onChange={e => setMsg(sel, 'headline', e.target.value)} />
              </Field>
              <Field label="Message" hint="Leave a blank line to start a new paragraph.">
                <textarea className="ainp" rows={7} style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} value={msg.message} onFocus={() => { lastField.current = 'message'; }} onChange={e => setMsg(sel, 'message', e.target.value)} />
              </Field>
              <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 6 }}>Click a word to add it to the field you were editing:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {PLACEHOLDERS.map(([ph, desc]) => (
                  <button key={ph} type="button" title={desc} onClick={() => insertPlaceholder(ph)} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--bd)', background: 'var(--sf)', color: 'var(--tx)', cursor: 'pointer', fontFamily: 'monospace' }}>{ph}</button>
                ))}
              </div>
              <button className="abtn" type="button" onClick={resetThis}>↺ Reset this email to standard wording</button>
            </div>
          </div>

          <div className="acard" style={{ marginBottom: 16 }}>
            <div className="acard-head"><span style={{ fontWeight: 700 }}>Branding & footer</span></div>
            <div className="acard-body">
              <div className="aform-row">
                <Field label="Sender name"><input className="ainp" style={inp} value={draft.brand.senderName} onChange={e => setBrand('senderName', e.target.value)} /></Field>
                <Field label="Reply-to email"><input className="ainp" style={inp} value={draft.brand.replyTo} onChange={e => setBrand('replyTo', e.target.value)} /></Field>
              </div>
              <div className="aform-row">
                <Field label="Accent colour">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(draft.brand.color) ? draft.brand.color : '#f97316'} onChange={e => setBrand('color', e.target.value)} style={{ width: 44, height: 34, border: '1px solid var(--bd)', background: 'transparent', borderRadius: 6 }} />
                    <input className="ainp" style={inp} value={draft.brand.color} onChange={e => setBrand('color', e.target.value)} />
                  </div>
                </Field>
                <Field label="Logo address (optional)" hint="Leave blank to use your logo from Appearance."><input className="ainp" style={inp} placeholder="https://…" value={draft.brand.logoUrl} onChange={e => setBrand('logoUrl', e.target.value)} /></Field>
              </div>
              <div className="aform-row">
                <Field label="Phone"><input className="ainp" style={inp} value={draft.brand.phone} onChange={e => setBrand('phone', e.target.value)} /></Field>
                <Field label="Website"><input className="ainp" style={inp} value={draft.brand.website} onChange={e => setBrand('website', e.target.value)} /></Field>
              </div>
              <Field label="Shop address"><input className="ainp" style={inp} value={draft.brand.address} onChange={e => setBrand('address', e.target.value)} /></Field>
              <Field label="Opening hours"><input className="ainp" style={inp} value={draft.brand.hours} onChange={e => setBrand('hours', e.target.value)} /></Field>
              <Field label="Contact line (above the footer address)"><input className="ainp" style={inp} value={draft.brand.contactLine} onChange={e => setBrand('contactLine', e.target.value)} /></Field>
              <Field label="Extra footer text (optional)" hint="For example your GST/HST number or a short notice."><textarea className="ainp" rows={2} style={{ ...inp, resize: 'vertical' }} value={draft.brand.footerText} onChange={e => setBrand('footerText', e.target.value)} /></Field>
            </div>
          </div>

          <div className="acard" style={{ marginBottom: 16 }}>
            <div className="acard-head"><span style={{ fontWeight: 700 }}>What the order confirmation shows</span></div>
            <div className="acard-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
              <Toggle on={draft.show.orderBox} onChange={v => setShow('orderBox', v)} label="Order number, date and total" />
              <Toggle on={draft.show.items} onChange={v => setShow('items', v)} label="Items with options" />
              <Toggle on={draft.show.priceBreakdown} onChange={v => setShow('priceBreakdown', v)} label="Price breakdown (subtotal, shipping, tax)" />
              <Toggle on={draft.show.addresses} onChange={v => setShow('addresses', v)} label="Shipping and billing address" />
              <Toggle on={draft.show.payment} onChange={v => setShow('payment', v)} label="Payment (card type and last 4)" />
              <Toggle on={draft.show.shippingMethod} onChange={v => setShow('shippingMethod', v)} label="Shipping method and estimate" />
              <Toggle on={draft.show.trackLink} onChange={v => setShow('trackLink', v)} label="“Check your order status” link" />
            </div>
          </div>

          <div className="acard" style={{ marginBottom: 16 }}>
            <div className="acard-head"><span style={{ fontWeight: 700 }}>Alerts to you</span></div>
            <div className="acard-body">
              <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                <Toggle on={draft.alerts.onOrder} onChange={v => setAlert('onOrder', v)} label="Alert me about new orders" />
                <Toggle on={draft.alerts.onQuote} onChange={v => setAlert('onQuote', v)} label="Alert me about quote requests" />
                <Toggle on={draft.alerts.onContact} onChange={v => setAlert('onContact', v)} label="Alert me about contact-form messages" />
                <Toggle on={draft.alerts.onProof} onChange={v => setAlert('onProof', v)} label="Alert me when a customer approves or asks for changes to a proof" />
              </div>
              <Field label="Also send alert emails to (optional)" hint="Separate several addresses with commas. These are in addition to the address set under Admin → Emails. Telegram chat IDs are managed under Admin → Emails.">
                <input className="ainp" style={inp} placeholder="name@example.com, other@example.com" value={draft.alerts.extraEmails} onChange={e => setAlert('extraEmails', e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="acard" style={{ marginBottom: 16 }}>
            <div className="acard-head"><span style={{ fontWeight: 700 }}>Cookie notice (shown on the website)</span></div>
            <div className="acard-body">
              <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 8 }}>Pick a ready-made wording, or write your own:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {COOKIE_PRESETS.map(pr => (
                  <button key={pr.name} type="button" className="abtn" style={{ fontSize: 12, padding: '5px 12px' }} onClick={() => setDraft(d => ({ ...d, cookie: { text: pr.text, accept: pr.accept, reject: pr.reject } }))}>{pr.name}</button>
                ))}
              </div>
              <Field label="Message"><textarea className="ainp" rows={3} style={{ ...inp, resize: 'vertical' }} value={draft.cookie.text} onChange={e => setCookie('text', e.target.value)} /></Field>
              <div className="aform-row">
                <Field label="Accept button"><input className="ainp" style={inp} maxLength={30} value={draft.cookie.accept} onChange={e => setCookie('accept', e.target.value)} /></Field>
                <Field label="Decline button"><input className="ainp" style={inp} maxLength={30} value={draft.cookie.reject} onChange={e => setCookie('reject', e.target.value)} /></Field>
              </div>
              <div data-testid="cookie-preview" style={{ background: '#17171b', color: '#d4d4d8', border: '1px solid #2c2c33', borderRadius: 12, padding: '14px 16px', fontSize: 13, lineHeight: 1.6 }}>
                {draft.cookie.text} <span style={{ color: '#f97316', whiteSpace: 'nowrap' }}>Privacy Policy</span>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <span style={{ padding: '7px 14px', border: '1px solid #52525b', borderRadius: 8, color: '#f4f4f5', fontWeight: 700 }}>{draft.cookie.reject}</span>
                  <span style={{ padding: '7px 14px', background: '#f97316', borderRadius: 8, color: '#000', fontWeight: 700 }}>{draft.cookie.accept}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 8 }}>The notice has a "Privacy Policy" link added automatically. Visitors can reopen their choice from "Cookie settings" in the footer.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', position: 'sticky', bottom: 0, background: 'var(--bg, #0c0c0e)', padding: '10px 0' }}>
            <button className="abtn abtn-add" onClick={save} disabled={!dirty} style={{ flex: '1 1 140px', opacity: dirty ? 1 : .55 }}>💾 Save changes</button>
            <button className="abtn" onClick={resetAll}>Reset everything</button>
            {dirty && <span style={{ fontSize: 12, color: '#facc15' }}>Unsaved changes</span>}
          </div>
        </div>

        {/* ── RIGHT: preview + test ──────────────────────────────────── */}
        <div style={{ flex: '1 1 420px', minWidth: 0, position: 'sticky', top: 12, alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: 'var(--mu)' }}>Preview — sample order, {meta?.label}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['desktop', 'mobile'].map(d => (
                <button key={d} className="abtn" onClick={() => setDevice(d)} style={{ padding: '4px 10px', fontSize: 11, borderColor: device === d ? 'var(--o)' : undefined }}>{d === 'desktop' ? 'Desktop' : 'Phone'}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, marginBottom: 8, padding: '8px 10px', border: '1px solid var(--bd)', borderRadius: 8, background: 'var(--sf)' }}>
            <span style={{ color: 'var(--mu)' }}>Subject: </span><strong>{built.subject}</strong>
          </div>
          <div style={{ border: '1px solid var(--bd)', borderRadius: 10, overflow: 'hidden', background: '#f3f3f1' }}>
            <iframe title="Email preview" srcDoc={`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0">${built.html}</body></html>`}
              style={{ display: 'block', margin: '0 auto', border: 0, width: device === 'mobile' ? 390 : '100%', maxWidth: '100%', height: 760, background: '#f3f3f1' }} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input className="ainp" style={{ flex: '1 1 220px' }} placeholder="Send a test to this email" value={testTo} onChange={e => setTestTo(e.target.value)} />
            <button className="abtn abtn-add" onClick={sendTest} disabled={sending}>{sending ? 'Sending…' : '✉ Send test email'}</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 6, lineHeight: 1.6 }}>The test uses sample order details and the settings above, including any changes you haven't saved yet.</div>
        </div>
      </div>
    </div>
  );
}
