// Cloudinary on-the-fly image optimization.
// Applied to event covers, highlight galleries and guest photos so the browser
// downloads a right-sized WebP/AVIF instead of the original 3-5 MB upload.
//
// Non-Cloudinary URLs (direct backend uploads, external links) are returned
// unchanged so the helper is always safe to call.

const PRESETS = {
  card: { w: 600, h: 360, c: "fill" },        // grid event cards (h-40 → h-44)
  thumb: { w: 240, h: 160, c: "fill" },       // highlight carousel thumbs
  hero: { w: 1600, c: "limit" },              // large detail / banner hero
  avatar: { w: 240, h: 240, c: "fill" },      // guest photos
  banner: { w: 1400, c: "limit" },            // full-bleed highlight gallery (sharp at 65vh on retina)
};

const DEFAULTS = { q: "auto", f: "auto" };

function buildTransform({ w, h, c, q, f }) {
  return [
    w && `w_${w}`,
    h && `h_${h}`,
    c && `c_${c}`,
    q && `q_${q}`,
    f && `f_${f}`,
  ]
    .filter(Boolean)
    .join(",");
}

export function optimizeImage(url, opts = {}) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("/upload/")) return url;

  const preset = opts.preset && PRESETS[opts.preset] ? PRESETS[opts.preset] : {};
  const transform = buildTransform({ ...DEFAULTS, ...preset, ...opts });
  if (!transform) return url;

  return url.replace("/upload/", `/upload/${transform}/`);
}

export const optimizeCard = (url) => optimizeImage(url, { preset: "card" });
export const optimizeHero = (url) => optimizeImage(url, { preset: "hero" });
export const optimizeThumb = (url) => optimizeImage(url, { preset: "thumb" });
export const optimizeAvatar = (url) => optimizeImage(url, { preset: "avatar" });
export const optimizeBanner = (url) => optimizeImage(url, { preset: "banner" });
