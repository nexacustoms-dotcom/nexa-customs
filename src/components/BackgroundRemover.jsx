import { useState, useEffect, useRef } from 'react';

// ────────────────────────────────────────────────────────────────────────────
// Background removal — flood-fill from image edges based on sampled
// background color, with soft edge feathering. Runs 100% client-side on
// canvas — no API calls, no server cost, no external libraries.
// ────────────────────────────────────────────────────────────────────────────
function stripBackground(imgEl, threshold = 32) {
  const maxD = 1400; // cap working size for speed; upscales fine for stickers
  const sc = Math.min(maxD / imgEl.naturalWidth, maxD / imgEl.naturalHeight, 1);
  const iw = Math.max(1, Math.round(imgEl.naturalWidth * sc));
  const ih = Math.max(1, Math.round(imgEl.naturalHeight * sc));

  const canvas = document.createElement('canvas');
  canvas.width = iw; canvas.height = ih;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgEl, 0, 0, iw, ih);

  const imgData = ctx.getImageData(0, 0, iw, ih);
  const data = imgData.data;

  const samplePts = [
    [0, 0], [iw - 1, 0], [0, ih - 1], [iw - 1, ih - 1],
    [Math.floor(iw / 2), 0], [Math.floor(iw / 2), ih - 1],
    [0, Math.floor(ih / 2)], [iw - 1, Math.floor(ih / 2)],
  ];
  const bgSamples = samplePts.map(([x, y]) => {
    const i = (y * iw + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bgR = Math.round(bgSamples.reduce((s, c) => s + c[0], 0) / bgSamples.length);
  const bgG = Math.round(bgSamples.reduce((s, c) => s + c[1], 0) / bgSamples.length);
  const bgB = Math.round(bgSamples.reduce((s, c) => s + c[2], 0) / bgSamples.length);

  function colorDist(r, g, b) {
    return Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
  }

  const mask = new Uint8Array(iw * ih);
  const visited = new Uint8Array(iw * ih);
  const queue = [];
  for (let x = 0; x < iw; x++) { queue.push(x); queue.push((ih - 1) * iw + x); }
  for (let y = 1; y < ih - 1; y++) { queue.push(y * iw); queue.push(y * iw + iw - 1); }

  const tol = threshold * 2.2;
  while (queue.length) {
    const idx = queue.shift();
    if (visited[idx]) continue;
    visited[idx] = 1;
    const x = idx % iw, y = Math.floor(idx / iw);
    const pi = idx * 4;
    const d = colorDist(data[pi], data[pi + 1], data[pi + 2]);
    if (d <= tol) {
      mask[idx] = 0;
      if (x > 0) queue.push(idx - 1);
      if (x < iw - 1) queue.push(idx + 1);
      if (y > 0) queue.push(idx - iw);
      if (y < ih - 1) queue.push(idx + iw);
    } else {
      mask[idx] = 1;
    }
  }
  for (let i = 0; i < iw * ih; i++) if (!visited[i]) mask[i] = 1;

  const result = new Uint8ClampedArray(data);
  for (let y = 0; y < ih; y++) {
    for (let x = 0; x < iw; x++) {
      const i = y * iw + x;
      let alpha = mask[i] === 1 ? 255 : 0;
      if (alpha === 0) {
        let fgNeighbors = 0;
        if (x > 0 && mask[i - 1] === 1) fgNeighbors++;
        if (x < iw - 1 && mask[i + 1] === 1) fgNeighbors++;
        if (y > 0 && mask[i - iw] === 1) fgNeighbors++;
        if (y < ih - 1 && mask[i + iw] === 1) fgNeighbors++;
        if (fgNeighbors > 0) alpha = Math.round((fgNeighbors / 4) * 180);
      }
      result[i * 4 + 3] = alpha;
    }
  }

  ctx.putImageData(new ImageData(result, iw, ih), 0, 0);
  return canvas.toDataURL('image/png');
}

// ────────────────────────────────────────────────────────────────────────────
// Outline — stamps a solid-color silhouette of the cutout around a ring of
// offset positions to build up an even border of the chosen thickness, then
// draws the original artwork back on top, centered. Classic "sticker border"
// look, no per-pixel contour tracing needed.
// ────────────────────────────────────────────────────────────────────────────
function addOutline(imgEl, color, widthPx) {
  const iw = imgEl.naturalWidth || imgEl.width;
  const ih = imgEl.naturalHeight || imgEl.height;
  const pad = widthPx + 4;

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = iw; maskCanvas.height = ih;
  const mctx = maskCanvas.getContext('2d');
  mctx.drawImage(imgEl, 0, 0, iw, ih);
  mctx.globalCompositeOperation = 'source-in';
  mctx.fillStyle = color;
  mctx.fillRect(0, 0, iw, ih);

  const canvas = document.createElement('canvas');
  canvas.width = iw + pad * 2; canvas.height = ih + pad * 2;
  const ctx = canvas.getContext('2d');

  const steps = Math.max(20, Math.round(widthPx * 2.5));
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const dx = Math.cos(angle) * widthPx;
    const dy = Math.sin(angle) * widthPx;
    ctx.drawImage(maskCanvas, pad + dx, pad + dy);
  }
  ctx.drawImage(imgEl, pad, pad, iw, ih);
  return canvas.toDataURL('image/png');
}

function dataUrlToFile(dataUrl, filename) {
  return fetch(dataUrl).then(r => r.blob()).then(blob => new File([blob], filename, { type: 'image/png' }));
}
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

const OUTLINE_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Black', value: '#000000' },
];
const OUTLINE_WIDTHS = [
  { label: 'Thin', value: 6 },
  { label: 'Medium', value: 12 },
  { label: 'Thick', value: 20 },
];

// ────────────────────────────────────────────────────────────────────────────
export default function BackgroundRemover({ file, onConfirm, onSkip }) {
  const [srcUrl, setSrcUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null); // after bg removal
  const [outlineUrl, setOutlineUrl] = useState(null);      // after outline applied
  const [processing, setProcessing] = useState(false);
  const [outlining, setOutlining] = useState(false);
  const [error, setError] = useState('');

  const [outlineOn, setOutlineOn] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#ffffff');
  const [outlineWidth, setOutlineWidth] = useState(12);
  const [customColor, setCustomColor] = useState('#ffffff');

  useEffect(() => {
    setSrcUrl(null); setProcessedUrl(null); setOutlineUrl(null); setError('');
    setOutlineOn(false);
    const reader = new FileReader();
    reader.onload = e => setSrcUrl(e.target.result);
    reader.readAsDataURL(file);
  }, [file]);

  function handleRemove() {
    if (!srcUrl) return;
    setProcessing(true); setError('');
    const img = new Image();
    img.onload = () => {
      requestAnimationFrame(() => {
        try {
          const out = stripBackground(img, 32);
          setProcessedUrl(out);
        } catch (e) {
          setError('Could not process this image — you can still use the original.');
        }
        setProcessing(false);
      });
    };
    img.onerror = () => { setProcessing(false); setError('Could not load this image.'); };
    img.src = srcUrl;
  }

  // Recompute the outline whenever it's toggled on, or its color/width changes
  useEffect(() => {
    if (!outlineOn || !processedUrl) { setOutlineUrl(null); return; }
    let cancelled = false;
    setOutlining(true);
    loadImg(processedUrl).then(img => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        try {
          const out = addOutline(img, outlineColor, outlineWidth);
          if (!cancelled) setOutlineUrl(out);
        } catch (e) {
          if (!cancelled) setError('Could not add an outline to this image.');
        }
        if (!cancelled) setOutlining(false);
      });
    });
    return () => { cancelled = true; };
  }, [outlineOn, outlineColor, outlineWidth, processedUrl]);

  const displayUrl = outlineOn && outlineUrl ? outlineUrl : (processedUrl || srcUrl);

  async function useImage(useProcessed) {
    if (!useProcessed) { onConfirm(file); return; }
    const base = file.name.replace(/\.[^.]+$/, '');
    const suffix = outlineOn && outlineUrl ? '-sticker' : '-nobg';
    const outFile = await dataUrlToFile(displayUrl, `${base}${suffix}.png`);
    onConfirm(outFile);
  }

  const checker = {
    backgroundImage: 'linear-gradient(45deg,#2a2a33 25%,transparent 25%),linear-gradient(-45deg,#2a2a33 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2a2a33 75%),linear-gradient(-45deg,transparent 75%,#2a2a33 75%)',
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
    backgroundColor: '#1b1b21',
  };

  const swatchStyle = (active, color) => ({
    width: 26, height: 26, borderRadius: 7, cursor: 'pointer',
    background: color, border: active ? '2px solid var(--o)' : '1px solid var(--bd)',
    boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px #00000022' : 'none',
  });

  return (
    <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20, marginBottom: 18 }}>
      <div className="D" style={{ fontSize: 16, marginBottom: 4 }}>✂️ Sticker Tools</div>
      <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>
        {file.name} — cut out the background and add a sticker-style border. Both optional — you can also just use the original file.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ ...checker, width: 180, height: 180, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--bd)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {srcUrl && (
            <img src={displayUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Step 1: background removal */}
          {!processedUrl ? (
            <button
              onClick={handleRemove}
              disabled={!srcUrl || processing}
              className="btn btn-primary"
              style={{ justifyContent: 'center', opacity: processing ? 0.7 : 1 }}
            >
              {processing ? 'Removing background…' : '✂️ Remove Background'}
            </button>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--gr)', fontWeight: 600 }}>✅ Background removed</div>
          )}

          {/* Step 2: outline, only offered once bg is removed */}
          {processedUrl && (
            <div style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <input type="checkbox" checked={outlineOn} onChange={e => setOutlineOn(e.target.checked)} />
                Add sticker outline
                {outlining && <span style={{ color: 'var(--mu)', fontWeight: 400 }}>(rendering…)</span>}
              </label>

              {outlineOn && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--mu)', width: 52 }}>Color</span>
                    {OUTLINE_COLORS.map(c => (
                      <div key={c.value} title={c.label} onClick={() => setOutlineColor(c.value)} style={swatchStyle(outlineColor === c.value, c.value)} />
                    ))}
                    <input
                      type="color"
                      value={customColor}
                      onChange={e => { setCustomColor(e.target.value); setOutlineColor(e.target.value); }}
                      title="Custom color"
                      style={{ width: 26, height: 26, padding: 0, border: outlineColor === customColor ? '2px solid var(--o)' : '1px solid var(--bd)', borderRadius: 7, cursor: 'pointer', background: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--mu)', width: 52 }}>Width</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {OUTLINE_WIDTHS.map(w => (
                        <button
                          key={w.value}
                          onClick={() => setOutlineWidth(w.value)}
                          className={outlineWidth === w.value ? 'btn btn-primary' : 'btn btn-ghost'}
                          style={{ fontSize: 11, padding: '4px 10px' }}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {error && <div style={{ fontSize: 12, color: '#ef4444' }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {processedUrl && (
              <button onClick={() => useImage(true)} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                Use This Image →
              </button>
            )}
            <button onClick={() => useImage(false)} className="btn btn-ghost" style={{ justifyContent: 'center' }}>
              {processedUrl ? 'Use Original Instead' : 'Skip, Use Original →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
