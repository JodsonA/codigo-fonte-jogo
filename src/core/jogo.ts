import { criarHerois, type Atributo, type Heroi, type HeroiSave } from './herois';
import { FASES, type Fase } from './fases';

const CHAVE_SAVE = 'codigo-fonte-save-v1';
export const LIMITE_OFFLINE_MS = 8 * 60 * 60 * 1000;
const MINIMO_OFFLINE_MS = 60 * 1000;

interface Save {
  versao: 1;
  bytes: number;
  commits: number;
  fasesVencidas: string[];
  enigmasResolvidos: string[];
  herois: HeroiSave[];
  ultimoSalvamento: number;
}

export interface Ganhos {
  bytes: number;
  xp: number;
  niveis: { nome: string; subiu: number }[];
  tempoMs: number;
}

export class Jogo {
  herois: Heroi[] = criarHerois();
  bytes = 0;
  commits = 0;
  fasesVencidas: string[] = [];
  enigmasResolvidos: string[] = [];
  ultimoSalvamento = Date.now();

  static carregar(): Jogo {
    const jogo = new Jogo();
    try {
      const bruto = localStorage.getItem(CHAVE_SAVE);
      if (!bruto) return jogo;
      const s = JSON.parse(bruto) as Save;
      jogo.bytes = s.bytes ?? 0;
      jogo.commits = s.commits ?? 0;
      jogo.fasesVencidas = s.fasesVencidas ?? [];
      jogo.enigmasResolvidos = s.enigmasResolvidos ?? [];
      jogo.ultimoSalvamento = s.ultimoSalvamento ?? Date.now();
      for (const hs of s.herois ?? []) jogo.herois.find((h) => h.id === hs.id)?.carregar(hs);
    } catch {
      // Save corrompido: começa do zero.
    }
    return jogo;
  }

  salvar() {
    this.ultimoSalvamento = Date.now();
    const s: Save = {
      versao: 1,
      bytes: this.bytes,
      commits: this.commits,
      fasesVencidas: this.fasesVencidas,
      enigmasResolvidos: this.enigmasResolvidos,
      herois: this.herois.map((h) => h.salvar()),
      ultimoSalvamento: this.ultimoSalvamento,
    };
    try {
      localStorage.setItem(CHAVE_SAVE, JSON.stringify(s));
    } catch {
      // Navegador sem armazenamento (modo privado de alguns navegadores).
    }
  }

  reiniciar() {
    try { localStorage.removeItem(CHAVE_SAVE); } catch { /* sem armazenamento */ }
  }

  /** "Processos em segundo plano": quanto o time rende por minuto. */
  taxaPorMinuto() {
    const n = this.fasesVencidas.length;
    if (n === 0) return { bytes: 0, xp: 0 };
    return { bytes: 1 + n, xp: n };
  }

  /** Aplica o rendimento de um intervalo de tempo (online ou offline). */
  aplicarTempo(ms: number): Ganhos {
    const taxa = this.taxaPorMinuto();
    const min = ms / 60000;
    const bytes = taxa.bytes * min;
    const xp = taxa.xp * min;
    this.bytes += bytes;
    const niveis = this.herois.map((h) => ({ nome: h.nomeCurto, subiu: h.ganharXp(xp) }));
    return { bytes, xp, niveis, tempoMs: ms };
  }

  /** Chame uma vez ao abrir o jogo. Devolve null se o tempo fora foi curto. */
  coletarOffline(agora = Date.now()): Ganhos | null {
    const fora = Math.min(agora - this.ultimoSalvamento, LIMITE_OFFLINE_MS);
    if (fora < MINIMO_OFFLINE_MS || this.taxaPorMinuto().bytes === 0) return null;
    const g = this.aplicarTempo(fora);
    this.salvar();
    return g;
  }

  faseVencida(id: string) { return this.fasesVencidas.includes(id); }
  enigmaResolvido(id: string) { return this.enigmasResolvidos.includes(id); }

  /** Fase liberada: a anterior foi vencida e o enigma do portão (se houver) foi resolvido. */
  faseLiberada(fase: Fase) {
    const i = FASES.indexOf(fase);
    const anteriorOk = i <= 0 || this.faseVencida(FASES[i - 1].id);
    const enigmaOk = !fase.enigmaAntes || this.enigmaResolvido(fase.enigmaAntes);
    return anteriorOk && enigmaOk;
  }

  /** O portão do enigma aparece quando a fase anterior à fase protegida foi vencida. */
  enigmaLiberado(enigmaId: string) {
    const fase = FASES.find((f) => f.enigmaAntes === enigmaId);
    if (!fase) return false;
    const i = FASES.indexOf(fase);
    return i <= 0 || this.faseVencida(FASES[i - 1].id);
  }

  registrarVitoria(fase: Fase) {
    const primeira = !this.faseVencida(fase.id);
    // Repetir uma fase rende metade (para farmar sem quebrar o equilíbrio).
    const fator = primeira ? 1 : 0.5;
    const xp = Math.round(fase.recompensa.xp * fator);
    const bytes = Math.round(fase.recompensa.bytes * fator);
    const commits = primeira ? fase.recompensa.commits : 0;
    this.bytes += bytes;
    this.commits += commits;
    if (primeira) this.fasesVencidas.push(fase.id);
    const niveis = this.herois.map((h) => ({ nome: h.nomeCurto, subiu: h.ganharXp(xp) }));
    this.salvar();
    return { xp, bytes, commits, niveis, primeira };
  }

  registrarEnigma(id: string, commits: number) {
    if (this.enigmaResolvido(id)) return 0;
    this.enigmasResolvidos.push(id);
    this.commits += commits;
    this.salvar();
    return commits;
  }

  treinar(heroi: Heroi, attr: Atributo) {
    const custo = heroi.custoTreino(attr);
    if (this.bytes < custo) return false;
    this.bytes -= custo;
    heroi.treinar(attr);
    this.salvar();
    return true;
  }
}

export const jogo = Jogo.carregar();
