export interface ModeloInimigo {
  nome: string;
  vida: number;
  ataque: number;
  intervalo: number;
  cor: number;
  chefe?: boolean;
}

export interface Fase {
  id: string;
  nome: string;
  descricao: string;
  ondas: ModeloInimigo[][];
  recompensa: { xp: number; bytes: number; commits: number };
  /** Enigma que precisa ser resolvido antes de entrar na fase. */
  enigmaAntes?: string;
}

const NULO: ModeloInimigo = { nome: 'NullPointer', vida: 28, ataque: 4, intervalo: 1600, cor: 0xe05561 };
const LOOP: ModeloInimigo = { nome: 'Loop Infinito', vida: 40, ataque: 3, intervalo: 1200, cor: 0xd98e04 };
const VAZAMENTO: ModeloInimigo = { nome: 'Vazamento', vida: 26, ataque: 7, intervalo: 1800, cor: 0x9b59b6 };
const MONOLITO: ModeloInimigo = { nome: 'O Monolito', vida: 800, ataque: 16, intervalo: 1500, cor: 0x7f8c8d, chefe: true };

export const FASES: Fase[] = [
  {
    id: '1-1',
    nome: 'Primeiros Passos',
    descricao: 'Bugs soltos invadiram a entrada do Vale das Interfaces.',
    ondas: [[NULO], [NULO, NULO], [LOOP, NULO]],
    recompensa: { xp: 50, bytes: 20, commits: 0 },
  },
  {
    id: '1-2',
    nome: 'Detalhes Demais',
    descricao: 'A Exceção espalhou detalhes por toda parte. Ninguém enxerga o todo.',
    ondas: [[LOOP, VAZAMENTO], [NULO, NULO, VAZAMENTO], [LOOP, LOOP, VAZAMENTO]],
    recompensa: { xp: 70, bytes: 30, commits: 0 },
  },
  {
    id: '1-3',
    nome: 'O Monolito',
    descricao: 'Um bloco gigante de código que faz tudo e não esconde nada. Chefão do reino.',
    ondas: [[VAZAMENTO, NULO], [LOOP, VAZAMENTO, VAZAMENTO], [MONOLITO]],
    recompensa: { xp: 150, bytes: 60, commits: 10 },
    enigmaAntes: 'linha-do-tempo',
  },
];

export function buscarFase(id: string): Fase {
  const f = FASES.find((x) => x.id === id);
  if (!f) throw new Error(`Fase desconhecida: ${id}`);
  return f;
}
