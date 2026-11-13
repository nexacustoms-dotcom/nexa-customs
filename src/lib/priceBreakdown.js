// Itemised price breakdown for receipts. Purely informational: it never changes what is charged.
// Lines are built one option at a time (in the order the options appear on the product page), so
// base + every line adds up to the exact price the customer pays.

// A bare "Yes" / "No" / "None" choice means nothing on a receipt, so name the option group with it (e.g. "Stakes: Yes").
export function optLabelFor(prod, key, val) {
  const g = prod.opts?.find(x => x.key === key);
  const label = g?.opts?.find(o => o.id === val)?.l || val;
  return (g?.label && /^(yes|no|none)$/i.test(String(label).trim())) ? `${g.label}: ${label}` : label;
}

export function priceBreakdown(prod, qty, priceOpts, calcPrice) {
  try {
    const realTotal = calcPrice(prod, qty, priceOpts).total;
    // "size" is part of the base price (it is what you are buying), everything else is an option
    const groups = (prod.opts || []).filter(g => g.key !== 'size' && g.opts?.length);
    let cur = { ...priceOpts };
    groups.forEach(g => { const f = g.opts.find(o => !o.disabled); if (f) cur[g.key] = f.id; });
    let prev = calcPrice(prod, qty, cur).total;
    const lines = [];
    groups.forEach(g => {
      const selId = priceOpts[g.key];
      if (selId === undefined || selId === cur[g.key]) return;
      cur = { ...cur, [g.key]: selId };
      const t = calcPrice(prod, qty, cur).total;
      const d = +(t - prev).toFixed(2);
      if (Math.abs(d) >= 0.005) lines.push({ label: optLabelFor(prod, g.key, selId), amount: d });
      prev = t;
    });
    const base = +(realTotal - lines.reduce((s, l) => s + l.amount, 0)).toFixed(2);
    return { base, lines };
  } catch {
    return null;   // never block an order because of a display detail
  }
}
