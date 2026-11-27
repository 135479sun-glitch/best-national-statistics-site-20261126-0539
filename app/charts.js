// The Oz Ledger — chart builders.
// Hand-rolled inline SVG, no library: bar charts and line charts drawn from
// plain arrays of {label, value} pairs. Every chart is labelled, has a
// baseline, and prints its values so the picture is readable without colour.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function niceMax(values) {
  const m = Math.max(...values.map((v) => Math.abs(v)));
  if (m <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(m)));
  const n = m / pow;
  // Fine steps so a series like 23.8–27.6 tops out at 30, not 50.
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const step = steps.find((s) => n <= s) ?? 10;
  return step * pow;
}

// Horizontal bar chart. values: [{label, value, note?}], format: fn(value)->string.
// Negative values grow left of the zero line.
export function barChart(values, opts = {}) {
  const format = opts.format || ((v) => String(v));
  const width = opts.width || 640;
  const rowH = opts.rowHeight || 34;
  const labelW = opts.labelWidth || 150;
  const padR = 74;
  const top = 8;
  const height = top + values.length * rowH + 26;
  const max = niceMax(values.map((v) => v.value));
  const min = Math.min(0, ...values.map((v) => v.value));
  const minAbs = niceMax(values.filter((v) => v.value < 0).map((v) => v.value));
  const plotW = width - labelW - padR;
  const zeroX = labelW + (min < 0 ? (minAbs / (minAbs + max)) * plotW : 0);
  const scale = plotW / (minAbs + max);
  const bars = values.map((d, i) => {
    const y = top + i * rowH;
    const w = Math.max(2, Math.abs(d.value) * scale);
    const x = d.value >= 0 ? zeroX : zeroX - w;
    const fill = d.value < 0 ? "#b3402e" : d.highlight ? "#c97b1e" : "#1f6b4a";
    const valX = d.value >= 0 ? x + w + 8 : x - 8;
    const anchor = d.value >= 0 ? "start" : "end";
    return (
      `<text x="${labelW - 10}" y="${y + 15}" text-anchor="end" class="ch-label">${esc(d.label)}</text>` +
      `<rect x="${x}" y="${y + 3}" width="${w}" height="18" rx="3" fill="${fill}"/>` +
      `<text x="${valX}" y="${y + 17}" text-anchor="${anchor}" class="ch-value">${esc(format(d.value))}</text>` +
      (d.note ? `<text x="${labelW - 10}" y="${y + 30}" text-anchor="end" class="ch-note">${esc(d.note)}</text>` : "")
    );
  }).join("");
  const grid = [0, 0.5, 1].map((f) => {
    const x = zeroX + f * max * scale;
    return `<line x1="${x}" y1="${top}" x2="${x}" y2="${top + values.length * rowH - 4}" class="ch-grid"/>`;
  }).join("");
  return (
    `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart" class="chart">` +
    grid +
    `<line x1="${zeroX}" y1="${top}" x2="${zeroX}" y2="${top + values.length * rowH - 4}" class="ch-zero"/>` +
    bars +
    `</svg>`
  );
}

// Vertical bar chart with a zero line, for a short time series.
export function columnChart(values, opts = {}) {
  const format = opts.format || ((v) => String(v));
  const width = opts.width || 640;
  const height = opts.height || 260;
  const padL = 46, padR = 14, padT = 26, padB = 34;
  const max = niceMax(values.map((v) => v.value));
  const min = Math.min(0, ...values.map((v) => v.value));
  const plotH = height - padT - padB;
  const range = max - min;
  const zeroY = padT + (max / range) * plotH;
  const scale = plotH / range;
  const slot = (width - padL - padR) / values.length;
  const barW = Math.min(64, slot * 0.58);
  const cols = values.map((d, i) => {
    const cx = padL + i * slot + slot / 2;
    const h = Math.max(2, Math.abs(d.value) * scale);
    const y = d.value >= 0 ? zeroY - h : zeroY;
    const fill = d.value < 0 ? "#b3402e" : d.highlight ? "#c97b1e" : "#1f6b4a";
    return (
      `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" rx="3" fill="${fill}"/>` +
      `<text x="${cx.toFixed(1)}" y="${(y - 7).toFixed(1)}" text-anchor="middle" class="ch-value">${esc(format(d.value))}</text>` +
      `<text x="${cx.toFixed(1)}" y="${height - 12}" text-anchor="middle" class="ch-label">${esc(d.label)}</text>`
    );
  }).join("");
  const ticks = [0, max].map((v) => {
    const y = padT + ((max - v) / range) * plotH;
    return `<text x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="ch-label">${esc(format(v))}</text>` +
      `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - padR}" y2="${y.toFixed(1)}" class="ch-grid"/>`;
  }).join("");
  return (
    `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Column chart" class="chart">` +
    ticks +
    `<line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${width - padR}" y2="${zeroY.toFixed(1)}" class="ch-zero"/>` +
    cols +
    `</svg>`
  );
}

// Line chart with dots and value labels, for a short time series.
export function lineChart(values, opts = {}) {
  const format = opts.format || ((v) => String(v));
  const width = opts.width || 640;
  const height = opts.height || 260;
  const padL = 52, padR = 18, padT = 28, padB = 34;
  const nums = values.map((v) => v.value);
  const max = niceMax(nums);
  const min = Math.min(...nums);
  const lo = Math.min(min, max * 0.8);
  const range = max - lo || 1;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const px = (i) => padL + (i / (values.length - 1)) * plotW;
  const py = (v) => padT + ((max - v) / range) * plotH;
  const pts = values.map((d, i) => `${px(i).toFixed(1)},${py(d.value).toFixed(1)}`).join(" ");
  const dots = values.map((d, i) =>
    `<circle cx="${px(i).toFixed(1)}" cy="${py(d.value).toFixed(1)}" r="4.5" fill="#c97b1e" stroke="#fff" stroke-width="1.5"/>` +
    `<text x="${px(i).toFixed(1)}" y="${(py(d.value) - 10).toFixed(1)}" text-anchor="middle" class="ch-value">${esc(format(d.value))}</text>` +
    `<text x="${px(i).toFixed(1)}" y="${height - 12}" text-anchor="middle" class="ch-label">${esc(d.label)}</text>`
  ).join("");
  const gridVals = [lo, (lo + max) / 2, max];
  const grid = gridVals.map((v) => {
    const y = py(v);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - padR}" y2="${y.toFixed(1)}" class="ch-grid"/>` +
      `<text x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="ch-label">${esc(format(v))}</text>`;
  }).join("");
  return (
    `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart" class="chart">` +
    grid +
    `<polyline points="${pts}" fill="none" stroke="#1f6b4a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` +
    dots +
    `</svg>`
  );
}

// A simple donut for a single share, e.g. overseas-born 32%.
export function donut(pct, label, opts = {}) {
  const size = opts.size || 150;
  const r = 58, cx = size / 2, cy = size / 2;
  const frac = pct / 100;
  const a0 = -Math.PI / 2;
  const a1 = a0 + frac * 2 * Math.PI;
  const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const large = frac > 0.5 ? 1 : 0;
  return (
    `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(label)}" class="donut">` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e3dcc9" stroke-width="20"/>` +
    `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="#1f6b4a" stroke-width="20"/>` +
    `<text x="${cx}" y="${cy - 2}" text-anchor="middle" class="donut-big">${pct}%</text>` +
    `<text x="${cx}" y="${cy + 20}" text-anchor="middle" class="donut-small">${esc(label)}</text>` +
    `</svg>`
  );
}
