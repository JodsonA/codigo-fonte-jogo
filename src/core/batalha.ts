import type { Heroi } from './herois';
import type { Fase, ModeloInimigo } from './fases';
import type { ContextoBatalha, Evento, HeroiBatalha, InimigoBatalha } from './tipos';

export type EstadoBatalha = 'lutando' | 'vitoria' | 'derrota';

const ENERGIA_POR_ATAQUE = 20;
const PAUSA_ENTRE_ONDAS = 900;

/** Simulação pura: não desenha nada. A cena só lê `eventos` e o estado. */
export class Batalha implements ContextoBatalha {
  readonly herois: HeroiBatalha[];
  inimigos: InimigoBatalha[] = [];
  ondaAtual = -1;
  estado: EstadoBatalha = 'lutando';
  escudo = 0;
  eventos: Evento[] = [];
  private pausa = 0;
  private proximoUid = 1;

  constructor(readonly fase: Fase, herois: Heroi[]) {
    this.herois = herois.map((h) => ({
      uid: this.proximoUid++,
      nome: h.nome,
      cor: h.cor,
      hp: h.vidaMax,
      hpMax: h.vidaMax,
      heroi: h,
      energia: 0,
      cooldown: h.intervaloAtaque * (0.3 + Math.random() * 0.3),
    }));
    this.iniciarOnda();
  }

  get totalOndas() { return this.fase.ondas.length; }

  private iniciarOnda() {
    this.ondaAtual++;
    this.inimigos = this.fase.ondas[this.ondaAtual].map((m: ModeloInimigo) => ({
      uid: this.proximoUid++,
      nome: m.nome,
      cor: m.cor,
      hp: m.vida,
      hpMax: m.vida,
      ataque: m.ataque,
      intervalo: m.intervalo,
      cooldown: m.intervalo * (0.6 + Math.random() * 0.4),
      marcado: 0,
      chefe: !!m.chefe,
    }));
    this.eventos.push({ tipo: 'onda', onda: this.ondaAtual });
  }

  atualizar(dt: number) {
    if (this.estado !== 'lutando') return;

    if (this.pausa > 0) {
      this.pausa -= dt;
      if (this.pausa <= 0) this.iniciarOnda();
      return;
    }

    for (const h of this.heroisVivos()) {
      h.cooldown -= dt;
      if (h.cooldown > 0) continue;
      h.cooldown += h.heroi.intervaloAtaque;
      const alvo = this.alvoInimigo();
      if (!alvo) break;
      this.eventos.push({ tipo: 'ataque', origem: h.uid, alvo: alvo.uid });
      h.heroi.atacar(this, h);
      h.energia = Math.min(100, h.energia + ENERGIA_POR_ATAQUE);
    }

    for (const e of this.inimigosVivos()) {
      e.cooldown -= dt;
      if (e.cooldown > 0) continue;
      e.cooldown += e.intervalo;
      const vivos = this.heroisVivos();
      if (vivos.length === 0) break;
      const alvo = vivos[Math.floor(Math.random() * vivos.length)];
      this.eventos.push({ tipo: 'ataque', origem: e.uid, alvo: alvo.uid });
      if (this.escudo > 0) {
        this.escudo--;
        this.eventos.push({ tipo: 'bloqueio', alvo: alvo.uid });
        continue;
      }
      const valor = variar(e.ataque);
      alvo.hp = Math.max(0, alvo.hp - valor);
      this.eventos.push({ tipo: 'dano', alvo: alvo.uid, valor });
    }

    if (this.heroisVivos().length === 0) {
      this.estado = 'derrota';
    } else if (this.inimigosVivos().length === 0) {
      if (this.ondaAtual < this.totalOndas - 1) this.pausa = PAUSA_ENTRE_ONDAS;
      else this.estado = 'vitoria';
    }
  }

  podeUsarHabilidade(h: HeroiBatalha) {
    return this.estado === 'lutando' && this.pausa <= 0 && h.hp > 0 && h.energia >= 100 && h.heroi.habilidadeDesbloqueada;
  }

  usarHabilidade(h: HeroiBatalha) {
    if (!this.podeUsarHabilidade(h)) return false;
    h.energia = 0;
    this.eventos.push({ tipo: 'habilidade', origem: h.uid, nome: h.heroi.habilidade.nome });
    h.heroi.usarHabilidade(this, h);
    return true;
  }

  // ---- ContextoBatalha ----
  alvoInimigo() { return this.inimigos.find((i) => i.hp > 0); }
  inimigosVivos() { return this.inimigos.filter((i) => i.hp > 0); }
  heroisVivos() { return this.herois.filter((h) => h.hp > 0); }

  aliadoMaisFerido() {
    const vivos = this.heroisVivos().filter((h) => h.hp < h.hpMax);
    vivos.sort((a, b) => a.hp / a.hpMax - b.hp / b.hpMax);
    return vivos[0];
  }

  causarDano(alvo: InimigoBatalha, valor: number, critico = false) {
    if (alvo.hp <= 0) return 0;
    const v = variar(valor);
    alvo.hp = Math.max(0, alvo.hp - v);
    this.eventos.push({ tipo: 'dano', alvo: alvo.uid, valor: v, critico });
    return v;
  }

  curar(alvo: HeroiBatalha, valor: number) {
    if (alvo.hp <= 0) return;
    const antes = alvo.hp;
    alvo.hp = Math.min(alvo.hpMax, alvo.hp + Math.round(valor));
    if (alvo.hp > antes) this.eventos.push({ tipo: 'cura', alvo: alvo.uid, valor: alvo.hp - antes });
  }

  adicionarEscudo(cargas: number) {
    this.escudo += cargas;
  }
}

function variar(v: number) {
  return Math.max(1, Math.round(v * (0.9 + Math.random() * 0.2)));
}
