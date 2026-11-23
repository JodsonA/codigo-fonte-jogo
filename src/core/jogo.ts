import { criarTodosHerois, HEROIS_INICIAIS, type Atributo, type Heroi, type HeroiSave } from './herois';
import { FASES, type Fase } from './fases';
import {
  CUSTO_GIRO, FICHAS_REPETIDO, PACOTES_LOJA, PRECO_LOJA, girar, type EstadoGacha, type ResultadoGiro,
} from './gacha';

const CHAVE_SAVE = 'codigo-fonte-save-v1';
export const LIMITE_OFFLINE_MS = 8 * 60 * 60 * 1000;
const MINIMO_OFFLINE_MS = 60 * 1000;

export const TAMANHO_EQUIPE = 4;
export const BONUS_BOAS_VINDAS = 100;

/** Energia: cada fase custa energia, que recarrega com o tempo. Limita quantas fases dá para jogar por dia. */
export const ENERGIA_MAX = 60;
export const CUSTO_FASE = 6;
export const RECARGA_ENERGIA_MS = 12 * 60 * 1000;
/** Na derrota ou na fuga, metade da energia volta. */
export const DEVOLUCAO_DERROTA = 3;
/** Repetir uma fase vencida também rende alguns Commits. */
const COMMITS_REPETICAO = 3;

interface Save {
  versao: 1 | 2;
  bytes: number;
  commits: number;
  fichas?: number;
  fasesVencidas: string[];
  enigmasResolvidos: string[];
  herois: HeroiSave[];
  equipe?: string[];
  gacha?: EstadoGacha;
  energia?: number;
  energiaEm?: number;
  bonusBoasVindas?: boolean;
  perfil?: Perfil;
  ultimoSalvamento: number;
}

export interface Perfil {
  nickname: string;
  avatarId: string;
  criadoEm: number;
  vitorias: number;
  derrotas: number;
}

export const NICK_MIN = 3;
export const NICK_MAX = 16;

/** Valida o nickname. Devolve a mensagem de erro, ou null se estiver tudo certo. */
export function validarNickname(bruto: string): string | null {
  const nick = bruto.trim();
  if (nick.length < NICK_MIN) return `Use pelo menos ${NICK_MIN} caracteres.`;
  if (nick.length > NICK_MAX) return `Use no máximo ${NICK_MAX} caracteres.`;
  if (!/^[\p{L}\p{N}_ .-]+$/u.test(nick)) return 'Use só letras, números, espaço, ponto, hífen e _.';
  return null;
}

export interface Ganhos {
  bytes: number;
  xp: number;
  niveis: { nome: string; subiu: number }[];
  tempoMs: number;
}

export type ResultadoInstanciar = ResultadoGiro & { novo?: boolean; fichasConvertidas?: number };

export class Jogo {
  /** Todos os heróis que existem no jogo. */
  readonly todos: Heroi[] = criarTodosHerois();
  colecao = new Set<string>(HEROIS_INICIAIS);
  equipeIds: string[] = [...HEROIS_INICIAIS];
  bytes = 0;
  commits = 0;
  fichas = 0;
  fasesVencidas: string[] = [];
  enigmasResolvidos: string[] = [];
  gacha: EstadoGacha = { semCinco: 0, semQuatro: 0, total: 0 };
  energia = ENERGIA_MAX;
  energiaEm = Date.now();
  bonusBoasVindas = false;
  /** Verdadeiro só na sessão em que o presente de boas-vindas foi entregue. */
  bonusRecebidoAgora = false;
  ultimoSalvamento = Date.now();
  perfil: Perfil = { nickname: 'Desenvolvedor(a)', avatarId: 'ada', criadoEm: Date.now(), vitorias: 0, derrotas: 0 };

  static carregar(): Jogo {
    const jogo = new Jogo();
    try {
      const bruto = localStorage.getItem(CHAVE_SAVE);
      if (bruto) {
        const s = JSON.parse(bruto) as Save;
        jogo.bytes = s.bytes ?? 0;
        jogo.commits = s.commits ?? 0;
        jogo.fichas = s.fichas ?? 0;
        jogo.fasesVencidas = s.fasesVencidas ?? [];
        jogo.enigmasResolvidos = s.enigmasResolvidos ?? [];
        jogo.ultimoSalvamento = s.ultimoSalvamento ?? Date.now();
        for (const hs of s.herois ?? []) {
          const h = jogo.buscar(hs.id);
          if (!h) continue;
          h.carregar(hs);
          jogo.colecao.add(h.id);
        }
        const equipe = (s.equipe ?? HEROIS_INICIAIS).filter((id) => jogo.colecao.has(id)).slice(0, TAMANHO_EQUIPE);
        jogo.equipeIds = equipe.length ? equipe : [...HEROIS_INICIAIS];
        if (s.gacha) jogo.gacha = { ...jogo.gacha, ...s.gacha };
        jogo.energia = s.energia ?? ENERGIA_MAX;
        jogo.energiaEm = s.energiaEm ?? Date.now();
        jogo.bonusBoasVindas = !!s.bonusBoasVindas;
        if (s.perfil) jogo.perfil = { ...jogo.perfil, ...s.perfil };
        if (!jogo.colecao.has(jogo.perfil.avatarId)) jogo.perfil.avatarId = 'ada';
      }
    } catch {
      // Save corrompido: começa do zero.
    }
    if (!jogo.bonusBoasVindas) {
      jogo.bonusBoasVindas = true;
      jogo.bonusRecebidoAgora = true;
      jogo.commits += BONUS_BOAS_VINDAS;
    }
    return jogo;
  }

  salvar() {
    this.ultimoSalvamento = Date.now();
    const s: Save = {
      versao: 2,
      bytes: this.bytes,
      commits: this.commits,
      fichas: this.fichas,
      fasesVencidas: this.fasesVencidas,
      enigmasResolvidos: this.enigmasResolvidos,
      herois: this.herois.map((h) => h.salvar()),
      equipe: this.equipeIds,
      gacha: this.gacha,
      energia: this.energia,
      energiaEm: this.energiaEm,
      bonusBoasVindas: this.bonusBoasVindas,
      perfil: this.perfil,
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

  // ------------------------------------------------------------ Heróis e equipe

  buscar(id: string) { return this.todos.find((h) => h.id === id); }

  /** Heróis que o jogador já tem. */
  get herois() { return this.todos.filter((h) => this.colecao.has(h.id)); }

  /** Heróis que vão para a batalha (até 4). */
  get equipe() { return this.equipeIds.map((id) => this.buscar(id)!).filter(Boolean); }

  naEquipe(id: string) { return this.equipeIds.includes(id); }

  /** Coloca ou tira um herói da equipe. Devolve uma mensagem para o jogador. */
  alternarEquipe(id: string): string {
    if (!this.colecao.has(id)) return 'Você ainda não tem este herói.';
    if (this.naEquipe(id)) {
      if (this.equipeIds.length <= 1) return 'A equipe precisa de pelo menos 1 herói.';
      this.equipeIds = this.equipeIds.filter((x) => x !== id);
      this.salvar();
      return 'Saiu da equipe.';
    }
    if (this.equipeIds.length >= TAMANHO_EQUIPE) return `A equipe já tem ${TAMANHO_EQUIPE} heróis. Tire alguém antes.`;
    this.equipeIds.push(id);
    this.salvar();
    return 'Entrou na equipe!';
  }

  /** Novo herói entra no nível médio da equipe (herda a experiência dela). */
  private recrutar(h: Heroi) {
    const media = this.equipe.reduce((s, x) => s + x.nivel, 0) / Math.max(1, this.equipe.length);
    h.definirNivelInicial(media);
    this.colecao.add(h.id);
    if (this.equipeIds.length < TAMANHO_EQUIPE) this.equipeIds.push(h.id);
  }

  private darXpEquipe(xp: number) {
    return this.equipe.map((h) => ({ nome: h.nomeCurto, subiu: h.ganharXp(xp) }));
  }

  // ------------------------------------------------------------ Tempo e idle

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
    return { bytes, xp, niveis: this.darXpEquipe(xp), tempoMs: ms };
  }

  /** Chame uma vez ao abrir o jogo. Devolve null se o tempo fora foi curto. */
  coletarOffline(agora = Date.now()): Ganhos | null {
    const fora = Math.min(agora - this.ultimoSalvamento, LIMITE_OFFLINE_MS);
    if (fora < MINIMO_OFFLINE_MS || this.taxaPorMinuto().bytes === 0) return null;
    const g = this.aplicarTempo(fora);
    this.salvar();
    return g;
  }

  // ------------------------------------------------------------ Energia

  private sincronizarEnergia(agora = Date.now()) {
    if (this.energia >= ENERGIA_MAX) {
      this.energiaEm = agora;
      return;
    }
    const ganhos = Math.floor((agora - this.energiaEm) / RECARGA_ENERGIA_MS);
    if (ganhos <= 0) return;
    this.energia = Math.min(ENERGIA_MAX, this.energia + ganhos);
    this.energiaEm = this.energia >= ENERGIA_MAX ? agora : this.energiaEm + ganhos * RECARGA_ENERGIA_MS;
  }

  energiaAtual(agora = Date.now()) {
    this.sincronizarEnergia(agora);
    return this.energia;
  }

  /** Quanto falta para ganhar +1 de energia (0 se está cheia). */
  msParaProximaEnergia(agora = Date.now()) {
    this.sincronizarEnergia(agora);
    return this.energia >= ENERGIA_MAX ? 0 : RECARGA_ENERGIA_MS - (agora - this.energiaEm);
  }

  /** Quanto falta para encher até ter energia para mais uma fase. */
  msParaJogar(agora = Date.now()) {
    const falta = CUSTO_FASE - this.energiaAtual(agora);
    if (falta <= 0) return 0;
    return this.msParaProximaEnergia(agora) + (falta - 1) * RECARGA_ENERGIA_MS;
  }

  gastarEnergia(qtd = CUSTO_FASE) {
    if (this.energiaAtual() < qtd) return false;
    this.energia -= qtd;
    this.salvar();
    return true;
  }

  devolverEnergia(qtd: number) {
    this.sincronizarEnergia();
    this.energia = Math.min(ENERGIA_MAX, this.energia + qtd);
    this.salvar();
  }

  // ------------------------------------------------------------ Fases e enigmas

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
    const commits = primeira ? fase.recompensa.commits : COMMITS_REPETICAO;
    this.bytes += bytes;
    this.commits += commits;
    if (primeira) this.fasesVencidas.push(fase.id);
    this.perfil.vitorias++;
    const niveis = this.darXpEquipe(xp);
    this.salvar();
    return { xp, bytes, commits, niveis, primeira };
  }

  registrarDerrota() {
    this.perfil.derrotas++;
    this.salvar();
  }

  definirNickname(bruto: string) {
    const erro = validarNickname(bruto);
    if (erro) return erro;
    this.perfil.nickname = bruto.trim().replace(/\s+/g, ' ');
    this.salvar();
    return null;
  }

  definirAvatar(id: string) {
    if (!this.colecao.has(id)) return;
    this.perfil.avatarId = id;
    this.salvar();
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

  // ------------------------------------------------------------ Instanciar (gacha)

  /** Heróis que podem sair no Instanciar, por raridade. */
  poolGacha(): Record<4 | 5, string[]> {
    return {
      4: this.todos.filter((h) => h.raridade === 4).map((h) => h.id),
      5: this.todos.filter((h) => h.raridade === 5).map((h) => h.id),
    };
  }

  instanciar(quantidade: number, aleatorio: () => number = Math.random): ResultadoInstanciar[] | null {
    const custo = quantidade * CUSTO_GIRO;
    if (this.commits < custo) return null;
    this.commits -= custo;
    const pool = this.poolGacha();
    const resultados: ResultadoInstanciar[] = [];
    for (let i = 0; i < quantidade; i++) {
      const r: ResultadoInstanciar = girar(this.gacha, pool, aleatorio);
      if (r.tipo === 'heroi') {
        const h = this.buscar(r.heroiId)!;
        if (this.colecao.has(h.id)) {
          r.fichasConvertidas = FICHAS_REPETIDO[r.raridade];
          this.fichas += r.fichasConvertidas;
        } else {
          r.novo = true;
          this.recrutar(h);
        }
      } else if (r.tipo === 'xp') {
        this.darXpEquipe(r.quantidade);
      } else if (r.tipo === 'bytes') {
        this.bytes += r.quantidade;
      } else {
        this.fichas += r.quantidade;
      }
      resultados.push(r);
    }
    this.salvar();
    return resultados;
  }

  // ------------------------------------------------------------ Loja de Fichas

  precoHeroi(h: Heroi) { return h.raridade === 5 ? PRECO_LOJA[5] : PRECO_LOJA[4]; }

  comprarHeroi(id: string) {
    const h = this.buscar(id);
    if (!h || h.raridade === 3 || this.colecao.has(id)) return false;
    const preco = this.precoHeroi(h);
    if (this.fichas < preco) return false;
    this.fichas -= preco;
    this.recrutar(h);
    this.salvar();
    return true;
  }

  comprarPacote(id: (typeof PACOTES_LOJA)[number]['id']) {
    const p = PACOTES_LOJA.find((x) => x.id === id)!;
    if (this.fichas < p.preco) return false;
    this.fichas -= p.preco;
    if (id === 'xp') this.darXpEquipe(150);
    else this.bytes += 120;
    this.salvar();
    return true;
  }
}

export const jogo = Jogo.carregar();
