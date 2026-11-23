export interface ItemLinhaDoTempo {
  nome: string;
  ano: number;
  detalhe: string;
}

export interface EnigmaLinhaDoTempo {
  tipo: 'linha-do-tempo';
  id: string;
  titulo: string;
  enunciado: string;
  narrador: string;
  dica: string;
  itens: ItemLinhaDoTempo[];
  recompensaCommits: number;
}

export const ENIGMA_LINHA_DO_TEMPO: EnigmaLinhaDoTempo = {
  tipo: 'linha-do-tempo',
  id: 'linha-do-tempo',
  titulo: 'Portão do Enigma: Linha do Tempo',
  narrador: 'Ada, a Analista',
  enunciado:
    'O Monolito embaralhou a memória do Vale. Para abrir o portão, coloque estes marcos na ordem em que aconteceram, do mais antigo ao mais recente.',
  dica:
    'Lembre das fichas dos heróis: as notas de Ada Lovelace vieram muito antes de qualquer computador eletrônico, e a máquina de Turing é dos anos 1930.',
  itens: [
    { nome: 'Notas de Ada Lovelace sobre a Máquina Analítica', ano: 1843, detalhe: 'Ada Lovelace publica a Nota G, com um algoritmo para calcular números de Bernoulli.' },
    { nome: 'Máquina de Turing', ano: 1936, detalhe: 'Alan Turing descreve um modelo abstrato do que um computador pode calcular.' },
    { nome: 'Linguagem FORTRAN', ano: 1957, detalhe: 'Equipe da IBM liderada por John Backus lança uma das primeiras linguagens de alto nível.' },
    { nome: 'Linguagem C', ano: 1972, detalhe: 'Dennis Ritchie cria o C nos Bell Labs. Muitas linguagens herdam sua sintaxe.' },
    { nome: 'Linguagem Python', ano: 1991, detalhe: 'Guido van Rossum publica a primeira versão do Python.' },
  ],
  recompensaCommits: 20,
};

export interface PerguntaQuiz {
  pergunta: string;
  /** Quando há código, cada linha é uma opção clicável. */
  codigo?: string[];
  opcoes?: string[];
  correta: number;
  explicacao: string;
}

export interface EnigmaQuiz {
  tipo: 'quiz';
  id: string;
  titulo: string;
  enunciado: string;
  narrador: string;
  perguntas: PerguntaQuiz[];
  recompensaCommits: number;
}

export const ENIGMA_COFRE: EnigmaQuiz = {
  tipo: 'quiz',
  id: 'cofre-privado',
  titulo: 'Portão do Enigma: O Cofre Privado',
  narrador: 'Grace, a Compiladora',
  enunciado: 'O cofre da Cidadela só se abre para quem entende encapsulamento. Responda às três perguntas.',
  perguntas: [
    {
      pergunta: 'Qual linha quebra o encapsulamento do cofre? Clique nela.',
      codigo: [
        'class Cofre {',
        '  private moedas = 0;',
        '  public senha = "1234";',
        '  depositar(qtd: number) {',
        '    if (qtd > 0) this.moedas += qtd;',
        '  }',
        '  get total() { return this.moedas; }',
        '}',
      ],
      correta: 2,
      explicacao: 'A senha é pública: qualquer parte do programa pode ler ou trocar. Estado sensível deve ser privado e acessado só por métodos.',
    },
    {
      pergunta: 'Qual linha altera o estado do cofre sem passar por um método? Clique nela.',
      codigo: [
        'const cofre = new Cofre();',
        'cofre.depositar(50);',
        'console.log(cofre.total);',
        'cofre["moedas"] = 9999;',
        'cofre.depositar(-10);',
      ],
      correta: 3,
      explicacao: 'Mexer direto em moedas pula a regra do método depositar(), que recusa valores negativos. É exatamente o que o encapsulamento evita.',
    },
    {
      pergunta: 'Qual foi a primeira linguagem com classes e objetos, criada por Ole-Johan Dahl e Kristen Nygaard em 1967?',
      opcoes: ['FORTRAN', 'Simula 67', 'C', 'COBOL'],
      correta: 1,
      explicacao: 'Simula 67 introduziu classes, objetos e herança, ideias que depois chegaram a Smalltalk, C++, Java e muitas outras.',
    },
  ],
  recompensaCommits: 20,
};

export type Enigma = EnigmaLinhaDoTempo | EnigmaQuiz;

export const ENIGMAS: Record<string, Enigma> = {
  [ENIGMA_LINHA_DO_TEMPO.id]: ENIGMA_LINHA_DO_TEMPO,
  [ENIGMA_COFRE.id]: ENIGMA_COFRE,
};
