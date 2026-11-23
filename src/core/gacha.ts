import type { Raridade } from './herois';

/**
 * Instanciar (o gacha do jogo): cada giro cria uma "instância" aleatória.
 * Regras, sempre visíveis para o jogador:
 * - 5★: 1,5% de chance base. A partir do 41º giro sem 5★ a chance sobe 8 pontos por giro,
 *   e o 50º giro é garantido.
 * - 4★: 10% de chance base. A partir do 9º giro sem 4★ (ou melhor) a chance sobe 30 pontos por giro,
 *   e o 10º giro é garantido.
 * - Nos outros giros vem XP para a equipe, Bytes ou Fichas (moeda da Loja).
 * - Personagem repetido vira Fichas.
 */
export const CUSTO_GIRO = 10;
export const GIROS_LOTE = 10;

export const TAXA_5 = 0.015;
export const INICIO_SUAVE_5 = 40;
export const GARANTIA_5 = 50;
export const TAXA_4 = 0.1;
export const INICIO_SUAVE_4 = 8;
export const GARANTIA_4 = 10;

export const FICHAS_REPETIDO: Record<4 | 5, number> = { 4: 25, 5: 80 };

/** Prêmios dos giros sem personagem, com o peso de cada um. */
export const PREMIOS = [
  { tipo: 'xp' as const, quantidade: 40, peso: 45, nome: 'XP para a equipe' },
  { tipo: 'bytes' as const, quantidade: 30, peso: 35, nome: 'Bytes' },
  { tipo: 'fichas' as const, quantidade: 5, peso: 20, nome: 'Fichas' },
];

export type ResultadoGiro =
  | { tipo: 'heroi'; raridade: 4 | 5; heroiId: string }
  | { tipo: 'xp' | 'bytes' | 'fichas'; quantidade: number };

export interface EstadoGacha {
  /** Giros desde o último 5★. */
  semCinco: number;
  /** Giros desde o último 4★ ou 5★. */
  semQuatro: number;
  total: number;
}

/** Chance de 5★ no n-ésimo giro desde o último 5★ (n começa em 1). */
export function chanceCinco(n: number) {
  if (n >= GARANTIA_5) return 1;
  if (n > INICIO_SUAVE_5) return Math.min(1, TAXA_5 + 0.08 * (n - INICIO_SUAVE_5));
  return TAXA_5;
}

/** Chance de 4★ no n-ésimo giro desde o último 4★ ou melhor. */
export function chanceQuatro(n: number) {
  if (n >= GARANTIA_4) return 1;
  if (n > INICIO_SUAVE_4) return Math.min(1, TAXA_4 + 0.3 * (n - INICIO_SUAVE_4));
  return TAXA_4;
}

export function girar(
  estado: EstadoGacha,
  pool: Record<4 | 5, string[]>,
  aleatorio: () => number = Math.random,
): ResultadoGiro {
  estado.total++;
  const n5 = estado.semCinco + 1;
  const n4 = estado.semQuatro + 1;
  if (aleatorio() < chanceCinco(n5)) {
    estado.semCinco = 0;
    estado.semQuatro = 0;
    return { tipo: 'heroi', raridade: 5, heroiId: sortear(pool[5], aleatorio) };
  }
  estado.semCinco = n5;
  if (aleatorio() < chanceQuatro(n4)) {
    estado.semQuatro = 0;
    return { tipo: 'heroi', raridade: 4, heroiId: sortear(pool[4], aleatorio) };
  }
  estado.semQuatro = n4;
  const total = PREMIOS.reduce((s, p) => s + p.peso, 0);
  let r = aleatorio() * total;
  for (const p of PREMIOS) {
    r -= p.peso;
    if (r < 0) return { tipo: p.tipo, quantidade: p.quantidade };
  }
  return { tipo: 'xp', quantidade: PREMIOS[0].quantidade };
}

function sortear<T>(lista: T[], aleatorio: () => number) {
  return lista[Math.floor(aleatorio() * lista.length)];
}

/** Preços da Loja de Fichas. */
export const PRECO_LOJA: Record<Exclude<Raridade, 3>, number> = { 4: 200, 5: 600 };

export const PACOTES_LOJA = [
  { id: 'xp', nome: 'Pacote de XP', descricao: '+150 XP para cada herói da equipe', preco: 40 },
  { id: 'bytes', nome: 'Pacote de Bytes', descricao: '+120 Bytes para treinar', preco: 30 },
] as const;
