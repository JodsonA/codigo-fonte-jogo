export interface ItemLinhaDoTempo {
  nome: string;
  ano: number;
  detalhe: string;
}

export interface EnigmaLinhaDoTempo {
  id: string;
  titulo: string;
  enunciado: string;
  narrador: string;
  dica: string;
  itens: ItemLinhaDoTempo[];
  recompensaCommits: number;
}

export const ENIGMA_LINHA_DO_TEMPO: EnigmaLinhaDoTempo = {
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
  recompensaCommits: 5,
};
