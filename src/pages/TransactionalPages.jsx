import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, sendEmailJS, imgUrl } from '../context/AppContext';

// Loaded only when a customer actually uploads an image in the artwork step —
// keeps this off the initial bundle for every other page on the site.
const BackgroundRemover = lazy(() => import('../components/BackgroundRemover'));

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
            {cart.map(item => {
              const thumb = item.imgs?.find(x=>x?.length) || item.img || '';
              return (
              <div key={item.cartId} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 14 }}>
                <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--s2)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {thumb ? <img src={imgUrl(thumb, 120)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /> : <span style={{ fontSize: 24 }}>🖨️</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{item.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)' }}>Qty: {item.qty}</span>
                    {(item.opts || []).map((o, i) => <span key={i} style={{ fontSize: 10, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 4, padding: '2px 7px', color: 'var(--mu)' }}>{o}</span>)}
                  </div>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--o)', flexShrink: 0, minWidth: 72, textAlign: 'right' }}>${item.price.toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.cartId)} style={{ color: 'var(--mu)', padding: 6, borderRadius: 6, fontSize: 15, cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--mu)'; e.currentTarget.style.background = 'none'; }}
                >✕</button>
              </div>
            );})}
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

  useEffect(() => {
    if (cart.length > 0 && typeof window.gtag === 'function') {
      window.gtag('event', 'begin_checkout', { currency: 'CAD', value: cartSubtotal, items: cart.map(i => ({ item_id: i.id, item_name: i.name, quantity: i.qty || 1, price: i.unitPrice || 0 })) });
    }
  }, []);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fn: '', ln: '', email: '', phone: '', company: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [shipping, setShipping] = useState({ address: '', city: '', province: 'ON', postal: '', country: 'Canada' });
  const [turnaround, setTurnaround] = useState('standard');
  const [payMethod, setPayMethod] = useState('stripe');
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeCheckDone, setStripeCheckDone] = useState(false);
  const [stripeErr, setStripeErr] = useState('');
  const [placing, setPlacing] = useState(false);
  const [artworkFiles, setArtworkFiles] = useState([]);
  const [artworkUploading, setArtworkUploading] = useState(false);
  const [imageQueue, setImageQueue] = useState([]); // image files awaiting a bg-removal decision
  const [activeImage, setActiveImage] = useState(null);
  const [delivery, setDelivery] = useState('pickup');
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
  // Rush/express fee is now baked into item prices at the product configurator — no global surcharge
  const rushFee = 0;
  const subtotal = +(cartSubtotal + shipCost).toFixed(2);
  const hst = +(subtotal * pricing.hst).toFixed(2);
  const total = +(subtotal + hst).toFixed(2);

  useEffect(() => {
    if (payMethod !== 'stripe' || step !== 4) return;
    setStripeReady(false);
    setStripeCheckDone(false);

    async function initStripe() {
      const pk = cfg.stripePk();
      if (!pk || pk.length < 10) { setStripeCheckDone(true); return; }
      // Load Stripe dynamically if not already loaded (saves 253KB on non-checkout pages)
      if (typeof window.Stripe === 'undefined') {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://js.stripe.com/v3/';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      try {
        const stripe = window.Stripe(pk);
        const elements = stripe.elements({ appearance: { theme: 'night', variables: { colorPrimary: '#f97316', colorBackground: '#242429', colorText: '#f0ede8', borderRadius: '9px' } } });
        const card = elements.create('card', {
          hidePostalCode: true,
          style: { base: { color: '#f0ede8', fontSize: '14px', fontFamily: 'DM Sans,sans-serif', '::placeholder': { color: '#7c7c8a' } } }
        });
        setTimeout(() => {
          try { card.mount('#stripe-card-el'); setStripeReady(true); } catch(e) { console.warn('Card mount:', e.message); }
          setStripeCheckDone(true);
        }, 300);
        card.on('change', e => setStripeErr(e.error?.message || ''));
        stripeRef.current = stripe; cardRef.current = card;
        return true;
      } catch (e) { console.warn('Stripe init:', e.message); setStripeCheckDone(true); return true; }
    }

    // Try immediately, then poll every 200ms for up to 8 seconds
    if (!initStripe()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (initStripe() || attempts > 40) {
          clearInterval(interval);
          if (attempts > 40) setStripeCheckDone(true);
        }
      }, 200);
      return () => clearInterval(interval);
    }
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

  function validateStep2() {
    if (delivery === 'pickup') return true;
    const errs = {};
    if (!shipping.address.trim()) errs.ship_address = 'Street address is required';
    if (!shipping.city.trim()) errs.ship_city = 'City is required';
    if (!shipping.postal.trim()) errs.ship_postal = 'Postal code is required';
    else if (!/^[A-Za-z]\d[A-Za-z][\s]?\d[A-Za-z]\d$/.test(shipping.postal.trim())) errs.ship_postal = 'Enter a valid Canadian postal code (e.g. L5T 1J6)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && typeof window.gtag === 'function') {
      window.gtag('event', 'add_payment_info', { currency: 'CAD', value: cartSubtotal });
    }
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

    // Plain images (png/jpg) get routed through the optional background-removal
    // step first. PDFs/AI/EPS/PSD/SVG/ZIP upload immediately as before.
    const bgEligible = ['png','jpg','jpeg'];
    const images = files.filter(f => bgEligible.includes(f.name.split('.').pop().toLowerCase()));
    const others = files.filter(f => !images.includes(f));

    if (others.length) {
      setArtworkUploading(true);
      const tempNo = 'TEMP-' + Date.now();
      const uploaded = [];
      for (const file of others) {
        const url = await uploadArtwork(file, tempNo);
        uploaded.push({ name: file.name, size: file.size, url, file });
      }
      setArtworkUploading(false);
      setArtworkFiles(prev => [...prev, ...uploaded]);
      const ok = uploaded.filter(x => x.url).length;
      showToast(ok > 0 ? `${ok} file(s) uploaded!` : 'Upload failed — email files after ordering');
    }

    if (images.length) setImageQueue(q => [...q, ...images]);
    if (e.target) e.target.value = '';
  }

  // Pull the next queued image into the bg-removal widget once the previous one is done
  useEffect(() => {
    if (!activeImage && imageQueue.length > 0) {
      setActiveImage(imageQueue[0]);
      setImageQueue(q => q.slice(1));
    }
  }, [imageQueue, activeImage]);

  async function finishImageUpload(finalFile) {
    setActiveImage(null);
    setArtworkUploading(true);
    const tempNo = 'TEMP-' + Date.now();
    const url = await uploadArtwork(finalFile, tempNo);
    setArtworkUploading(false);
    setArtworkFiles(prev => [...prev, { name: finalFile.name, size: finalFile.size, url, file: finalFile }]);
    showToast(url ? `${finalFile.name} uploaded!` : 'Upload failed — email files after ordering');
  }

  async function saveOrder(no, pmId = '') {
    const supaUrl = cfg.supaUrl(); const supaKey = cfg.supaKey();
    const itemsStr = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
    if (supaUrl && supaKey && supaKey.length > 10) {
      const orderData = {
        id: no,
        order_number: no,
        customer_name: (form.fn + ' ' + form.ln).trim(),
        customer_email: form.email,
        customer_phone: form.phone,
        company: form.company || '',
        items: itemsStr,
        total,
        delivery,
        turnaround,
        status: 'New',
        source: 'Website',
        payment_method: payMethod,
        stripe_pm_id: pmId || '',
        artwork_urls: artworkFiles.filter(f => f.url).map(f => f.url).join(', '),
        artwork_files: artworkFiles.map(f => f.name).join(', '),
        notes: form.notes || '',
        created_at: new Date().toISOString(),
      };
      // Try full save first (with new columns)
      try {
        const res = await fetch(supaUrl + '/rest/v1/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: supaKey, Authorization: 'Bearer ' + supaKey, Prefer: 'return=minimal' },
          body: JSON.stringify({
            ...orderData,
            billing_name: billing.sameAsContact ? (form.fn + ' ' + form.ln).trim() : (billing.fn + ' ' + billing.ln).trim(),
            billing_address: billing.sameAsContact ? '' : `${billing.address}, ${billing.city}, ${billing.province} ${billing.postal}`,
            shipping_address: delivery !== 'pickup' ? `${shipping.address}, ${shipping.city}, ${shipping.province} ${shipping.postal}` : 'Pickup',
          }),
        });
        if (!res.ok) {
          const err = await res.text();
          console.error('Supabase order save error:', err);
          // Fallback: save without new columns in case they don't exist yet
          const res2 = await fetch(supaUrl + '/rest/v1/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: supaKey, Authorization: 'Bearer ' + supaKey, Prefer: 'return=minimal' },
            body: JSON.stringify(orderData),
          });
          if (!res2.ok) {
            const err2 = await res2.text();
            console.error('Supabase fallback save error:', err2);
            showToast('Order placed! Note: database save failed — ' + err2.slice(0, 80));
          }
        }
      } catch (e) {
        console.error('Supabase network error:', e.message);
      }
    }
    const tok = cfg.tgToken(); const cid = cfg.tgChat();
    if (tok && cid) {
      const artInfo = artworkFiles.length > 0 ? ' | FILES: ' + artworkFiles.map(f => f.name).join(', ') : '';
      const itemsStr2 = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
      fetch(`https://api.telegram.org/bot${tok}/sendMessage?chat_id=${cid}&text=${encodeURIComponent(`NEW ORDER ${no} | ${(form.fn + ' ' + form.ln).trim()} | ${form.email} | ${form.phone} | ${itemsStr2} | $${total.toFixed(2)} | ${payMethod}${artInfo}`)}`).catch(() => {});
    }
    const ejsSvc = cfg.ejsSvc(); const ejsTpl = cfg.ejsTpl(); const ejsKey = cfg.ejsKey(); const ejsTo = cfg.ejsTo();
    if (ejsSvc && ejsTpl && ejsKey) {
      const p = {
        to_email:       ejsTo || 'info@nexacustoms.ca',
        from_name:      'Nexa Customs Website',
        reply_to:       form.email,
        order_number:   no,
        order_id:       no,
        customer_name:  (form.fn + ' ' + form.ln).trim(),
        customer_email: form.email,
        customer_phone: form.phone || 'N/A',
        company:        form.company || 'N/A',
        order_items:    cart.map(i => `${i.qty}x ${i.name}`).join(', '),
        total:          '$' + total.toFixed(2),
        delivery:       delivery === 'pickup' ? 'Free Pickup — Mississauga' : delivery === 'post' ? `Canada Post — ${shipping.address}, ${shipping.city}, ${shipping.province} ${shipping.postal}` : `Courier — ${shipping.address}, ${shipping.city}, ${shipping.province} ${shipping.postal}`,
        turnaround:     cart.map(i => i.turnaround || 'standard').join(', '),
        payment_method: payMethod,
        notes:          (form.notes || '') + (delivery !== 'pickup' ? `\nShip To: ${shipping.address}, ${shipping.city}, ${shipping.province} ${shipping.postal}` : ''),
        subject:        `New Order ${no} — ${(form.fn + ' ' + form.ln).trim()}`,
        message:        `New order!\n\nOrder: ${no}\nCustomer: ${(form.fn + ' ' + form.ln).trim()}\nEmail: ${form.email}\nPhone: ${form.phone}\nItems: ${cart.map(i => `${i.qty}x ${i.name}`).join(', ')}\nTotal: $${total.toFixed(2)}\nDelivery: ${delivery}${delivery !== 'pickup' ? `\nShip To: ${shipping.address}, ${shipping.city}, ${shipping.province} ${shipping.postal}` : ' (Pickup at 6033 Shawson Dr)'}\nPayment: ${payMethod}`,
      };
      sendEmailJS(ejsSvc, ejsTpl, ejsKey, p)
        .then(() => console.log('✅ Order email sent'))
        .catch(err => { console.error('❌ Order email failed:', err.message); showToast('Order saved! Email error: ' + err.message); });
    } else {
      console.warn('EmailJS not configured — skipping order email');
    }
  }

  async function handlePlace() {
    if (cart.length === 0) { showToast('Your cart is empty'); return; }
    const no = 'NCX-' + Math.floor(10000 + Math.random() * 90000);
    setPlacing(true);
    setStripeErr('');
    try {
      if (payMethod === 'stripe') {
        const pk = cfg.stripePk();
        if (pk && pk.length > 10 && stripeRef.current && cardRef.current) {
          // Step 1 — tokenize the card
          const billingName = billing.sameAsContact
            ? (form.fn + ' ' + form.ln).trim()
            : (billing.fn + ' ' + billing.ln).trim() || (form.fn + ' ' + form.ln).trim();
          const billingAddress = billing.sameAsContact ? null : {
            line1: billing.address,
            city: billing.city,
            state: billing.province,
            postal_code: billing.postal,
            country: billing.country === 'Canada' ? 'CA' : 'US',
          };
          const { error: pmError, paymentMethod } = await stripeRef.current.createPaymentMethod({
            type: 'card',
            card: cardRef.current,
            billing_details: {
              name: billingName,
              email: form.email,
              phone: form.phone,
              ...(billingAddress ? { address: billingAddress } : {}),
            },
          });
          if (pmError) { setStripeErr(pmError.message); setPlacing(false); return; }

          // Step 2 — actually charge via Edge Function
          const amountInCents = Math.round(total * 100);
          const itemsStr = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
          const edgeUrl = `${cfg.supaUrl()}/functions/v1/process-stripe-payment`;
          let chargeData = {};
          try {
            const res = await fetch(edgeUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': cfg.supaKey(),
                'Authorization': `Bearer ${cfg.supaKey()}`,
              },
              body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                amount: amountInCents,
                currency: 'cad',
                customer_name: (form.fn + ' ' + form.ln).trim(),
                customer_email: form.email,
                order_number: no,
                description: `Nexa Customs ${no} — ${itemsStr.slice(0, 100)}`,
                billing_details: {
                  name: billingName,
                  email: form.email,
                  ...(billingAddress ? { address: billingAddress } : {}),
                },
              }),
            });
            chargeData = await res.json();
          } catch (fetchErr) {
            console.error('Edge function unreachable:', fetchErr);
            showToast('Payment server error — please call us at (437) 997-9921');
            setPlacing(false);
            return;
          }

          // Step 3 — handle 3D Secure if required
          if (chargeData.requires_action && chargeData.payment_intent_client_secret) {
            const { error: actionErr } = await stripeRef.current.handleNextAction({
              clientSecret: chargeData.payment_intent_client_secret,
            });
            if (actionErr) {
              setStripeErr(actionErr.message || '3D Secure verification failed. Please try again.');
              setPlacing(false);
              return;
            }
          }

          // Step 4 — surface any charge error with the bank's exact message
          if (chargeData.error) {
            setStripeErr(chargeData.error);
            setPlacing(false);
            return;
          }

          // Step 5 — payment confirmed, now save order
          await saveOrder(no, chargeData.payment_intent_id || paymentMethod.id);
        } else {
          // Stripe not configured — save as invoice/quote
          await saveOrder(no);
        }
      } else {
        await saveOrder(no);
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', {
          transaction_id: no,
          currency: 'CAD',
          value: total,
          items: cart.map(i => ({ item_id: i.id, item_name: i.name, quantity: i.qty || 1, price: i.unitPrice || 0 })),
        });
      }
      sessionStorage.setItem('last_order_no', no);
      sessionStorage.setItem('last_delivery', delivery);
      sessionStorage.setItem('last_ship_addr', delivery !== 'pickup' ? `${shipping.address}, ${shipping.city}, ${shipping.province} ${shipping.postal}` : '');
      clearCart();
      sessionStorage.setItem('last_order_items', cart.map(i => i.qty+'x '+i.name).join('|'));
      sessionStorage.setItem('last_order_total', '$'+total.toFixed(2));
      navigate('/order-confirmed');
    } catch (err) {
      console.error('Checkout error:', err);
      showToast('Something went wrong — please try again or call us at (437) 997-9921');
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
                    <div key={opt.id} onClick={() => setDelivery(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: delivery === opt.id ? 'rgba(249,115,22,.08)' : 'var(--s2)', border: `2px solid ${delivery === opt.id ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all .18s', marginBottom: 10 }}>
                      {/* Radio */}
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${delivery === opt.id ? 'var(--o)' : 'var(--bd)'}`, background: delivery === opt.id ? 'var(--o)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                        {delivery === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#000' }} />}
                      </div>
                      {/* Icon */}
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: delivery === opt.id ? 'rgba(249,115,22,.15)' : 'var(--dk)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{opt.ico}</div>
                      {/* Label */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {opt.label}
                          {opt.tag && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20, background: 'var(--ol)', color: 'var(--o)', border: '1px solid var(--o25)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{opt.tag}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.4 }}>{opt.sub}</div>
                      </div>
                      {/* Price */}
                      <div style={{ fontWeight: 800, fontSize: 16, color: delivery === opt.id ? 'var(--o)' : 'var(--tx)', flexShrink: 0 }}>{opt.price}</div>
                    </div>
                  ))}
                </div>

                {/* Shipping address — only shown when post or courier selected */}
                {delivery !== 'pickup' && (
                  <div style={{ background: 'var(--sf)', border: `1px solid ${errors.ship_address || errors.ship_city || errors.ship_postal ? '#ef4444' : 'var(--bd)'}`, borderRadius: 'var(--rl)', padding: 26, marginBottom: 14 }}>
                    <div className="D" style={{ fontSize: 22, marginBottom: 4 }}>Shipping Address</div>
                    <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 18, lineHeight: 1.6 }}>Enter the address where you want your order delivered.</p>
                    <div className="fgrp">
                      <label className="flbl">Street Address *</label>
                      <input className="finp" placeholder="123 Main Street, Unit 4" value={shipping.address}
                        onChange={e => { setShipping(s => ({...s, address: e.target.value})); setErrors(er => ({...er, ship_address: ''})); }}
                        style={{ borderColor: errors.ship_address ? '#ef4444' : '' }} />
                      {errors.ship_address && <div style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.ship_address}</div>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div className="fgrp">
                        <label className="flbl">City *</label>
                        <input className="finp" placeholder="Mississauga" value={shipping.city}
                          onChange={e => { setShipping(s => ({...s, city: e.target.value})); setErrors(er => ({...er, ship_city: ''})); }}
                          style={{ borderColor: errors.ship_city ? '#ef4444' : '' }} />
                        {errors.ship_city && <div style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.ship_city}</div>}
                      </div>
                      <div className="fgrp">
                        <label className="flbl">Province</label>
                        <select className="fsel" value={shipping.province} onChange={e => setShipping(s => ({...s, province: e.target.value}))}>
                          {['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'].map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div className="fgrp">
                        <label className="flbl">Postal Code * <span style={{ color: 'var(--mu)', fontSize: 10 }}>(e.g. L5T 1J6)</span></label>
                        <input className="finp" placeholder="L5T 1J6" value={shipping.postal} maxLength={7}
                          onChange={e => { setShipping(s => ({...s, postal: e.target.value.toUpperCase()})); setErrors(er => ({...er, ship_postal: ''})); }}
                          style={{ borderColor: errors.ship_postal ? '#ef4444' : '', fontFamily: "'DM Mono',monospace", letterSpacing: '.1em' }} />
                        {errors.ship_postal && <div style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.ship_postal}</div>}
                      </div>
                      <div className="fgrp">
                        <label className="flbl">Country</label>
                        <select className="fsel" value={shipping.country} onChange={e => setShipping(s => ({...s, country: e.target.value}))}>
                          <option>Canada</option>
                          <option>United States</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 26, marginBottom: 14 }}>
                  <div className="D" style={{ fontSize: 22, marginBottom: 4 }}>Turnaround Summary</div>
                  <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>Turnaround was selected per item on the product page. Production starts after your artwork proof is approved.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cart.map((item, i) => {
                      const ta = item.turnaround || 'standard';
                      const ico = ta === 'express' ? '🚀' : ta === 'rush' ? '⚡' : '📦';
                      const sub = ta === 'express' ? 'Same / next day' : ta === 'rush' ? '2–3 business days' : '5–7 business days';
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                            <span>{ico}</span>
                            <span style={{ fontWeight: 700, textTransform: 'capitalize', color: ta !== 'standard' ? 'var(--o)' : 'var(--tx)' }}>{ta}</span>
                            <span style={{ color: 'var(--mu)' }}>· {sub}</span>
                          </div>
                        </div>
                      );
                    })}
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

                {activeImage && (
                  <Suspense fallback={<div style={{ padding: 20, fontSize: 12, color: 'var(--mu)' }}>Loading…</div>}>
                    <BackgroundRemover
                      file={activeImage}
                      onConfirm={finishImageUpload}
                      onSkip={() => finishImageUpload(activeImage)}
                    />
                  </Suspense>
                )}

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
                      <span style={{ color: 'var(--tx)', fontWeight: 600, textTransform: 'capitalize' }}>
                        {[...new Set(cart.map(i => i.turnaround || 'standard'))].join(', ')}
                      </span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(99,102,241,.08)', border: '2px solid rgba(99,102,241,.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 18 }}>
                    <span style={{ fontSize: 28 }}>💳</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Credit / Debit Card</div>
                      <div style={{ fontSize: 11, color: 'var(--mu)', display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                        <span>Visa</span><span>·</span><span>Mastercard</span><span>·</span><span>Amex</span><span>·</span><span>Interac</span><span>·</span><span style={{ color: '#818cf8' }}>🔒 Powered by Stripe</span>
                      </div>
                    </div>
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
                          {cfg.stripePk() && stripeCheckDone && !stripeReady && (
                            <div style={{ fontSize: 12, color: '#f87171', marginTop: 8, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 7, padding: '10px 12px', lineHeight: 1.6 }}>
                              ⚠️ <strong>Payment form not loading.</strong> Try disabling any ad blocker for this page and refreshing, or <a href="tel:4379979921" style={{ color: 'var(--o)', fontWeight: 700 }}>call us at (437) 997-9921</a>.
                            </div>
                          )}
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
                    : <>🔒 Place Order — ${total.toFixed(2)}</>
                  }
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
  const orderNo      = sessionStorage.getItem('last_order_no') || '';
  const deliveryType = sessionStorage.getItem('last_delivery') || 'pickup';
  const shipAddr     = sessionStorage.getItem('last_ship_addr') || '';
  const itemsRaw     = sessionStorage.getItem('last_order_items') || '';
  const totalRaw     = sessionStorage.getItem('last_order_total') || '';
  const items = itemsRaw ? itemsRaw.split('|').filter(Boolean) : [];

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
      <h1 className="D" style={{ fontSize: 'clamp(32px,5vw,54px)', marginBottom: 10, color: 'var(--gr)' }}>Order Confirmed!</h1>
      <p style={{ fontSize: 14, color: 'var(--mu)', maxWidth: 460, margin: '0 auto 12px', lineHeight: 1.7 }}>Your order has been received. We will be in touch within 1 business day with your proof.</p>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 20, color: 'var(--o)', marginBottom: 20, background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.2)', borderRadius: 8, padding: '10px 28px', display: 'inline-block', letterSpacing: '.05em' }}>{orderNo || 'NCX—'}</div>
      <div style={{ maxWidth: 480, width: '100%', marginBottom: 24 }}>
        {items.length > 0 && (
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: '16px 20px', marginBottom: 12, textAlign: 'left' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>Order Summary</div>
            {items.map((it, i) => (
              <div key={i} style={{ fontSize: 13, paddingBottom: 7, marginBottom: 7, borderBottom: i < items.length - 1 ? '1px solid var(--bd)' : 'none', color: 'var(--tx)' }}>{it}</div>
            ))}
            {totalRaw && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, paddingTop: 8, borderTop: '1px solid var(--bd)', marginTop: 4 }}>
                <span>Total Paid</span><span style={{ color: 'var(--o)' }}>{totalRaw}</span>
              </div>
            )}
          </div>
        )}
        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: '16px 20px', textAlign: 'left' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>Next Steps</div>
          {[
            ['📎 Artwork', 'Email files to info@nexacustoms.ca with your order number'],
            deliveryType === 'pickup'
              ? ['📍 Pickup', '6033 Shawson Dr, Unit 40, Mississauga · Mon–Fri 9AM–6PM']
              : ['📦 Shipping', shipAddr + ' · ' + (deliveryType === 'post' ? 'Canada Post 3–7 days' : 'Courier 1–2 days')],
            ['📞 Questions?', 'Call or text (437) 997-9921'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 12, fontSize: 13, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--bd)' }}>
              <span style={{ color: 'var(--o)', flexShrink: 0, fontWeight: 600, minWidth: 90 }}>{k}</span>
              <span style={{ color: 'var(--mu)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
        <button className="btn btn-ghost" onClick={() => navigate('/order-status')}>📦 Track Your Order</button>
      </div>
      <div style={{ fontSize: 12, color: 'var(--mu)' }}>A confirmation has been sent to your email.</div>
    </div>
  );
}

// ── QUOTE ─────────────────────────────────────────────────────────────────────
export function QuotePage() {
  const { showToast, cats, cfg } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', company: '', cat: 'Business Cards', qty: '', deadline: '', desc: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [quoteFile, setQuoteFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function uploadQuoteFile(file) {
    if (!file) return null;
    const supaUrl = cfg.supaUrl(); const supaKey = cfg.supaKey();
    if (!supaUrl || !supaKey) return null;
    setUploading(true);
    const ext = file.name.split('.').pop().toLowerCase();
    const fname = 'quotes/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
    try {
      const res = await fetch(supaUrl + '/storage/v1/object/nexa-media/' + fname, {
        method: 'POST',
        headers: { apikey: supaKey, Authorization: 'Bearer ' + supaKey, 'Content-Type': file.type, 'x-upsert': 'true' },
        body: file,
      });
      setUploading(false);
      if (res.ok) return supaUrl + '/storage/v1/object/public/nexa-media/' + fname;
    } catch(e) { console.error('Quote file upload:', e); }
    setUploading(false);
    return null;
  }

  async function submit() {
    if (!form.fname || !form.email || !form.desc) { showToast('Please fill in required fields'); return; }
    setSending(true);
    const id = 'QUO-' + Math.floor(10000 + Math.random() * 90000);
    const fileUrl = quoteFile ? await uploadQuoteFile(quoteFile) : null;

    // Save to Supabase
    const supaUrl = cfg.supaUrl(); const supaKey = cfg.supaKey();
    if (supaUrl && supaKey && supaKey.length > 10) {
      fetch(supaUrl + '/rest/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: supaKey, Authorization: 'Bearer ' + supaKey, Prefer: 'return=minimal' },
        body: JSON.stringify({ id, order_number: id, customer_name: form.fname + ' ' + form.lname, customer_email: form.email, customer_phone: form.phone, company: form.company || '', items: form.cat + ': ' + form.desc.slice(0, 200), total: 0, status: 'Quote', source: 'Quote Form', notes: form.desc + (fileUrl ? '\n\nArtwork: ' + fileUrl : ''), created_at: new Date().toISOString() })
      }).catch(e => console.error('Supabase quote save:', e));
    }

    // Telegram
    const tok = cfg.tgToken(); const cid = cfg.tgChat();
    if (tok && cid) {
      fetch(`https://api.telegram.org/bot${tok}/sendMessage?chat_id=${cid}&text=${encodeURIComponent(`📋 QUOTE REQUEST\n\nName: ${form.fname} ${form.lname}\nCompany: ${form.company || 'N/A'}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\nCategory: ${form.cat}\nQty: ${form.qty || 'N/A'}\nDeadline: ${form.deadline || 'N/A'}\nFile: ${fileUrl || 'None'}\n\n${form.desc.slice(0, 200)}`)}`).catch(() => {});
    }

    // EmailJS
    const ejsSvc = cfg.ejsSvc(); const ejsKey = cfg.ejsKey(); const ejsTo = cfg.ejsTo();
    const ejsTpl = cfg.ejsCtTpl() || cfg.ejsTpl();
    if (ejsSvc && ejsTpl && ejsKey) {
      const params = {
        to_email:       ejsTo || 'info@nexacustoms.ca',
        from_name:      form.fname + ' ' + form.lname,
        from_email:     form.email,
        reply_to:       form.email,
        customer_name:  form.fname + ' ' + form.lname,
        customer_email: form.email,
        customer_phone: form.phone || 'N/A',
        order_number:   id,
        order_id:       id,
        order_items:    `${form.cat} — Qty: ${form.qty || 'N/A'} — Deadline: ${form.deadline || 'N/A'}`,
        total:          'Quote Request',
        payment_method: 'Quote',
        notes:          form.desc,
        message:        `QUOTE REQUEST\n\nName: ${form.fname} ${form.lname}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\nCategory: ${form.cat}\nQty: ${form.qty || 'N/A'}\nDeadline: ${form.deadline || 'N/A'}\n\nDescription:\n${form.desc}`,
        subject:        `Quote Request from ${form.fname} ${form.lname} — ${form.cat}`,
        phone:          form.phone || 'N/A',
        company:        'N/A',
        delivery:       'N/A',
        turnaround:     'N/A',
      };
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id: ejsSvc, template_id: ejsTpl, user_id: ejsKey, template_params: params }),
        });
        if (res.ok) { console.log('✅ Quote email sent'); }
        else { const t = await res.text(); console.error('❌ Quote email failed:', t); showToast('Quote saved! Email error: ' + t); }
      } catch (e) { console.error('❌ Quote email error:', e.message); }
    }

    setSending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="W" style={{ padding: '80px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>📋</div>
        <h1 className="D" style={{ fontSize: 'clamp(28px,4vw,48px)', marginBottom: 12 }}>Quote Request Received!</h1>
        <p style={{ fontSize: 14, color: 'var(--mu)', maxWidth: 460, margin: '0 auto 12px', lineHeight: 1.75 }}>
          Thanks <strong>{form.fname}</strong>! We have received your quote request and will get back to you at <strong>{form.email}</strong> within 1 business day.
        </p>
        <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 32 }}>
          For urgent requests call us at <a href="tel:4379979921" style={{ color: 'var(--o)', fontWeight: 700 }}>(437) 997-9921</a>
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setSent(false)}>Submit Another Quote</button>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
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
            <div className="fgrp"><label className="flbl">Company Name</label><input className="finp" placeholder="Your Company Inc." value={form.company} onChange={upd('company')} /></div>
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
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20, marginBottom: 14 }}>
            <div className="D" style={{ fontSize: 16, marginBottom: 4 }}>Attach Artwork <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--mu)' }}>(optional)</span></div>
            <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 12 }}>Upload your logo, artwork, or reference file. PDF, AI, EPS, PNG, JPG accepted. Max 20MB.</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '2px dashed var(--bd)', borderRadius: 10, cursor: 'pointer',
              background: quoteFile ? 'rgba(34,197,94,.05)' : 'var(--s2)', borderColor: quoteFile ? 'rgba(34,197,94,.4)' : 'var(--bd)' }}>
              <input type="file" accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.psd,.svg,.tiff" style={{ display: 'none' }}
                onChange={e => setQuoteFile(e.target.files[0] || null)} />
              <span style={{ fontSize: 24 }}>{quoteFile ? '✅' : '📎'}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: quoteFile ? '#22c55e' : 'var(--tx)' }}>
                  {quoteFile ? quoteFile.name : 'Click to attach a file'}
                </div>
                {quoteFile && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>{(quoteFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</div>}
              </div>
            </label>
            {uploading && <div style={{ fontSize: 12, color: 'var(--o)', marginTop: 8 }}>⏳ Uploading file…</div>}
          </div>
          <button className="btn btn-primary" onClick={submit} disabled={sending || uploading}
            style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: 14, borderRadius: 'var(--r)', opacity: (sending || uploading) ? 0.7 : 1 }}>
            {sending ? 'Sending…' : uploading ? 'Uploading…' : 'Send Quote Request →'}
          </button>
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
  const { store, showToast, cfg } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', msg: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSend() {
    if (!form.name.trim()) { showToast('Please enter your name'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { showToast('Please enter a valid email'); return; }
    if (!form.msg.trim()) { showToast('Please enter a message'); return; }
    setSending(true);

    const ejsSvc = cfg.ejsSvc();
    const ejsKey = cfg.ejsKey();
    const ejsTo  = cfg.ejsTo();
    // Use dedicated contact template if set, otherwise fall back to order template
    const ejsTpl = cfg.ejsCtTpl() || cfg.ejsTpl();

    if (ejsSvc && ejsTpl && ejsKey) {
      const params = {
        to_email:    ejsTo || 'info@nexacustoms.ca',
        from_name:   form.name,
        from_email:  form.email,
        reply_to:    form.email,
        phone:       form.phone || 'Not provided',
        message:     form.msg,
        subject:     `New Contact Message from ${form.name}`,
        customer_name:  form.name,
        customer_email: form.email,
        customer_phone: form.phone || 'Not provided',
        order_number:   'Contact Form',
        order_items:    'N/A',
        total:          'N/A',
        payment_method: 'N/A',
        notes:          form.msg,
      };
      try {
        await sendEmailJS(ejsSvc, ejsTpl, ejsKey, params);
        console.log('✅ Contact email sent');
        setSent(true);
        setForm({ name: '', email: '', phone: '', msg: '' });
      } catch (err) {
        console.error('❌ Contact email failed:', err.message);
        showToast('Email error: ' + err.message);
      }
    } else {
      console.warn('EmailJS not configured');
      // Still show success to user so they know we got their message
      setSent(true);
      setForm({ name: '', email: '', phone: '', msg: '' });
    }
    setSending(false);
  }

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

        {sent ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Message Sent!</div>
            <p style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.7, marginBottom: 20 }}>
              Thanks for reaching out, <strong>{form.name || 'there'}</strong>! We will reply to your email within 1 business day.<br />
              For urgent orders call us at <a href="tel:4379979921" style={{ color: 'var(--o)', fontWeight: 700 }}>(437) 997-9921</a>.
            </p>
            <button className="btn btn-ghost" onClick={() => setSent(false)} style={{ fontSize: 13 }}>Send Another Message</button>
          </div>
        ) : (
          <>
            <div className="frow">
              <div className="fgrp"><label className="flbl">Name *</label><input className="finp" placeholder="Your name" value={form.name} onChange={upd('name')} /></div>
              <div className="fgrp"><label className="flbl">Email *</label><input className="finp" placeholder="your@email.com" value={form.email} onChange={upd('email')} /></div>
            </div>
            <div className="fgrp"><label className="flbl">Phone (optional)</label><input className="finp" placeholder="(416) 555-0000" value={form.phone} onChange={upd('phone')} /></div>
            <div className="fgrp"><label className="flbl">Message *</label><textarea className="ftxt" rows="4" placeholder="Tell us about your project..." value={form.msg} onChange={upd('msg')} /></div>
            <button className="btn btn-primary" onClick={handleSend} disabled={sending}
              style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: 13, borderRadius: 'var(--r)', opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}>
              {sending ? 'Sending…' : 'Send Message →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── ORDER STATUS PAGE ─────────────────────────────────────────────────────────
export function OrderStatusPage() {
  const { cfg } = useApp();
  const navigate = useNavigate();
  const [orderNo, setOrderNo] = useState('');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [order,   setOrder]   = useState(null);
  const [error,   setError]   = useState('');

  const STATUSES = ['New','In Progress','Ready','Completed'];
  const STATUS_INFO = {
    'New':         { icon: '📋', label: 'Order Received',             desc: 'We have your order and are reviewing your artwork.' },
    'In Progress': { icon: '🖨️',  label: 'In Production',             desc: 'Your order is on the press and being printed.' },
    'Ready':       { icon: '✅',  label: 'Ready for Pickup / Shipped', desc: "Your order is complete! Come pick it up or it's on its way." },
    'Completed':   { icon: '🎉', label: 'Completed',                  desc: 'Order delivered. Thank you for choosing Nexa Customs!' },
    'Cancelled':   { icon: '❌', label: 'Cancelled',                  desc: 'This order has been cancelled. Contact us if you have questions.' },
  };

  async function lookup() {
    const no = orderNo.trim().toUpperCase();
    const em = email.trim().toLowerCase();
    if (!no || !em) { setError('Please enter your order number and email.'); return; }
    if (!no.startsWith('NCX-') && !no.startsWith('QUO-')) { setError('Order numbers start with NCX- or QUO-'); return; }
    setLoading(true); setError(''); setOrder(null);
    const supaUrl = cfg.supaUrl(); const supaKey = cfg.supaKey();
    if (!supaUrl || !supaKey) { setError('Order tracking unavailable — store not configured.'); setLoading(false); return; }
    try {
      const res = await fetch(
        supaUrl + '/rest/v1/orders?order_number=eq.' + encodeURIComponent(no) + '&select=order_number,status,items,total,delivery,created_at,customer_name,customer_email',
        { headers: { apikey: supaKey, Authorization: 'Bearer ' + supaKey } }
      );
      const data = await res.json();
      if (!data || data.length === 0) { setError('No order found with that order number. Please double-check and try again.'); setLoading(false); return; }
      const match = data.find(o => (o.customer_email||'').toLowerCase() === em);
      if (!match) { setError('Email does not match our records for that order number.'); setLoading(false); return; }
      setOrder(match);
    } catch(e) { setError('Could not connect. Please try again.'); }
    setLoading(false);
  }

  const st = order ? (STATUS_INFO[order.status] || STATUS_INFO['New']) : null;
  const activeIdx = order ? STATUSES.indexOf(order.status) : -1;

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="W" style={{ maxWidth: 580, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="badge-orange" style={{ marginBottom: 12 }}>Order Tracking</div>
          <h1 className="D" style={{ fontSize: 'clamp(28px,5vw,48px)', marginBottom: 10 }}>Track Your Order</h1>
          <p style={{ fontSize: 13, color: 'var(--mu)' }}>Enter your order number (NCX-XXXXX) and email to check your production status.</p>
        </div>

        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mu)', display: 'block', marginBottom: 6 }}>Order Number</label>
            <input style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '11px 14px', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'DM Mono',monospace", letterSpacing: '.05em', boxSizing: 'border-box' }}
              placeholder="NCX-12345" value={orderNo}
              onChange={e => setOrderNo(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && lookup()} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mu)', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input type="email" style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '11px 14px', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()} />
          </div>
          {error && <div style={{ fontSize: 12, color: '#f87171', marginBottom: 12, padding: '8px 12px', background: 'rgba(239,68,68,.08)', borderRadius: 7 }}>{error}</div>}
          <button onClick={lookup} disabled={loading}
            style={{ width: '100%', padding: '13px', borderRadius: 9, background: 'var(--o)', color: '#000', border: 'none', fontWeight: 700, fontSize: 14, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: "'DM Sans',sans-serif" }}>
            {loading ? '🔍 Looking up…' : '🔍 Track Order'}
          </button>
        </div>

        {order && st && (
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 14, padding: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 28, padding: '20px', background: 'var(--s2)', borderRadius: 10 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{st.icon}</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 6 }}>{st.label}</div>
              <div style={{ fontSize: 13, color: 'var(--mu)' }}>{st.desc}</div>
            </div>

            {order.status !== 'Cancelled' && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                  {STATUSES.map((s, i) => {
                    const done    = i <= activeIdx;
                    const current = i === activeIdx;
                    return (
                      <div key={s} style={{ textAlign: 'center' }}>
                        <div style={{ height: 5, borderRadius: 4, background: done ? 'var(--o)' : 'var(--bd)', marginBottom: 6 }} />
                        <div style={{ fontSize: 10, fontWeight: current ? 700 : 400, color: current ? 'var(--o)' : done ? 'var(--tx)' : 'var(--mu)' }}>
                          {s === 'New' ? 'Received' : s === 'In Progress' ? 'Printing' : s === 'Ready' ? 'Ready' : 'Done'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 18 }}>
              {[
                ['Order #',  order.order_number],
                ['Name',     order.customer_name || '—'],
                ['Items',    order.items],
                ['Total',    order.total ? '$'+parseFloat(order.total).toFixed(2) : '—'],
                ['Delivery', order.delivery === 'pickup' ? 'Free Pickup — Mississauga' : order.delivery === 'post' ? 'Canada Post' : order.delivery === 'courier' ? 'Courier' : order.delivery || '—'],
                ['Placed',   order.created_at ? new Date(order.created_at).toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'}) : '—'],
              ].map(([k,v],i,arr) => (
                <div key={k} style={{ display:'grid', gridTemplateColumns:'110px 1fr', gap:10, padding:'10px 0', borderBottom: i<arr.length-1?'1px solid var(--bd)':'none', fontSize:13 }}>
                  <span style={{ color:'var(--mu)', fontWeight:600 }}>{k}</span>
                  <span style={{ color:'var(--tx)' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 14px', background: 'rgba(249,115,22,.06)', borderRadius: 8, fontSize: 12, color: 'var(--mu)', borderLeft: '3px solid var(--o)' }}>
              📞 Questions? Call <a href="tel:+14379979921" style={{ color: 'var(--o)', fontWeight: 700 }}>(437) 997-9921</a> or email <a href="mailto:info@nexacustoms.ca" style={{ color: 'var(--o)' }}>info@nexacustoms.ca</a>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', color: 'var(--mu)', fontSize: 12, cursor: 'pointer' }}>← Back to Products</button>
        </div>
      </div>
    </div>
  );
}
