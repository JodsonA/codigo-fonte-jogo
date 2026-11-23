export interface ModeloInimigo {
  nome: string;
  vida: number;
  ataque: number;
  intervalo: number;
  cor: number;
  chefe?: boolean;
  /** Subchefe: chefe no meio do capítulo, menor que o chefão. */
  subchefe?: boolean;
}

export interface Capitulo {
  numero: number;
  nome: string;
  reino: string;
  fundo: string;
  chefe: string;
  subchefe?: string;
  vitoriaTitulo: string;
  vitoriaTexto: string;
}

export const CAPITULOS: Capitulo[] = [
  {
    numero: 1, nome: 'Vale das Interfaces', reino: 'Abstração', fundo: 'fundo-mapa', chefe: 'O Monolito',
    vitoriaTitulo: 'O Vale das Interfaces está livre!',
    vitoriaTexto: 'Você derrotou O Monolito. O capítulo 2, a Cidadela Privada, foi liberado!',
  },
  {
    numero: 2, nome: 'Cidadela Privada', reino: 'Encapsulamento', fundo: 'fundo-cidadela', chefe: 'O Global Mutável',
    vitoriaTitulo: 'A Cidadela Privada está protegida!',
    vitoriaTexto: 'Você derrotou O Global Mutável. O capítulo 3, a Floresta das Linhagens, foi liberado!',
  },
  {
    numero: 3, nome: 'Floresta das Linhagens', reino: 'Herança', fundo: 'fundo-floresta', chefe: 'O Ancestral Corrompido', subchefe: 'A Rainha Clone',
    vitoriaTitulo: 'As linhagens foram curadas!',
    vitoriaTexto: 'Você derrotou O Ancestral Corrompido, e os descendentes deixaram de herdar seus bugs. O capítulo 4, a Arena dos Mil Rostos, foi liberado!',
  },
  {
    numero: 4, nome: 'Arena dos Mil Rostos', reino: 'Polimorfismo', fundo: 'fundo-arena', chefe: 'O Imitador', subchefe: 'O Instanceof',
    vitoriaTitulo: 'Os quatro reinos estão salvos!',
    vitoriaTexto: 'Você derrotou O Imitador e dominou os quatro pilares: abstração, encapsulamento, herança e polimorfismo. Obrigado por jogar!',
  },
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

// Capítulo 3: Herança
const FRAGIL: ModeloInimigo = { nome: 'Classe Frágil', vida: 500, ataque: 30, intervalo: 1400, cor: 0xf0e2bd };
const DIAMANTE: ModeloInimigo = { nome: 'Diamante', vida: 380, ataque: 46, intervalo: 1700, cor: 0x5dade2 };
const COPIA: ModeloInimigo = { nome: 'Copia e Cola', vida: 280, ataque: 26, intervalo: 1000, cor: 0xbb8fce };
const RAINHA: ModeloInimigo = { nome: 'A Rainha Clone', vida: 7000, ataque: 70, intervalo: 1500, cor: 0xe67e22, chefe: true, subchefe: true };
const ANCESTRAL: ModeloInimigo = { nome: 'O Ancestral Corrompido', vida: 12000, ataque: 85, intervalo: 1500, cor: 0x6e4b2a, chefe: true };

// Capítulo 4: Polimorfismo
const CAST: ModeloInimigo = { nome: 'Cast Inválido', vida: 700, ataque: 48, intervalo: 1300, cor: 0xe74c3c };
const SWITCH: ModeloInimigo = { nome: 'Switch Gigante', vida: 1100, ataque: 36, intervalo: 1700, cor: 0x2e86c1 };
const FANTASMA: ModeloInimigo = { nome: 'Tipo Fantasma', vida: 520, ataque: 70, intervalo: 1900, cor: 0xd5d8dc };
const INSTANCEOF: ModeloInimigo = { nome: 'O Instanceof', vida: 12000, ataque: 100, intervalo: 1500, cor: 0x27ae60, chefe: true, subchefe: true };
const IMITADOR: ModeloInimigo = { nome: 'O Imitador', vida: 16000, ataque: 100, intervalo: 1400, cor: 0x1c1030, chefe: true };

type Bruta = [nome: string, descricao: string, ondas: ModeloInimigo[][], xp: number, bytes: number, commits: number, enigmaAntes?: string];

/** Monta as fases de um capítulo a partir de uma tabela curta. */
function capitulo(n: number, lista: Bruta[]): Fase[] {
  return lista.map(([nome, descricao, ondas, xp, bytes, commits, enigmaAntes], i) => ({
    id: `${n}-${i + 1}`, capitulo: n, nome, descricao, ondas, recompensa: { xp, bytes, commits }, ...(enigmaAntes ? { enigmaAntes } : {}),
  }));
}

const CAPITULO_3 = capitulo(3, [
  ['Raízes Expostas', 'A Floresta das Linhagens adoeceu. Bugs brotam das raízes das árvores de classes.', [[COPIA, COPIA], [FRAGIL, COPIA], [FRAGIL, FRAGIL, COPIA]], 180, 70, 20],
  ['Galhos Quebrados', 'Uma Classe Frágil mudou e quebrou todos os galhos que herdavam dela.', [[FRAGIL, FRAGIL], [DIAMANTE, COPIA], [FRAGIL, DIAMANTE, COPIA]], 190, 72, 20],
  ['A Trilha Copiada', 'Alguém copiou a mesma trilha dez vezes em vez de reaproveitar o caminho.', [[COPIA, COPIA, COPIA], [DIAMANTE, COPIA, COPIA], [FRAGIL, FRAGIL, DIAMANTE]], 200, 75, 20],
  ['Ninho de Clones', 'Ovos idênticos por toda parte. Algo está se copiando sem parar.', [[DIAMANTE, DIAMANTE], [COPIA, COPIA, FRAGIL], [DIAMANTE, FRAGIL, COPIA]], 210, 78, 20],
  ['A Rainha Clone', 'A Rainha Clone bota cópias de si mesma em vez de herdar de uma classe comum. Subchefe do reino.', [[COPIA, COPIA, COPIA], [FRAGIL, DIAMANTE], [RAINHA]], 350, 130, 50, 'arvore-linguagens'],
  ['O Losango Sombrio', 'Dois caminhos levam ao mesmo ancestral. Qual método vale? O Diamante confunde todos.', [[DIAMANTE, DIAMANTE], [DIAMANTE, FRAGIL, COPIA], [DIAMANTE, DIAMANTE, FRAGIL]], 230, 85, 20],
  ['Herança Profunda', 'Uma linhagem tão funda que ninguém lembra de onde vem cada método.', [[FRAGIL, FRAGIL, FRAGIL], [DIAMANTE, COPIA, COPIA], [FRAGIL, DIAMANTE, DIAMANTE]], 240, 88, 20],
  ['Pântano do super()', 'Construtores que esqueceram de chamar super() deixaram objetos pela metade.', [[COPIA, COPIA, DIAMANTE], [FRAGIL, FRAGIL, DIAMANTE], [DIAMANTE, DIAMANTE, COPIA]], 250, 92, 20],
  ['Clareira dos Descendentes', 'Os filhos do Ancestral defendem a clareira. Todos herdaram os mesmos bugs.', [[DIAMANTE, FRAGIL, COPIA], [FRAGIL, FRAGIL, DIAMANTE], [DIAMANTE, DIAMANTE, FRAGIL]], 260, 96, 20],
  ['O Ancestral Corrompido', 'A classe-mãe de toda a floresta. Cada bug dela passa para todos os descendentes. Chefão do reino.', [[DIAMANTE, FRAGIL], [COPIA, DIAMANTE, FRAGIL], [ANCESTRAL]], 500, 180, 80, 'testamento-ancestral'],
]);

const CAPITULO_4 = capitulo(4, [
  ['Portões da Arena', 'Na Arena dos Mil Rostos, cada lutador muda de comportamento. Os bugs se aproveitam disso.', [[CAST, CAST], [SWITCH, CAST], [FANTASMA, CAST, SWITCH]], 280, 110, 20],
  ['O Cast Forçado', 'Alguém tentou transformar um objeto no que ele não é. Tudo explodiu.', [[CAST, CAST, CAST], [FANTASMA, CAST], [CAST, SWITCH, FANTASMA]], 290, 112, 20],
  ['Corredor dos Switches', 'Um switch para cada tipo. A cada tipo novo, ele cresce mais.', [[SWITCH, SWITCH], [SWITCH, CAST, CAST], [SWITCH, SWITCH, FANTASMA]], 300, 115, 20],
  ['Arquibancada Fantasma', 'Um tipo que não é o que diz. Quem chama o método errado leva o golpe.', [[FANTASMA, FANTASMA], [CAST, FANTASMA, SWITCH], [FANTASMA, FANTASMA, CAST]], 310, 118, 20],
  ['O Instanceof', 'O inspetor confere o tipo de cada objeto antes de agir, em vez de deixar cada um agir do seu jeito. Subchefe do reino.', [[CAST, SWITCH], [FANTASMA, CAST, CAST], [INSTANCEOF]], 500, 180, 60, 'mil-rostos'],
  ['A Sobrecarga', 'Métodos com o mesmo nome e parâmetros diferentes. Escolha o certo ou apanhe.', [[CAST, CAST, FANTASMA], [SWITCH, SWITCH, CAST], [FANTASMA, SWITCH, CAST]], 330, 125, 20],
  ['Máscaras Trocadas', 'As máscaras do Imitador estão espalhadas pela arena, enganando os heróis.', [[FANTASMA, FANTASMA, CAST], [SWITCH, FANTASMA, FANTASMA], [CAST, CAST, SWITCH]], 340, 128, 20],
  ['O Contrato Quebrado', 'Uma subclasse prometeu fazer o mesmo que a mãe, mas fez outra coisa.', [[SWITCH, SWITCH, SWITCH], [CAST, FANTASMA, FANTASMA], [SWITCH, CAST, FANTASMA]], 350, 132, 20],
  ['Camarim do Imitador', 'O último corredor antes do centro da arena. Os bugs mais fortes guardam a passagem.', [[FANTASMA, CAST, SWITCH], [FANTASMA, FANTASMA, SWITCH], [CAST, CAST, FANTASMA]], 360, 136, 20],
  ['O Imitador', 'Um só nome e mil comportamentos, todos errados. Ele sobrescreve tudo o que toca. Chefão final.', [[SWITCH, CAST], [FANTASMA, CAST, SWITCH], [IMITADOR]], 800, 260, 100, 'ordem-das-linguagens'],
]);

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
  ...CAPITULO_3,
  ...CAPITULO_4,
];

export const fasesDoCapitulo = (n: number) => FASES.filter((f) => f.capitulo === n);

export function buscarFase(id: string): Fase {
  const f = FASES.find((x) => x.id === id);
  if (!f) throw new Error(`Fase desconhecida: ${id}`);
  return f;
}
