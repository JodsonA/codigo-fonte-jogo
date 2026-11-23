import type { Heroi } from './herois';

/** Qualquer coisa que tem vida no campo de batalha. */
export interface Unidade {
  uid: number;
  nome: string;
  hp: number;
  hpMax: number;
  cor: number;
}

export interface HeroiBatalha extends Unidade {
  heroi: Heroi;
  energia: number;
  cooldown: number;
  /** Golpes inimigos que este herói ainda atrai para si (tanques). */
  provocacao: number;
  /** Fração do dano reduzida enquanto provoca (0 a 1). */
  reducao: number;
}

export interface InimigoBatalha extends Unidade {
  ataque: number;
  intervalo: number;
  cooldown: number;
  /** Quantos golpes ainda recebem dano dobrado (fraqueza revelada por Turing). */
  marcado: number;
  chefe: boolean;
  /** Milissegundos restantes com o ataque reduzido. */
  enfraquecido: number;
  /** Contador de golpes (chefões fazem um golpe em área a cada 3). */
  golpes: number;
}

export type Evento =
  | { tipo: 'ataque'; origem: number; alvo: number }
  | { tipo: 'dano'; alvo: number; valor: number; critico?: boolean }
  | { tipo: 'cura'; alvo: number; valor: number }
  | { tipo: 'bloqueio'; alvo: number }
  | { tipo: 'habilidade'; origem: number; nome: string }
  | { tipo: 'onda'; onda: number }
  | { tipo: 'texto'; msg: string };

/**
 * Abstração: o herói não precisa saber como a batalha funciona por dentro.
 * Ele só conversa com esta interface.
 */
export interface ContextoBatalha {
  alvoInimigo(): InimigoBatalha | undefined;
  inimigosVivos(): InimigoBatalha[];
  heroisVivos(): HeroiBatalha[];
  aliadoMaisFerido(): HeroiBatalha | undefined;
  causarDano(alvo: InimigoBatalha, valor: number, critico?: boolean): number;
  curar(alvo: HeroiBatalha, valor: number): void;
  adicionarEscudo(cargas: number): void;
  inimigoMaisFraco(): InimigoBatalha | undefined;
  provocar(eu: HeroiBatalha, golpes: number, reducao: number): void;
  reforcarEquipe(multiplicador: number, ms: number): void;
  enfraquecer(alvo: InimigoBatalha, ms: number): void;
  darEnergia(alvo: HeroiBatalha, quantidade: number): void;
}
