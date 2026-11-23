import { ENIGMA_LINHA_DO_TEMPO } from './enigmas';
import { FASES } from './fases';
import type { Jogo } from './jogo';

/** Marcos do capítulo: as fases e os portões de enigma, na ordem do mapa. */
export type Marco =
  | { tipo: 'fase'; id: string }
  | { tipo: 'enigma'; id: string };

export function marcosDoCapitulo(): Marco[] {
  const lista: Marco[] = [];
  for (const f of FASES) {
    if (f.enigmaAntes) lista.push({ tipo: 'enigma', id: f.enigmaAntes });
    lista.push({ tipo: 'fase', id: f.id });
  }
  return lista;
}

export function marcoConcluido(j: Jogo, m: Marco) {
  return m.tipo === 'fase' ? j.faseVencida(m.id) : j.enigmaResolvido(m.id);
}

export function progressoCapitulo(j: Jogo) {
  const marcos = marcosDoCapitulo();
  return { feitos: marcos.filter((m) => marcoConcluido(j, m)).length, total: marcos.length };
}

export const ENIGMAS = { [ENIGMA_LINHA_DO_TEMPO.id]: ENIGMA_LINHA_DO_TEMPO };
