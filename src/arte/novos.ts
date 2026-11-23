import { olhos, olhosBravos, pernas, svg, type Arte } from './personagens';

/**
 * Heróis do Instanciar (gacha) e bugs do capítulo 2.
 * Todos são personagens estilizados, inspirados nas figuras históricas, sem retratá-las.
 */

interface Chibi {
  pele: string;
  cabelo: string;
  penteado: 'curto' | 'ondulado' | 'longo' | 'calvo' | 'cacheado' | 'anos40';
  roupa: string;
  roupaEscura: string;
  tipo: 'calca' | 'vestido';
  gola?: string;
  oculos?: boolean;
  barba?: boolean;
  corOlhos?: string;
  peito?: string;
  maoDireita?: string;
  maoEsquerda?: string;
  extraFundo?: string;
  extraFrente?: string;
}

function cabeloAtras(p: Chibi) {
  switch (p.penteado) {
    case 'longo':
      return `<path d="M44 56 Q40 110 52 118 L108 118 Q120 110 116 56 Z" fill="${p.cabelo}"/>`;
    case 'cacheado':
      return [40, 52, 108, 120].map((x, i) => `<circle cx="${x}" cy="${62 + (i % 2) * 14}" r="12" fill="${p.cabelo}"/>`).join('');
    case 'anos40':
      return `<circle cx="48" cy="70" r="12" fill="${p.cabelo}"/><circle cx="112" cy="70" r="12" fill="${p.cabelo}"/><circle cx="52" cy="84" r="9" fill="${p.cabelo}"/><circle cx="108" cy="84" r="9" fill="${p.cabelo}"/>`;
    default:
      return '';
  }
}

function cabeloFrente(p: Chibi) {
  const c = p.cabelo;
  switch (p.penteado) {
    case 'curto':
      return `<path d="M46 56 Q42 22 80 22 Q118 22 114 56 Q110 38 92 36 Q80 44 62 38 Q50 42 46 56 Z" fill="${c}"/>`;
    case 'ondulado':
      return `<path d="M44 60 Q38 24 80 22 Q122 24 116 60 Q112 46 104 44 Q100 36 90 40 Q82 32 72 40 Q60 36 56 46 Q48 48 44 60 Z" fill="${c}"/>
        <circle cx="50" cy="48" r="8" fill="${c}"/><circle cx="110" cy="48" r="8" fill="${c}"/>`;
    case 'longo':
      return `<path d="M44 64 Q40 22 80 22 Q120 22 116 64 Q112 44 98 40 Q86 46 80 36 Q74 46 62 40 Q48 44 44 64 Z" fill="${c}"/>`;
    case 'calvo':
      return `<path d="M46 66 Q44 46 52 40 Q54 56 50 70 Z M114 66 Q116 46 108 40 Q106 56 110 70 Z" fill="${c}"/>
        <ellipse cx="72" cy="34" rx="10" ry="4" fill="#fff" opacity=".35"/>`;
    case 'cacheado':
      return [52, 64, 76, 88, 100, 110, 46].map((x, i) => `<circle cx="${x}" cy="${30 + (i % 2) * 6 + (i === 6 ? 16 : 0)}" r="${11 + (i % 3)}" fill="${c}"/>`).join('');
    case 'anos40':
      return `<path d="M46 58 Q42 22 80 22 Q118 22 114 58 Q108 40 96 38 Q88 30 80 38 Q72 30 64 38 Q52 40 46 58 Z" fill="${c}"/>
        <circle cx="64" cy="30" r="9" fill="${c}"/><circle cx="96" cy="30" r="9" fill="${c}"/>`;
  }
}

function chibi(p: Chibi) {
  const corpo = p.tipo === 'vestido'
    ? `<path d="M52 112 L108 112 L128 188 Q80 196 32 188 Z" fill="${p.roupa}"/>
       <path d="M36 178 Q80 188 124 178 L128 188 Q80 196 32 188 Z" fill="${p.roupaEscura}"/>
       <rect x="54" y="96" width="52" height="34" rx="12" fill="${p.roupa}"/>`
    : `<rect x="62" y="148" width="16" height="38" rx="4" fill="${p.roupaEscura}"/>
       <rect x="82" y="148" width="16" height="38" rx="4" fill="${p.roupaEscura}"/>
       <rect x="58" y="182" width="22" height="9" rx="4" fill="#2a1e17"/>
       <rect x="80" y="182" width="22" height="9" rx="4" fill="#2a1e17"/>
       <rect x="50" y="96" width="60" height="62" rx="14" fill="${p.roupa}"/>`;
  const gola = p.gola ? `<path d="M64 96 L80 112 L96 96 Z" fill="${p.gola}"/>` : '';
  const oculos = p.oculos
    ? `<circle cx="67" cy="62" r="10" fill="#fff" fill-opacity=".15" stroke="#2b2340" stroke-width="2.5"/>
       <circle cx="93" cy="62" r="10" fill="#fff" fill-opacity=".15" stroke="#2b2340" stroke-width="2.5"/>
       <path d="M77 62 L83 62" stroke="#2b2340" stroke-width="2.5"/>`
    : '';
  const barba = p.barba ? `<path d="M50 70 Q52 98 80 100 Q108 98 110 70 Q104 86 80 88 Q56 86 50 70 Z" fill="${p.cabelo}"/>` : '';
  const boca = p.barba
    ? `<path d="M74 82 Q80 86 86 82" stroke="#5a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : `<path d="M74 78 Q80 83 86 78" stroke="#8a4a4a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  return svg(160, 200, `
    <ellipse cx="80" cy="192" rx="44" ry="7" fill="#000" opacity=".3"/>
    ${p.extraFundo ?? ''}
    ${cabeloAtras(p)}
    ${corpo}
    ${gola}
    ${p.peito ?? ''}
    <path d="M54 104 Q38 116 42 134" stroke="${p.roupa}" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M106 104 Q122 112 118 128" stroke="${p.roupa}" stroke-width="12" stroke-linecap="round" fill="none"/>
    ${p.maoEsquerda ?? ''}
    ${p.maoDireita ?? ''}
    <circle cx="44" cy="136" r="6" fill="${p.pele}"/>
    <circle cx="118" cy="128" r="6" fill="${p.pele}"/>
    <rect x="73" y="84" width="14" height="12" fill="${p.pele}" opacity=".85"/>
    <circle cx="80" cy="58" r="34" fill="${p.pele}"/>
    ${barba}
    ${cabeloFrente(p)}
    ${olhos(80, 62, 13, p.corOlhos ?? '#2b2340')}
    ${oculos}
    <ellipse cx="62" cy="74" rx="6" ry="3.5" fill="#ff8fa3" opacity=".4"/>
    <ellipse cx="98" cy="74" rx="6" ry="3.5" fill="#ff8fa3" opacity=".4"/>
    ${boca}
    ${p.extraFrente ?? ''}
  `);
}

// ------------------------------------------------------------------ 5 estrelas

/** Grace, a Compiladora (5★, Tanque): uniforme azul-marinho, escudo de chaves e uma mariposa amiga. */
const GRACE = chibi({
  pele: '#f2c9a5', cabelo: '#d9dde6', penteado: 'ondulado', roupa: '#1f3a6e', roupaEscura: '#142850', tipo: 'vestido', gola: '#ffffff',
  peito: `<circle cx="72" cy="116" r="2.5" fill="#f5c542"/><circle cx="88" cy="116" r="2.5" fill="#f5c542"/><circle cx="72" cy="126" r="2.5" fill="#f5c542"/><circle cx="88" cy="126" r="2.5" fill="#f5c542"/>
    <rect x="56" y="100" width="10" height="4" rx="1" fill="#f5c542"/><rect x="94" y="100" width="10" height="4" rx="1" fill="#f5c542"/>`,
  maoEsquerda: `<g transform="translate(34 142)">
      <path d="M0 -30 Q22 -26 24 -20 Q24 10 0 26 Q-24 10 -24 -20 Q-22 -26 0 -30 Z" fill="#4fc3f7" stroke="#1a6f9a" stroke-width="3"/>
      <text y="8" font-size="26" font-family="monospace" font-weight="bold" fill="#0b3c57" text-anchor="middle">{}</text>
    </g>`,
  maoDireita: `<g transform="translate(130 112)">
      <ellipse cx="-5" cy="0" rx="7" ry="5" fill="#c9b48f" transform="rotate(-30)"/><ellipse cx="5" cy="0" rx="7" ry="5" fill="#c9b48f" transform="rotate(30)"/>
      <ellipse cx="0" cy="2" rx="2" ry="6" fill="#5a4a3a"/>
    </g>`,
});

/** Dijkstra, o Desbravador (5★, Dano): jaqueta de explorador, óculos, mapa com um grafo e uma bússola. */
const DIJKSTRA = chibi({
  pele: '#f0c4a0', cabelo: '#9aa0a8', penteado: 'calvo', roupa: '#d9731a', roupaEscura: '#5a4a3a', tipo: 'calca', gola: '#f5e6c8', oculos: true,
  peito: `<rect x="56" y="120" width="14" height="12" rx="2" fill="#b85e10"/><rect x="90" y="120" width="14" height="12" rx="2" fill="#b85e10"/><path d="M80 112 V158" stroke="#b85e10" stroke-width="2"/>`,
  maoDireita: `<g transform="translate(122 140) rotate(8)">
      <rect x="-18" y="-22" width="40" height="34" rx="3" fill="#f5e6c8" stroke="#a07a10" stroke-width="2"/>
      <path d="M-10 -12 L4 -4 L14 -14 M4 -4 L0 6 L14 2" stroke="#e05561" stroke-width="2" fill="none"/>
      ${[[-10, -12], [4, -4], [14, -14], [0, 6], [14, 2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#2b6fd6"/>`).join('')}
    </g>`,
  maoEsquerda: `<g transform="translate(40 142)">
      <circle r="12" fill="#f5c542" stroke="#a07a10" stroke-width="2.5"/><circle r="8" fill="#fff8e1"/>
      <path d="M0 -7 L3 0 L0 7 L-3 0 Z" fill="#e05561"/>
    </g>`,
});

// ------------------------------------------------------------------ 4 estrelas

/** Dennis, o Ponteiro (4★, Tanque): barba, moletom cinza, escudo com * e uma seta como lança. */
const DENNIS = chibi({
  pele: '#f2c9a5', cabelo: '#3a2c24', penteado: 'longo', roupa: '#5d6d7e', roupaEscura: '#2c3440', tipo: 'calca', barba: true,
  peito: `<text x="80" y="140" font-size="18" font-family="monospace" font-weight="bold" fill="#c9d1e0" text-anchor="middle">C</text>`,
  maoDireita: `<g transform="translate(126 112) rotate(-20)"><rect x="-3" y="-10" width="6" height="74" rx="3" fill="#8a6f4d"/><path d="M0 -30 L14 -8 L-14 -8 Z" fill="#c0c8d6" stroke="#6b7489" stroke-width="2"/></g>`,
  maoEsquerda: `<g transform="translate(34 140)"><rect x="-22" y="-26" width="44" height="50" rx="10" fill="#16a085" stroke="#0e6655" stroke-width="3"/>
      <text y="12" font-size="34" font-family="monospace" font-weight="bold" fill="#e8fff8" text-anchor="middle">*</text></g>`,
});

/** Nygaard, o Simulador (4★, Suporte): cabelo cacheado, suéter rosa, livro de classes e uma árvore de herança. */
const NYGAARD = chibi({
  pele: '#f2c9a5', cabelo: '#7a4a2a', penteado: 'cacheado', roupa: '#e0567f', roupaEscura: '#3d4352', tipo: 'calca',
  peito: `<path d="M58 110 H102 M58 122 H102 M58 134 H102" stroke="#c94470" stroke-width="3"/>`,
  maoEsquerda: `<g transform="translate(40 138) rotate(-10)"><rect x="-16" y="-18" width="32" height="38" rx="3" fill="#2b6fd6" stroke="#173f80" stroke-width="2"/>
      <text y="2" font-size="9" font-family="monospace" font-weight="bold" fill="#fff" text-anchor="middle">class</text></g>`,
  maoDireita: `<g transform="translate(130 106)">
      <path d="M0 0 L-10 14 M0 0 L10 14 M-10 14 L-16 28 M-10 14 L-4 28 M10 14 L16 28" stroke="#f5c542" stroke-width="2.5"/>
      ${[[0, 0], [-10, 14], [10, 14], [-16, 28], [-4, 28], [16, 28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#ffd86b" stroke="#a07a10" stroke-width="1.5"/>`).join('')}
    </g>`,
});

/** Jean, a Programadora (4★, Dano): penteado dos anos 40, macacão verde e cabos de conexão. */
const JEAN = chibi({
  pele: '#f2c9a5', cabelo: '#b5651d', penteado: 'anos40', roupa: '#27ae60', roupaEscura: '#1e8449', tipo: 'calca', gola: '#ffffff',
  peito: `<rect x="74" y="112" width="12" height="30" rx="2" fill="#1e8449"/>`,
  maoDireita: `<path d="M118 128 Q140 140 128 160 Q120 172 138 182" stroke="#e05561" stroke-width="4" fill="none"/><rect x="133" y="178" width="10" height="8" rx="2" fill="#7f8c8d"/>`,
  maoEsquerda: `<path d="M44 136 Q24 148 34 166 Q42 178 26 186" stroke="#2b6fd6" stroke-width="4" fill="none"/><rect x="20" y="182" width="10" height="8" rx="2" fill="#7f8c8d"/>`,
});

/** Backus, o Tradutor (4★, Dano): colete azul-petróleo, giz e um cartão com fórmulas. */
const BACKUS = chibi({
  pele: '#f2c9a5', cabelo: '#2f2520', penteado: 'curto', roupa: '#138d75', roupaEscura: '#3d4352', tipo: 'calca', gola: '#eef1f5',
  peito: `<path d="M70 112 L80 150 L90 112" stroke="#0e6655" stroke-width="3" fill="none"/>`,
  maoDireita: `<g transform="translate(126 120) rotate(10)"><rect x="-6" y="-24" width="36" height="28" rx="3" fill="#f5e6c8" stroke="#a07a10" stroke-width="2"/>
      <text x="12" y="-6" font-size="10" font-family="serif" font-style="italic" fill="#173f80" text-anchor="middle">x=Σy</text></g>`,
  maoEsquerda: `<rect x="38" y="138" width="14" height="5" rx="2" fill="#fff" transform="rotate(-30 44 140)"/>
    <text x="22" y="122" font-size="16" font-family="serif" fill="#fff" opacity=".8">Σ</text><text x="14" y="104" font-size="12" font-family="serif" fill="#fff" opacity=".6">π</text>`,
});

// ------------------------------------------------------------------ Bugs do capítulo 2

/** Race Condition: dois besouros gêmeos disputando o mesmo recurso. */
const RACE = svg(120, 120, `
  <ellipse cx="60" cy="110" rx="44" ry="5" fill="#000" opacity=".3"/>
  <path d="M6 60 H24 M2 72 H22 M8 84 H26" stroke="#fff" stroke-width="2.5" opacity=".6" stroke-linecap="round"/>
  ${[{ x: 46, y: 74, c: '#1abc9c', e: '#0e6655' }, { x: 78, y: 66, c: '#16a085', e: '#0b5345' }].map((b) => `
    ${pernas(b.x, b.y + 4, 30, b.e).replace(/stroke-width="4"/g, 'stroke-width="3"')}
    <ellipse cx="${b.x}" cy="${b.y}" rx="20" ry="18" fill="${b.c}" stroke="${b.e}" stroke-width="2"/>
    <path d="M${b.x} ${b.y - 16} V${b.y + 16}" stroke="${b.e}" stroke-width="2"/>
    <circle cx="${b.x}" cy="${b.y - 20}" r="10" fill="${b.e}"/>
    ${olhosBravos(b.x, b.y - 20, 5).replace(/r="5"/g, 'r="3.6"').replace(/r="2.4"/g, 'r="1.8"')}
  `).join('')}
  <path d="M58 38 L64 30 L62 38 L70 32" stroke="#f5c542" stroke-width="3" fill="none" stroke-linecap="round"/>
`);

/** Stack Overflow: uma pilha de caixas que cresceu demais e está tombando. */
const STACK = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity=".3"/>
  ${[0, 1, 2, 3, 4].map((i) => {
    const y = 96 - i * 18;
    const x = 36 + i * 3 + (i % 2) * 2;
    return `<rect x="${x}" y="${y}" width="${48 - i * 2}" height="16" rx="3" fill="${['#c0392b', '#e05561', '#c0392b', '#e05561', '#ff7b86'][i]}" stroke="#7a1f2b" stroke-width="2"/>
      <text x="${x + 24 - i}" y="${y + 12}" font-size="9" font-family="monospace" fill="#fff" text-anchor="middle">f()</text>`;
  }).join('')}
  <circle cx="74" cy="12" r="12" fill="#7a1f2b"/>
  ${olhosBravos(74, 12, 5).replace(/r="5"/g, 'r="3.6"').replace(/r="2.4"/g, 'r="1.8"')}
  <path d="M30 104 L22 116 M90 104 L98 116" stroke="#7a1f2b" stroke-width="4" stroke-linecap="round"/>
`);

/** Variável Global: um fantasma que entra em qualquer lugar e mexe em tudo. */
const GLOBAL_VAR = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="26" ry="4" fill="#000" opacity=".25"/>
  <path d="M28 62 Q28 18 60 18 Q92 18 92 62 L92 96 Q86 88 80 96 Q74 104 68 96 Q62 88 56 96 Q50 104 44 96 Q38 88 32 96 Q28 100 28 96 Z" fill="#b8e0ff" opacity=".85" stroke="#5aa0d6" stroke-width="2.5"/>
  <text x="60" y="80" font-size="14" font-family="monospace" font-weight="bold" fill="#1a5a8a" text-anchor="middle">var</text>
  ${olhosBravos(60, 46, 10)}
  <path d="M96 50 Q108 44 112 54 M24 60 Q12 54 8 64" stroke="#5aa0d6" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g transform="translate(106 66) rotate(30)"><circle r="4" fill="none" stroke="#f5c542" stroke-width="2.5"/><path d="M4 0 H14 M10 0 V4" stroke="#f5c542" stroke-width="2.5"/></g>
`);

/** O Global Mutável: uma gosma gigante que muda de forma e roubou as chaves da Cidadela. */
const GLOBAL_MUTAVEL = svg(240, 260, `
  <ellipse cx="120" cy="250" rx="104" ry="10" fill="#000" opacity=".35"/>
  <path d="M20 240 Q10 160 50 120 Q40 70 90 60 Q110 20 150 44 Q200 40 200 100 Q236 140 220 240 Z" fill="#8e44ad"/>
  <path d="M36 240 Q30 170 64 136 Q60 96 98 84 Q120 56 148 70 Q186 70 184 110 Q212 146 204 240 Z" fill="#a569bd"/>
  <path d="M40 240 Q46 252 56 244 M100 240 Q104 256 116 246 M170 240 Q176 254 188 244" stroke="#8e44ad" stroke-width="8" fill="none" stroke-linecap="round"/>
  ${[[92, 120, 20], [150, 108, 16], [124, 160, 12], [70, 168, 9], [176, 160, 10]].map(([x, y, r]) => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + r * 0.15}" cy="${y + r * 0.15}" r="${r * 0.5}" fill="#2a0030"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.3}" r="${r * 0.18}" fill="#fff"/>`).join('')}
  <path d="M96 196 Q120 214 150 196" stroke="#2a0030" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M104 200 L108 208 L114 201 L120 209 L126 201 L132 208 L138 200" stroke="#fff" stroke-width="3" fill="none"/>
  ${[[30, 110, -20], [214, 86, 25], [200, 200, 10]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><circle r="7" fill="none" stroke="#f5c542" stroke-width="4"/><path d="M7 0 H24 M18 0 V7 M23 0 V5" stroke="#f5c542" stroke-width="4"/></g>`).join('')}
  <text x="120" y="40" font-size="20" font-family="monospace" font-weight="bold" fill="#f5c542" text-anchor="middle">global</text>
`);

// ------------------------------------------------------------------ Cenário do capítulo 2

const FUNDO_CIDADELA = (() => {
  const torre = (x: number, h: number) => `
    <rect x="${x}" y="${300 - h}" width="70" height="${h}" fill="#5d6d8e"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${x + i * 18}" y="${288 - h}" width="12" height="14" fill="#5d6d8e"/>`).join('')}
    <rect x="${x + 26}" y="${330 - h}" width="18" height="26" rx="9" fill="#2a3450"/>
    <path d="M${x + 35} ${300 - h - 12} V${300 - h - 60}" stroke="#ddd" stroke-width="3"/>
    <path d="M${x + 35} ${300 - h - 60} L${x + 70} ${300 - h - 50} L${x + 35} ${300 - h - 40} Z" fill="#e05561"/>`;
  return svg(960, 540, `
    <defs><linearGradient id="ceuC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1660"/><stop offset="1" stop-color="#e08a5a"/></linearGradient></defs>
    <rect width="960" height="540" fill="url(#ceuC)"/>
    <circle cx="160" cy="110" r="44" fill="#ffe0a0" opacity=".85"/>
    ${torre(90, 150)}${torre(380, 200)}${torre(700, 170)}
    <rect x="0" y="200" width="960" height="110" fill="#4a5878"/>
    ${Array.from({ length: 40 }, (_, i) => `<rect x="${i * 24}" y="188" width="14" height="14" fill="#4a5878"/>`).join('')}
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 80} 220 H${i * 80 + 70} M${i * 80 + 35} 250 H${i * 80 + 105} M${i * 80} 280 H${i * 80 + 70}" stroke="#3a4664" stroke-width="2"/>`).join('')}
    ${[200, 520, 820].map((x) => `<g transform="translate(${x} 250)"><path d="M0 -28 Q22 -24 24 -18 Q24 8 0 24 Q-24 8 -24 -18 Q-22 -24 0 -28 Z" fill="#2b6fd6" stroke="#f5c542" stroke-width="3"/><rect x="-8" y="-6" width="16" height="13" rx="2" fill="#f5c542"/><path d="M-5 -6 V-11 Q0 -17 5 -11 V-6" stroke="#f5c542" stroke-width="3" fill="none"/></g>`).join('')}
    <path d="M0 300 Q240 280 480 300 Q720 320 960 296 V540 H0 Z" fill="#6b5a4a"/>
    <path d="M0 340 Q300 320 520 344 Q760 366 960 336 V540 H0 Z" fill="#7d6a56"/>
    ${Array.from({ length: 30 }, (_, i) => `<ellipse cx="${(i * 97) % 960}" cy="${360 + ((i * 53) % 170)}" rx="${10 + (i % 4) * 4}" ry="${5 + (i % 3) * 2}" fill="#5e4e3e" opacity=".7"/>`).join('')}
  `.replace('width="2880" height="1620"', 'width="1920" height="1080"'));
})();

export const ARTES_NOVAS: Arte[] = [
  { chave: 'heroi-grace', largura: 160, altura: 200, svg: GRACE },
  { chave: 'heroi-dijkstra', largura: 160, altura: 200, svg: DIJKSTRA },
  { chave: 'heroi-dennis', largura: 160, altura: 200, svg: DENNIS },
  { chave: 'heroi-nygaard', largura: 160, altura: 200, svg: NYGAARD },
  { chave: 'heroi-jean', largura: 160, altura: 200, svg: JEAN },
  { chave: 'heroi-backus', largura: 160, altura: 200, svg: BACKUS },
  { chave: 'inimigo-Race Condition', largura: 120, altura: 120, svg: RACE },
  { chave: 'inimigo-Stack Overflow', largura: 120, altura: 120, svg: STACK },
  { chave: 'inimigo-Variável Global', largura: 120, altura: 120, svg: GLOBAL_VAR },
  { chave: 'inimigo-O Global Mutável', largura: 240, altura: 260, svg: GLOBAL_MUTAVEL },
  { chave: 'fundo-cidadela', largura: 960, altura: 540, svg: FUNDO_CIDADELA },
];
