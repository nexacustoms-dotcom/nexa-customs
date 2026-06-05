import fs from 'fs';

const file = 'src/pages/AdminPage.jsx';
let c = fs.readFileSync(file, 'utf8');

// Fix: ensure OrdersTab is at top level (not nested)
// The issue is the old comment has 4 dashes, new has more
c = c.replace(
  `// ── ORDERS TAB ────────────────────────────────────────────────────────────────
function OrdersTab() {`,
  `}

// ── ORDERS TAB ─────────────────────────────────────────────────────────────────
function OrdersTab() {`
);

fs.writeFileSync(file, c);
console.log('Fixed! Line count:', c.split('\n').length);
