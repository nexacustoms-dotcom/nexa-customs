import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ── CART ──────────────────────────────────────────────────────────────────────
export function CartPage() {
  const { cart, removeFromCart, pricing, cartSubtotal } = useApp();
  const navigate = useNavigate();
  const hst = +(cartSubtotal * pricing.hst).toFixed(2);
  const total = +(cartSubtotal + hst).toFixed(2);

  if (cart.length === 0) return (
    <div style={{ minHeight: '52vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <div className="D" style={{ fontSize: 28 }}>Your Cart is Empty</div>
      <p style={{ fontSize: 13, color: 'var(--mu)' }}>Browse our products and add items to get started.</p>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop All Products →</button>
    </div>
  );

  return (
    <div style={{ padding: '36px 0 76px' }}>
      <div className="W">
        <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,46px)', marginBottom: 24 }}>Your Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 24, alignItems: 'start' }} className="cart-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cart.map(item => (
              <div key={item.cartId} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{item.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    <span style={{ fontSize: 10, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 4, padding: '2px 7px', color: 'var(--mu)' }}>Qty: {item.qty}</span>
                    {(item.opts || []).map((o, i) => <span key={i} style={{ fontSize: 10, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 4, padding: '2px 7px', color: 'var(--mu)' }}>{o}</span>)}
                  </div>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--o)', flexShrink: 0 }}>${item.price.toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.cartId)} style={{ color: 'var(--mu)', padding: 6, borderRadius: 6, fontSize: 15, cursor: 'pointer', background: 'none', border: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--mu)'; e.currentTarget.style.background = 'none'; }}
                >✕</button>
              </div>
            ))}
            <div style={{ background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.15)', borderRadius: 10, padding: '13px 17px', fontSize: 13, color: 'var(--mu)' }}>
              <strong style={{ color: 'var(--tx)' }}>📎 Artwork:</strong> You can upload your files at checkout, or email them to <strong style={{ color: 'var(--o)' }}>info@nexacustoms.ca</strong> after ordering. We accept PDF, AI, EPS, PNG/JPG (300dpi+).
            </div>
          </div>
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22, position: 'sticky', top: 76 }} className="cart-sum">
            <div className="D" style={{ fontSize: 20, marginBottom: 16 }}>Order Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mu)', marginBottom: 7 }}><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mu)', marginBottom: 7 }}><span>Shipping</span><span style={{ color: 'var(--gr)' }}>Calculated at checkout</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mu)', marginBottom: 7 }}><span>HST (13%)</span><span>${hst.toFixed(2)}</span></div>
            <div style={{ height: 1, background: 'var(--bd)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Est. Total</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: 'var(--o)' }}>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: 14, marginTop: 18, borderRadius: 'var(--r)' }} onClick={() => navigate('/checkout')}>Proceed to Checkout →</button>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--mu)', marginTop: 10 }}>🔒 Secure checkout · SSL encrypted</div>
            <button onClick={() => navigate('/products')} style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: 12, color: 'var(--mu)', marginTop: 10, cursor: 'pointer', background: 'none', border: 'none' }}>← Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CHECKOUT ──────────────────────────────────────────────────────────────────
export function CheckoutPage() {
  const { cart, cartSubtotal, pricing, clearCart, showToast, ls, cfg } = useApp();
  const navigate = useNavigate();

  useEffect(() => { if (cart.length === 0) navigate('/products'); }, [cart.length]);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fn: '', ln: '', email: '', phone: '', company: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState('pickup');
  const [turnaround, setTurnaround] = useState('standard');
  const [payMethod, setPayMethod] = useState('invoice');
  const [stripeErr, setStripeErr] = useState('');
  const [placing, setPlacing] = useState(false);
  const [artworkFiles, setArtworkFiles] = useState([]);
  const [artworkUploading, setArtworkUploading] = useState(false);
  const [billing, setBilling] = useState({
    sameAsContact: true,
    name: '',
    fn: '', ln: '',
    address: '', city: 'Mississauga',
    province: 'ON', postal: '', country: 'Canada',
  });
  const artworkRef = useRef(null);
  const stripeRef = useRef(null);
  const cardRef = useRef(null);

  const shipCost = delivery === 'post' ? pricing.shipping_post : delivery === 'courier' ? pricing.shipping_courier : 0;
  const rushMult = turnaround === 'rush' ? pricing.rush_pct : turnaround === 'express' ? pricing.express_pct : 0;
  const rushFee = +(cartSubtotal * rushMult).toFixed(2);
  const subtotal = +(cartSubtotal + shipCost + rushFee).toFixed(2);
  const hst = +(subtotal * pricing.hst).toFixed(2);
  const total = +(subtotal + hst).toFixed(2);

  useEffect(() => {
    if (payMethod !== 'stripe' || step !== 4) return;
    const pk = cfg.stripePk();
    if (!pk || pk.length < 10 || typeof window.Stripe === 'undefined') return;
    try {
      const stripe = window.Stripe(pk);
      const elements = stripe.elements({ appearance: { theme: 'night', variables: { colorPrimary: '#f97316', colorBackground: '#242429', colorText: '#f0ede8', borderRadius: '9px' } } });
      const card = elements.create('card', { style: { base: { color: '#f0ede8', fontSize: '14px', fontFamily: 'DM Sans,sans-serif', '::placeholder': { color: '#7c7c8a' } } } });
      setTimeout(() => { try { card.mount('#stripe-card-el'); } catch {} }, 150);
      card.on('change', e => setStripeErr(e.error?.message || ''));
      stripeRef.current = stripe; cardRef.current = card;
    } catch (e) { console.warn('Stripe:', e.message); }
  }, [payMethod, step]);

  const upd = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };

  function validateStep1() {
    const errs = {};
    if (!form.fn.trim()) errs.fn = 'First name is required';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid email is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    setStep(s => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goBack() { setStep(s => Math.max(s - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  async function uploadArtwork(file, orderNo) {
    const supaUrl = cfg.supaUrl(); const supaKey = cfg.supaKey();
    if (!supaUrl || !supaKey || supaKey.length < 10) return null;
    const ext = file.name.split('.').pop().toLowerCase() || 'pdf';
    const safeName = `artwork/${orderNo}-${Date.now()}.${ext}`;
    try {
      const res = await fetch(`${supaUrl}/storage/v1/object/nexa-media/${safeName}`, {
        method: 'POST', headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' }, body: file,
      });
      if (res.ok) return `${supaUrl}/storage/v1/object/public/nexa-media/${safeName}`;
      const res2 = await fetch(`${supaUrl}/storage/v1/object/nexa-media/${safeName}`, {
        method: 'POST', headers: { 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' }, body: file,
      });
      if (res2.ok) return `${supaUrl}/storage/v1/object/public/nexa-media/${safeName}`;
      return null;
    } catch { return null; }
  }

  async function handleArtworkSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const allowed = ['pdf','ai','eps','psd','png','jpg','jpeg','svg','tiff','tif','zip'];
    const invalid = files.filter(f => !allowed.includes(f.name.split('.').pop().toLowerCase()));
    if (invalid.length) { showToast('Unsupported: ' + invalid[0].name); return; }
    const tooBig = files.filter(f => f.size > 50 * 1024 * 1024);
    if (tooBig.length) { showToast('Max 50MB per file'); return; }
    setArtworkUploading(true);
    const tempNo = 'TEMP-' + Date.now();
    const uploaded = [];
    for (const file of files) {
      const url = await uploadArtwork(file, tempNo);
      uploaded.push({ name: file.name, size: file.size, url, file });
    }
    setArtworkUploading(false);
    setArtworkFiles(prev => [...prev, ...uploaded]);
    const ok = uploaded.filter(x => x.url).length;
    showToast(ok > 0 ? `${ok} file(s) uploaded!` : 'Upload failed — email files after ordering');
    if (e.target) e.target.value = '';
  }

  async function saveOrder(no, pmId = '') {
    const supaUrl = cfg.supaUrl(); const supaKey = cfg.supaKey();
    const itemsStr = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
    if (supaUrl && supaKey && supaKey.length > 10) {
      fetch(supaUrl + '/rest/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: supaKey, Authorization: 'Bearer ' + supaKey, Prefer: 'return=minimal,resolution=merge-duplicates' },
        body: JSON.stringify({ id: 'WEB-' + no, order_number: no, customer_name: (form.fn + ' ' + form.ln).trim(), billing_name: billing.sameAsContact ? (form.fn + ' ' + form.ln).trim() : (billing.fn + ' ' + billing.ln).trim(), billing_address: billing.sameAsContact ? '' : `${billing.address}, ${billing.city}, ${billing.province} ${billing.postal}, ${billing.country}`, customer_email: form.email, customer_phone: form.phone, company: form.company, items: itemsStr, total, delivery, turnaround, status: 'New', source: 'Website', payment_method: payMethod, stripe_pm_id: pmId, artwork_urls: artworkFiles.filter(f => f.url).map(f => f.url).join(', '), artwork_files: artworkFiles.map(f => f.name).join(', '), notes: form.notes, created_at: new Date().toISOString() }),
      }).catch(() => {});
    }
    const tok = cfg.tgToken(); const cid = cfg.tgChat();
    if (tok && cid) {
      const artInfo = artworkFiles.length > 0 ? ' | FILES: ' + artworkFiles.map(f => f.name).join(', ') : '';
      const itemsStr2 = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
      fetch(`https://api.telegram.org/bot${tok}/sendMessage?chat_id=${cid}&text=${encodeURIComponent(`NEW ORDER ${no} | ${(form.fn + ' ' + form.ln).trim()} | ${form.email} | ${form.phone} | ${itemsStr2} | $${total.toFixed(2)} | ${payMethod}${artInfo}`)}`).catch(() => {});
    }
    const ejsSvc = cfg.ejsSvc(); const ejsTpl = cfg.ejsTpl(); const ejsKey = cfg.ejsKey(); const ejsTo = cfg.ejsTo();
    if (ejsSvc && ejsTpl && ejsKey) {
      const send = () => {
        window.emailjs.init(ejsKey);
        const p = { order_id: no, customer_name: (form.fn + ' ' + form.ln).trim(), customer_email: form.email, customer_phone: form.phone, order_items: cart.map(i => `${i.qty}x ${i.name}`).join(', '), total: '$' + total.toFixed(2), to_email: ejsTo, reply_to: form.email, payment_method: payMethod };
        if (ejsTo) window.emailjs.send(ejsSvc, ejsTpl, p).catch(() => {});
        if (ls.raw('nxt_send_cust', '') === '1' && form.email) window.emailjs.send(ejsSvc, ejsTpl, { ...p, to_email: form.email }).catch(() => {});
      };
      window.emailjs ? send() : (() => { const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'; sc.onload = send; document.head.appendChild(sc); })();
    }
  }

  async function handlePlace() {
    if (cart.length === 0) { showToast('Your cart is empty'); return; }
    const no = 'NCX-' + Math.floor(10000 + Math.random() * 90000);
    setPlacing(true);
    try {
      if (payMethod === 'stripe') {
        const pk = cfg.stripePk();
        if (pk && pk.length > 10 && stripeRef.current && cardRef.current) {
          const billingName = billing.sameAsContact ? (form.fn + ' ' + form.ln).trim() : (billing.fn + ' ' + billing.ln).trim() || (form.fn + ' ' + form.ln).trim();
          const billingAddress = billing.sameAsContact ? null : {
            line1: billing.address,
            city: billing.city,
            state: billing.province,
            postal_code: billing.postal,
            country: billing.country === 'Canada' ? 'CA' : 'US',
          };
          const result = await stripeRef.current.createPaymentMethod({
            type: 'card',
            card: cardRef.current,
            billing_details: {
              name: billingName,
              email: form.email,
              phone: form.phone,
              ...(billingAddress ? { address: billingAddress } : {}),
            }
          });
          if (result.error) { setStripeErr(result.error.message); setPlacing(false); return; }
          await saveOrder(no, result.paymentMethod.id);
        } else { await saveOrder(no); }
      } else { await saveOrder(no); }
      sessionStorage.setItem('last_order_no', no);
      clearCart();
      navigate('/order-confirmed');
    } catch (err) {
      console.error('Order error:', err);
      showToast('Something went wrong — please try again');
    } finally { setPlacing(false); }
  }

  const STEPS = ['Contact', 'Delivery', 'Artwork', 'Payment'];

  return (
    <div style={{ padding: '32px 0 80px', minHeight: '80vh' }}>
      <div className="W" style={{ maxWidth: 900 }}>
        {/* Header + step bar */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="D" style={{ fontSize: 'clamp(26px,4vw,42px)', marginBottom: 18 }}>Checkout</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, i) => {
              const n = i + 1; const done = step > n; const active = step === n;
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                  <div onClick={() => done && setStep(n)} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: done ? 'pointer' : 'default', flexShrink: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, transition: 'all .2s', background: done ? 'var(--gr)' : active ? 'var(--o)' : 'var(--s2)', color: done || active ? '#000' : 'var(--mu)', border: `2px solid ${done ? 'var(--gr)' : active ? 'var(--o)' : 'var(--bd)'}` }}>
                      {done ? '✓' : n}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? 'var(--tx)' : done ? 'var(--gr)' : 'var(--mu)', whiteSpace: 'nowrap' }}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: done ? 'var(--gr)' : 'var(--bd)', margin: '0 10px', transition: 'background .3s', minWidth: 20 }} />}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="ck-layout">
          {/* Left - steps */}
          <div>

            {/* STEP 1 — Contact */}
            {step === 1 && (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 26 }}>
                <div className="D" style={{ fontSize: 22, marginBottom: 4 }}>Your Information</div>
                <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 22, lineHeight: 1.6 }}>We will use this to send your order confirmation and artwork proof.</p>
                <div className="frow">
                  <div className="fgrp">
                    <label className="flbl">First Name *</label>
                    <input className="finp" placeholder="Ravi" value={form.fn} onChange={upd('fn')} style={{ borderColor: errors.fn ? '#ef4444' : '' }} />
                    {errors.fn && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>* {errors.fn}</div>}
                  </div>
                  <div className="fgrp">
                    <label className="flbl">Last Name</label>
                    <input className="finp" placeholder="Sharma" value={form.ln} onChange={upd('ln')} />
                  </div>
                </div>
                <div className="frow">
                  <div className="fgrp">
                    <label className="flbl">Email Address *</label>
                    <input className="finp" type="email" placeholder="ravi@company.com" value={form.email} onChange={upd('email')} style={{ borderColor: errors.email ? '#ef4444' : '' }} />
                    {errors.email && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>* {errors.email}</div>}
                  </div>
                  <div className="fgrp">
                    <label className="flbl">Phone Number *</label>
                    <input className="finp" type="tel" placeholder="(437) 997-9921" value={form.phone} onChange={upd('phone')} style={{ borderColor: errors.phone ? '#ef4444' : '' }} />
                    {errors.phone && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>* {errors.phone}</div>}
                  </div>
                </div>
                <div className="fgrp">
                  <label className="flbl">Company Name (optional)</label>
                  <input className="finp" placeholder="Your Company Inc." value={form.company} onChange={upd('company')} />
                </div>
                <div className="fgrp">
                  <label className="flbl">Special Instructions (optional)</label>
                  <textarea className="ftxt" rows="3" placeholder="Deadline, colour references, special requirements..." value={form.notes} onChange={upd('notes')} />
                </div>
                <button onClick={goNext} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px 20px', borderRadius: 'var(--r)', marginTop: 6 }}>
                  Continue to Delivery →
                </button>
              </div>
            )}

            {/* STEP 2 — Delivery & Turnaround */}
            {step === 2 && (
              <div>
                <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 26, marginBottom: 14 }}>
                  <div className="D" style={{ fontSize: 22, marginBottom: 4 }}>Delivery Method</div>
                  <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 20, lineHeight: 1.6 }}>Choose how you want to receive your order.</p>
                  {[
                    { id: 'pickup', ico: '🏪', label: 'Free Local Pickup', sub: '6033 Shawson Dr, Unit 40, Mississauga · Mon–Fri 9AM–6PM', price: 'Free', tag: 'Most Popular' },
                    { id: 'post',   ico: '📬', label: 'Canada Post Standard', sub: '3–7 business days · Tracking included', price: `$${pricing.shipping_post.toFixed(2)}`, tag: '' },
                    { id: 'courier',ico: '🚀', label: 'Courier Express', sub: '1–2 business days · FedEx or UPS', price: `$${pricing.shipping_courier.toFixed(2)}`, tag: 'Fastest' },
                  ].map(opt => (
                    <div key={opt.id} onClick={() => setDelivery(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: delivery === opt.id ? 'rgba(249,115,22,.08)' : 'var(--s2)', border: `2px solid ${delivery === opt.id ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all .18s', marginBottom: 10, position: 'relative' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 9, background: delivery === opt.id ? 'rgba(249,115,22,.15)' : 'var(--dk)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{opt.ico}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {opt.label}
                          {opt.tag && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20, background: 'var(--ol)', color: 'var(--o)', border: '1px solid var(--o25)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{opt.tag}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.4 }}>{opt.sub}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: delivery === opt.id ? 'var(--o)' : 'var(--tx)', flexShrink: 0 }}>{opt.price}</div>
                      <div style={{ position: 'absolute', top: 14, right: 14, width: 18, height: 18, borderRadius: '50%', border: `2px solid ${delivery === opt.id ? 'var(--o)' : 'var(--bd)'}`, background: delivery === opt.id ? 'var(--o)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {delivery === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#000' }} />}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 26, marginBottom: 14 }}>
                  <div className="D" style={{ fontSize: 22, marginBottom: 4 }}>Turnaround Time</div>
                  <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 20, lineHeight: 1.6 }}>Production starts after your artwork proof is approved.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }} className="ta-grid">
                    {[
                      { id: 'standard', ico: '📦', label: 'Standard', sub: '5–7 business days', extra: null },
                      { id: 'rush',     ico: '⚡', label: 'Rush',     sub: '2–3 business days', extra: `+${Math.round(pricing.rush_pct * 100)}% fee` },
                      { id: 'express',  ico: '🚀', label: 'Express',  sub: 'Same / next day',   extra: `+${Math.round(pricing.express_pct * 100)}% fee` },
                    ].map(opt => (
                      <div key={opt.id} onClick={() => setTurnaround(opt.id)} style={{ border: `2px solid ${turnaround === opt.id ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 12, padding: '18px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all .18s', background: turnaround === opt.id ? 'rgba(249,115,22,.08)' : 'var(--s2)' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{opt.ico}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: opt.extra ? 6 : 0, lineHeight: 1.4 }}>{opt.sub}</div>
                        {opt.extra && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--o)' }}>{opt.extra}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={goBack} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                  <button onClick={goNext} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: 15, padding: '14px 20px', borderRadius: 'var(--r)' }}>Continue to Artwork →</button>
                </div>
              </div>
            )}

            {/* STEP 3 — Artwork */}
            {step === 3 && (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 26 }}>
                <div className="D" style={{ fontSize: 22, marginBottom: 4 }}>Artwork Upload</div>
                <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 20, lineHeight: 1.65 }}>
                  Upload your print-ready files now, or skip and email them after ordering to{' '}
                  <strong style={{ color: 'var(--o)' }}>info@nexacustoms.ca</strong> with your order number.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {[['PDF','Preferred'],['AI',''],['EPS',''],['PSD',''],['PNG','300dpi+'],['JPG','300dpi+'],['ZIP','']].map(([f, note]) => (
                    <div key={f} style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{f}</span>
                      {note && <span style={{ fontSize: 10, color: 'var(--mu)' }}>{note}</span>}
                    </div>
                  ))}
                  <span style={{ fontSize: 11, color: 'var(--mu)', alignSelf: 'center' }}>· Max 50MB/file</span>
                </div>

                <div
                  onClick={() => artworkRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--o)'; e.currentTarget.style.background = 'rgba(249,115,22,.04)'; }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.background = 'transparent'; }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.background = 'transparent'; handleArtworkSelect({ target: { files: e.dataTransfer.files } }); }}
                  style={{ border: '2px dashed var(--bd)', borderRadius: 12, padding: '36px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .2s', marginBottom: 14 }}
                >
                  <div style={{ fontSize: 44, marginBottom: 12 }}>{artworkUploading ? '⏳' : '📁'}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>
                    {artworkUploading ? 'Uploading your files…' : 'Click to browse or drag & drop'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>PDF, AI, EPS, PSD, PNG, JPG, ZIP accepted</div>
                  <input ref={artworkRef} type="file" multiple accept=".pdf,.ai,.eps,.psd,.png,.jpg,.jpeg,.svg,.tiff,.tif,.zip" style={{ display: 'none' }} onChange={handleArtworkSelect} />
                </div>

                {artworkFiles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {artworkFiles.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: f.url ? 'rgba(34,197,94,.06)' : 'var(--s2)', border: `1px solid ${f.url ? 'rgba(34,197,94,.2)' : 'var(--bd)'}`, borderRadius: 9, padding: '10px 14px' }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{f.name.match(/\.pdf$/i) ? '📄' : f.name.match(/\.zip$/i) ? '🗜️' : f.name.match(/\.(png|jpg|jpeg|tiff?)$/i) ? '🖼️' : '📎'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--mu)' }}>
                            {(f.size / 1024 / 1024).toFixed(1)} MB
                            {f.url ? <span style={{ color: 'var(--gr)', marginLeft: 8 }}>✅ Uploaded</span> : <span style={{ color: '#f59e0b', marginLeft: 8 }}>📧 Email after order</span>}
                          </div>
                        </div>
                        <button onClick={() => setArtworkFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ color: 'var(--mu)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: '2px 6px', borderRadius: 4 }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--mu)'}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.15)', borderRadius: 9, padding: '12px 14px', fontSize: 12, color: 'var(--mu)', marginBottom: 20, lineHeight: 1.6 }}>
                  No files ready? No problem — skip this step and email artwork to <strong style={{ color: 'var(--o)' }}>info@nexacustoms.ca</strong> after ordering. We will send a proof before printing.
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={goBack} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                  <button onClick={goNext} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: 15, padding: '14px 20px', borderRadius: 'var(--r)' }}>
                    {artworkFiles.length > 0 ? `Continue with ${artworkFiles.length} file(s) →` : 'Skip & Continue →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Payment */}
            {step === 4 && (
              <div>
                {/* Order review */}
                <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div className="D" style={{ fontSize: 20 }}>Order Review</div>
                    <button onClick={() => setStep(1)} style={{ fontSize: 11, color: 'var(--o)', background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Edit Info</button>
                  </div>
                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {cart.map(item => (
                      <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--s2)', borderRadius: 8, padding: '10px 14px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--mu)' }}>Qty: {item.qty}{item.opts?.length > 0 ? ' · ' + item.opts.slice(0, 2).join(' · ') : ''}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--o)', fontFamily: "'DM Mono',monospace" }}>${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  {/* Summary rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 0', borderTop: '1px solid var(--bd)' }}>
                    <div style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>📍 Delivery</span>
                      <span style={{ color: 'var(--tx)', fontWeight: 600 }}>
                        {delivery === 'pickup' ? '🏪 Free Pickup — Mississauga' : delivery === 'post' ? `📬 Canada Post — $${shipCost.toFixed(2)}` : `🚀 Courier — $${shipCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>⏱ Turnaround</span>
                      <span style={{ color: 'var(--tx)', fontWeight: 600, textTransform: 'capitalize' }}>{turnaround}{rushFee > 0 ? ` (+$${rushFee.toFixed(2)})` : ''}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>📎 Artwork</span>
                      {artworkFiles.length > 0
                        ? <span style={{ color: 'var(--gr)', fontWeight: 600 }}>✅ {artworkFiles.length} file(s) uploaded</span>
                        : <span style={{ color: '#f59e0b', fontWeight: 600 }}>📧 Will email after ordering</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>👤 Customer</span>
                      <span style={{ color: 'var(--tx)', fontWeight: 600 }}>{form.fn} {form.ln} · {form.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22, marginBottom: 14 }}>
                  <div className="D" style={{ fontSize: 20, marginBottom: 14 }}>Payment Method</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }} className="pay-grid">
                    {[
                      { id: 'invoice', ico: '🏪', label: 'Pay at Pickup', sub: 'Cash or card in store', color: 'var(--gr)' },
                      { id: 'stripe',  ico: '💳', label: 'Credit / Debit Card', sub: 'Visa, MC, Amex · Stripe', color: '#818cf8' },
                      { id: 'net30',   ico: '📄', label: 'Net 30 Invoice', sub: 'Approved accounts only', color: '#60a5fa' },
                    ].map(opt => (
                      <div key={opt.id} onClick={() => setPayMethod(opt.id)} style={{ border: `2px solid ${payMethod === opt.id ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 12, padding: '16px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all .18s', background: payMethod === opt.id ? 'rgba(249,115,22,.08)' : 'var(--s2)', position: 'relative' }}>
                        {payMethod === opt.id && <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: 'var(--o)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#000' }}>✓</div>}
                        <div style={{ fontSize: 26, marginBottom: 8 }}>{opt.ico}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{opt.label}</div>
                        <div style={{ fontSize: 10, color: 'var(--mu)', lineHeight: 1.3 }}>{opt.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stripe card + billing address */}
                  {payMethod === 'stripe' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="bill-grid">
                        <div className="fgrp" style={{ gridColumn: '1/-1' }}>
                          <label className="flbl">Cardholder Name</label>
                          <input className="finp" placeholder={`${form.fn} ${form.ln}`.trim() || 'Full name on card'} value={billing.name} onChange={e => setBilling(b => ({...b, name: e.target.value}))} />
                        </div>
                        <div className="fgrp" style={{ gridColumn: '1/-1' }}>
                          <label className="flbl">Card Details</label>
                          <div id="stripe-card-el" style={{ background: 'var(--s2)', border: `1px solid ${stripeErr ? '#ef4444' : 'var(--bd)'}`, borderRadius: 9, padding: 14, minHeight: 44, transition: 'border-color .2s' }} />
                          {stripeErr && <div style={{ color: '#f87171', fontSize: 11, marginTop: 5 }}>⚠ {stripeErr}</div>}
                          {!cfg.stripePk() && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 8, background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.15)', borderRadius: 7, padding: '8px 12px' }}>💡 Stripe not configured — order will be processed as invoice.</div>}
                        </div>
                      </div>

                      {/* Billing address */}
                      <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <label className="flbl" style={{ margin: 0 }}>Billing Address</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="checkbox" id="same-addr" checked={billing.sameAsContact} onChange={e => setBilling(b => ({...b, sameAsContact: e.target.checked}))} style={{ width: 14, height: 14, cursor: 'pointer' }} />
                            <label htmlFor="same-addr" style={{ fontSize: 12, color: 'var(--mu)', cursor: 'pointer' }}>Same as contact info</label>
                          </div>
                        </div>
                        {!billing.sameAsContact && (
                          <div>
                            <div className="frow" style={{ marginBottom: 0 }}>
                              <div className="fgrp">
                                <label className="flbl">First Name</label>
                                <input className="finp" value={billing.fn} onChange={e => setBilling(b => ({...b, fn: e.target.value}))} placeholder="First name" />
                              </div>
                              <div className="fgrp">
                                <label className="flbl">Last Name</label>
                                <input className="finp" value={billing.ln} onChange={e => setBilling(b => ({...b, ln: e.target.value}))} placeholder="Last name" />
                              </div>
                            </div>
                            <div className="fgrp">
                              <label className="flbl">Street Address</label>
                              <input className="finp" value={billing.address} onChange={e => setBilling(b => ({...b, address: e.target.value}))} placeholder="123 Main Street, Unit 4" />
                            </div>
                            <div className="frow">
                              <div className="fgrp">
                                <label className="flbl">City</label>
                                <input className="finp" value={billing.city} onChange={e => setBilling(b => ({...b, city: e.target.value}))} placeholder="Mississauga" />
                              </div>
                              <div className="fgrp">
                                <label className="flbl">Province</label>
                                <select className="fsel" value={billing.province} onChange={e => setBilling(b => ({...b, province: e.target.value}))}>
                                  {['ON','QC','BC','AB','MB','SK','NS','NB','NL','PE','YT','NT','NU'].map(p => <option key={p}>{p}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="frow">
                              <div className="fgrp">
                                <label className="flbl">Postal Code</label>
                                <input className="finp" value={billing.postal} onChange={e => setBilling(b => ({...b, postal: e.target.value.toUpperCase()}))} placeholder="L5T 1J6" maxLength={7} />
                              </div>
                              <div className="fgrp">
                                <label className="flbl">Country</label>
                                <select className="fsel" value={billing.country} onChange={e => setBilling(b => ({...b, country: e.target.value}))}>
                                  <option>Canada</option>
                                  <option>United States</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                        {billing.sameAsContact && (
                          <div style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--mu)' }}>
                            ✅ Billing name: <strong style={{ color: 'var(--tx)' }}>{form.fn} {form.ln}</strong> · Contact info used for billing
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {payMethod === 'invoice' && (
                    <div style={{ background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 10, padding: '14px 16px', fontSize: 13 }}>
                      <div style={{ fontWeight: 700, color: 'var(--gr)', marginBottom: 6 }}>✅ Pay at Pickup — No payment needed now</div>
                      <div style={{ color: 'var(--mu)', fontSize: 12, lineHeight: 1.65 }}>
                        Pay by cash or card when you pick up your order at our Mississauga location.<br/>
                        📍 6033 Shawson Dr, Unit 40 · Mon–Fri 9AM–6PM<br/>
                        We will call or email you when your order is ready.
                      </div>
                    </div>
                  )}

                  {payMethod === 'net30' && (
                    <div style={{ background: 'rgba(96,165,250,.06)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 10, padding: '14px 16px', fontSize: 13 }}>
                      <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: 6 }}>📄 Net 30 Invoice</div>
                      <div style={{ color: 'var(--mu)', fontSize: 12, lineHeight: 1.65 }}>
                        Available for approved business accounts only. An invoice will be emailed to <strong style={{ color: 'var(--tx)' }}>{form.email}</strong> within 1 business day.<br/>
                        Contact us at <a href="tel:+14379979921" style={{ color: 'var(--o)' }}>(437) 997-9921</a> to set up a Net 30 account.
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap', padding: '6px 0' }}>
                  {[['🔒','SSL Encrypted'],['✅','Free Proof Included'],['🛡️','Quality Guaranteed'],['📞','(437) 997-9921']].map(([ico, l]) => (
                    <div key={l} style={{ fontSize: 11, color: 'var(--mu)', display: 'flex', alignItems: 'center', gap: 5 }}><span>{ico}</span>{l}</div>
                  ))}
                </div>

                {/* Place order */}
                <button onClick={handlePlace} disabled={placing} style={{ width: '100%', background: placing ? 'var(--bd)' : 'var(--o)', color: placing ? 'var(--mu)' : '#000', border: 'none', borderRadius: 'var(--r)', padding: '16px 20px', fontSize: 16, fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
                  {placing
                    ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⏳</span> Placing Order…</>
                    : <>Place Order — ${total.toFixed(2)} <span style={{ fontSize: 13, opacity: 0.7 }}>({payMethod === 'stripe' ? '💳 Card' : payMethod === 'invoice' ? '🏪 Pickup' : '📄 Net 30'})</span></>}
                </button>
                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--mu)' }}>
                  By placing this order you agree to our <span onClick={() => window.open('/terms','_blank')} style={{ color: 'var(--o)', cursor: 'pointer' }}>Terms & Conditions</span>
                </div>

                <button onClick={goBack} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--mu)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back to Artwork</button>
              </div>
            )}
          </div>

          {/* Right — sticky summary */}
          <div style={{ position: 'sticky', top: 80 }} className="ck-sum">
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
              <div className="D" style={{ fontSize: 18, marginBottom: 14 }}>Order Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14, maxHeight: 220, overflowY: 'auto' }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12 }}>
                    <span style={{ color: 'var(--mu)', flex: 1, lineHeight: 1.4 }}>{item.name} <strong style={{ color: 'var(--tx)' }}>x{item.qty}</strong></span>
                    <span style={{ color: 'var(--tx)', fontWeight: 700, flexShrink: 0 }}>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: 'var(--bd)', marginBottom: 10 }} />
              {[[`Subtotal`, `$${cartSubtotal.toFixed(2)}`], shipCost > 0 ? [`Shipping`, `$${shipCost.toFixed(2)}`] : null, rushFee > 0 ? [`${turnaround} fee`, `$${rushFee.toFixed(2)}`] : null, [`HST (13%)`, `$${hst.toFixed(2)}`]].filter(Boolean).map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mu)', marginBottom: 6 }}><span>{l}</span><span>{v}</span></div>
              ))}
              <div style={{ height: 1, background: 'var(--bd)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: 'var(--o)' }}>${total.toFixed(2)}</span>
              </div>

              {step > 1 && form.fn && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bd)', fontSize: 12 }}>
                  <div style={{ color: 'var(--mu)', marginBottom: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Ordering as</div>
                  <div style={{ fontWeight: 600 }}>{form.fn} {form.ln}</div>
                  <div style={{ color: 'var(--mu)' }}>{form.email}</div>
                  <div style={{ color: 'var(--mu)' }}>{form.phone}</div>
                  <button onClick={() => setStep(1)} style={{ fontSize: 11, color: 'var(--o)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginTop: 4 }}>✏️ Edit</button>
                </div>
              )}

              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'center', gap: 14 }}>
                <span style={{ fontSize: 11, color: 'var(--mu)' }}>🔒 Secure</span>
                <span style={{ fontSize: 11, color: 'var(--mu)' }}>✅ Free Proof</span>
                <a href="tel:+14379979921" style={{ fontSize: 11, color: 'var(--o)', textDecoration: 'none' }}>📞 Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SUCCESS ───────────────────────────────────────────────────────────────────
export function SuccessPage() {
  const navigate = useNavigate();
  const orderNo = sessionStorage.getItem('last_order_no') || 'NCX—';
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
      <h1 className="D" style={{ fontSize: 'clamp(36px,5vw,60px)', marginBottom: 10, color: 'var(--gr)' }}>Order Confirmed!</h1>
      <p style={{ fontSize: 14, color: 'var(--mu)', maxWidth: 460, margin: '0 auto 12px', lineHeight: 1.7 }}>Your order has been received. We will be in touch within 1 business day with your proof.</p>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, color: 'var(--o)', marginBottom: 28, background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.2)', borderRadius: 8, padding: '10px 24px', display: 'inline-block' }}>{orderNo}</div>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 14, padding: 22, maxWidth: 440, width: '100%', marginBottom: 28, textAlign: 'left' }}>
        {[['📎 Artwork', 'Email files to info@nexacustoms.ca with your order number'],['📍 Pickup', '6033 Shawson Dr, Unit 40, Mississauga · Mon–Fri 9AM–6PM'],['📞 Questions?', 'Call or text (437) 997-9921']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 12, fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--bd)' }}>
            <span style={{ color: 'var(--o)', flexShrink: 0, fontWeight: 600 }}>{k}</span>
            <span style={{ color: 'var(--mu)' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
}

// ── QUOTE ─────────────────────────────────────────────────────────────────────
export function QuotePage() {
  const { showToast, ls, cats, cfg } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', cat: 'Business Cards', qty: '', deadline: '', desc: '' });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit() {
    if (!form.fname || !form.email || !form.desc) { showToast('Please fill in required fields'); return; }
    const supaUrl = cfg.supaUrl(); const supaKey = cfg.supaKey();
    if (supaUrl && supaKey && supaKey.length > 10) {
      const id = 'WEB-QUO-' + Date.now();
      fetch(supaUrl + '/rest/v1/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: supaKey, Authorization: 'Bearer ' + supaKey, Prefer: 'return=minimal' }, body: JSON.stringify({ id, order_number: id, customer_name: form.fname + ' ' + form.lname, customer_email: form.email, customer_phone: form.phone, items: form.cat + ': ' + form.desc.slice(0, 120), total: 0, status: 'Quote', source: 'Quote Form', created_at: new Date().toISOString() }) }).catch(() => {});
    }
    const tok = cfg.tgToken(); const cid = cfg.tgChat();
    if (tok && cid) fetch(`https://api.telegram.org/bot${tok}/sendMessage?chat_id=${cid}&text=${encodeURIComponent(`QUOTE REQUEST | ${form.fname} ${form.lname} | ${form.email} | ${form.phone} | ${form.cat} | ${form.desc.slice(0,100)}`)}`).catch(() => {});
    showToast('Quote request sent! We will respond within 1 business day.');
    navigate('/');
  }

  return (
    <div className="W" style={{ padding: '40px 28px 76px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div className="badge-orange" style={{ marginBottom: 12 }}>Free Consultation</div>
        <h1 className="D" style={{ fontSize: 'clamp(32px,5vw,56px)', marginBottom: 8 }}>Request a Quote</h1>
        <p style={{ fontSize: 13, color: 'var(--mu)', maxWidth: 440, margin: '0 auto' }}>Tell us about your project. We will get back to you within 1 business day.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }} className="qp-layout">
        <div>
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 24, marginBottom: 14 }}>
            <div className="D" style={{ fontSize: 18, marginBottom: 16 }}>Your Information</div>
            <div className="frow">
              <div className="fgrp"><label className="flbl">First Name *</label><input className="finp" placeholder="Ravi" value={form.fname} onChange={upd('fname')} /></div>
              <div className="fgrp"><label className="flbl">Last Name</label><input className="finp" placeholder="Sharma" value={form.lname} onChange={upd('lname')} /></div>
            </div>
            <div className="frow">
              <div className="fgrp"><label className="flbl">Email *</label><input className="finp" type="email" placeholder="ravi@nexacustoms.ca" value={form.email} onChange={upd('email')} /></div>
              <div className="fgrp"><label className="flbl">Phone</label><input className="finp" type="tel" placeholder="(437) 997-9921" value={form.phone} onChange={upd('phone')} /></div>
            </div>
          </div>
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 24, marginBottom: 14 }}>
            <div className="D" style={{ fontSize: 18, marginBottom: 16 }}>Project Details</div>
            <div className="fgrp"><label className="flbl">Product Category</label>
              <select className="fsel" value={form.cat} onChange={upd('cat')}>
                {cats.map(c => <option key={c.id}>{c.l}</option>)}
                <option>Other / Custom</option>
              </select>
            </div>
            <div className="frow">
              <div className="fgrp"><label className="flbl">Quantity</label><input className="finp" placeholder="e.g. 500" value={form.qty} onChange={upd('qty')} /></div>
              <div className="fgrp"><label className="flbl">Deadline</label><input className="finp" type="date" value={form.deadline} onChange={upd('deadline')} /></div>
            </div>
            <div className="fgrp"><label className="flbl">Project Description *</label><textarea className="ftxt" rows="4" placeholder="Sizes, finishes, deadline, special requirements..." value={form.desc} onChange={upd('desc')} /></div>
          </div>
          <button className="btn btn-primary" onClick={submit} style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: 14, borderRadius: 'var(--r)' }}>Send Quote Request →</button>
        </div>
        <div>
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 12 }}>Why Nexa Customs?</div>
            {['Response within 1 business day','Free digital proof before printing','Same-day pickup in Mississauga','Quality guaranteed — reprint if not satisfied','13+ years in business'].map(t => (
              <div key={t} style={{ display: 'flex', gap: 8, fontSize: 12, marginBottom: 8, color: 'var(--mu)' }}><span style={{ color: 'var(--o)' }}>✓</span>{t}</div>
            ))}
          </div>
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 12 }}>Contact Directly</div>
            {[['📞','(437) 997-9921','tel:+14379979921'],['✉️','info@nexacustoms.ca','mailto:info@nexacustoms.ca'],['📍','6033 Shawson Dr, Unit 40',null]].map(([ico, val, href]) => (
              <div key={val} style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', gap: 9, marginBottom: 10 }}>
                {ico} {href ? <a href={href} style={{ color: 'var(--o)' }}>{val}</a> : val}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
export function ContactPage() {
  const { store, showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="W" style={{ padding: '40px 28px 76px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 className="D" style={{ fontSize: 'clamp(32px,5vw,56px)', marginBottom: 8 }}>Get In Touch</h1>
        <p style={{ fontSize: 13, color: 'var(--mu)' }}>We are here to help with any print project, big or small.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }} className="ct-grid">
        {[
          { ico: '📞', t: 'Call Us', val: store.phone, href: `tel:+${store.phone_raw}`, sub: 'Mon–Fri 9AM–6PM · Sat By Appt' },
          { ico: '✉️', t: 'Email Us', val: store.email, href: `mailto:${store.email}`, sub: 'Response within 1 business day' },
          { ico: '📍', t: 'Visit Us', val: `${store.address}\n${store.city}`, href: null, sub: null },
          { ico: '💬', t: 'WhatsApp', val: store.phone, href: `https://wa.me/${store.phone_raw}`, sub: 'Send photos of your project' },
        ].map(c => (
          <div key={c.t} className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.ico}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{c.t}</div>
            {c.href ? <a href={c.href} style={{ color: 'var(--o)', fontSize: 14, fontWeight: 700 }}>{c.val}</a> : <div style={{ fontSize: 13, color: 'var(--mu)', whiteSpace: 'pre-line' }}>{c.val}</div>}
            {c.sub && <p style={{ fontSize: 11, color: 'var(--mu)', marginTop: 5 }}>{c.sub}</p>}
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 24, maxWidth: 560, margin: '0 auto' }}>
        <div className="D" style={{ fontSize: 18, marginBottom: 16 }}>Send Us a Message</div>
        <div className="frow">
          <div className="fgrp"><label className="flbl">Name</label><input className="finp" placeholder="Your name" value={form.name} onChange={upd('name')} /></div>
          <div className="fgrp"><label className="flbl">Email</label><input className="finp" placeholder="your@email.com" value={form.email} onChange={upd('email')} /></div>
        </div>
        <div className="fgrp"><label className="flbl">Message</label><textarea className="ftxt" rows="4" placeholder="Tell us about your project..." value={form.msg} onChange={upd('msg')} /></div>
        <button className="btn btn-primary" onClick={() => { showToast('Message sent! We will reply within 1 business day.'); setForm({ name:'',email:'',msg:'' }); }} style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: 13, borderRadius: 'var(--r)' }}>Send Message →</button>
      </div>
    </div>
  );
}
