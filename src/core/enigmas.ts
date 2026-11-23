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

export const ENIGMA_ARVORE: EnigmaLinhaDoTempo = {
  tipo: 'linha-do-tempo',
  id: 'arvore-linguagens',
  titulo: 'Portão do Enigma: A Árvore das Linguagens',
  narrador: 'Nygaard, o Simulador',
  enunciado:
    'A Rainha Clone embaralhou a árvore genealógica das linguagens orientadas a objetos. Coloque as linguagens na ordem em que nasceram, da mais antiga à mais recente.',
  dica:
    'Simula foi a primeira linguagem com classes e herança. Java e C# são primas bem mais novas: uma veio da Sun e a outra da Microsoft, poucos anos depois.',
  itens: [
    { nome: 'Simula 67', ano: 1967, detalhe: 'Ole-Johan Dahl e Kristen Nygaard criam classes, objetos e herança na Noruega.' },
    { nome: 'Smalltalk', ano: 1972, detalhe: 'Alan Kay e a equipe da Xerox PARC levam a ideia ao extremo: tudo é objeto.' },
    { nome: 'C++', ano: 1985, detalhe: 'Bjarne Stroustrup lança o C++, que junta as classes do Simula com a velocidade do C.' },
    { nome: 'Java', ano: 1995, detalhe: 'James Gosling e a equipe da Sun lançam o Java: "escreva uma vez, rode em qualquer lugar".' },
    { nome: 'C#', ano: 2000, detalhe: 'A Microsoft apresenta o C#, criado por uma equipe liderada por Anders Hejlsberg.' },
  ],
  recompensaCommits: 25,
};

export const ENIGMA_TESTAMENTO: EnigmaQuiz = {
  tipo: 'quiz',
  id: 'testamento-ancestral',
  titulo: 'Portão do Enigma: O Testamento do Ancestral',
  narrador: 'Ada, a Analista',
  enunciado: 'O Ancestral deixou um testamento em código. Só quem entende herança passa pelo portão.',
  perguntas: [
    {
      pergunta: 'Qual linha chama o construtor da classe mãe? Clique nela.',
      codigo: [
        'class Animal {',
        '  constructor(public nome: string) {}',
        '  falar() { return "..."; }',
        '}',
        'class Gato extends Animal {',
        '  constructor(nome: string) {',
        '    super(nome);',
        '  }',
        '  falar() { return "miau"; }',
        '}',
      ],
      correta: 6,
      explicacao: 'super(nome) chama o construtor de Animal. A classe filha precisa fazer isso antes de usar this, para que a parte herdada do objeto fique pronta.',
    },
    {
      pergunta: 'Herança representa uma relação "é um". Qual destas frases é uma boa herança?',
      opcoes: ['Carro é um Motor', 'Gato é um Animal', 'Casa é um Telhado', 'Pedido é um Cliente'],
      correta: 1,
      explicacao: 'Todo gato é um animal, então Gato pode herdar de Animal. Um carro TEM um motor: isso é composição, não herança.',
    },
    {
      pergunta: 'Qual linha dá erro, porque a filha tenta mexer num atributo private da mãe? Clique nela.',
      codigo: [
        'class Conta {',
        '  private saldo = 0;',
        '  protected titular = "Ana";',
        '}',
        'class Poupanca extends Conta {',
        '  render() {',
        '    this.saldo = this.saldo * 1.01;',
        '    return this.titular;',
        '  }',
        '}',
      ],
      correta: 6,
      explicacao: 'Private só é visível dentro da própria classe Conta. Protected (como titular) pode ser usado pelas filhas. Por isso a linha 7 não compila.',
    },
    {
      pergunta: 'Qual linguagem, criada na Xerox PARC por Alan Kay e equipe, popularizou a ideia de que "tudo é objeto"?',
      opcoes: ['Smalltalk', 'FORTRAN', 'COBOL', 'Assembly'],
      correta: 0,
      explicacao: 'Smalltalk tratava tudo como objeto, até números e classes. Muitas ideias de interfaces gráficas também nasceram nesse projeto.',
    },
  ],
  recompensaCommits: 25,
};

export const ENIGMA_MIL_ROSTOS: EnigmaQuiz = {
  tipo: 'quiz',
  id: 'mil-rostos',
  titulo: 'Portão do Enigma: Os Mil Rostos',
  narrador: 'Turing, o Decifrador',
  enunciado: 'Na arena, o mesmo comando faz coisas diferentes conforme quem o recebe. Prove que entende polimorfismo.',
  perguntas: [
    {
      pergunta: 'Qual linha usa polimorfismo: a mesma chamada, um resultado para cada forma? Clique nela.',
      codigo: [
        'abstract class Forma { abstract area(): number; }',
        'class Quadrado extends Forma { area() { return 4; } }',
        'class Circulo extends Forma { area() { return 3.14; } }',
        'const formas: Forma[] = [new Quadrado(), new Circulo()];',
        'let total = 0;',
        'for (const f of formas) total += f.area();',
      ],
      correta: 5,
      explicacao: 'f.area() é a mesma chamada, mas cada objeto responde do seu jeito. O laço não precisa saber se a forma é um quadrado ou um círculo.',
    },
    {
      pergunta: 'Qual linha sobrescreve (override) o método da classe mãe? Clique nela.',
      codigo: [
        'class Heroi {',
        '  atacar() { return 10; }',
        '}',
        'class Arqueira extends Heroi {',
        '  mirar() { return true; }',
        '  atacar() { return 25; }',
        '}',
      ],
      correta: 5,
      explicacao: 'Arqueira redefine atacar(), que já existia em Heroi. Quem chamar heroi.atacar() numa Arqueira recebe 25. mirar() é um método novo, não uma sobrescrita.',
    },
    {
      pergunta: 'Em 1987, Barbara Liskov apresentou um princípio sobre subclasses. O que ele diz?',
      opcoes: [
        'Toda classe deve ter só um método',
        'A filha deve poder substituir a mãe sem quebrar o programa',
        'Nunca use herança',
        'Toda variável deve ser global',
      ],
      correta: 1,
      explicacao: 'É o Princípio da Substituição de Liskov: onde o programa espera a classe mãe, qualquer filha deve funcionar sem surpresas.',
    },
  ],
  recompensaCommits: 25,
};

export const ENIGMA_ORDEM_LINGUAGENS: EnigmaLinhaDoTempo = {
  tipo: 'linha-do-tempo',
  id: 'ordem-das-linguagens',
  titulo: 'Portão do Enigma: Linguagens de Mil Rostos',
  narrador: 'Backus, o Tradutor',
  enunciado:
    'O Imitador trocou as datas das linguagens que ensinaram os programas a lidar com tipos diferentes. Coloque-as em ordem, da mais antiga à mais recente.',
  dica:
    'Lisp é quase da mesma época do FORTRAN. JavaScript nasceu com a web dos anos 1990, e TypeScript veio bem depois para dar tipos a ela.',
  itens: [
    { nome: 'Lisp', ano: 1958, detalhe: 'John McCarthy cria o Lisp, em que uma mesma função pode receber dados de vários tipos.' },
    { nome: 'Pascal', ano: 1970, detalhe: 'Niklaus Wirth cria o Pascal para ensinar programação de forma organizada.' },
    { nome: 'ML', ano: 1973, detalhe: 'Robin Milner cria o ML, com polimorfismo paramétrico: uma função serve para listas de qualquer tipo.' },
    { nome: 'JavaScript', ano: 1995, detalhe: 'Brendan Eich cria o JavaScript em poucos dias para os navegadores.' },
    { nome: 'TypeScript', ano: 2012, detalhe: 'A Microsoft lança o TypeScript, que adiciona tipos ao JavaScript. Este jogo é escrito nele!' },
  ],
  recompensaCommits: 30,
};

export type Enigma = EnigmaLinhaDoTempo | EnigmaQuiz;

export const ENIGMAS: Record<string, Enigma> = {
  [ENIGMA_LINHA_DO_TEMPO.id]: ENIGMA_LINHA_DO_TEMPO,
  [ENIGMA_COFRE.id]: ENIGMA_COFRE,
  [ENIGMA_ARVORE.id]: ENIGMA_ARVORE,
  [ENIGMA_TESTAMENTO.id]: ENIGMA_TESTAMENTO,
  [ENIGMA_MIL_ROSTOS.id]: ENIGMA_MIL_ROSTOS,
  [ENIGMA_ORDEM_LINGUAGENS.id]: ENIGMA_ORDEM_LINGUAGENS,
};
