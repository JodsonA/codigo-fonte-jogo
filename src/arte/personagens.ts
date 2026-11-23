/**
 * Arte vetorial original do jogo, em SVG.
 * Os heróis são personagens estilizados (chibi) INSPIRADOS nas figuras históricas,
 * sem reproduzir fotos ou retratos reais.
 */

export interface Arte {
  chave: string;
  largura: number;
  altura: number;
  svg: string;
}

export const svg = (w: number, h: number, corpo: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 3}" height="${h * 3}" viewBox="0 0 ${w} ${h}">${corpo}</svg>`;

export const PELE = '#f2c9a5';
export const PELE_SOMBRA = '#e0ae86';

/** Olhos grandes e expressivos no estilo do jogo. */
export function olhos(cx: number, cy: number, dist: number, cor = '#2b2340') {
  return [-1, 1]
    .map((s) => {
      const x = cx + s * dist;
      return `<ellipse cx="${x}" cy="${cy}" rx="5.5" ry="7" fill="${cor}"/>
        <circle cx="${x + 1.8}" cy="${cy - 2.5}" r="2.2" fill="#fff"/>
        <circle cx="${x - 1.5}" cy="${cy + 2.5}" r="1" fill="#fff" opacity=".7"/>`;
    })
    .join('');
}

// ------------------------------------------------------------------ Heróis

/** Ada, a Analista: vestido lilás de gola alta, coque com fita, cartão perfurado brilhando. */
const ADA = svg(160, 200, `
  <ellipse cx="80" cy="192" rx="46" ry="7" fill="#000" opacity=".3"/>
  <path d="M52 112 L108 112 L130 188 Q80 196 30 188 Z" fill="#6c5ce7"/>
  <path d="M34 178 Q80 188 126 178 L130 188 Q80 196 30 188 Z" fill="#4b3fb5"/>
  <path d="M62 120 L56 186 M80 120 L80 190 M98 120 L104 186" stroke="#5a4bd1" stroke-width="2"/>
  <rect x="56" y="96" width="48" height="32" rx="12" fill="#8e7cf0"/>
  <path d="M66 96 Q80 108 94 96 L90 92 Q80 100 70 92 Z" fill="#fff"/>
  <g transform="translate(80 114)">
    <circle r="7" fill="#f5c542"/>
    <circle r="3" fill="#8e7cf0"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<rect x="-1.6" y="-9.5" width="3.2" height="4" fill="#f5c542" transform="rotate(${a})"/>`).join('')}
  </g>
  <path d="M58 104 Q42 122 52 140" stroke="#8e7cf0" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="53" cy="141" r="6" fill="${PELE}"/>
  <path d="M102 104 Q116 116 110 130" stroke="#8e7cf0" stroke-width="11" stroke-linecap="round" fill="none"/>
  <g transform="rotate(-12 120 128)">
    <rect x="98" y="114" width="44" height="30" rx="3" fill="#f5e6c8" stroke="#ffd86b" stroke-width="2.5"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${104 + i * 6}" y="${120 + (i % 3) * 6}" width="3" height="5" fill="#5a4a3a"/>`).join('')}
    <rect x="104" y="136" width="30" height="2" fill="#c9b48f"/>
  </g>
  <circle cx="110" cy="130" r="6" fill="${PELE}"/>
  <circle cx="132" cy="112" r="2" fill="#ffd86b"/><circle cx="140" cy="122" r="1.5" fill="#ffd86b"/><circle cx="128" cy="104" r="1.2" fill="#ffd86b"/>
  <rect x="73" y="86" width="14" height="12" fill="${PELE_SOMBRA}"/>
  <circle cx="80" cy="24" r="15" fill="#3b2a2a"/>
  <path d="M68 22 Q80 30 92 22" stroke="#8e7cf0" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="60" r="34" fill="${PELE}"/>
  <path d="M46 62 Q42 24 80 24 Q118 24 114 62 Q112 46 100 40 Q86 48 62 42 Q50 48 46 62 Z" fill="#3b2a2a"/>
  <path d="M46 58 Q38 76 44 92 Q50 84 50 66 Z" fill="#3b2a2a"/>
  <path d="M114 58 Q122 76 116 92 Q110 84 110 66 Z" fill="#3b2a2a"/>
  ${olhos(80, 64, 13)}
  <ellipse cx="62" cy="76" rx="6" ry="3.5" fill="#ff8fa3" opacity=".5"/>
  <ellipse cx="98" cy="76" rx="6" ry="3.5" fill="#ff8fa3" opacity=".5"/>
  <path d="M74 80 Q80 85 86 80" stroke="#8a4a4a" stroke-width="2" fill="none" stroke-linecap="round"/>
`);

/** Turing, o Decifrador: paletó de tweed, cachecol listrado, fita de 0 e 1 e um rotor. */
const TURING = svg(160, 200, `
  <ellipse cx="80" cy="192" rx="42" ry="7" fill="#000" opacity=".3"/>
  <rect x="62" y="148" width="16" height="38" rx="4" fill="#3d4352"/>
  <rect x="82" y="148" width="16" height="38" rx="4" fill="#3d4352"/>
  <rect x="58" y="182" width="22" height="9" rx="4" fill="#2a1e17"/>
  <rect x="80" y="182" width="22" height="9" rx="4" fill="#2a1e17"/>
  <rect x="50" y="96" width="60" height="62" rx="14" fill="#7a6248"/>
  <path d="M50 110 H110 M50 124 H110 M50 138 H110" stroke="#6b5440" stroke-width="1.5"/>
  <path d="M66 98 L80 128 L94 98 Z" fill="#eef1f5"/>
  <path d="M66 98 L74 140 L80 128 Z M94 98 L86 140 L80 128 Z" fill="#8d7356"/>
  <path d="M60 94 Q80 106 100 94 L102 102 Q80 114 58 102 Z" fill="#2e6fd1"/>
  <path d="M66 98 L70 104 M76 102 L78 108 M86 102 L84 108 M94 98 L90 104" stroke="#eef1f5" stroke-width="3"/>
  <path d="M92 102 L98 132" stroke="#2e6fd1" stroke-width="8" stroke-linecap="round"/>
  <path d="M93 112 L97 112 M95 122 L99 122" stroke="#eef1f5" stroke-width="3"/>
  <path d="M54 104 Q36 116 40 134" stroke="#7a6248" stroke-width="12" stroke-linecap="round" fill="none"/>
  <g transform="translate(36 140)">
    <circle r="13" fill="#c0a060" stroke="#8a7040" stroke-width="2"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="-1.5" y="-16" width="3" height="5" fill="#c0a060" transform="rotate(${i * 30})"/>`).join('')}
    <circle r="5" fill="#8a7040"/>
    <text y="-5" font-size="6" font-family="monospace" text-anchor="middle" fill="#3a2a10">A</text>
  </g>
  <circle cx="44" cy="136" r="6" fill="${PELE}"/>
  <path d="M106 104 Q122 112 118 128" stroke="#7a6248" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M116 128 Q132 140 124 156 Q118 168 134 178" stroke="#f5e6c8" stroke-width="12" fill="none"/>
  <text x="0" y="0" font-size="8" font-family="monospace" fill="#2b2340" font-weight="bold">
    <tspan x="118" y="141">1</tspan><tspan x="122" y="153">0</tspan><tspan x="121" y="165">1</tspan><tspan x="128" y="176">1</tspan>
  </text>
  <circle cx="118" cy="128" r="6" fill="${PELE}"/>
  <rect x="73" y="84" width="14" height="12" fill="${PELE_SOMBRA}"/>
  <circle cx="80" cy="58" r="34" fill="${PELE}"/>
  <path d="M44 58 Q40 22 80 22 Q120 22 116 56 Q110 40 96 38 Q98 46 88 44 Q78 34 66 40 Q54 42 50 54 Z" fill="#2f2520"/>
  <path d="M60 36 Q70 28 84 30" stroke="#4a3a30" stroke-width="2" fill="none"/>
  <path d="M64 52 L74 50 M86 50 L96 52" stroke="#2f2520" stroke-width="2.5" stroke-linecap="round"/>
  ${olhos(80, 62, 13, '#1f3040')}
  <ellipse cx="62" cy="74" rx="6" ry="3.5" fill="#ff8fa3" opacity=".35"/>
  <ellipse cx="98" cy="74" rx="6" ry="3.5" fill="#ff8fa3" opacity=".35"/>
  <path d="M74 78 Q82 83 88 77" stroke="#8a4a4a" stroke-width="2" fill="none" stroke-linecap="round"/>
`);

// ------------------------------------------------------------------ Bugs

export const pernas = (cx: number, cy: number, abertura: number, cor: string) =>
  [-1, 1]
    .map((s) =>
      [-14, 0, 14]
        .map((dy) => `<path d="M${cx + s * 18} ${cy + dy} Q${cx + s * (abertura - 6)} ${cy + dy - 10} ${cx + s * abertura} ${cy + dy + 8}" stroke="${cor}" stroke-width="4" fill="none" stroke-linecap="round"/>`)
        .join(''),
    )
    .join('');

export const olhosBravos = (cx: number, cy: number, d: number) => `
  <circle cx="${cx - d}" cy="${cy}" r="5" fill="#fff"/><circle cx="${cx + d}" cy="${cy}" r="5" fill="#fff"/>
  <circle cx="${cx - d + 1}" cy="${cy + 1}" r="2.4" fill="#111"/><circle cx="${cx + d - 1}" cy="${cy + 1}" r="2.4" fill="#111"/>
  <path d="M${cx - d - 6} ${cy - 8} L${cx - 2} ${cy - 4} M${cx + d + 6} ${cy - 8} L${cx + 2} ${cy - 4}" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>`;

/** NullPointer: besouro com o casco "vazio" (símbolo de conjunto vazio). */
const NULL_POINTER = svg(120, 120, `
  <ellipse cx="60" cy="110" rx="36" ry="5" fill="#000" opacity=".3"/>
  ${pernas(60, 76, 46, '#5a1620')}
  <ellipse cx="60" cy="74" rx="34" ry="30" fill="#e05561"/>
  <path d="M60 46 L60 104" stroke="#8f2533" stroke-width="3"/>
  <ellipse cx="48" cy="62" rx="9" ry="6" fill="#fff" opacity=".25"/>
  <circle cx="60" cy="78" r="12" fill="none" stroke="#fff" stroke-width="4"/>
  <path d="M48 92 L72 64" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <path d="M50 30 Q40 14 30 16 M70 30 Q80 14 90 16" stroke="#5a1620" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="30" cy="16" r="3.5" fill="#ffd86b"/><circle cx="90" cy="16" r="3.5" fill="#ffd86b"/>
  <ellipse cx="60" cy="40" rx="20" ry="15" fill="#7a1f2b"/>
  ${olhosBravos(60, 40, 9)}
`);

/** Loop Infinito: lagarta enrolada em forma de ∞ que nunca chega ao fim. */
const LOOP = (() => {
  const segs: string[] = [];
  const n = 18;
  for (let i = n - 1; i >= 1; i--) {
    const t = (i / n) * Math.PI * 2;
    const d = 1 + Math.sin(t) ** 2;
    const x = 56 + (44 * Math.cos(t)) / d;
    const y = 60 + (80 * Math.sin(t) * Math.cos(t)) / d;
    segs.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9.5" fill="${i % 2 ? '#f0a020' : '#d98e04'}" stroke="#9a6200" stroke-width="1.5"/>`);
    segs.push(`<path d="M${x.toFixed(1)} ${(y + 8).toFixed(1)} l-2 6 M${x.toFixed(1)} ${(y + 8).toFixed(1)} l2 6" stroke="#9a6200" stroke-width="1.5"/>`);
  }
  return svg(120, 120, `
    <ellipse cx="60" cy="108" rx="44" ry="5" fill="#000" opacity=".3"/>
    ${segs.join('')}
    <circle cx="104" cy="62" r="14" fill="#f5b240" stroke="#9a6200" stroke-width="2"/>
    <path d="M100 50 Q98 38 90 36 M110 50 Q114 38 122 38" stroke="#9a6200" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${olhosBravos(104, 60, 6)}
    <path d="M98 70 Q104 74 110 70" stroke="#5a3a00" stroke-width="2" fill="none"/>
    <text x="60" y="66" font-size="14" font-family="monospace" font-weight="bold" fill="#5a3a00" text-anchor="middle">∞</text>
  `);
})();

/** Vazamento: mosquito-carrapato com o abdômen transparente vazando memória. */
const VAZAMENTO = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="30" ry="4" fill="#000" opacity=".3"/>
  <ellipse cx="34" cy="40" rx="20" ry="9" fill="#d9c8ff" opacity=".55" transform="rotate(-25 34 40)"/>
  <ellipse cx="86" cy="40" rx="20" ry="9" fill="#d9c8ff" opacity=".55" transform="rotate(25 86 40)"/>
  ${pernas(60, 66, 40, '#4a2560')}
  <ellipse cx="60" cy="70" rx="28" ry="24" fill="#9b59b6" opacity=".75" stroke="#6c2f86" stroke-width="2.5"/>
  <path d="M34 76 Q60 66 86 76 Q84 92 60 94 Q36 92 34 76 Z" fill="#c38fff"/>
  <text x="60" y="88" font-size="9" font-family="monospace" fill="#3a1050" text-anchor="middle">0x0F</text>
  <ellipse cx="48" cy="58" rx="7" ry="4" fill="#fff" opacity=".35"/>
  <path d="M52 94 Q50 104 54 106 Q58 104 56 94 Z" fill="#c38fff"/>
  <path d="M66 96 Q64 108 69 112 Q74 108 70 96 Z" fill="#c38fff"/>
  <circle cx="60" cy="40" r="14" fill="#6c2f86"/>
  <path d="M60 50 L60 62" stroke="#3a1050" stroke-width="2.5"/>
  ${olhosBravos(60, 38, 6)}
`);

// ------------------------------------------------------------------ Chefão

/** O Monolito: um bloco de pedra gigante feito de código que faz tudo e não esconde nada. */
const MONOLITO = svg(240, 260, `
  <ellipse cx="120" cy="250" rx="96" ry="9" fill="#000" opacity=".35"/>
  <rect x="14" y="110" width="40" height="34" rx="4" fill="#5d6d7e"/><rect x="6" y="146" width="44" height="40" rx="5" fill="#6f7f8f"/>
  <rect x="186" y="110" width="40" height="34" rx="4" fill="#5d6d7e"/><rect x="190" y="146" width="44" height="40" rx="5" fill="#6f7f8f"/>
  <path d="M50 24 L190 24 L204 242 L36 242 Z" fill="#7f8c8d"/>
  <path d="M190 24 L204 242 L180 242 L170 24 Z" fill="#65737e"/>
  <path d="M50 24 L190 24 L186 36 L54 36 Z" fill="#95a5a6"/>
  ${Array.from({ length: 11 }, (_, i) => {
    const y = 120 + i * 11;
    const ind = [0, 8, 16, 16, 8, 16, 24, 16, 8, 0, 8][i];
    const w = [70, 90, 60, 100, 50, 80, 60, 90, 40, 70, 30][i];
    return `<rect x="${64 + ind}" y="${y}" width="${w}" height="4" rx="2" fill="#4d5a66"/>`;
  }).join('')}
  <ellipse cx="120" cy="78" rx="34" ry="22" fill="#2c3440"/>
  <ellipse cx="120" cy="78" rx="22" ry="16" fill="#ff3b4e"/>
  <circle cx="120" cy="78" r="8" fill="#2a0008"/>
  <circle cx="126" cy="72" r="3" fill="#fff"/>
  <path d="M84 52 L112 62 M156 52 L128 62" stroke="#2c3440" stroke-width="6" stroke-linecap="round"/>
  <path d="M70 40 L82 70 L74 96 M176 60 L164 92 L172 112 M60 200 L80 214 L76 236 M170 180 L158 206" stroke="#4d5a66" stroke-width="2.5" fill="none"/>
  <text x="58" y="18" font-size="26" font-family="monospace" font-weight="bold" fill="#ff3b4e">{</text>
  <text x="170" y="18" font-size="26" font-family="monospace" font-weight="bold" fill="#ff3b4e">}</text>
  <text x="120" y="16" font-size="16" font-family="monospace" font-weight="bold" fill="#f5c542" text-anchor="middle">main()</text>
`);

export const ARTES: Arte[] = [
  { chave: 'heroi-ada', largura: 160, altura: 200, svg: ADA },
  { chave: 'heroi-turing', largura: 160, altura: 200, svg: TURING },
  { chave: 'inimigo-NullPointer', largura: 120, altura: 120, svg: NULL_POINTER },
  { chave: 'inimigo-Loop Infinito', largura: 120, altura: 120, svg: LOOP },
  { chave: 'inimigo-Vazamento', largura: 120, altura: 120, svg: VAZAMENTO },
  { chave: 'inimigo-O Monolito', largura: 240, altura: 260, svg: MONOLITO },
];

export const dataUri = (s: string) => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
