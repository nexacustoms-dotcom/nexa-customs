import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// ── CART ──────────────────────────────────────────────────────────────────────
export function CartPage() {
  const { cart, removeFromCart, go, pricing, cartSubtotal } = useApp();
  const hst = +(cartSubtotal * pricing.hst).toFixed(2);
  const total = +(cartSubtotal + hst).toFixed(2);

  if (cart.length === 0) return (
    <div style={{ minHeight: '52vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <div className="D" style={{ fontSize: 28 }}>Your Cart is Empty</div>
      <p style={{ fontSize: 13, color: 'var(--mu)' }}>Browse our products and add items to get started.</p>
      <button className="btn btn-primary" onClick={() => go('products')}>Shop All Products →</button>
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
                <button onClick={() => removeFromCart(item.cartId)} style={{ color: 'var(--mu)', padding: 6, borderRadius: 6, fontSize: 15, cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--mu)'; e.currentTarget.style.background = 'none'; }}
                >✕</button>
              </div>
            ))}
            <div style={{ background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.15)', borderRadius: 10, padding: '13px 17px', fontSize: 13, color: 'var(--mu)' }}>
              <strong style={{ color: 'var(--tx)' }}>📎 Artwork:</strong> Email files to <strong style={{ color: 'var(--o)' }}>info@nexacustoms.ca</strong> with your order number. PDF, AI, EPS, or high-res PNG/JPG (300dpi+).
            </div>
          </div>
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22, position: 'sticky', top: 76 }} className="cart-sum">
            <div className="D" style={{ fontSize: 20, marginBottom: 16 }}>Order Summary</div>
            <SumRow label="Subtotal" val={`$${cartSubtotal.toFixed(2)}`} />
            <SumRow label="Shipping" val="Calculated at checkout" valStyle={{ color: 'var(--gr)' }} />
            <SumRow label="HST (13%)" val={`$${hst.toFixed(2)}`} />
            <div style={{ height: 1, background: 'var(--bd)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Est. Total</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: 'var(--o)' }}>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: 14, marginTop: 18, borderRadius: 'var(--r)' }} onClick={() => go('checkout')}>Proceed to Checkout →</button>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--mu)', marginTop: 10 }}>🔒 Secure checkout · SSL encrypted</div>
            <button onClick={() => go('products')} style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: 12, color: 'var(--mu)', marginTop: 10, cursor: 'pointer' }}>← Continue Shopping</button>
          </div>
        </div>
      </div>
      <style>{`.cart-layout{@media(max-width:1060px){grid-template-columns:1fr !important}}.cart-sum{@media(max-width:1060px){position:static !important}}`}</style>
    </div>
  );
}

// ── CHECKOUT ──────────────────────────────────────────────────────────────────
export function CheckoutPage() {
  const { cart, cartSubtotal, pricing, go, clearCart, showToast, ls } = useApp();
  const [form, setForm] = useState({ fn: '', email: '', phone: '', company: '', notes: '' });
  const [delivery, setDelivery] = useState('pickup');
  const [turnaround, setTurnaround] = useState('standard');
  const [payMethod, setPayMethod] = useState('invoice');
  const [stripeErr, setStripeErr] = useState('');
  const [placing, setPlacing] = useState(false);
  const stripeRef = useRef(null);
  const cardRef = useRef(null);

  const shipCost = delivery === 'post' ? pricing.shipping_post : delivery === 'courier' ? pricing.shipping_courier : 0;
  const rushMult = turnaround === 'rush' ? pricing.rush_pct : turnaround === 'express' ? pricing.express_pct : 0;
  const rushFee = +(cartSubtotal * rushMult).toFixed(2);
  const subtotal = +(cartSubtotal + shipCost + rushFee).toFixed(2);
  const hst = +(subtotal * pricing.hst).toFixed(2);
  const total = +(subtotal + hst).toFixed(2);

  useEffect(() => {
    if (payMethod !== 'stripe') return;
    const pk = ls.raw('nxt_stripe_pk', '');
    if (!pk || pk.length < 10 || typeof window.Stripe === 'undefined') return;
    try {
      const stripe = window.Stripe(pk);
      const elements = stripe.elements({ appearance: { theme: 'night', variables: { colorPrimary: '#f97316', colorBackground: '#242429', colorText: '#f0ede8', borderRadius: '9px' } } });
      const card = elements.create('card', { style: { base: { color: '#f0ede8', fontSize: '14px', fontFamily: 'DM Sans,sans-serif', '::placeholder': { color: '#7c7c8a' } } } });
      card.mount('#stripe-card-el');
      card.on('change', e => setStripeErr(e.error?.message || ''));
      stripeRef.current = stripe; cardRef.current = card;
    } catch (e) { console.warn('Stripe:', e.message); }
  }, [payMethod]);

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function saveOrder(no, pmId = '') {
    const supaUrl = ls.raw('nxt_supa_url', '');
    const supaKey = ls.raw('nxt_supa_key', '');
    const itemsStr = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
    if (supaUrl && supaKey && supaKey.length > 10) {
      fetch(supaUrl + '/rest/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': supaKey, 'Authorization': 'Bearer ' + supaKey, 'Prefer': 'return=minimal,resolution=merge-duplicates' },
        body: JSON.stringify({ id: 'WEB-' + no, order_number: no, customer_name: form.fn, customer_email: form.email, customer_phone: form.phone, company: form.company, items: itemsStr, total, delivery, turnaround, status: 'New', source: 'Website', payment_method: payMethod, stripe_pm_id: pmId, created_at: new Date().toISOString() }),
      }).catch(() => {});
    }
    // Telegram
    const tok = ls.raw('nxt_tg_token', ''); const cid = ls.raw('nxt_tg_chatid', '');
    if (tok && cid) {
      const msg = `🛒 NEW ORDER ${no} | ${form.fn} | ${form.email} | ${form.phone} | ${itemsStr} | $${total.toFixed(2)} | ${payMethod}`;
      fetch(`https://api.telegram.org/bot${tok}/sendMessage?chat_id=${cid}&text=${encodeURIComponent(msg)}`).catch(() => {});
    }
    // EmailJS
    const ejsSvc = ls.raw('nxt_ejs_svc', ''); const ejsTpl = ls.raw('nxt_ejs_tpl', ''); const ejsKey = ls.raw('nxt_ejs_key', ''); const ejsTo = ls.raw('nxt_ejs_to', '');
    if (ejsSvc && ejsTpl && ejsKey) {
      const loadAndSend = () => {
        window.emailjs.init(ejsKey);
        const p = { order_id: no, customer_name: form.fn, customer_email: form.email, customer_phone: form.phone, order_items: itemsStr, total: '$' + total.toFixed(2), to_email: ejsTo, reply_to: form.email, payment_method: payMethod };
        if (ejsTo) window.emailjs.send(ejsSvc, ejsTpl, p).catch(() => {});
        if (ls.raw('nxt_send_cust', '') === '1' && form.email) window.emailjs.send(ejsSvc, ejsTpl, { ...p, to_email: form.email }).catch(() => {});
      };
      if (window.emailjs) { loadAndSend(); } else {
        const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'; sc.onload = loadAndSend; document.head.appendChild(sc);
      }
    }
  }

  async function handlePlace() {
    if (!form.fn.trim()) { showToast('Please enter your name'); return; }
    if (!form.email.includes('@')) { showToast('Please enter a valid email'); return; }
    if (!form.phone.trim()) { showToast('Please enter your phone'); return; }
    if (cart.length === 0) { showToast('Your cart is empty'); return; }

    const no = 'NCX-' + Math.floor(10000 + Math.random() * 90000);
    setPlacing(true);

    try {
      // Stripe payment
      if (payMethod === 'stripe') {
        const pk = ls.raw('nxt_stripe_pk', '');
        if (pk && pk.length > 10 && stripeRef.current && cardRef.current) {
          const result = await stripeRef.current.createPaymentMethod({
            type: 'card', card: cardRef.current,
            billing_details: { name: form.fn, email: form.email }
          });
          if (result.error) {
            setStripeErr(result.error.message);
            setPlacing(false);
            return;
          }
          await saveOrder(no, result.paymentMethod.id);
        } else {
          // Stripe not configured — fall through to invoice
          await saveOrder(no);
        }
      } else {
        // Invoice / Pay at pickup
        await saveOrder(no);
      }

      // Store order number for success page, navigate
      sessionStorage.setItem('last_order_no', no);
      clearCart();
      go('success');
      showToast('✓ Order placed!');
    } catch (err) {
      console.error('Order error:', err);
      showToast('Something went wrong — please try again');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div style={{ padding: '36px 0 76px' }}>
      <div className="W">
        <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,46px)', marginBottom: 24 }}>Checkout</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }} className="ck-layout">
          <div>
            {/* Contact */}
            <CkSection n={1} title="Your Information">
              <div className="frow">
                <div className="fgrp"><label className="flbl">Full Name *</label><input className="finp" placeholder="Ravi Sharma" value={form.fn} onChange={upd('fn')} /></div>
                <div className="fgrp"><label className="flbl">Email *</label><input className="finp" type="email" placeholder="ravi@company.com" value={form.email} onChange={upd('email')} /></div>
              </div>
              <div className="frow">
                <div className="fgrp"><label className="flbl">Phone *</label><input className="finp" type="tel" placeholder="(437) 997-9921" value={form.phone} onChange={upd('phone')} /></div>
                <div className="fgrp"><label className="flbl">Company</label><input className="finp" placeholder="Your Company Inc." value={form.company} onChange={upd('company')} /></div>
              </div>
              <div className="fgrp"><label className="flbl">Order Notes</label><textarea className="ftxt" rows="3" placeholder="Deadline, colour notes, special instructions…" value={form.notes} onChange={upd('notes')} /></div>
            </CkSection>

            {/* Delivery */}
            <CkSection n={2} title="Delivery Method">
              {[
                { id: 'pickup', label: 'Local Pickup', sub: '6033 Shawson Dr, Unit 40 · Mississauga', price: 'Free' },
                { id: 'post', label: 'Canada Post', sub: '3–5 business days', price: `+$${pricing.shipping_post.toFixed(2)}` },
                { id: 'courier', label: 'Courier (FedEx/UPS)', sub: '1–2 business days', price: `+$${pricing.shipping_courier.toFixed(2)}` },
              ].map(opt => (
                <div key={opt.id} onClick={() => setDelivery(opt.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: delivery === opt.id ? 'rgba(249,115,22,.09)' : 'var(--s2)', border: `1px solid ${delivery === opt.id ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 10, padding: '12px 15px', cursor: 'pointer', transition: 'all .15s', marginBottom: 8 }}>
                  <div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{opt.label}</div><div style={{ fontSize: 11, color: 'var(--mu)' }}>{opt.sub}</div></div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--o)', flexShrink: 0, marginLeft: 12 }}>{opt.price}</div>
                </div>
              ))}
            </CkSection>

            {/* Turnaround */}
            <CkSection n={3} title="Turnaround Time">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }} className="ta-grid">
                {[
                  { id: 'standard', ico: '📦', l: 'Standard', sub: '5–7 business days', extra: '' },
                  { id: 'rush', ico: '⚡', l: 'Rush', sub: '2–3 business days', extra: `+${Math.round(pricing.rush_pct * 100)}%` },
                  { id: 'express', ico: '🚀', l: 'Express', sub: 'Same / next day', extra: `+${Math.round(pricing.express_pct * 100)}%` },
                ].map(opt => (
                  <div key={opt.id} onClick={() => setTurnaround(opt.id)} style={{ border: `1px solid ${turnaround === opt.id ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 10, padding: '13px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s', background: turnaround === opt.id ? 'rgba(249,115,22,.09)' : 'var(--s2)' }}>
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{opt.ico}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{opt.l}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)' }}>{opt.sub}</div>
                    {opt.extra && <div style={{ fontSize: 11, color: 'var(--o)', fontWeight: 700, marginTop: 3 }}>{opt.extra}</div>}
                  </div>
                ))}
              </div>
            </CkSection>

            {/* Artwork */}
            <CkSection n={4} title="Artwork Submission">
              <div style={{ background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.15)', borderRadius: 9, padding: '12px 15px', fontSize: 13, color: 'var(--mu)' }}>
                📎 After placing your order, email artwork to <strong style={{ color: 'var(--o)' }}>info@nexacustoms.ca</strong> with your order number. We accept PDF, AI, EPS, PNG/JPG (300dpi+).
              </div>
            </CkSection>
          </div>

          {/* Summary sidebar */}
          <div style={{ position: 'sticky', top: 76 }} className="ck-sum">
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22 }}>
              <div className="D" style={{ fontSize: 18, marginBottom: 14 }}>Order Summary</div>
              {cart.map(item => (
                <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mu)', marginBottom: 7 }}>
                  <span style={{ flex: 1, paddingRight: 8 }}>{item.name} ×{item.qty}</span>
                  <span style={{ color: 'var(--tx)', fontWeight: 600 }}>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--bd)', margin: '10px 0' }} />
              <SumRow label="Subtotal" val={`$${cartSubtotal.toFixed(2)}`} />
              {shipCost > 0 && <SumRow label="Shipping" val={`$${shipCost.toFixed(2)}`} />}
              {rushFee > 0 && <SumRow label={turnaround === 'rush' ? 'Rush fee' : 'Express fee'} val={`$${rushFee.toFixed(2)}`} />}
              <SumRow label="HST (13%)" val={`$${hst.toFixed(2)}`} />
              <div style={{ height: 1, background: 'var(--bd)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: 'var(--o)' }}>${total.toFixed(2)}</span>
              </div>

              {/* Payment */}
              <div style={{ marginTop: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Payment Method</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['stripe','💳 Pay by Card'],['invoice','🧾 Invoice / Pay on Pickup']].map(([id, lbl]) => (
                    <button key={id} onClick={() => setPayMethod(id)} style={{ flex: 1, padding: '10px 8px', borderRadius: 8, border: `2px solid ${payMethod === id ? 'var(--o)' : 'var(--bd)'}`, background: payMethod === id ? 'rgba(249,115,22,.1)' : 'var(--s2)', color: payMethod === id ? 'var(--o)' : 'var(--tx)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', fontFamily: "'DM Sans',sans-serif" }}>{lbl}</button>
                  ))}
                </div>
              </div>

              {payMethod === 'stripe' && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>Card Details</div>
                  <div id="stripe-card-el" style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 9, padding: 13 }} />
                  {stripeErr && <div style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>{stripeErr}</div>}
                  {!ls.raw('nxt_stripe_pk', '') && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 5 }}>Stripe key not set — order will use invoice mode.</div>}
                </div>
              )}

              <button onClick={handlePlace} disabled={placing} style={{ width: '100%', background: 'var(--o)', color: '#000', border: 'none', borderRadius: 'var(--r)', padding: 14, fontSize: 15, fontWeight: 700, cursor: placing ? 'not-allowed' : 'pointer', marginBottom: 8, fontFamily: "'DM Sans',sans-serif", opacity: placing ? 0.7 : 1, transition: 'all .18s' }}>
                {placing ? 'Placing Order…' : 'Place Order →'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--mu)', marginBottom: 10 }}>🔒 Secured by Stripe · SSL encrypted</div>
              <span onClick={() => go('cart')} style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--mu)', cursor: 'pointer' }}>← Edit Cart</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`.ck-layout{@media(max-width:1060px){grid-template-columns:1fr !important}}.ck-sum{@media(max-width:1060px){position:static !important}}.ta-grid{@media(max-width:480px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function CkSection({ n, title, children }) {
  return (
    <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22, marginBottom: 14 }}>
      <div className="D" style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--o)', color: '#000', fontSize: 11, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

// ── SUCCESS ───────────────────────────────────────────────────────────────────
export function SuccessPage() {
  const { go } = useApp();
  const orderNo = sessionStorage.getItem('last_order_no') || 'NCX—';
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
      <h1 className="D" style={{ fontSize: 'clamp(36px,5vw,60px)', marginBottom: 10, color: 'var(--gr)' }}>Order Confirmed!</h1>
      <p style={{ fontSize: 14, color: 'var(--mu)', maxWidth: 460, margin: '0 auto 12px', lineHeight: 1.7 }}>Your order has been received. We'll send a confirmation within 1 business day.</p>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, color: 'var(--o)', marginBottom: 28, background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.2)', borderRadius: 8, padding: '10px 24px', display: 'inline-block' }}>{orderNo}</div>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 14, padding: 22, maxWidth: 440, width: '100%', marginBottom: 28, textAlign: 'left' }}>
        {[['📎 Artwork', 'Email files to info@nexacustoms.ca with your order number'],['📍 Pickup', '6033 Shawson Dr, Unit 40, Mississauga'],['📞 Questions?', 'Call (437) 997-9921']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 12, fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--bd)' }}>
            <span style={{ color: 'var(--o)', flexShrink: 0, fontWeight: 600 }}>{k}</span>
            <span style={{ color: 'var(--mu)' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => go('products')}>Continue Shopping</button>
        <button className="btn btn-ghost" onClick={() => go('home')}>Back to Home</button>
      </div>
    </div>
  );
}

// ── QUOTE ─────────────────────────────────────────────────────────────────────
export function QuotePage() {
  const { go, showToast, ls, cats } = useApp();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', cat: 'Business Cards', qty: '', deadline: '', desc: '' });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit() {
    if (!form.fname || !form.email || !form.desc) { showToast('Please fill in required fields'); return; }
    const supaUrl = ls.raw('nxt_supa_url', ''); const supaKey = ls.raw('nxt_supa_key', '');
    if (supaUrl && supaKey && supaKey.length > 10) {
      const id = 'WEB-QUO-' + Date.now();
      fetch(supaUrl + '/rest/v1/pos_orders', { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': supaKey, 'Authorization': 'Bearer ' + supaKey, 'Prefer': 'return=minimal' }, body: JSON.stringify({ id, data: { id, description: form.cat + ': ' + form.desc.slice(0, 120), waveCustomerName: form.fname + ' ' + form.lname, contactName: form.fname + ' ' + form.lname, contactEmail: form.email, contactPhone: form.phone, total: 0, status: 'New', source: 'Quote Request', createdAt: new Date().toISOString() } }) }).catch(() => {});
    }
    const tok = ls.raw('nxt_tg_token', ''); const cid = ls.raw('nxt_tg_chatid', '');
    if (tok && cid) fetch(`https://api.telegram.org/bot${tok}/sendMessage?chat_id=${cid}&text=${encodeURIComponent(`📋 QUOTE REQUEST | ${form.fname} ${form.lname} | ${form.email} | ${form.phone} | ${form.cat} | ${form.desc.slice(0,100)}`)}`).catch(() => {});
    showToast('✓ Quote request sent! We\'ll respond within 1 business day.'); go('home');
  }

  return (
    <div className="W" style={{ padding: '40px 28px 76px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div className="badge-orange" style={{ marginBottom: 12 }}>Free Consultation</div>
        <h1 className="D" style={{ fontSize: 'clamp(32px,5vw,56px)', marginBottom: 8 }}>Request a Quote</h1>
        <p style={{ fontSize: 13, color: 'var(--mu)', maxWidth: 440, margin: '0 auto' }}>Tell us about your project. We'll get back to you within 1 business day.</p>
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
            <div className="fgrp"><label className="flbl">Project Description *</label><textarea className="ftxt" rows="4" placeholder="Sizes, finishes, deadline, special requirements…" value={form.desc} onChange={upd('desc')} /></div>
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
            {[['📞','(437) 997-9921','tel:+14379979921'],['✉️','info@nexacustoms.ca',null],['📍','6033 Shawson Dr, Unit 40, Mississauga',null]].map(([ico, val, href]) => (
              <div key={val} style={{ fontSize: 12, color: 'var(--mu)', display: 'flex', gap: 9, marginBottom: 10 }}>
                {ico} {href ? <a href={href} style={{ color: 'var(--o)' }}>{val}</a> : val}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`.qp-layout{@media(max-width:1060px){grid-template-columns:1fr !important}}`}</style>
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
        <p style={{ fontSize: 13, color: 'var(--mu)' }}>We're here to help with any print project, big or small.</p>
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
        <div className="fgrp"><label className="flbl">Message</label><textarea className="ftxt" rows="4" placeholder="Tell us about your project…" value={form.msg} onChange={upd('msg')} /></div>
        <button className="btn btn-primary" onClick={() => { showToast('✓ Message sent! We\'ll reply within 1 business day.'); setForm({ name:'',email:'',msg:'' }); }} style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: 13, borderRadius: 'var(--r)' }}>Send Message →</button>
      </div>
      <style>{`.ct-grid{@media(max-width:640px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// Shared helpers
function SumRow({ label, val, valStyle }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mu)', marginBottom: 7 }}>
      <span>{label}</span><span style={valStyle}>{val}</span>
    </div>
  );
}
