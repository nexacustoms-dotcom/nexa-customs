// Builds every customer email (order confirmation + order status updates) from settings you can edit in
// Admin → Notifications. Pure functions: nothing here sends anything or touches the database.

// ── Which notifications exist ────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { key: 'confirmation',     label: 'Order confirmation',        when: 'Sent automatically when a customer pays.' },
  { key: 'Order Received',   label: 'Order received',            when: 'Sent when you click "Order Received".' },
  { key: 'Proof Sent',       label: 'Proof ready',               when: 'Sent when you click "Proof Sent" (attach the proof file first).' },
  { key: 'Printing',         label: 'In production',             when: 'Sent when you click "Printing".' },
  { key: 'Printed',          label: 'Printing complete (shipping)', when: 'Sent when you click "Printed" on an order that will be shipped.' },
  { key: 'Printed (pickup)', label: 'Printing complete (pickup)',   when: 'Sent when you click "Printed" on a pickup order.' },
  { key: 'Shipped',          label: 'Shipped',                   when: 'Sent when you click "Shipped" on an order that is being shipped.' },
  { key: 'Ready for Pickup', label: 'Ready for pickup',          when: 'Sent when you click "Ready for Pickup" on a pickup order.' },
  { key: 'Delivered',        label: 'Delivered',                 when: 'Sent when you click "Delivered" on an order that was shipped.' },
  { key: 'Picked Up',        label: 'Picked up',                 when: 'Sent when you click "Picked Up" on a pickup order.' },
  { key: 'Cancelled',        label: 'Cancelled',                 when: 'Sent when you click "Cancelled".' },
];

// Admin order status + pickup/ship → which notification to use
export function notificationKeyFor(status, isPickup) {
  switch (status) {
    case 'Order Received': return 'Order Received';
    case 'Proof Sent':     return 'Proof Sent';
    case 'Printing':       return 'Printing';
    case 'Printed':        return isPickup ? 'Printed (pickup)' : 'Printed';
    case 'Shipped':        return isPickup ? 'Ready for Pickup' : 'Shipped';
    case 'Delivered':      return isPickup ? 'Picked Up' : 'Delivered';
    case 'Cancelled':      return 'Cancelled';
    default:               return null;
  }
}

// Words you can drop into any subject / headline / message, e.g. "Hi {first_name}"
export const PLACEHOLDERS = [
  ['{first_name}', "customer's first name"],
  ['{full_name}', "customer's full name"],
  ['{order_number}', 'order number'],
  ['{order_date}', 'order date'],
  ['{total}', 'order total, e.g. $54.15'],
  ['{tracking_number}', 'tracking number (blank if none)'],
  ['{tracking_sentence}', '"Your tracking number is …" (blank if none)'],
  ['{proof_link}', 'link to the proof file (Proof ready email)'],
  ['{estimate}', 'estimated delivery / pickup date'],
  ['{pickup_address}', 'your shop address'],
  ['{hours}', 'your opening hours'],
  ['{phone}', 'your phone number'],
];

export const DEFAULT_NOTIFY = {
  brand: {
    senderName: 'Nexa Customs',
    replyTo: 'info@nexacustoms.ca',
    logoUrl: '',                       // blank = use the logo from Admin → Appearance
    color: '#f97316',
    phone: '(437) 997-9921',
    address: 'Nexa Customs Inc., 6033 Shawson Dr, Unit 40, Mississauga, ON L5T 1J6',
    hours: 'Mon–Fri 10 AM–8 PM, Sat by appointment',
    website: 'https://nexacustoms.ca',
    contactLine: 'Questions about your order? Reply to this email or call {phone}.',
    footerText: '',
  },
  show: { orderBox: true, items: true, priceBreakdown: true, addresses: true, payment: true, shippingMethod: true, trackLink: true },
  messages: {
    'confirmation': {
      enabled: true,
      subject: 'Order {order_number} confirmed — Nexa Customs',
      headline: 'Thank you for your order, {first_name}.',
      message: "We've received order {order_number} and will review your artwork shortly. If anything needs attention, we'll contact you before printing.\n\nBelow is a copy of your order for your records.",
    },
    'Order Received': {
      enabled: true,
      subject: "We've received order {order_number}",
      headline: 'Order received',
      message: "Thank you for your order. We're reviewing it now. We'll email you again when your proof is ready for approval, or when your order goes to print if no proof is needed.",
    },
    'Proof Sent': {
      enabled: true,
      subject: 'Proof ready for your approval — {order_number}',
      headline: 'Your proof is ready',
      message: "A proof for order {order_number} is ready for your review.{proof_sentence}\n\nPlease check spelling, colours, sizes and layout carefully, then reply to this email with your approval or any changes. Production starts once we have your approval.",
    },
    'Printing': {
      enabled: true,
      subject: 'Your order is in production — {order_number}',
      headline: 'Your order is being printed',
      message: "Order {order_number} is now in production. We'll email you again when printing is finished.",
    },
    'Printed': {
      enabled: true,
      subject: 'Printing complete — {order_number}',
      headline: 'Printing is complete',
      message: "Order {order_number} has finished printing and is being finished and packed for shipping. We'll send your tracking details as soon as it ships.",
    },
    'Printed (pickup)': {
      enabled: true,
      subject: 'Printing complete — {order_number}',
      headline: 'Printing is complete',
      message: "Order {order_number} has finished printing and is being finished and packed. We'll let you know the moment it's ready for pickup.",
    },
    'Shipped': {
      enabled: true,
      subject: 'Your order has shipped — {order_number}',
      headline: 'Your order is on its way',
      message: 'Order {order_number} has shipped.{tracking_sentence}',
    },
    'Ready for Pickup': {
      enabled: true,
      subject: 'Your order is ready for pickup — {order_number}',
      headline: 'Your order is ready for pickup',
      message: 'Order {order_number} is ready.\n\nPickup location: {pickup_address}\nHours: {hours}',
    },
    'Delivered': {
      enabled: true,
      subject: 'Your order has been delivered — {order_number}',
      headline: 'Your order has been delivered',
      message: "Order {order_number} has been delivered. Thank you for choosing Nexa Customs. If anything isn't right, reply to this email and we'll sort it out.",
    },
    'Picked Up': {
      enabled: true,
      subject: 'Thank you — {order_number}',
      headline: 'Thank you',
      message: "Thank you for picking up order {order_number}. If anything isn't right, reply to this email and we'll make it right.",
    },
    'Cancelled': {
      enabled: true,
      subject: 'Order {order_number} has been cancelled',
      headline: 'Your order has been cancelled',
      message: "Order {order_number} has been cancelled. If this wasn't expected, reply to this email or call {phone}.",
    },
  },
  alerts: { onOrder: true, onQuote: true, onContact: true, extraEmails: '' },
};

// Saved settings + defaults. Anything missing (or a new field added later) falls back to the default.
export function mergeNotify(saved) {
  const s = (saved && typeof saved === 'object') ? saved : {};
  const d = DEFAULT_NOTIFY;
  const messages = {};
  Object.keys(d.messages).forEach(k => { messages[k] = { ...d.messages[k], ...(s.messages?.[k] || {}) }; });
  return {
    brand: { ...d.brand, ...(s.brand || {}) },
    show: { ...d.show, ...(s.show || {}) },
    messages,
    alerts: { ...d.alerts, ...(s.alerts || {}) },
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
export const esc = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = n => `$${(Number(n) || 0).toFixed(2)}`;
const signed = n => `${n >= 0 ? '+' : '−'}$${Math.abs(Number(n) || 0).toFixed(2)}`;
const safeColor = c => (/^#[0-9a-fA-F]{6}$/.test(String(c || '').trim()) ? String(c).trim() : DEFAULT_NOTIFY.brand.color);
const safeUrl = u => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '');

export function fillText(text, vars) {
  return String(text ?? '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : m));
}

function varsFor(settings, data) {
  const first = (data.customer_name || '').trim().split(/\s+/)[0] || 'there';
  const tn = (data.tracking_number || '').trim();
  return {
    first_name: first,
    full_name: (data.customer_name || '').trim() || 'there',
    order_number: data.order_number || '',
    order_date: data.order_date || '',
    total: money(data.total),
    tracking_number: tn,
    tracking_sentence: tn ? ` Your tracking number is ${tn}.` : '',
    proof_link: data.proofUrl || '',
    proof_sentence: data.proofUrl ? ' Use the button below to view it.' : " We'll send it to you separately if you haven't received it yet.",
    estimate: data.estimateDate || '',
    pickup_address: settings.brand.address,
    hours: settings.brand.hours,
    phone: settings.brand.phone,
  };
}

const FONT = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const INK = '#16161a';
const BODY = '#3d3d45';
const MUTED = '#76767f';
const LINE = '#e3e3e0';

function paragraphs(text) {
  return String(text || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
    .map(p => `<p style="margin:0 0 14px 0; font-family:${FONT}; font-size:15px; line-height:1.65; color:${BODY};">${esc(p).replace(/\n/g, '<br/>')}</p>`).join('');
}
const label = t => `<div style="font-family:${FONT}; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:${MUTED}; padding-bottom:4px;">${esc(t)}</div>`;

// ── Pieces of the email ──────────────────────────────────────────────────────
function itemsBlock(data) {
  if (!data.items?.length) return '';
  const rows = data.items.map(i => {
    const thumb = safeUrl(i.img);
    const img = thumb
      ? `<img src="${esc(thumb)}" width="56" height="56" alt="" style="display:block; width:56px; height:56px; object-fit:cover; border:1px solid ${LINE};" />`
      : `<div style="width:56px; height:56px; background:#f3f3f1; border:1px solid ${LINE};"></div>`;
    const name = i.cat
      ? `<a href="https://nexacustoms.ca/products/${esc(i.cat)}" style="color:${INK}; text-decoration:none; font-weight:600;">${esc(i.name)}</a>`
      : `<span style="color:${INK}; font-weight:600;">${esc(i.name)}</span>`;
    const small = t => `<div style="font-size:13px; line-height:1.55; color:${MUTED};">${t}</div>`;
    const opts = i.opts?.length ? small(esc(i.opts.join(' · '))) : '';
    const taNames = { standard: 'Standard (5–7 business days)', rush: 'Rush (2–3 business days)', express: 'Express (same / next day)' };
    const ta = small(`Turnaround: ${esc(taNames[i.turnaround || 'standard'] || i.turnaround)}`);
    const parts = i.breakdown ? [`Base ${money(i.breakdown.base)}`, ...(i.breakdown.lines || []).map(l => `${esc(l.label)} ${signed(l.amount)}`)] : [];
    if (i.taFee > 0) parts.push(`${i.turnaround === 'rush' ? 'Rush' : 'Express'} ${signed(i.taFee)}`);
    const bd = parts.length > 1 ? small(parts.join(' · ')) : '';
    return `<tr>
      <td style="padding:14px 14px 14px 0; width:56px; vertical-align:top; border-bottom:1px solid ${LINE};">${img}</td>
      <td style="padding:14px 12px 14px 0; vertical-align:top; font-family:${FONT}; font-size:14px; line-height:1.5; color:${INK}; border-bottom:1px solid ${LINE};">
        ${name}${opts}${ta}${bd}${small(`Qty ${esc(i.qty)} · ${money(i.unit)} each`)}
      </td>
      <td style="padding:14px 0; vertical-align:top; text-align:right; white-space:nowrap; font-family:${FONT}; font-size:14px; font-weight:600; color:${INK}; border-bottom:1px solid ${LINE};">${money(i.price)}</td>
    </tr>`;
  }).join('');
  return `<tr><td style="padding:26px 36px 0 36px;">
    <div style="font-family:${FONT}; font-size:15px; font-weight:600; color:${INK}; padding-bottom:10px; border-bottom:1px solid ${INK};">Order summary</div>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows}</table>
  </td></tr>`;
}

function totalsBlock(data, color) {
  const t = data.totals;
  if (!t) return '';
  const row = (l, v, strong) => `<tr>
    <td style="padding:5px 0; font-family:${FONT}; font-size:${strong ? 15 : 14}px; color:${strong ? INK : MUTED}; font-weight:${strong ? 700 : 400};">${esc(l)}</td>
    <td style="padding:5px 0; text-align:right; font-family:${FONT}; font-size:${strong ? 15 : 14}px; color:${strong ? INK : INK}; font-weight:${strong ? 700 : 500};">${esc(v)}</td></tr>`;
  const rows = [
    row(`Items (${t.pieces} pcs)`, money(t.items)),
    t.express > 0 ? row('Express / Rush turnaround', money(t.express)) : '',
    t.shipping > 0 ? row(`Shipping (${t.shippingLabel})`, money(t.shipping)) : row('Pickup (Mississauga)', '$0.00'),
    row(t.taxLabel, money(t.tax)),
  ].join('');
  return `<tr><td style="padding:10px 36px 0 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
      <td width="40%"></td>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows}
          <tr><td colspan="2" style="border-top:2px solid ${esc(color)}; height:6px; line-height:6px; font-size:0;">&nbsp;</td></tr>
          ${row('Total (CAD)', money(t.total), true)}
        </table>
      </td></tr></table>
  </td></tr>`;
}

function customerBlock(data, show) {
  const cells = [];
  const col = (title, html) => `<td width="50%" style="vertical-align:top; padding:0 16px 20px 0; font-family:${FONT}; font-size:14px; line-height:1.6; color:${BODY};">${label(title)}${html}</td>`;
  const lines = arr => (arr || []).map(esc).join('<br/>');
  const rows = [];
  if (show.addresses && (data.shipLines?.length || data.billLines?.length)) {
    rows.push(`<tr>${col(data.delivery === 'pickup' ? 'Pickup location' : 'Shipping address', lines(data.shipLines))}${col('Billing address', lines(data.billLines))}</tr>`);
  }
  const second = [];
  if (show.payment && data.paymentText) second.push(col('Payment', esc(data.paymentText)));
  if (show.shippingMethod && data.shipMethodText) second.push(col(data.delivery === 'pickup' ? 'Pickup' : 'Shipping method', `${esc(data.shipMethodText)}${data.estimateDate ? `<br/>${esc(data.estimateLabel || '')} ${esc(data.estimateDate)}` : ''}`));
  if (second.length) rows.push(`<tr>${second.join('')}${second.length === 1 ? '<td width="50%"></td>' : ''}</tr>`);
  if (!rows.length) return '';
  return `<tr><td style="padding:22px 36px 0 36px;">
    <div style="font-family:${FONT}; font-size:15px; font-weight:600; color:${INK}; padding-bottom:12px; border-bottom:1px solid ${INK}; margin-bottom:16px;">Customer information</div>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows.join('')}</table>
  </td></tr>`;
}

// ── The whole email ──────────────────────────────────────────────────────────
// settings: merged notification settings;  key: one of NOTIFICATIONS;  data: normalised order (see sampleOrder)
export function buildEmail(settings, key, data) {
  const st = mergeNotify(settings);
  const msg = st.messages[key] || st.messages.confirmation;
  const vars = varsFor(st, data);
  const color = safeColor(st.brand.color);
  const logo = safeUrl(st.brand.logoUrl) || safeUrl(data.logoUrl);
  const subject = fillText(msg.subject, vars);
  const headline = fillText(msg.headline, vars);
  const message = fillText(msg.message, vars);
  const contact = fillText(st.brand.contactLine, vars);
  const isConfirmation = key === 'confirmation';
  const showItems = st.show.items && isConfirmation;

  const header = logo
    ? `<img src="${esc(logo)}" alt="${esc(st.brand.senderName)}" height="40" style="display:block; height:40px; width:auto; border:0;" />`
    : `<div style="font-family:${FONT}; font-size:18px; font-weight:700; color:${INK};">${esc(st.brand.senderName)}</div>`;

  const meta = st.show.orderBox ? `<tr><td style="padding:6px 36px 0 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-top:1px solid ${LINE}; border-bottom:1px solid ${LINE};"><tr>
      <td style="padding:14px 0; font-family:${FONT};">${label('Order number')}<div style="font-size:15px; font-weight:600; color:${INK}; white-space:nowrap;">${esc(data.order_number)}</div></td>
      <td style="padding:14px 0; font-family:${FONT};">${label('Date')}<div style="font-size:15px; font-weight:600; color:${INK};">${esc(data.order_date)}</div></td>
      <td style="padding:14px 0; font-family:${FONT}; text-align:right;">${label('Total')}<div style="font-size:15px; font-weight:600; color:${INK};">${money(data.total)} CAD</div></td>
    </tr></table></td></tr>` : '';

  const tracking = (data.tracking_number && (key === 'Shipped' || key === 'Delivered'))
    ? `<tr><td style="padding:18px 36px 0 36px; font-family:${FONT}; font-size:14px; line-height:1.6; color:${BODY};">Tracking number: <strong style="color:${INK};">${esc(data.tracking_number)}</strong></td></tr>` : '';
  const trackLink = st.show.trackLink
    ? `<tr><td style="padding:18px 36px 0 36px; font-family:${FONT}; font-size:14px; line-height:1.6;"><a href="${esc(st.brand.website)}/order-status" style="color:${esc(color)}; font-weight:600; text-decoration:underline;">Check your order status online</a></td></tr>` : '';

  const proofUrl = (key === 'Proof Sent') ? safeUrl(data.proofUrl) : '';
  const proofBlock = proofUrl ? `<tr><td style="padding:2px 36px 8px 36px;">
      <a href="${esc(proofUrl)}" style="display:inline-block; background:${INK}; color:#ffffff; font-family:${FONT}; font-size:14px; font-weight:600; text-decoration:none; padding:12px 24px; border-radius:4px;">View your proof</a>
      <div style="font-family:${FONT}; font-size:12px; line-height:1.6; color:${MUTED}; padding-top:10px; word-break:break-all;">If the button doesn't open, copy this link into your browser:<br/>${esc(proofUrl)}</div>
    </td></tr>` : '';

  const html = `<div style="margin:0; padding:28px 12px; background:#f3f3f1;">
  <div style="display:none; max-height:0; overflow:hidden; font-size:1px; line-height:1px; color:#f3f3f1;">${esc(headline)} ${esc(message).slice(0, 110)}</div>
  <table align="center" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px; max-width:100%; background:#ffffff; border:1px solid ${LINE};">
    <tr><td style="height:4px; line-height:4px; font-size:0; background:${esc(color)};">&nbsp;</td></tr>
    <tr><td style="padding:28px 36px 6px 36px;">${header}</td></tr>
    <tr><td style="padding:22px 36px 8px 36px;">
      <h1 style="margin:0 0 14px 0; font-family:${FONT}; font-size:23px; line-height:1.3; font-weight:600; color:${INK};">${esc(headline)}</h1>
      ${paragraphs(message)}
    </td></tr>
    ${proofBlock}
    ${meta}
    ${tracking}
    ${showItems ? itemsBlock(data) : ''}
    ${showItems && st.show.priceBreakdown ? totalsBlock(data, color) : ''}
    ${isConfirmation ? customerBlock(data, st.show) : ''}
    ${trackLink}
    <tr><td style="padding:30px 36px 28px 36px;">
      <div style="border-top:1px solid ${LINE}; padding-top:18px; font-family:${FONT}; font-size:12.5px; line-height:1.7; color:${MUTED};">
        ${contact ? `${esc(contact)}<br/>` : ''}
        ${esc(st.brand.address)}<br/>
        <a href="${esc(st.brand.website)}" style="color:${MUTED};">${esc(String(st.brand.website).replace(/^https?:\/\//, ''))}</a>
        ${st.brand.footerText ? `<br/><br/>${esc(st.brand.footerText).replace(/\n/g, '<br/>')}` : ''}
      </div>
    </td></tr>
  </table>
</div>`;
  return { subject, headline, message, html };
}

// ── Sample order for the live preview and test emails ────────────────────────
export function sampleOrder() {
  return {
    order_number: 'NCX-1234567',
    order_date: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }),
    customer_name: 'Alex Morgan',
    customer_email: 'alex@example.com',
    delivery: 'post',
    total: 417.38,
    tracking_number: '1234 5678 9012',
    estimateLabel: 'Estimated delivery by',
    estimateDate: 'Friday, November 20',
    items: [
      { name: 'Lawn Signs (Coroplast)', cat: 'signs-banners', qty: 30, unit: 12.4167, price: 372.5, img: '',
        opts: ['18"×24"', 'Double Sided', 'Stakes: Yes'], turnaround: 'standard', taFee: 0,
        breakdown: { base: 280, lines: [{ label: 'Double Sided', amount: 52.5 }, { label: 'Stakes: Yes', amount: 40 }] } },
    ],
    totals: { pieces: 30, items: 372.5, express: 0, shipping: 25, shippingLabel: 'Canada Post', taxLabel: 'GST (5%)', tax: 19.88, total: 417.38 },
    shipLines: ['Alex Morgan', '253 Clockwork Drive', 'Brampton, ON L7A 5C7', 'Canada'],
    billLines: ['Alex Morgan', '253 Clockwork Drive', 'Brampton, ON L7A 5C7', 'Canada'],
    paymentText: 'Visa ending with 1216',
    shipMethodText: 'Canada Post · $25.00',
  };
}

// Who receives the shop alert emails: your main address plus any extra addresses added in Admin → Notifications.
export function alertRecipients(settings, primary) {
  const main = (primary || 'info@nexacustoms.ca').trim();
  const extra = String(mergeNotify(settings).alerts.extraEmails || '').split(/[,;\s]+/).map(x => x.trim()).filter(x => /^\S+@\S+\.\S+$/.test(x));
  return Array.from(new Set([main, ...extra])).join(',');
}

// ── Simple alert email for YOU (new order / quote request / contact message) ─────────────────────
// Built from the same field names the alerts already send. Sent as `email_html`, so an EmailJS template
// that contains only {{{email_html}}} shows it, and an older template that uses the individual fields
// keeps working exactly as before.
const ALERT_ROWS = [
  ['Order', 'order_number'], ['Customer', 'customer_name'], ['From', 'from_name'], ['Email', 'customer_email'], ['Email', 'from_email'],
  ['Phone', 'customer_phone'], ['Phone', 'phone'], ['Company', 'company'], ['Items', 'order_items'], ['Total', 'total'],
  ['Delivery', 'delivery'], ['Turnaround', 'turnaround'], ['Payment', 'payment_method'], ['Notes', 'notes'],
];
export function buildAlertEmail(title, params, settings) {
  const st = mergeNotify(settings);
  const color = safeColor(st.brand.color);
  const seen = new Set();
  const rows = [];
  ALERT_ROWS.forEach(([lbl, key]) => {
    const v = params[key];
    if (v === undefined || v === null) return;
    const val = String(v).trim();
    if (!val || /^(n\/a|not provided|—)$/i.test(val)) return;
    const sig = lbl + '|' + val;
    if (seen.has(sig)) return; seen.add(sig);
    rows.push(`<tr><td style="padding:9px 14px 9px 0; width:110px; vertical-align:top; border-bottom:1px solid ${LINE}; font-family:${FONT}; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:${MUTED};">${esc(lbl)}</td>
      <td style="padding:9px 0; vertical-align:top; border-bottom:1px solid ${LINE}; font-family:${FONT}; font-size:14px; line-height:1.6; color:${INK};">${esc(val).replace(/\n/g, '<br/>')}</td></tr>`);
  });
  return `<div style="margin:0; padding:24px 12px; background:#f3f3f1;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px; max-width:100%; background:#ffffff; border:1px solid ${LINE};">
    <tr><td style="height:4px; line-height:4px; font-size:0; background:${esc(color)};">&nbsp;</td></tr>
    <tr><td style="padding:24px 32px 6px 32px;"><h1 style="margin:0; font-family:${FONT}; font-size:20px; line-height:1.3; font-weight:600; color:${INK};">${esc(title)}</h1></td></tr>
    <tr><td style="padding:10px 32px 24px 32px;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows.join('')}</table>
      <p style="margin:16px 0 0 0; font-family:${FONT}; font-size:12.5px; color:${MUTED};">Reply to this email to answer the customer directly.</p></td></tr>
  </table></div>`;
}
