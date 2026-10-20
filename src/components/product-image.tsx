import type { ProductImageKind, StoreProduct } from "@/lib/types";

// Elegant vector "packshot" scenes so every product looks like a designed
// Jawad Select studio shot. Admins can override with a real photo URL per
// product (imageUrl) from the admin panel.

const NAVY = "#0a2540";
const NAVY2 = "#103a63";
const GOLD = "#c6a469";
const GOLD_D = "#9d7c43";
const IVORY = "#f7f1e1";

function Paw({ x, y, s = 1, fill = "#fff" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <ellipse cx="0" cy="4" rx="7.5" ry="6" />
      <ellipse cx="-9" cy="-2" rx="3" ry="4.2" transform="rotate(-18 -9 -2)" />
      <ellipse cx="-3.2" cy="-5.5" rx="3.1" ry="4.4" transform="rotate(-6 -3 -5)" />
      <ellipse cx="3.2" cy="-5.5" rx="3.1" ry="4.4" transform="rotate(6 3 -5)" />
      <ellipse cx="9" cy="-2" rx="3" ry="4.2" transform="rotate(18 9 -2)" />
    </g>
  );
}

function KindArt({ kind }: { kind: ProductImageKind }) {
  switch (kind) {
    case "food-bag":
      return (<>
        <rect x="60" y="38" width="80" height="16" rx="5" fill={NAVY2} />
        <path d="M60 54 h80 v96 a10 10 0 0 1 -10 10 H70 a10 10 0 0 1 -10 -10 Z" fill={NAVY} />
        <rect x="60" y="94" width="80" height="30" fill={GOLD} />
        <Paw x={100} y={109} s={1.15} fill={NAVY} />
        <rect x="74" y="64" width="52" height="5" rx="2.5" fill="#33507a" />
        <rect x="82" y="74" width="36" height="5" rx="2.5" fill="#33507a" />
        <path d="M128 152 a16 9 0 0 0 32 0 Z" fill={GOLD_D} />
        <circle cx="138" cy="149" r="3.4" fill="#8a5a2b" /><circle cx="147" cy="147" r="3.4" fill="#8a5a2b" /><circle cx="155" cy="149" r="3.4" fill="#8a5a2b" />
      </>);
    case "food-pouch":
      return (<>
        <path d="M66 44 h68 l6 106 a10 10 0 0 1 -10 10 H70 a10 10 0 0 1 -10 -10 Z" fill={NAVY2} />
        <rect x="66" y="44" width="68" height="10" fill={NAVY} />
        <rect x="70" y="58" width="60" height="3.4" rx="1.7" fill="#3c5c8a" />
        <circle cx="100" cy="102" r="24" fill="none" stroke={GOLD} strokeWidth="2.4" />
        <Paw x={100} y={103} s={1.3} fill={GOLD} />
        <rect x="80" y="136" width="40" height="5" rx="2.5" fill="#3c5c8a" />
      </>);
    case "kitten-food":
      return (<>
        <rect x="68" y="52" width="64" height="13" rx="4" fill={GOLD_D} />
        <path d="M68 65 h64 v84 a9 9 0 0 1 -9 9 H77 a9 9 0 0 1 -9 -9 Z" fill={NAVY} />
        <rect x="68" y="104" width="64" height="24" fill={IVORY} />
        <Paw x={100} y={116} s={0.95} fill={NAVY} />
        <g fill={IVORY}><path d="M126 150 a13 13 0 1 1 18 0 a9 6 0 0 1 -18 0Z" opacity="0" /></g>
        <g><circle cx="140" cy="138" r="14" fill="#e8ddc4" /><path d="M129 129 l-3 -10 10 4Z" fill="#e8ddc4" /><path d="M151 129 l3 -10 -10 4Z" fill="#e8ddc4" /><circle cx="135" cy="137" r="1.8" fill={NAVY} /><circle cx="145" cy="137" r="1.8" fill={NAVY} /><path d="M138 143 q2 2 4 0" stroke={NAVY} strokeWidth="1.6" fill="none" strokeLinecap="round" /></g>
      </>);
    case "litter":
      return (<>
        <path d="M52 70 L148 70 L158 152 a10 10 0 0 1 -10 10 H52 a10 10 0 0 1 -10 -10 Z" fill={NAVY} transform="translate(0 -6)" />
        <rect x="52" y="52" width="96" height="14" rx="4" fill={NAVY2} />
        <rect x="52" y="100" width="96" height="26" fill={GOLD} />
        <Paw x={100} y={113} s={1.05} fill={NAVY} />
        <g fill="#e8ddc4"><circle cx="62" cy="150" r="3" /><circle cx="74" cy="155" r="2.4" /><circle cx="132" cy="152" r="2.8" /><circle cx="142" cy="146" r="2.2" /><circle cx="86" cy="150" r="2.2" /></g>
      </>);
    case "toy":
      return (<g fill="none" strokeLinecap="round">
        <path d="M46 78 q54 -34 108 0 q-10 26 -54 26 q-44 0 -54 -26Z" stroke={NAVY} strokeWidth="11" />
        <path d="M60 116 q40 34 80 0 q-8 -20 -40 -20 q-32 0 -40 20Z" stroke={GOLD_D} strokeWidth="11" />
        <circle cx="46" cy="78" r="11" fill={GOLD} stroke="none" /><circle cx="154" cy="78" r="11" fill={GOLD} stroke="none" />
        <path d="M40 92 l-8 14 M52 92 l-3 15 M160 92 l8 14 M148 92 l3 15" stroke={GOLD_D} strokeWidth="4" />
        <Paw x={100} y={86} s={0.8} fill={NAVY} />
      </g>);
    case "harness":
      return (<g fill="none" strokeLinecap="round">
        <path d="M70 46 v88 M130 46 v88" stroke={NAVY} strokeWidth="13" />
        <path d="M70 74 h60 M70 110 h60" stroke={NAVY2} strokeWidth="11" />
        <circle cx="100" cy="92" r="13" stroke={GOLD_D} strokeWidth="5" />
        <path d="M100 79 q6 -30 34 -40" stroke={GOLD_D} strokeWidth="5" />
        <rect x="60" y="128" width="20" height="12" rx="3" fill={GOLD} stroke="none" /><rect x="120" y="128" width="20" height="12" rx="3" fill={GOLD} stroke="none" />
      </g>);
    case "grooming":
      return (<>
        <rect x="58" y="72" width="44" height="86" rx="9" fill={NAVY} />
        <rect x="70" y="52" width="20" height="20" rx="4" fill={NAVY2} />
        <path d="M80 52 v-8 h30" stroke={NAVY2} strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="58" y="100" width="44" height="26" fill={GOLD} />
        <Paw x={80} y={113} s={0.85} fill={NAVY} />
        <g><rect x="116" y="84" width="34" height="52" rx="8" fill={GOLD_D} /><g fill={IVORY}>{[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <circle key={`${r}-${c}`} cx={123 + c * 7} cy={94 + r * 11} r="1.7" />))}</g><rect x="126" y="136" width="14" height="22" rx="5" fill={NAVY2} /></g>
      </>);
    case "bowls":
      return (<>
        <rect x="36" y="128" width="128" height="7" rx="3.5" fill={GOLD_D} />
        <rect x="48" y="135" width="8" height="22" fill={NAVY2} /><rect x="144" y="135" width="8" height="22" fill={NAVY2} />
        <path d="M44 104 h52 a26 24 0 0 1 -52 0Z" fill={NAVY} /><ellipse cx="70" cy="104" rx="26" ry="5.5" fill={NAVY2} />
        <path d="M104 104 h52 a26 24 0 0 1 -52 0Z" fill={GOLD} /><ellipse cx="130" cy="104" rx="26" ry="5.5" fill={GOLD_D} />
        <circle cx="63" cy="101" r="3" fill="#8a5a2b" /><circle cx="72" cy="99" r="3" fill="#8a5a2b" /><circle cx="80" cy="101" r="3" fill="#8a5a2b" />
        <path d="M118 100 q6 -5 12 0 q6 -5 12 0" stroke="#7fb2d9" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>);
    case "treats":
      return (<>
        <rect x="62" y="46" width="76" height="14" rx="5" fill={GOLD_D} />
        <path d="M58 60 h84 v88 a12 12 0 0 1 -12 12 H70 a12 12 0 0 1 -12 -12Z" fill="#e9dfca" />
        <path d="M58 60 h84 v88 a12 12 0 0 1 -12 12 H70 a12 12 0 0 1 -12 -12Z" fill="none" stroke={NAVY} strokeWidth="4" />
        <g fill="#b57e46">
          <path d="M72 92 a6 6 0 1 1 6 -8 a6 6 0 1 1 8 5 l10 6 a6 6 0 1 1 7 6 a6 6 0 1 1 -8 5 l-10 -6 a6 6 0 1 1 -13 -8Z" transform="translate(-4 6) scale(.92)" />
          <circle cx="86" cy="128" r="8" /><circle cx="110" cy="134" r="8" /><circle cx="122" cy="112" r="7" />
        </g>
        <rect x="78" y="66" width="44" height="16" rx="4" fill={NAVY} /><Paw x={100} y={74} s={0.55} fill={GOLD} />
      </>);
    case "bed":
      return (<>
        <ellipse cx="100" cy="118" rx="64" ry="36" fill={NAVY} />
        <ellipse cx="100" cy="112" rx="64" ry="36" fill={NAVY2} />
        <ellipse cx="100" cy="114" rx="38" ry="20" fill="#e8ddc4" />
        <ellipse cx="100" cy="112" rx="38" ry="20" fill={IVORY} />
        <Paw x={100} y={113} s={0.9} fill={GOLD_D} />
        <path d="M52 96 a64 36 0 0 1 30 -16" stroke={GOLD} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>);
    case "carrier":
      return (<>
        <path d="M44 158 v-52 a56 48 0 0 1 112 0 v52 Z" fill={NAVY} />
        <rect x="44" y="146" width="112" height="12" fill={NAVY2} />
        <path d="M78 158 v-40 a22 20 0 0 1 44 0 v40 Z" fill="#0d3054" stroke={GOLD} strokeWidth="3" />
        <path d="M88 158 v-46 M100 158 v-52 M112 158 v-46 M79 128 h42 M79 142 h42" stroke={GOLD} strokeWidth="2.4" />
        <path d="M82 52 a18 12 0 0 1 36 0" fill="none" stroke={GOLD_D} strokeWidth="6" strokeLinecap="round" />
        <Paw x={58} y={92} s={0.7} fill={GOLD} />
      </>);
    case "wet-food":
      return (<>
        <g><rect x="46" y="86" width="52" height="68" rx="7" fill={NAVY} /><ellipse cx="72" cy="86" rx="26" ry="7" fill={GOLD} /><rect x="46" y="106" width="52" height="22" fill={IVORY} /><Paw x={72} y={117} s={0.8} fill={NAVY} /></g>
        <g><rect x="104" y="70" width="52" height="68" rx="7" fill={NAVY2} /><ellipse cx="130" cy="70" rx="26" ry="7" fill={GOLD_D} /><rect x="104" y="90" width="52" height="22" fill={GOLD} /><Paw x={130} y={101} s={0.8} fill={NAVY} /></g>
        <path d="M104 138 h52 v16 h-52Z" fill="#0d3054" />
      </>);
    case "supplement":
      return (<>
        <rect x="66" y="40" width="68" height="16" rx="5" fill={GOLD_D} />
        <path d="M62 56 h76 v92 a11 11 0 0 1 -11 11 H73 a11 11 0 0 1 -11 -11Z" fill={NAVY} />
        <rect x="62" y="88" width="76" height="34" fill={IVORY} />
        <path d="M100 96 v18 M91 105 h18" stroke="#b3261e" strokeWidth="5.5" strokeLinecap="round" />
        <g transform="rotate(38 140 148)"><rect x="128" y="140" width="26" height="13" rx="6.5" fill={GOLD} /><rect x="128" y="140" width="13" height="13" rx="6.5" fill={NAVY2} /></g>
        <g transform="rotate(-24 56 152)"><rect x="44" y="145" width="26" height="13" rx="6.5" fill="#e8ddc4" /><rect x="44" y="145" width="13" height="13" rx="6.5" fill={GOLD_D} /></g>
      </>);
    case "record-kit":
      return (<>
        <path d="M48 58 h44 l8 10 h52 a8 8 0 0 1 8 8 v70 a8 8 0 0 1 -8 8 H48 a8 8 0 0 1 -8 -8 V66 a8 8 0 0 1 8 -8Z" fill={GOLD_D} transform="translate(0 4)" />
        <rect x="56" y="82" width="88" height="62" rx="7" fill={NAVY} />
        <Paw x={76} y={104} s={0.85} fill={GOLD} />
        <rect x="92" y="94" width="40" height="5" rx="2.5" fill="#33507a" /><rect x="92" y="105" width="30" height="5" rx="2.5" fill="#33507a" />
        <path d="M68 126 h64" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" />
      </>);
    case "wand":
      return (<g fill="none" strokeLinecap="round">
        <path d="M42 158 L118 66" stroke={NAVY} strokeWidth="7" />
        <path d="M118 66 q26 4 30 26" stroke={GOLD_D} strokeWidth="3" />
        <g fill={GOLD} stroke="none">
          <path d="M148 92 q22 10 12 34 q-20 -6 -18 -28 q1 -6 6 -6Z" />
          <path d="M144 94 q-18 14 -8 34 q16 -10 12 -30 q-1 -5 -4 -4Z" fill={NAVY2} />
        </g>
        <circle cx="147" cy="92" r="5" fill={NAVY} stroke="none" />
        <Paw x={66} y={84} s={0.95} fill={GOLD_D} />
        <path d="M52 138 l-14 12 M60 146 l-10 14" stroke={GOLD} strokeWidth="4" />
      </g>);
    default:
      return (<><circle cx="100" cy="100" r="40" fill={NAVY} /><Paw x={100} y={101} s={1.9} fill={GOLD} /></>);
  }
}

const CATEGORY_TINTS: Record<string, [string, string]> = {
  "cat-food": ["#faf4e4", "#f0e2c0"],
  "dog-food": ["#f7f0e0", "#ecdcba"],
  "puppy-kitten-food": ["#fdf6e9", "#f3e6c6"],
  "dry-wet-food": ["#faf4e4", "#eee0bc"],
  "cat-litter": ["#f2efe6", "#e4dcc4"],
  "toys-enrichment": ["#eef3fa", "#d8e4f2"],
  "collars-leashes-harnesses": ["#edf2f9", "#d3e0f0"],
  "pet-beds": ["#f7f1e6", "#e9dcc0"],
  "bowls-feeders": ["#f5f2ea", "#e6ddc6"],
  "grooming-hygiene": ["#eef6f4", "#d5e8e0"],
  "travel-accessories": ["#edf2f9", "#d8e2ef"],
  "treats-chews": ["#fbf3e2", "#f0dcb2"],
  "medicines-supplements": ["#f0f5f9", "#dae7f0"],
  "pet-stationery": ["#f6f1e4", "#e8dcbc"],
};

export type PackshotProduct = Pick<StoreProduct, "name" | "categorySlug" | "imageKind" | "imageUrl">;

export function ProductImage({ product, className = "" }: { product: PackshotProduct; className?: string }) {
  if (product.imageUrl) {
    return (
      <div className={`product-image ${className}`} role="img" aria-label={product.name} style={{ backgroundImage: `url(${product.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
    );
  }
  const [from, to] = CATEGORY_TINTS[product.categorySlug] ?? ["#faf6ec", "#eee3c6"];
  return (
    <div className={`product-image ${className}`} role="img" aria-label={`${product.name} — Jawad Select packshot`} style={{ background: `radial-gradient(120% 100% at 50% 0%, ${from} 0%, ${to} 100%)` }}>
      <span className="product-packshot">
        <span className="packshot-scene" aria-hidden="true">
          <svg viewBox="0 0 200 200" role="presentation">
            <circle cx="100" cy="98" r="66" fill="rgba(255,255,255,.55)" />
            <ellipse cx="100" cy="170" rx="58" ry="8" fill="rgba(10,37,64,.13)" />
            <KindArt kind={product.imageKind} />
          </svg>
        </span>
        <span className="packshot-caption">Jawad Select</span>
      </span>
    </div>
  );
}
