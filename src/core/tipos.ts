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
}

export interface InimigoBatalha extends Unidade {
  ataque: number;
  intervalo: number;
  cooldown: number;
  /** Quantos golpes ainda recebem dano dobrado (fraqueza revelada por Turing). */
  marcado: number;
  chefe: boolean;
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
}
