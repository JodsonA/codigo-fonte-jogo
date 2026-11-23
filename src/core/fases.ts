export interface ModeloInimigo {
  nome: string;
  vida: number;
  ataque: number;
  intervalo: number;
  cor: number;
  chefe?: boolean;
}

export interface Capitulo {
  numero: number;
  nome: string;
  reino: string;
  fundo: string;
  chefe: string;
}

export const CAPITULOS: Capitulo[] = [
  { numero: 1, nome: 'Vale das Interfaces', reino: 'Abstração', fundo: 'fundo-mapa', chefe: 'O Monolito' },
  { numero: 2, nome: 'Cidadela Privada', reino: 'Encapsulamento', fundo: 'fundo-cidadela', chefe: 'O Global Mutável' },
];

export interface Fase {
  id: string;
  capitulo: number;
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

const RACE: ModeloInimigo = { nome: 'Race Condition', vida: 90, ataque: 12, intervalo: 1100, cor: 0x1abc9c };
const STACK: ModeloInimigo = { nome: 'Stack Overflow', vida: 170, ataque: 9, intervalo: 1600, cor: 0xc0392b };
const GLOBAL: ModeloInimigo = { nome: 'Variável Global', vida: 80, ataque: 18, intervalo: 1900, cor: 0xb8e0ff };
const MUTAVEL: ModeloInimigo = { nome: 'O Global Mutável', vida: 4200, ataque: 44, intervalo: 1500, cor: 0x8e44ad, chefe: true };

export const FASES: Fase[] = [
  {
    id: '1-1',
    capitulo: 1,
    nome: 'Primeiros Passos',
    descricao: 'Bugs soltos invadiram a entrada do Vale das Interfaces.',
    ondas: [[NULO], [NULO, NULO], [LOOP, NULO]],
    recompensa: { xp: 50, bytes: 20, commits: 30 },
  },
  {
    id: '1-2',
    capitulo: 1,
    nome: 'Detalhes Demais',
    descricao: 'A Exceção espalhou detalhes por toda parte. Ninguém enxerga o todo.',
    ondas: [[LOOP, VAZAMENTO], [NULO, NULO, VAZAMENTO], [LOOP, LOOP, VAZAMENTO]],
    recompensa: { xp: 70, bytes: 30, commits: 30 },
  },
  {
    id: '1-3',
    capitulo: 1,
    nome: 'O Monolito',
    descricao: 'Um bloco gigante de código que faz tudo e não esconde nada. Chefão do reino.',
    ondas: [[VAZAMENTO, NULO], [LOOP, VAZAMENTO, VAZAMENTO], [MONOLITO]],
    recompensa: { xp: 150, bytes: 60, commits: 60 },
    enigmaAntes: 'linha-do-tempo',
  },
  {
    id: '2-1',
    capitulo: 2,
    nome: 'Portões Abertos',
    descricao: 'Os portões da Cidadela foram deixados abertos. Qualquer bug entra e mexe em tudo.',
    ondas: [[RACE, RACE], [STACK, GLOBAL], [RACE, STACK, GLOBAL]],
    recompensa: { xp: 120, bytes: 50, commits: 30 },
  },
  {
    id: '2-2',
    capitulo: 2,
    nome: 'Muralhas Quebradas',
    descricao: 'Sem muralhas, os dados privados da Cidadela estão expostos.',
    ondas: [[GLOBAL, GLOBAL], [STACK, STACK, RACE], [GLOBAL, RACE, STACK]],
    recompensa: { xp: 150, bytes: 60, commits: 30 },
  },
  {
    id: '2-3',
    capitulo: 2,
    nome: 'O Global Mutável',
    descricao: 'Uma gosma que pode ser alterada por qualquer um e roubou as chaves da Cidadela. Chefão do reino.',
    ondas: [[RACE, GLOBAL], [STACK, GLOBAL, GLOBAL], [MUTAVEL]],
    recompensa: { xp: 300, bytes: 120, commits: 60 },
    enigmaAntes: 'cofre-privado',
  },
];

export const fasesDoCapitulo = (n: number) => FASES.filter((f) => f.capitulo === n);

export function buscarFase(id: string): Fase {
  const f = FASES.find((x) => x.id === id);
  if (!f) throw new Error(`Fase desconhecida: ${id}`);
  return f;
}
