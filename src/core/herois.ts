import type { ContextoBatalha, HeroiBatalha } from './tipos';

export type Papel = 'Suporte' | 'Dano' | 'Tanque';
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

export function criarHerois(): Heroi[] {
  return [new AdaLovelace(), new AlanTuring()];
}
