import type { Arte } from './personagens';

/** Cenários e ícones originais em SVG. */

const svg = (w: number, h: number, escala: number, corpo: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w * escala}" height="${h * escala}" viewBox="0 0 ${w} ${h}">${corpo}</svg>`;

// Gerador pseudoaleatório fixo para o cenário sair sempre igual.
function rng(semente: number) {
  let s = semente;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

// ------------------------------------------------------------------ Ícones (64x64)

const icone = (corpo: string) => svg(64, 64, 3, corpo);

const ICONES: Record<string, string> = {
  espada: icone(`
    <g transform="rotate(45 32 32)">
      <path d="M28 4 L36 4 L36 40 L32 46 L28 40 Z" fill="#e8f1ff" stroke="#7d8ca8" stroke-width="2"/>
      <path d="M32 6 L32 40" stroke="#b9c7e0" stroke-width="2"/>
      <rect x="18" y="40" width="28" height="6" rx="3" fill="#f5c542" stroke="#a07a10" stroke-width="2"/>
      <rect x="29" y="46" width="6" height="12" rx="2" fill="#7a4a20"/>
      <circle cx="32" cy="60" r="4" fill="#f5c542" stroke="#a07a10" stroke-width="1.5"/>
    </g>`),
  herois: icone(`
    <circle cx="22" cy="22" r="10" fill="#8e7cf0"/><path d="M6 52 Q8 34 22 34 Q36 34 38 52 Z" fill="#8e7cf0"/>
    <circle cx="42" cy="24" r="11" fill="#4fc3f7" stroke="#1d3557" stroke-width="2"/><path d="M24 58 Q26 38 42 38 Q58 38 60 58 Z" fill="#4fc3f7" stroke="#1d3557" stroke-width="2"/>`),
  galeria: icone(`
    <rect x="6" y="10" width="52" height="44" rx="6" fill="#f5e6c8" stroke="#a07a10" stroke-width="3"/>
    <rect x="12" y="16" width="40" height="32" rx="3" fill="#6fd3ff"/>
    <path d="M12 48 L26 30 L36 42 L42 36 L52 48 Z" fill="#5cd65c"/>
    <circle cx="44" cy="24" r="4" fill="#f5c542"/>`),
  ajuda: icone(`
    <circle cx="32" cy="32" r="26" fill="#5cd65c" stroke="#2a7a2a" stroke-width="3"/>
    <text x="32" y="44" font-size="34" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">?</text>`),
  bytes: icone(`
    <path d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z" fill="#4fc3f7" stroke="#1a6f9a" stroke-width="3"/>
    <path d="M32 4 L56 18 L32 32 L8 18 Z" fill="#9be3ff"/>
    <text x="32" y="48" font-size="18" font-family="monospace" font-weight="bold" fill="#0b3c57" text-anchor="middle">01</text>`),
  commits: icone(`
    <rect x="29" y="2" width="6" height="60" rx="3" fill="#2a7a2a"/>
    <circle cx="32" cy="32" r="16" fill="#5cd65c" stroke="#2a7a2a" stroke-width="4"/>
    <circle cx="32" cy="32" r="6" fill="#d6ffd6"/>`),
  cadeado: icone(`
    <path d="M20 28 V20 Q20 8 32 8 Q44 8 44 20 V28" stroke="#9aa4b8" stroke-width="6" fill="none"/>
    <rect x="12" y="26" width="40" height="32" rx="6" fill="#c9d1e0" stroke="#6b7489" stroke-width="3"/>
    <circle cx="32" cy="40" r="5" fill="#6b7489"/><rect x="30" y="42" width="4" height="9" fill="#6b7489"/>`),
  coroa: icone(`
    <path d="M6 48 L10 18 L22 32 L32 12 L42 32 L54 18 L58 48 Z" fill="#f5c542" stroke="#a07a10" stroke-width="3"/>
    <rect x="6" y="46" width="52" height="8" rx="3" fill="#e0a800" stroke="#a07a10" stroke-width="2"/>
    <circle cx="32" cy="38" r="4" fill="#e05561"/>`),
  check: icone(`
    <circle cx="32" cy="32" r="26" fill="#5cd65c" stroke="#2a7a2a" stroke-width="3"/>
    <path d="M18 33 L28 43 L47 22" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  energia: icone(`
    <path d="M36 4 L12 36 L28 36 L24 60 L52 24 L34 24 Z" fill="#ffd34d" stroke="#b07a00" stroke-width="3" stroke-linejoin="round"/>`),
  fichas: icone(`
    <circle cx="32" cy="34" r="24" fill="#c0392b"/><circle cx="32" cy="30" r="24" fill="#ff7b86" stroke="#c0392b" stroke-width="3"/>
    <circle cx="32" cy="30" r="15" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 4"/>
    <text x="32" y="37" font-size="18" font-family="monospace" font-weight="bold" fill="#fff" text-anchor="middle">F</text>`),
  estrela: icone(`
    <path d="M32 4 L40 23 L60 24 L44 37 L50 58 L32 46 L14 58 L20 37 L4 24 L24 23 Z" fill="#ffd34d" stroke="#b07a00" stroke-width="3" stroke-linejoin="round"/>`),
  instanciar: icone(`
    <circle cx="32" cy="32" r="27" fill="#8e7cf0" stroke="#4b3fb5" stroke-width="3"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 5"/>
    <text x="32" y="40" font-size="20" font-family="monospace" font-weight="bold" fill="#fff" text-anchor="middle">new</text>`),
  loja: icone(`
    <path d="M10 22 H54 L50 58 H14 Z" fill="#ff9f1c" stroke="#a0600a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M22 24 V16 Q22 6 32 6 Q42 6 42 16 V24" stroke="#a0600a" stroke-width="4" fill="none"/>
    <circle cx="32" cy="40" r="8" fill="#ffd34d" stroke="#a0600a" stroke-width="2"/>`),
  editar: icone(`
    <circle cx="32" cy="32" r="28" fill="#2b6fd6" stroke="#fff" stroke-width="3"/>
    <path d="M20 44 L22 36 L40 18 L46 24 L28 42 Z" fill="#fff"/>
    <path d="M20 44 L22 36 L28 42 Z" fill="#f5c542"/>`),
  trofeu: icone(`
    <path d="M18 8 H46 V26 Q46 42 32 42 Q18 42 18 26 Z" fill="#f5c542" stroke="#a07a10" stroke-width="3"/>
    <path d="M18 14 H8 Q8 30 20 30 M46 14 H56 Q56 30 44 30" stroke="#a07a10" stroke-width="3" fill="none"/>
    <rect x="28" y="42" width="8" height="8" fill="#e0a800"/>
    <rect x="18" y="50" width="28" height="8" rx="2" fill="#e0a800" stroke="#a07a10" stroke-width="2"/>`),
  enigma: icone(`
    <rect x="8" y="8" width="48" height="48" rx="10" fill="#f5c542" stroke="#a07a10" stroke-width="3"/>
    <text x="32" y="44" font-size="30" font-family="monospace" font-weight="bold" fill="#5a3a00" text-anchor="middle">?</text>`),
};

// ------------------------------------------------------------------ Tela inicial (960x540)

const FUNDO_HOME = (() => {
  const r = rng(7);
  const torres = Array.from({ length: 14 }, (_, i) => {
    const w = 40 + r() * 30;
    const h = 120 + r() * 160;
    const x = i * 72 - 20 + r() * 20;
    const luzes = Array.from({ length: Math.floor(h / 24) }, (_, j) =>
      `<rect x="${x + 8}" y="${400 - h + 12 + j * 22}" width="${w - 16}" height="6" rx="3" fill="#7fe7ff" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`).join('');
    return `<rect x="${x}" y="${400 - h}" width="${w}" height="${h}" rx="6" fill="#2b2466" opacity=".85"/>${luzes}`;
  }).join('');
  const glifos = ['{ }', '&lt;/&gt;', ';', '01', '( )', '=&gt;', '[ ]', '#', '&amp;&amp;', '++'];
  const flutuantes = Array.from({ length: 16 }, () =>
    `<text x="${(r() * 940).toFixed(0)}" y="${(60 + r() * 300).toFixed(0)}" font-size="${(14 + r() * 18).toFixed(0)}" font-family="monospace" font-weight="bold" fill="#fff" opacity="${(0.12 + r() * 0.2).toFixed(2)}">${glifos[Math.floor(r() * glifos.length)]}</text>`).join('');
  const cores = ['#ff5d73', '#f5c542', '#4fc3f7', '#5cd65c', '#8e7cf0'];
  const bandeirolas = (y0: number, flecha: number) =>
    Array.from({ length: 22 }, (_, i) => {
      const x = i * 46;
      const t = (x + 23) / 960;
      const y = y0 + flecha * 4 * t * (1 - t);
      return `<path d="M${x + 6} ${y} L${x + 40} ${y} L${x + 23} ${y + 26} Z" fill="${cores[i % cores.length]}"/>`;
    }).join('') +
    `<path d="M0 ${y0} Q480 ${y0 + flecha * 2} 960 ${y0}" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`;
  return svg(960, 540, 2, `
    <defs>
      <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a1660"/><stop offset=".55" stop-color="#3b4fd8"/><stop offset="1" stop-color="#58c8ff"/>
      </linearGradient>
      <linearGradient id="chao" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5a3fd1"/><stop offset="1" stop-color="#2a1d78"/>
      </linearGradient>
      <radialGradient id="luz" cx=".5" cy="0" r="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="960" height="540" fill="url(#ceu)"/>
    ${torres}
    ${flutuantes}
    <path d="M380 0 L250 540 L710 540 L580 0 Z" fill="url(#luz)"/>
    <rect y="400" width="960" height="140" fill="url(#chao)"/>
    ${Array.from({ length: 13 }, (_, i) => `<path d="M${480 + (i - 6) * 40} 400 L${480 + (i - 6) * 170} 540" stroke="#7d6bff" stroke-width="1.5" opacity=".5"/>`).join('')}
    ${[420, 446, 480, 524].map((y) => `<path d="M0 ${y} H960" stroke="#7d6bff" stroke-width="1.5" opacity=".4"/>`).join('')}
    ${bandeirolas(14, 40)}
    <ellipse cx="480" cy="468" rx="150" ry="40" fill="#1a1250" opacity=".5"/>
    <ellipse cx="480" cy="456" rx="140" ry="36" fill="#3a2a9a"/>
    <ellipse cx="480" cy="448" rx="140" ry="36" fill="#4fc3f7"/>
    <ellipse cx="480" cy="444" rx="128" ry="31" fill="#2b6fd6"/>
    <ellipse cx="480" cy="444" rx="104" ry="24" fill="none" stroke="#9be3ff" stroke-width="3" stroke-dasharray="10 8"/>
  `);
})();

// ------------------------------------------------------------------ Mapa do capítulo (960x540)

/** Árvore binária estilizada, a "vegetação" do Vale das Interfaces. */
function arvore(x: number, y: number, s: number, cor: string) {
  const n = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="${7 * s}" fill="${cor}" stroke="#1d5a3a" stroke-width="${2 * s}"/>`;
  const l = (a: number, b: number, c: number, d: number) => `<path d="M${a} ${b} L${c} ${d}" stroke="#1d5a3a" stroke-width="${3 * s}"/>`;
  const h = 18 * s;
  const w = 14 * s;
  return `<rect x="${x - 2 * s}" y="${y}" width="${4 * s}" height="${16 * s}" fill="#6b4a2a"/>` +
    l(x, y, x - w, y - h) + l(x, y, x + w, y - h) + l(x - w, y - h, x - w * 1.6, y - 2 * h) + l(x - w, y - h, x - w * 0.4, y - 2 * h) + l(x + w, y - h, x + w * 1.6, y - 2 * h) +
    n(x, y) + n(x - w, y - h) + n(x + w, y - h) + n(x - w * 1.6, y - 2 * h) + n(x - w * 0.4, y - 2 * h) + n(x + w * 1.6, y - 2 * h);
}

const FUNDO_MAPA = (() => {
  const r = rng(3);
  const arvores = Array.from({ length: 18 }, () => {
    const x = r() * 960;
    const y = 200 + r() * 320;
    return { x, y, s: 0.6 + (y - 200) / 500 };
  }).sort((a, b) => a.y - b.y).map((a) => arvore(a.x, a.y, a.s, r() > 0.5 ? '#7ee07e' : '#5cc0a0')).join('');
  return svg(960, 540, 2, `
    <defs>
      <linearGradient id="ceuM" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1b2a6b"/><stop offset="1" stop-color="#3fa7d6"/>
      </linearGradient>
    </defs>
    <rect width="960" height="540" fill="url(#ceuM)"/>
    <path d="M0 200 Q120 120 260 170 Q400 110 520 160 Q680 90 820 150 Q900 130 960 160 V540 H0 Z" fill="#2d6a8a"/>
    <path d="M0 250 Q160 190 320 240 Q500 180 700 230 Q840 200 960 230 V540 H0 Z" fill="#2f8a6a"/>
    <path d="M0 330 Q200 280 420 320 Q640 270 960 310 V540 H0 Z" fill="#38a873"/>
    <path d="M-20 520 Q240 440 420 470 Q620 500 980 400" stroke="#6fd3ff" stroke-width="26" fill="none" opacity=".75"/>
    <path d="M-20 520 Q240 440 420 470 Q620 500 980 400" stroke="#c9f3ff" stroke-width="3" fill="none" stroke-dasharray="4 14" opacity=".9"/>
    ${arvores}
    <path d="M700 230 L760 60 L820 60 L860 230 Z" fill="#14264a" opacity=".35"/>
  `);
})();

export const ARTES_CENARIO: Arte[] = [
  ...Object.entries(ICONES).map(([k, s]) => ({ chave: `icone-${k}`, largura: 64, altura: 64, svg: s })),
  { chave: 'fundo-home', largura: 960, altura: 540, svg: FUNDO_HOME },
  { chave: 'fundo-mapa', largura: 960, altura: 540, svg: FUNDO_MAPA },
];
