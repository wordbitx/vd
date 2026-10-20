import { createRequire } from "node:module";

/**
 * Real Code 128 barcodes for booking slips and invoices, rendered server-side as inline SVG.
 * Falls back to a deterministic decorative stripe if the encoder is unavailable, so a slip never renders empty.
 */

type Bar = { x: number; w: number };

/**
 * bwip-js is server-only and large, so it is resolved lazily through createRequire.
 * The barcode for a slip must never be the reason a page fails to render.
 */
function bwipToSvg(options: Record<string, unknown>): string {
  const requireFn = createRequire(import.meta.url);
  const mod = requireFn("bwip-js") as { toSVG: (opts: Record<string, unknown>) => string };
  return mod.toSVG(options);
}

function decorative(text: string, width = 320, height = 62): Bar[] {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const bars: Bar[] = [];
  let x = 0;
  let i = 0;
  while (x < width) {
    h = Math.imul(h ^ (h << 13), 1234577) ^ Math.imul(h ^ (h >>> 7), 97);
    const w = 1 + (Math.abs(h) % 4);
    if (i % 2 === 0) bars.push({ x, w });
    x += w + 1 + (Math.abs(h >> 3) % 2);
    i += 1;
  }
  return bars;
}

export function barcodeSvg(text: string, opts: { height?: number; width?: number; margin?: number; tone?: string } = {}) {
  const { height = 54, margin = 6, tone = "#0d1f1d" } = opts;
  const clean = text.replace(/[^A-Za-z0-9\-.\s/]/g, "").slice(0, 40);
  try {
    const svg = bwipToSvg({
      bcid: "code128",
      text: clean,
      height,
      includetext: false,
      textalign: "center",
      background: "#00000000",
      barcolor: tone,
      padding: margin,
      scale: 2,
    });
    if (typeof svg === "string" && svg.startsWith("<svg")) {
      return svg
        .replace(/<svg /, '<svg preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" ')
        .replace(/#000000/g, tone);
    }
  } catch {
    /* fall through to the decorative renderer so a slip never renders blank */
  }
  const bars = decorative(clean, 340, height);
  const rects = bars.map((b) => `<rect x="${b.x}" y="0" width="${b.w}" height="${height}" fill="${tone}"/>`).join("");
  return `<svg viewBox="0 0 340 ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${rects}</svg>`;
}
