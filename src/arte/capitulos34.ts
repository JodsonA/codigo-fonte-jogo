import { olhosBravos, pernas, svg, type Arte } from './personagens';

/** Bugs, subchefes, chefões e cenários dos capítulos 3 (Herança) e 4 (Polimorfismo). */

const olhinhos = (cx: number, cy: number, d: number) =>
  olhosBravos(cx, cy, d).replace(/r="5"/g, 'r="3.8"').replace(/r="2.4"/g, 'r="1.9"');

/** Tamanho final da textura dos cenários: 2x em vez de 3x, para não pesar. */
const fundo = (corpo: string) => svg(960, 540, corpo).replace('width="2880" height="1620"', 'width="1920" height="1080"');

// ------------------------------------------------------------------ Capítulo 3: Herança

/** Classe Frágil: um ovo rachado. Qualquer mudança na base quebra todos os filhos. */
const CLASSE_FRAGIL = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="34" ry="5" fill="#000" opacity=".3"/>
  ${pernas(60, 92, 40, '#8a6d3b')}
  <path d="M60 14 Q96 18 96 66 Q96 104 60 104 Q24 104 24 66 Q24 18 60 14 Z" fill="#f0e2bd" stroke="#8a6d3b" stroke-width="3"/>
  <path d="M30 62 L42 54 L50 64 L60 52 L70 64 L80 54 L92 62" stroke="#8a6d3b" stroke-width="3" fill="none" stroke-linejoin="round"/>
  <path d="M46 26 L52 36 L46 42" stroke="#8a6d3b" stroke-width="2" fill="none"/>
  ${olhinhos(60, 76, 12)}
  <path d="M50 92 Q60 86 70 92" stroke="#5a4520" stroke-width="3" fill="none" stroke-linecap="round"/>
  <text x="60" y="44" font-size="11" font-family="monospace" font-weight="bold" fill="#8a6d3b" text-anchor="middle">base</text>
`);

/** Diamante: aranha com o corpo em losango, o famoso problema da herança múltipla. */
const DIAMANTE = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="40" ry="5" fill="#000" opacity=".3"/>
  ${pernas(60, 70, 52, '#1f4e79')}
  <path d="M60 18 L98 62 L60 106 L22 62 Z" fill="#5dade2" stroke="#1f4e79" stroke-width="3"/>
  <path d="M60 30 L84 62 L60 94 L36 62 Z" fill="#85c1e9"/>
  <path d="M60 30 L36 62 M60 30 L84 62 M36 62 L60 94 M84 62 L60 94" stroke="#1f4e79" stroke-width="2"/>
  ${[[60, 30], [36, 62], [84, 62], [60, 94]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f5c542" stroke="#1f4e79" stroke-width="1.5"/>`).join('')}
  ${olhinhos(60, 58, 9)}
`);

/** Copia e Cola: dois bugs idênticos. Código repetido em vez de herdado. */
const COPIA_COLA = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="44" ry="5" fill="#000" opacity=".3"/>
  ${[{ x: 76, y: 70, o: 0.55 }, { x: 48, y: 74, o: 1 }].map((b) => `
    <g opacity="${b.o}">
      ${pernas(b.x, b.y + 6, 30, '#7d3c98').replace(/stroke-width="4"/g, 'stroke-width="3"')}
      <rect x="${b.x - 22}" y="${b.y - 20}" width="44" height="40" rx="12" fill="#bb8fce" stroke="#7d3c98" stroke-width="2.5"/>
      <rect x="${b.x - 14}" y="${b.y - 4}" width="28" height="14" rx="3" fill="#7d3c98"/>
      <text x="${b.x}" y="${b.y + 7}" font-size="9" font-family="monospace" font-weight="bold" fill="#fff" text-anchor="middle">Ctrl+C</text>
      ${olhinhos(b.x, b.y - 10, 8)}
    </g>`).join('')}
`);

/** A Rainha Clone (subchefe): bota ovos que são cópias exatas dela mesma. */
const RAINHA_CLONE = svg(220, 240, `
  <ellipse cx="110" cy="230" rx="92" ry="9" fill="#000" opacity=".35"/>
  ${[[30, 206], [190, 206], [60, 222], [160, 222]].map(([x, y]) => `
    <ellipse cx="${x}" cy="${y}" rx="15" ry="19" fill="#f8c471" stroke="#a04000" stroke-width="2.5"/>
    <text x="${x}" y="${y + 4}" font-size="9" font-family="monospace" font-weight="bold" fill="#a04000" text-anchor="middle">copy</text>`).join('')}
  ${pernas(110, 170, 86, '#a04000').replace(/stroke-width="4"/g, 'stroke-width="7"')}
  <ellipse cx="110" cy="164" rx="62" ry="50" fill="#e67e22" stroke="#a04000" stroke-width="4"/>
  ${[0, 1, 2].map((i) => `<path d="M${60 + i * 6} ${148 + i * 18} Q110 ${136 + i * 18} ${160 - i * 6} ${148 + i * 18}" stroke="#a04000" stroke-width="4" fill="none"/>`).join('')}
  <path d="M40 120 Q10 70 40 50 Q50 90 72 108 Z" fill="#fdebd0" opacity=".8" stroke="#a04000" stroke-width="2"/>
  <path d="M180 120 Q210 70 180 50 Q170 90 148 108 Z" fill="#fdebd0" opacity=".8" stroke="#a04000" stroke-width="2"/>
  <circle cx="110" cy="92" r="40" fill="#f39c12" stroke="#a04000" stroke-width="4"/>
  ${olhosBravos(110, 92, 16).replace(/r="5"/g, 'r="9"').replace(/r="2.4"/g, 'r="4.5"')}
  <path d="M92 116 Q110 126 128 116" stroke="#5a2200" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M76 56 L84 26 L98 46 L110 18 L122 46 L136 26 L144 56 Z" fill="#f5c542" stroke="#a07800" stroke-width="3" stroke-linejoin="round"/>
  ${[84, 110, 136].map((x, i) => `<circle cx="${x}" cy="${[30, 22, 30][i]}" r="4" fill="#e05561"/>`).join('')}
`);

/** O Ancestral Corrompido (chefão): a classe-mãe de tudo, que passa os bugs para todos os descendentes. */
const ANCESTRAL = svg(240, 260, `
  <ellipse cx="120" cy="250" rx="108" ry="10" fill="#000" opacity=".35"/>
  <path d="M30 250 Q60 226 80 236 M210 250 Q180 226 160 236 M90 252 Q100 230 108 240 M150 252 Q140 230 132 240" stroke="#4a2c1a" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M70 246 Q60 150 80 110 L160 110 Q180 150 170 246 Z" fill="#6e4b2a" stroke="#3b2414" stroke-width="4"/>
  <path d="M96 246 Q90 180 104 140 M140 246 Q150 190 136 150" stroke="#3b2414" stroke-width="3" fill="none"/>
  <path d="M120 110 Q60 100 30 60 M120 110 Q180 100 210 60 M100 110 Q90 60 70 30 M140 110 Q150 60 170 30 M120 110 V20" stroke="#4a2c1a" stroke-width="9" fill="none" stroke-linecap="round"/>
  <ellipse cx="120" cy="66" rx="104" ry="48" fill="#4a235a" opacity=".85"/>
  <ellipse cx="96" cy="54" rx="56" ry="28" fill="#6c3483" opacity=".9"/>
  <ellipse cx="160" cy="70" rx="50" ry="26" fill="#5b2c6f" opacity=".9"/>
  ${[[40, 70], [76, 40], [120, 26], [166, 44], [204, 72], [140, 86], [92, 88]].map(([x, y]) => `
    <circle cx="${x}" cy="${y}" r="9" fill="#e05561" stroke="#7a1f2b" stroke-width="2"/>
    <circle cx="${x - 3}" cy="${y - 1}" r="1.8" fill="#fff"/><circle cx="${x + 3}" cy="${y - 1}" r="1.8" fill="#fff"/>`).join('')}
  <path d="M86 150 Q120 132 154 150 Q150 196 120 204 Q90 196 86 150 Z" fill="#2b1a0e"/>
  <circle cx="104" cy="160" r="10" fill="#e74c3c"/><circle cx="136" cy="160" r="10" fill="#e74c3c"/>
  <circle cx="104" cy="160" r="4" fill="#ffd86b"/><circle cx="136" cy="160" r="4" fill="#ffd86b"/>
  <path d="M92 146 L114 154 M148 146 L126 154" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <path d="M104 184 L110 190 L116 184 L122 190 L128 184 L134 190" stroke="#ffd86b" stroke-width="3" fill="none"/>
  <text x="120" y="232" font-size="16" font-family="monospace" font-weight="bold" fill="#f5c542" text-anchor="middle">extends</text>
`);

const FUNDO_FLORESTA = fundo(`
  <defs><linearGradient id="ceuF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e3b43"/><stop offset="1" stop-color="#7fb77e"/></linearGradient></defs>
  <rect width="960" height="540" fill="url(#ceuF)"/>
  <circle cx="800" cy="90" r="40" fill="#fff7c2" opacity=".8"/>
  ${[60, 210, 380, 560, 720, 880].map((x, i) => `
    <rect x="${x - 10}" y="${150 + (i % 2) * 20}" width="20" height="170" fill="#3e2a1a"/>
    <ellipse cx="${x}" cy="${140 + (i % 2) * 20}" rx="${70 + (i % 3) * 10}" ry="60" fill="${['#1e5631', '#245f3a', '#2d6a4f'][i % 3]}"/>`).join('')}
  ${[[200, 80], [480, 60], [760, 90]].map(([x, y]) => `
    <g opacity=".55" stroke="#d4f5d0" stroke-width="3" fill="none">
      <rect x="${x - 26}" y="${y}" width="52" height="22" rx="4" fill="#123d2a"/>
      <path d="M${x} ${y + 22} V${y + 40} M${x - 50} ${y + 40} H${x + 50} M${x - 50} ${y + 40} V${y + 54} M${x + 50} ${y + 40} V${y + 54}"/>
      <rect x="${x - 72}" y="${y + 54}" width="44" height="20" rx="4" fill="#123d2a"/>
      <rect x="${x + 28}" y="${y + 54}" width="44" height="20" rx="4" fill="#123d2a"/>
    </g>`).join('')}
  <path d="M0 300 Q240 280 480 300 Q720 320 960 296 V540 H0 Z" fill="#3f7d4a"/>
  <path d="M0 340 Q300 320 520 344 Q760 366 960 336 V540 H0 Z" fill="#4f9158"/>
  ${Array.from({ length: 34 }, (_, i) => `<path d="M${(i * 89) % 960} ${370 + ((i * 47) % 160)} l6 -14 l6 14" fill="#2f6b3a" opacity=".8"/>`).join('')}
  ${Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 131) % 960}" cy="${380 + ((i * 61) % 140)}" r="4" fill="${i % 2 ? '#f5c542' : '#ff9ff3'}"/>`).join('')}
`);

// ------------------------------------------------------------------ Capítulo 4: Polimorfismo

/** Cast Inválido: um bloco quadrado tentando caber num buraco redondo. */
const CAST_INVALIDO = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="38" ry="5" fill="#000" opacity=".3"/>
  ${pernas(60, 88, 44, '#7b241c')}
  <circle cx="60" cy="38" r="26" fill="none" stroke="#7f8c8d" stroke-width="5" stroke-dasharray="8 5"/>
  <rect x="30" y="50" width="60" height="52" rx="6" fill="#e74c3c" stroke="#7b241c" stroke-width="3" transform="rotate(-8 60 76)"/>
  <text x="60" y="94" font-size="12" font-family="monospace" font-weight="bold" fill="#fff" text-anchor="middle">(as)</text>
  ${olhinhos(60, 70, 12)}
  <path d="M96 40 L104 30 M100 48 L112 44" stroke="#f5c542" stroke-width="3" stroke-linecap="round"/>
`);

/** Switch Gigante: uma torre de "case" que cresce a cada tipo novo. */
const SWITCH_GIGANTE = svg(120, 120, `
  <ellipse cx="60" cy="114" rx="36" ry="5" fill="#000" opacity=".3"/>
  <path d="M38 104 L30 116 M82 104 L90 116 M50 106 L48 116 M70 106 L72 116" stroke="#1b4f72" stroke-width="4" stroke-linecap="round"/>
  <rect x="30" y="10" width="60" height="96" rx="8" fill="#2e86c1" stroke="#1b4f72" stroke-width="3"/>
  <rect x="36" y="16" width="48" height="16" rx="3" fill="#1b4f72"/>
  <text x="60" y="28" font-size="10" font-family="monospace" font-weight="bold" fill="#fff" text-anchor="middle">switch</text>
  ${[0, 1, 2, 3].map((i) => `<rect x="38" y="${58 + i * 11}" width="44" height="8" rx="2" fill="#aed6f1"/><text x="60" y="${65 + i * 11}" font-size="7" font-family="monospace" fill="#1b4f72" text-anchor="middle">case ${i}:</text>`).join('')}
  ${olhinhos(60, 44, 11)}
`);

/** Tipo Fantasma: aparece onde ninguém espera e nunca é o que dizia ser. */
const TIPO_FANTASMA = svg(120, 120, `
  <ellipse cx="60" cy="112" rx="26" ry="4" fill="#000" opacity=".25"/>
  <path d="M28 60 Q28 16 60 16 Q92 16 92 60 L92 96 Q84 88 76 98 Q68 106 60 96 Q52 106 44 98 Q36 88 28 96 Z" fill="#d5d8dc" opacity=".9" stroke="#626567" stroke-width="2.5"/>
  <path d="M38 40 Q60 30 82 40 L80 56 Q60 62 40 56 Z" fill="#17202a"/>
  <circle cx="50" cy="47" r="4" fill="#58d68d"/><circle cx="70" cy="47" r="4" fill="#58d68d"/>
  <text x="60" y="80" font-size="10" font-family="monospace" font-weight="bold" fill="#626567" text-anchor="middle">undefined</text>
  <text x="100" y="30" font-size="22" font-family="sans-serif" font-weight="bold" fill="#f5c542" text-anchor="middle">?</text>
`);

/** O Instanceof (subchefe): um inspetor que confere o tipo de tudo antes de agir. */
const INSTANCEOF = svg(220, 240, `
  <ellipse cx="110" cy="230" rx="88" ry="9" fill="#000" opacity=".35"/>
  ${pernas(110, 184, 80, '#145a32').replace(/stroke-width="4"/g, 'stroke-width="7"')}
  <ellipse cx="110" cy="170" rx="66" ry="52" fill="#27ae60" stroke="#145a32" stroke-width="4"/>
  <rect x="70" y="146" width="80" height="56" rx="6" fill="#145a32"/>
  ${[0, 1, 2].map((i) => `<path d="M80 ${160 + i * 14} l6 6 l10 -12" stroke="#58d68d" stroke-width="3" fill="none"/><rect x="102" y="${158 + i * 14}" width="38" height="5" rx="2" fill="#58d68d" opacity=".6"/>`).join('')}
  <circle cx="110" cy="92" r="42" fill="#2ecc71" stroke="#145a32" stroke-width="4"/>
  <rect x="68" y="40" width="84" height="12" rx="4" fill="#17202a"/><rect x="84" y="10" width="52" height="34" rx="4" fill="#17202a"/>
  ${olhosBravos(94, 92, 0).replace(/r="5"/g, 'r="8"').replace(/r="2.4"/g, 'r="4"')}
  <circle cx="128" cy="92" r="16" fill="#d6eaf8" opacity=".7" stroke="#f5c542" stroke-width="4"/><circle cx="128" cy="92" r="5" fill="#111"/>
  <path d="M144 100 Q156 130 148 150" stroke="#f5c542" stroke-width="2" fill="none"/>
  <path d="M96 118 Q110 112 124 118" stroke="#145a32" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g transform="translate(186 120) rotate(30)"><circle r="20" fill="#d6eaf8" opacity=".6" stroke="#7f8c8d" stroke-width="5"/><rect x="-4" y="20" width="8" height="34" rx="3" fill="#6e4b2a"/></g>
  <text x="110" y="226" font-size="15" font-family="monospace" font-weight="bold" fill="#f5c542" text-anchor="middle">instanceof</text>
`);

/** O Imitador (chefão): troca de máscara a cada golpe. Um só nome, mil comportamentos. */
const IMITADOR = svg(240, 260, `
  <ellipse cx="120" cy="250" rx="100" ry="10" fill="#000" opacity=".35"/>
  <path d="M40 246 Q50 140 90 100 L150 100 Q190 140 200 246 Q180 236 160 248 Q140 236 120 248 Q100 236 80 248 Q60 236 40 246 Z" fill="#1c1030" stroke="#5b2c6f" stroke-width="4"/>
  <path d="M90 100 Q120 140 150 100" stroke="#8e44ad" stroke-width="4" fill="none"/>
  <path d="M120 120 V240" stroke="#5b2c6f" stroke-width="3"/>
  <path d="M70 36 Q120 -4 170 36 Q186 90 120 116 Q54 90 70 36 Z" fill="#2c1a4a" stroke="#8e44ad" stroke-width="4"/>
  <path d="M84 60 Q120 40 156 60 Q156 96 120 104 Q84 96 84 60 Z" fill="#ecf0f1"/>
  <path d="M84 60 Q120 40 120 50 V104 Q84 96 84 60 Z" fill="#bdc3c7"/>
  <path d="M94 70 Q102 64 110 70 Q102 78 94 70 Z M130 70 Q138 64 146 70 Q138 78 130 70 Z" fill="#111"/>
  <circle cx="102" cy="70" r="2.5" fill="#e74c3c"/><circle cx="138" cy="70" r="2.5" fill="#e74c3c"/>
  <path d="M104 88 Q120 98 136 86" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${[
    { x: 30, y: 120, c: '#6c5ce7', f: '<circle r="20"/>' },
    { x: 210, y: 120, c: '#f39c12', f: '<rect x="-18" y="-18" width="36" height="36" rx="6"/>' },
    { x: 36, y: 196, c: '#27ae60', f: '<path d="M0 -22 L20 16 L-20 16 Z"/>' },
    { x: 204, y: 196, c: '#e74c3c', f: '<path d="M0 -20 L20 0 L0 20 L-20 0 Z"/>' },
  ].map((m) => `<g transform="translate(${m.x} ${m.y})" fill="${m.c}" stroke="#fff" stroke-width="2.5">${m.f}<circle cx="-6" cy="-2" r="2.5" fill="#111" stroke="none"/><circle cx="6" cy="-2" r="2.5" fill="#111" stroke="none"/></g>`).join('')}
  <path d="M60 132 Q40 126 34 140 M180 132 Q200 126 206 140" stroke="#8e44ad" stroke-width="5" fill="none" stroke-linecap="round"/>
  <text x="120" y="232" font-size="16" font-family="monospace" font-weight="bold" fill="#f5c542" text-anchor="middle">override</text>
`);

const FUNDO_ARENA = fundo(`
  <defs><linearGradient id="ceuA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0f3a"/><stop offset="1" stop-color="#c0507a"/></linearGradient></defs>
  <rect width="960" height="540" fill="url(#ceuA)"/>
  ${Array.from({ length: 24 }, (_, i) => `<circle cx="${(i * 173) % 960}" cy="${(i * 37) % 120 + 10}" r="${1 + (i % 3)}" fill="#fff" opacity=".7"/>`).join('')}
  <path d="M0 150 Q480 90 960 150 V300 H0 Z" fill="#6b4a5e"/>
  ${Array.from({ length: 16 }, (_, i) => {
    const x = 30 + i * 60;
    const y = 128 - Math.round(Math.sin((i / 15) * Math.PI) * 50);
    return `<path d="M${x} ${y + 140} V${y + 40} Q${x + 25} ${y + 10} ${x + 50} ${y + 40} V${y + 140}" fill="#3e2a3a" stroke="#8a6a7e" stroke-width="3"/>`;
  }).join('')}
  <path d="M0 230 Q480 180 960 230 V300 H0 Z" fill="#7d5a6e"/>
  ${[150, 330, 630, 810].map((x, i) => `
    <path d="M${x} 40 V200" stroke="#ddd" stroke-width="3"/>
    <path d="M${x} 44 H${x + 60} V100 L${x + 30} 86 L${x} 100 Z" fill="${['#6c5ce7', '#f39c12', '#27ae60', '#e74c3c'][i]}"/>
    <circle cx="${x + 30}" cy="66" r="12" fill="#ecf0f1"/>
    <circle cx="${x + 25}" cy="64" r="2" fill="#111"/><circle cx="${x + 35}" cy="64" r="2" fill="#111"/>`).join('')}
  <path d="M0 300 Q240 284 480 300 Q720 316 960 298 V540 H0 Z" fill="#c9a26b"/>
  <ellipse cx="480" cy="430" rx="420" ry="90" fill="#d9b67d"/>
  <ellipse cx="480" cy="430" rx="300" ry="60" fill="none" stroke="#b88d55" stroke-width="4" stroke-dasharray="14 10"/>
  ${Array.from({ length: 24 }, (_, i) => `<ellipse cx="${(i * 97) % 960}" cy="${370 + ((i * 53) % 160)}" rx="${8 + (i % 4) * 3}" ry="${4 + (i % 3)}" fill="#b88d55" opacity=".6"/>`).join('')}
`);

export const ARTES_CAPITULOS_3_4: Arte[] = [
  { chave: 'inimigo-Classe Frágil', largura: 120, altura: 120, svg: CLASSE_FRAGIL },
  { chave: 'inimigo-Diamante', largura: 120, altura: 120, svg: DIAMANTE },
  { chave: 'inimigo-Copia e Cola', largura: 120, altura: 120, svg: COPIA_COLA },
  { chave: 'inimigo-A Rainha Clone', largura: 220, altura: 240, svg: RAINHA_CLONE },
  { chave: 'inimigo-O Ancestral Corrompido', largura: 240, altura: 260, svg: ANCESTRAL },
  { chave: 'fundo-floresta', largura: 960, altura: 540, svg: FUNDO_FLORESTA },
  { chave: 'inimigo-Cast Inválido', largura: 120, altura: 120, svg: CAST_INVALIDO },
  { chave: 'inimigo-Switch Gigante', largura: 120, altura: 120, svg: SWITCH_GIGANTE },
  { chave: 'inimigo-Tipo Fantasma', largura: 120, altura: 120, svg: TIPO_FANTASMA },
  { chave: 'inimigo-O Instanceof', largura: 220, altura: 240, svg: INSTANCEOF },
  { chave: 'inimigo-O Imitador', largura: 240, altura: 260, svg: IMITADOR },
  { chave: 'fundo-arena', largura: 960, altura: 540, svg: FUNDO_ARENA },
];
