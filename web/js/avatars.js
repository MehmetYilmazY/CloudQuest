/* =========================================================================
   CloudQuest — Cyberpunk / tech-anime SVG avatarları
   Tamamen kod ile çizilir (telifsiz, çevrimdışı, tema uyumlu).
   Kullanım: avatarSVG(index, size)  ->  <svg> string
   ========================================================================= */

const AVATARS = [
  { id: "netrunner", label: "Netrunner", neon: "#38bdf8", skin: "#e6b48d", hair: "#0e2740", hairType: "hood",    face: "visor",     acc: "none" },
  { id: "ronin",     label: "Ronin",     neon: "#c084fc", skin: "#f0c9a0", hair: "#1a1030", hairType: "topknot", face: "eyes",      acc: "mask" },
  { id: "techno",    label: "Techno",    neon: "#4ade80", skin: "#e6b48d", hair: "#062e1a", hairType: "spike",   face: "eyes",      acc: "headphones" },
  { id: "oracle",    label: "Oracle",    neon: "#a78bfa", skin: "#e9c6a4", hair: "#2a0e3a", hairType: "long",    face: "eyes",      acc: "thirdeye" },
  { id: "pilot",     label: "Pilot",     neon: "#fb923c", skin: "#e6b48d", hair: "#111827", hairType: "helmet",  face: "visorFull", acc: "none" },
  { id: "ghost",     label: "Ghost",     neon: "#60a5fa", skin: "#bcd0e6", hair: "#0b1220", hairType: "none",    face: "eyes",      acc: "glitch" }
];

let __avUid = 0;

function avatarSVG(index, size) {
  const a = AVATARS[(index % AVATARS.length + AVATARS.length) % AVATARS.length];
  const uid = "av" + (__avUid++);
  const S = size || 120;
  const n = a.neon;

  const defs = `
    <defs>
      <radialGradient id="bg-${uid}" cx="50%" cy="38%" r="80%">
        <stop offset="0" stop-color="#132340"/>
        <stop offset="1" stop-color="#060a12"/>
      </radialGradient>
      <filter id="glow-${uid}" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

  const frame = `
    <rect x="3" y="3" width="234" height="234" rx="26" fill="url(#bg-${uid})" stroke="${n}" stroke-width="2"/>
    <rect x="10" y="10" width="220" height="220" rx="20" fill="none" stroke="${n}" stroke-width="0.6" opacity="0.35"/>
    <path d="M18 40 L18 18 L40 18 M200 18 L222 18 L222 40 M222 200 L222 222 L200 222 M40 222 L18 222 L18 200"
          fill="none" stroke="${n}" stroke-width="2" opacity="0.9"/>
    <circle cx="120" cy="128" r="66" fill="${n}" opacity="0.10"/>`;

  const shoulders = `<path d="M44 240 Q46 192 120 186 Q194 192 196 240 Z" fill="#0e1a2c" stroke="${n}" stroke-width="1.4"/>
    <path d="M120 186 L120 240" stroke="${n}" stroke-width="1" opacity="0.5"/>`;
  const neck = `<rect x="105" y="150" width="30" height="40" rx="8" fill="${a.skin}"/>
    <rect x="105" y="150" width="30" height="10" fill="#00000022"/>`;
  const head = `<rect x="83" y="80" width="74" height="90" rx="32" fill="${a.skin}"/>`;

  /* ---- saç (arka katman) ---- */
  let hairBack = "";
  if (a.hairType === "hood") {
    hairBack = `<path d="M54 152 Q50 76 120 54 Q190 76 186 152 Q120 116 54 152 Z" fill="#0e2036" stroke="${n}" stroke-width="1.6"/>`;
  } else if (a.hairType === "long") {
    hairBack = `<rect x="70" y="84" width="14" height="86" rx="7" fill="${a.hair}"/>
                <rect x="156" y="84" width="14" height="86" rx="7" fill="${a.hair}"/>
                <path d="M82 96 Q120 60 158 96 Q120 82 82 96 Z" fill="${a.hair}"/>`;
  }

  /* ---- saç / kask (ön katman) ---- */
  let hairFront = "";
  if (a.hairType === "spike") {
    hairFront = `<path d="M82 98 L94 56 L106 92 L120 50 L134 92 L146 58 L158 98 Q120 82 82 98 Z" fill="${a.hair}"/>
                 <path d="M120 50 L134 92 M120 50 L106 92" stroke="${n}" stroke-width="1" opacity="0.5"/>`;
  } else if (a.hairType === "topknot") {
    hairFront = `<path d="M84 98 Q120 62 156 98 Q120 82 84 98 Z" fill="${a.hair}"/>
                 <circle cx="120" cy="56" r="13" fill="${a.hair}" stroke="${n}" stroke-width="1.4"/>
                 <rect x="107" y="70" width="26" height="7" rx="3" fill="${n}"/>`;
  } else if (a.hairType === "helmet") {
    hairFront = `<path d="M76 122 Q76 60 120 56 Q164 60 164 122 Z" fill="#141d2e" stroke="${n}" stroke-width="1.6"/>
                 <path d="M120 56 L120 104" stroke="${n}" stroke-width="1.4" opacity="0.7"/>
                 <path d="M92 74 Q120 66 148 74" fill="none" stroke="${n}" stroke-width="1" opacity="0.5"/>`;
  } else if (a.hairType === "hood") {
    hairFront = `<path d="M80 92 Q120 58 160 92" fill="none" stroke="${n}" stroke-width="2" filter="url(#glow-${uid})"/>`;
  }

  /* ---- yüz ---- */
  let faceEl = "";
  if (a.face === "eyes") {
    faceEl = `
      <path d="M92 122 Q104 112 116 122 Q104 129 92 122 Z" fill="${n}" filter="url(#glow-${uid})"/>
      <path d="M124 122 Q136 112 148 122 Q136 129 124 122 Z" fill="${n}" filter="url(#glow-${uid})"/>
      <ellipse cx="105" cy="121" rx="2.6" ry="2" fill="#ffffff"/>
      <ellipse cx="135" cy="121" rx="2.6" ry="2" fill="#ffffff"/>
      <path d="M92 116 Q104 110 116 118" stroke="#00000055" stroke-width="1.5" fill="none"/>
      <path d="M124 118 Q136 110 148 116" stroke="#00000055" stroke-width="1.5" fill="none"/>`;
  } else if (a.face === "visor") {
    faceEl = `
      <rect x="82" y="112" width="76" height="18" rx="9" fill="#04121d" stroke="${n}" stroke-width="1.5"/>
      <rect x="88" y="119" width="64" height="3" rx="1.5" fill="${n}" filter="url(#glow-${uid})"/>`;
  } else if (a.face === "visorFull") {
    faceEl = `
      <rect x="84" y="104" width="72" height="34" rx="16" fill="#04121d" stroke="${n}" stroke-width="1.6"/>
      <polygon points="90,132 120,110 118,132" fill="${n}" opacity="0.18"/>
      <circle cx="106" cy="121" r="3" fill="${n}" filter="url(#glow-${uid})"/>
      <circle cx="134" cy="121" r="3" fill="${n}" filter="url(#glow-${uid})"/>`;
  }

  /* ---- aksesuar ---- */
  let accEl = "";
  if (a.acc === "mask") {
    accEl = `<path d="M88 138 Q120 158 152 138 L152 150 Q120 172 88 150 Z" fill="#0e1a2c" stroke="${n}" stroke-width="1.4"/>
             <path d="M104 150 L104 160 M120 152 L120 163 M136 150 L136 160" stroke="${n}" stroke-width="1" opacity="0.6"/>`;
  } else if (a.acc === "headphones") {
    accEl = `<path d="M74 98 Q120 54 166 98" fill="none" stroke="${n}" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
             <rect x="64" y="104" width="18" height="38" rx="9" fill="#141d2e" stroke="${n}" stroke-width="1.4"/>
             <rect x="158" y="104" width="18" height="38" rx="9" fill="#141d2e" stroke="${n}" stroke-width="1.4"/>
             <rect x="70" y="116" width="6" height="14" rx="3" fill="${n}"/>
             <rect x="164" y="116" width="6" height="14" rx="3" fill="${n}"/>`;
  } else if (a.acc === "thirdeye") {
    accEl = `<circle cx="120" cy="98" r="5" fill="${n}" filter="url(#glow-${uid})"/>
             <circle cx="120" cy="98" r="1.6" fill="#fff"/>
             <path d="M110 92 L120 96 L130 92" fill="none" stroke="${n}" stroke-width="1.2" opacity="0.7"/>`;
  } else if (a.acc === "glitch") {
    accEl = `<rect x="80" y="108" width="80" height="3" fill="${n}" opacity="0.45"/>
             <rect x="88" y="140" width="64" height="2" fill="#f472b6" opacity="0.5"/>
             <rect x="76" y="126" width="44" height="2" fill="#34d3ee" opacity="0.5"/>`;
  }

  const ghostWrap = a.id === "ghost";
  const bust = `${shoulders}${neck}${hairBack}${head}${hairFront}${faceEl}${accEl}`;

  return `<svg class="cq-avatar" viewBox="0 0 240 240" width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${defs}${frame}
    ${ghostWrap ? `<g opacity="0.86">${bust}</g>` : bust}
  </svg>`;
}
