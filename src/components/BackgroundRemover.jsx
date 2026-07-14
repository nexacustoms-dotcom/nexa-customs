import { useState, useEffect, useRef } from 'react';

// ────────────────────────────────────────────────────────────────────────────
// Core algorithm: flood-fill from image edges based on sampled background
// color, with soft edge feathering. Runs 100% client-side on canvas — no
// API calls, no server cost, no external libraries.
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

  // Sample background color from corners + edge midpoints
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

  // Flood fill from all 4 edges to find connected background region
  const mask = new Uint8Array(iw * ih); // 0 = bg, 1 = fg
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

  // Apply mask, feathering the boundary so edges don't look jagged
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

function dataUrlToFile(dataUrl, filename) {
  return fetch(dataUrl).then(r => r.blob()).then(blob => new File([blob], filename, { type: 'image/png' }));
}

// ────────────────────────────────────────────────────────────────────────────
// Widget — one image at a time, minimal controls: preview, one button to
// remove the background, and a choice to use the processed or original file.
// ────────────────────────────────────────────────────────────────────────────
export default function BackgroundRemover({ file, onConfirm, onSkip }) {
  const [srcUrl, setSrcUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const imgElRef = useRef(null);

  useEffect(() => {
    setSrcUrl(null); setProcessedUrl(null); setError('');
    const reader = new FileReader();
    reader.onload = e => setSrcUrl(e.target.result);
    reader.readAsDataURL(file);
  }, [file]);

  function handleRemove() {
    if (!srcUrl) return;
    setProcessing(true); setError('');
    const img = new Image();
    img.onload = () => {
      // Let the "processing" state paint before the (synchronous) heavy work runs
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

  async function useImage(processed) {
    const finalUrl = processed ? processedUrl : srcUrl;
    const base = file.name.replace(/\.[^.]+$/, '');
    const outFile = processed ? await dataUrlToFile(finalUrl, `${base}-nobg.png`) : file;
    onConfirm(outFile);
  }

  const checker = {
    backgroundImage: 'linear-gradient(45deg,#2a2a33 25%,transparent 25%),linear-gradient(-45deg,#2a2a33 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2a2a33 75%),linear-gradient(-45deg,transparent 75%,#2a2a33 75%)',
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
    backgroundColor: '#1b1b21',
  };

  return (
    <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20, marginBottom: 18 }}>
      <div className="D" style={{ fontSize: 16, marginBottom: 4 }}>✂️ Remove background?</div>
      <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>
        {file.name} — if this is a photo or logo for a sticker/decal, we can cut out the background for you. Optional — you can also just use the original file.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ ...checker, width: 180, height: 180, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--bd)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {srcUrl && (
            <img src={processedUrl || srcUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            <div style={{ fontSize: 12, color: 'var(--gr)', fontWeight: 600 }}>✅ Background removed — checkered area shows transparency</div>
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
