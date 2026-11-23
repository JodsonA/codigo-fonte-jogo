import { ENIGMAS } from './enigmas';
import { FASES, fasesDoCapitulo, type Fase } from './fases';
import type { Jogo } from './jogo';

export { ENIGMAS };

/** Marcos do capítulo: as fases e os portões de enigma, na ordem do mapa. */
export type Marco =
  | { tipo: 'fase'; id: string }
  | { tipo: 'enigma'; id: string };

export function marcosDoCapitulo(capitulo: number): Marco[] {
  const lista: Marco[] = [];
  for (const f of fasesDoCapitulo(capitulo)) {
    if (f.enigmaAntes) lista.push({ tipo: 'enigma', id: f.enigmaAntes });
    lista.push({ tipo: 'fase', id: f.id });
  }
  return lista;
}

export function marcoConcluido(j: Jogo, m: Marco) {
  return m.tipo === 'fase' ? j.faseVencida(m.id) : j.enigmaResolvido(m.id);
}

export function progressoCapitulo(j: Jogo, capitulo: number) {
  const marcos = marcosDoCapitulo(capitulo);
  return { feitos: marcos.filter((m) => marcoConcluido(j, m)).length, total: marcos.length };
}

/** Capítulo liberado: o primeiro sempre; os outros depois do chefão anterior. */
export function capituloLiberado(j: Jogo, capitulo: number) {
  if (capitulo <= 1) return true;
  const anterior = fasesDoCapitulo(capitulo - 1);
  return anterior.length > 0 && j.faseVencida(anterior[anterior.length - 1].id);
}

/** A fase que o enigma protege (e, por ela, o capítulo do enigma). */
export function faseDoEnigma(id: string): Fase | undefined {
  return FASES.find((f) => f.enigmaAntes === id);
}
