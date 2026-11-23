import type { ContextoBatalha, HeroiBatalha } from './tipos';

export type Papel = 'Suporte' | 'Dano' | 'Tanque';
/** 3 = herói inicial; 4 e 5 = heróis do Instanciar. */
export type Raridade = 3 | 4 | 5;
export type Atributo = 'ataque' | 'vida';

export interface HeroiSave {
  id: string;
  nivel: number;
  xp: number;
  treinoAtaque: number;
  treinoVida: number;
}

/**
 * Classe base de todos os heróis.
 * - Encapsulamento: nível, XP e treinos são privados (#) e só mudam por métodos.
 * - Herança: cada herói estende esta classe.
 * - Polimorfismo: todo herói tem atacar(), mas cada um ataca do seu jeito.
 */
export abstract class Heroi {
  static readonly NIVEL_HABILIDADE = 5;

  abstract readonly id: string;
  abstract readonly nome: string;
  abstract readonly nomeCurto: string;
  /** Figura histórica que inspirou o personagem (não é um retrato dela). */
  abstract readonly inspiracao: string;
  abstract readonly iniciais: string;
  abstract readonly papel: Papel;
  abstract readonly cor: number;
  abstract readonly fato: string;
  abstract readonly habilidade: { nome: string; descricao: string };
  abstract readonly codigoAtacar: string;
  abstract readonly intervaloAtaque: number;
  readonly raridade: Raridade = 3;
  protected abstract readonly ataqueBase: number;
  protected abstract readonly vidaBase: number;

  #nivel = 1;
  #xp = 0;
  #treinoAtaque = 0;
  #treinoVida = 0;

  get nivel() { return this.#nivel; }
  get xp() { return this.#xp; }
  get xpParaProximo() { return 20 * this.#nivel; }
  get habilidadeDesbloqueada() { return this.#nivel >= Heroi.NIVEL_HABILIDADE; }

  get ataque() {
    return Math.round(this.ataqueBase * (1 + 0.15 * (this.#nivel - 1)) + this.#treinoAtaque * 2);
  }

  get vidaMax() {
    return Math.round(this.vidaBase * (1 + 0.15 * (this.#nivel - 1)) + this.#treinoVida * 10);
  }

  custoTreino(attr: Atributo) {
    const feitos = attr === 'ataque' ? this.#treinoAtaque : this.#treinoVida;
    return 15 + feitos * 10;
  }

  /** O custo é cobrado por quem chama; aqui só o estado interno muda. */
  treinar(attr: Atributo) {
    if (attr === 'ataque') this.#treinoAtaque++;
    else this.#treinoVida++;
  }

  /** Devolve quantos níveis o herói subiu. */
  ganharXp(quantidade: number): number {
    let subiu = 0;
    this.#xp += quantidade;
    while (this.#xp >= this.xpParaProximo) {
      this.#xp -= this.xpParaProximo;
      this.#nivel++;
      subiu++;
    }
    return subiu;
  }

  /** Recrutado agora: começa no nível indicado (herda a experiência da equipe). */
  definirNivelInicial(nivel: number) {
    if (this.#nivel === 1 && this.#xp === 0) this.#nivel = Math.max(1, Math.floor(nivel));
  }

  abstract atacar(ctx: ContextoBatalha, eu: HeroiBatalha): void;
  abstract usarHabilidade(ctx: ContextoBatalha, eu: HeroiBatalha): void;

  salvar(): HeroiSave {
    return { id: this.id, nivel: this.#nivel, xp: this.#xp, treinoAtaque: this.#treinoAtaque, treinoVida: this.#treinoVida };
  }

  carregar(s: HeroiSave) {
    this.#nivel = Math.max(1, s.nivel | 0);
    this.#xp = Math.max(0, s.xp || 0);
    this.#treinoAtaque = Math.max(0, s.treinoAtaque | 0);
    this.#treinoVida = Math.max(0, s.treinoVida | 0);
  }
}

export class AdaLovelace extends Heroi {
  readonly id = 'ada';
  readonly nome = 'Ada, a Analista';
  readonly nomeCurto = 'Ada';
  readonly inspiracao = 'Ada Lovelace';
  readonly iniciais = 'AL';
  readonly papel = 'Suporte';
  readonly cor = 0x8e7cf0;
  readonly intervaloAtaque = 1200;
  protected readonly ataqueBase = 6;
  protected readonly vidaBase = 60;
  readonly fato =
    'Ada Lovelace, sua inspiração, publicou em 1843 notas sobre a Máquina Analítica de Babbage. A Nota G traz o que muitos consideram o primeiro algoritmo escrito para uma máquina.';
  readonly habilidade = {
    nome: 'Nota G',
    descricao: 'Prevê os próximos 3 ataques inimigos e os anula. Cura 20% da vida da equipe.',
  };
  readonly codigoAtacar = `class AdaLovelace extends Heroi {
  atacar(ctx) {
    ctx.causarDano(ctx.alvoInimigo(), this.ataque);
    // Suporte: também cuida da equipe
    ctx.curar(ctx.aliadoMaisFerido(), this.ataque * 0.4);
  }
}`;

  atacar(ctx: ContextoBatalha) {
    const alvo = ctx.alvoInimigo();
    if (alvo) ctx.causarDano(alvo, this.ataque);
    const ferido = ctx.aliadoMaisFerido();
    if (ferido) ctx.curar(ferido, this.ataque * 0.4);
  }

  usarHabilidade(ctx: ContextoBatalha) {
    ctx.adicionarEscudo(3);
    for (const h of ctx.heroisVivos()) ctx.curar(h, h.hpMax * 0.2);
  }
}

export class AlanTuring extends Heroi {
  readonly id = 'turing';
  readonly nome = 'Turing, o Decifrador';
  readonly nomeCurto = 'Turing';
  readonly inspiracao = 'Alan Turing';
  readonly iniciais = 'AT';
  readonly papel = 'Dano';
  readonly cor = 0x4fc3f7;
  readonly intervaloAtaque = 900;
  protected readonly ataqueBase = 10;
  protected readonly vidaBase = 45;
  readonly fato =
    'Alan Turing, sua inspiração, descreveu em 1936 a máquina de Turing, um modelo abstrato que define o que um computador consegue calcular.';
  readonly habilidade = {
    nome: 'Decifrar',
    descricao: 'Causa 150% do ataque em todos os inimigos e revela a fraqueza deles: os próximos 4 golpes dele em cada um causam dano dobrado.',
  };
  readonly codigoAtacar = `class AlanTuring extends Heroi {
  atacar(ctx) {
    const alvo = ctx.alvoInimigo();
    // Dano: se a fraqueza foi decifrada, golpe dobrado
    const mult = alvo.marcado > 0 ? 2 : 1;
    ctx.causarDano(alvo, this.ataque * mult);
  }
}`;

  atacar(ctx: ContextoBatalha) {
    const alvo = ctx.alvoInimigo();
    if (!alvo) return;
    const mult = alvo.marcado > 0 ? 2 : 1;
    if (alvo.marcado > 0) alvo.marcado--;
    ctx.causarDano(alvo, this.ataque * mult, mult > 1);
  }

  usarHabilidade(ctx: ContextoBatalha) {
    for (const i of ctx.inimigosVivos()) {
      i.marcado = 4;
      ctx.causarDano(i, this.ataque * 1.5);
    }
  }
}

// ======================================================================
// Heróis do Instanciar. Cada um sobrescreve atacar() de um jeito diferente.
// ======================================================================

export class GraceCompiladora extends Heroi {
  readonly id = 'grace';
  readonly nome = 'Grace, a Compiladora';
  readonly nomeCurto = 'Grace';
  readonly inspiracao = 'Grace Hopper';
  readonly iniciais = 'GC';
  readonly papel = 'Tanque';
  readonly raridade: Raridade = 5;
  readonly cor = 0x2b6fd6;
  readonly intervaloAtaque = 1300;
  protected readonly ataqueBase = 7;
  protected readonly vidaBase = 120;
  readonly fato =
    'Grace Hopper, sua inspiração, criou um dos primeiros compiladores (A-0, 1952) e ajudou a criar a linguagem COBOL. Em 1947 sua equipe registrou o famoso "bug": uma mariposa presa no computador Harvard Mark II.';
  readonly habilidade = {
    nome: 'Compilar Escudo',
    descricao: 'Dá 3 cargas de escudo à equipe e atrai os próximos 5 ataques inimigos para si, sofrendo 50% menos dano.',
  };
  readonly codigoAtacar = `class GraceCompiladora extends Heroi {
  atacar(ctx, eu) {
    ctx.causarDano(ctx.alvoInimigo(), this.ataque);
    // Tanque: chama a atenção do inimigo para proteger a equipe
    ctx.provocar(eu, 1, 0.3);
  }
}`;

  atacar(ctx: ContextoBatalha, eu: HeroiBatalha) {
    const alvo = ctx.alvoInimigo();
    if (alvo) ctx.causarDano(alvo, this.ataque);
    ctx.provocar(eu, 1, 0.3);
  }

  usarHabilidade(ctx: ContextoBatalha, eu: HeroiBatalha) {
    ctx.adicionarEscudo(3);
    ctx.provocar(eu, 5, 0.5);
  }
}

export class DijkstraDesbravador extends Heroi {
  readonly id = 'dijkstra';
  readonly nome = 'Dijkstra, o Desbravador';
  readonly nomeCurto = 'Dijkstra';
  readonly inspiracao = 'Edsger Dijkstra';
  readonly iniciais = 'ED';
  readonly papel = 'Dano';
  readonly raridade: Raridade = 5;
  readonly cor = 0xd9731a;
  readonly intervaloAtaque = 1000;
  protected readonly ataqueBase = 15;
  protected readonly vidaBase = 55;
  readonly fato =
    'Edsger Dijkstra, sua inspiração, publicou em 1959 o algoritmo do caminho mínimo, usado até hoje em mapas, GPS e redes.';
  readonly habilidade = {
    nome: 'Caminho Mínimo',
    descricao: 'Causa 250% do ataque no inimigo mais fraco. Se derrotá-lo, salta para o próximo mais fraco (até 3 saltos).',
  };
  readonly codigoAtacar = `class DijkstraDesbravador extends Heroi {
  atacar(ctx) {
    // Dano: sempre escolhe o caminho mais curto até a vitória
    const alvo = ctx.inimigoMaisFraco();
    ctx.causarDano(alvo, this.ataque);
  }
}`;

  atacar(ctx: ContextoBatalha) {
    const alvo = ctx.inimigoMaisFraco();
    if (alvo) ctx.causarDano(alvo, this.ataque);
  }

  usarHabilidade(ctx: ContextoBatalha) {
    for (let salto = 0; salto < 3; salto++) {
      const alvo = ctx.inimigoMaisFraco();
      if (!alvo) return;
      ctx.causarDano(alvo, this.ataque * 2.5, true);
      if (alvo.hp > 0) return;
    }
  }
}

export class DennisPonteiro extends Heroi {
  readonly id = 'dennis';
  readonly nome = 'Dennis, o Ponteiro';
  readonly nomeCurto = 'Dennis';
  readonly inspiracao = 'Dennis Ritchie';
  readonly iniciais = 'DP';
  readonly papel = 'Tanque';
  readonly raridade: Raridade = 4;
  readonly cor = 0x16a085;
  readonly intervaloAtaque = 1200;
  protected readonly ataqueBase = 6;
  protected readonly vidaBase = 105;
  readonly fato =
    'Dennis Ritchie, sua inspiração, criou a linguagem C nos Bell Labs no início dos anos 1970 e ajudou a criar o sistema Unix.';
  readonly habilidade = {
    nome: 'Desreferenciar',
    descricao: 'Aponta todos os ataques inimigos para si pelos próximos 6 golpes, com 60% menos dano, e recupera 25% da vida.',
  };
  readonly codigoAtacar = `class DennisPonteiro extends Heroi {
  atacar(ctx, eu) {
    ctx.causarDano(ctx.alvoInimigo(), this.ataque);
    // Tanque: um ponteiro que aponta o perigo para si
    if (eu.hp > eu.hpMax / 2) ctx.provocar(eu, 1, 0.2);
  }
}`;

  atacar(ctx: ContextoBatalha, eu: HeroiBatalha) {
    const alvo = ctx.alvoInimigo();
    if (alvo) ctx.causarDano(alvo, this.ataque);
    if (eu.hp > eu.hpMax / 2) ctx.provocar(eu, 1, 0.2);
  }

  usarHabilidade(ctx: ContextoBatalha, eu: HeroiBatalha) {
    ctx.provocar(eu, 6, 0.6);
    ctx.curar(eu, eu.hpMax * 0.25);
  }
}

export class NygaardSimulador extends Heroi {
  readonly id = 'nygaard';
  readonly nome = 'Nygaard, o Simulador';
  readonly nomeCurto = 'Nygaard';
  readonly inspiracao = 'Kristen Nygaard';
  readonly iniciais = 'KN';
  readonly papel = 'Suporte';
  readonly raridade: Raridade = 4;
  readonly cor = 0xe0567f;
  readonly intervaloAtaque = 1200;
  protected readonly ataqueBase = 5;
  protected readonly vidaBase = 70;
  readonly fato =
    'Kristen Nygaard, sua inspiração, criou com Ole-Johan Dahl a linguagem Simula 67, a primeira com classes, objetos e herança.';
  readonly habilidade = {
    nome: 'Classe Base',
    descricao: 'Toda a equipe herda +40% de ataque por 8 segundos.',
  };
  readonly codigoAtacar = `class NygaardSimulador extends Heroi {
  atacar(ctx) {
    ctx.causarDano(ctx.alvoInimigo(), this.ataque);
    // Suporte: passa energia para um aliado, como uma herança
    const aliado = ctx.heroisVivos()[0];
    ctx.darEnergia(aliado, 10);
  }
}`;

  atacar(ctx: ContextoBatalha, eu: HeroiBatalha) {
    const alvo = ctx.alvoInimigo();
    if (alvo) ctx.causarDano(alvo, this.ataque);
    const aliados = ctx.heroisVivos().filter((h) => h !== eu);
    if (aliados.length) ctx.darEnergia(aliados[Math.floor(Math.random() * aliados.length)], 10);
  }

  usarHabilidade(ctx: ContextoBatalha) {
    ctx.reforcarEquipe(1.4, 8000);
  }
}

export class JeanProgramadora extends Heroi {
  readonly id = 'jean';
  readonly nome = 'Jean, a Programadora';
  readonly nomeCurto = 'Jean';
  readonly inspiracao = 'Jean Bartik';
  readonly iniciais = 'JB';
  readonly papel = 'Dano';
  readonly raridade: Raridade = 4;
  readonly cor = 0x27ae60;
  readonly intervaloAtaque = 800;
  protected readonly ataqueBase = 7;
  protected readonly vidaBase = 50;
  readonly fato =
    'Jean Bartik, sua inspiração, foi uma das seis primeiras programadoras do ENIAC, por volta de 1945 e 1946, programando a máquina com cabos e chaves.';
  readonly habilidade = {
    nome: 'Reprogramar',
    descricao: 'Dispara 6 golpes rápidos de 70% do ataque em inimigos aleatórios.',
  };
  readonly codigoAtacar = `class JeanProgramadora extends Heroi {
  atacar(ctx) {
    // Dano: dois golpes rápidos, como trocar dois cabos de uma vez
    const alvo = ctx.alvoInimigo();
    ctx.causarDano(alvo, this.ataque * 0.6);
    ctx.causarDano(alvo, this.ataque * 0.6);
  }
}`;

  atacar(ctx: ContextoBatalha) {
    for (let i = 0; i < 2; i++) {
      const alvo = ctx.alvoInimigo();
      if (alvo) ctx.causarDano(alvo, this.ataque * 0.6);
    }
  }

  usarHabilidade(ctx: ContextoBatalha) {
    for (let i = 0; i < 6; i++) {
      const vivos = ctx.inimigosVivos();
      if (!vivos.length) return;
      ctx.causarDano(vivos[Math.floor(Math.random() * vivos.length)], this.ataque * 0.7);
    }
  }
}

export class BackusTradutor extends Heroi {
  readonly id = 'backus';
  readonly nome = 'Backus, o Tradutor';
  readonly nomeCurto = 'Backus';
  readonly inspiracao = 'John Backus';
  readonly iniciais = 'JB';
  readonly papel = 'Dano';
  readonly raridade: Raridade = 4;
  readonly cor = 0x138d75;
  readonly intervaloAtaque = 1400;
  protected readonly ataqueBase = 8;
  protected readonly vidaBase = 55;
  readonly fato =
    'John Backus, sua inspiração, liderou na IBM a criação do FORTRAN (1957), que traduzia fórmulas matemáticas para código de máquina.';
  readonly habilidade = {
    nome: 'Fórmula',
    descricao: 'Causa 160% do ataque em todos os inimigos e reduz o ataque deles em 30% por 6 segundos.',
  };
  readonly codigoAtacar = `class BackusTradutor extends Heroi {
  atacar(ctx) {
    // Dano em área: uma fórmula vale para todos os inimigos
    for (const inimigo of ctx.inimigosVivos())
      ctx.causarDano(inimigo, this.ataque * 0.45);
  }
}`;

  atacar(ctx: ContextoBatalha) {
    for (const i of ctx.inimigosVivos()) ctx.causarDano(i, this.ataque * 0.45);
  }

  usarHabilidade(ctx: ContextoBatalha) {
    for (const i of ctx.inimigosVivos()) {
      ctx.causarDano(i, this.ataque * 1.6);
      ctx.enfraquecer(i, 6000);
    }
  }
}

/** Todos os heróis do jogo, na ordem em que aparecem nas listas. */
export function criarTodosHerois(): Heroi[] {
  return [
    new AdaLovelace(), new AlanTuring(),
    new GraceCompiladora(), new DijkstraDesbravador(),
    new DennisPonteiro(), new NygaardSimulador(), new JeanProgramadora(), new BackusTradutor(),
  ];
}

export const HEROIS_INICIAIS = ['ada', 'turing'];

