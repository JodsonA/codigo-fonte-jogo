import Phaser from 'phaser';
import { Batalha, TEMPO_LIMITE } from '../core/batalha';
import { CAPITULOS, buscarFase, fasesDoCapitulo, type Fase } from '../core/fases';
import { DEVOLUCAO_DERROTA, jogo } from '../core/jogo';
import { Heroi } from '../core/herois';
import type { HeroiBatalha, InimigoBatalha } from '../core/tipos';
import { ALTURA, Barra, Botao, COR, LARGURA, TXT, modal, texto } from './ui';
import { sprite } from './BootScene';

interface VisaoHeroi {
  unidade: HeroiBatalha;
  corpo: Phaser.GameObjects.Container;
  vida: Barra;
  vidaTxt: Phaser.GameObjects.Text;
  energia: Barra;
  botao: Botao;
}

interface VisaoInimigo {
  unidade: InimigoBatalha;
  corpo: Phaser.GameObjects.Container;
  vida: Barra;
  marca: Phaser.GameObjects.Text;
  morto: boolean;
}

export class BatalhaScene extends Phaser.Scene {
  private fase!: Fase;
  private batalha!: Batalha;
  private herois: VisaoHeroi[] = [];
  private inimigos: VisaoInimigo[] = [];
  private cabecalho!: Phaser.GameObjects.Text;
  private escudo!: Phaser.GameObjects.Text;
  private velocidade = 1;
  private terminou = false;
  private relogio!: Phaser.GameObjects.Text;

  constructor() { super('Batalha'); }

  init(data: { faseId: string }) {
    this.fase = buscarFase(data.faseId);
    this.herois = [];
    this.inimigos = [];
    this.terminou = false;
  }

  create() {
    const cap = CAPITULOS.find((c) => c.numero === this.fase.capitulo) ?? CAPITULOS[0];
    this.add.image(0, 0, cap.fundo).setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.add.rectangle(0, 0, LARGURA, ALTURA, 0x0b0820, 0.45).setOrigin(0);
    this.add.rectangle(0, 0, LARGURA, 66, 0x0b0820, 0.6).setOrigin(0);

    this.batalha = new Batalha(this.fase, jogo.equipe);

    this.cabecalho = texto(this, 20, 14, '', 20, TXT.normal, { fontStyle: 'bold' });
    texto(this, 20, 42, this.fase.descricao, 13, TXT.suave);
    this.escudo = texto(this, 40, 490, '', 15, TXT.destaque, { fontStyle: 'bold' });

    const vel = new Botao(this, LARGURA - 210, 32, 140, 38, 'Velocidade 1x', () => {
      this.velocidade = this.velocidade === 1 ? 2 : 1;
      vel.setRotulo(`Velocidade ${this.velocidade}x`);
    }, COR.cinzaBotao, 14);
    new Botao(this, LARGURA - 70, 32, 110, 38, 'Fugir', () => {
      jogo.devolverEnergia(DEVOLUCAO_DERROTA);
      this.scene.start('Mapa');
    }, COR.perigo, 14);
    this.relogio = texto(this, LARGURA - 300, 24, '', 15, TXT.normal, { fontStyle: 'bold' }).setOrigin(1, 0);

    const n = this.batalha.herois.length;
    this.batalha.herois.forEach((u, i) => (n <= 2 ? this.criarHeroi(u, 120, 170 + i * 150) : this.criarHeroiCompacto(u, 74, 120 + i * 104)));
    this.processarEventos();
  }

  private criarHeroi(u: HeroiBatalha, x: number, y: number) {
    const corpo = this.add.container(x - 14, y - 4);
    const img = sprite(this, 0, 0, `heroi-${u.heroi.id}`, 130);
    corpo.add(img);
    this.tweens.add({ targets: img, scaleY: img.scaleY * 1.03, duration: 800 + Math.random() * 300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    texto(this, x + 50, y - 40, `${u.heroi.nomeCurto} · nv ${u.heroi.nivel}`, 15, TXT.normal, { fontStyle: 'bold' });
    const vida = new Barra(this, x + 50, y - 8, 190, 12, COR.ok);
    const vidaTxt = texto(this, x + 245, y - 16, '', 12, TXT.suave);
    const energia = new Barra(this, x + 50, y + 12, 190, 7, COR.ouro);
    const h = u.heroi;
    const botao = new Botao(
      this, x + 145, y + 46, 190, 32,
      h.habilidadeDesbloqueada ? h.habilidade.nome : `${h.habilidade.nome} (nível ${Heroi.NIVEL_HABILIDADE})`,
      () => this.batalha.usarHabilidade(u) && this.processarEventos(), COR.ouro, 13,
    );
    this.herois.push({ unidade: u, corpo, vida, vidaTxt, energia, botao });
  }

  /** Layout para equipes de 3 ou 4 heróis. */
  private criarHeroiCompacto(u: HeroiBatalha, x: number, y: number) {
    const corpo = this.add.container(x, y);
    const img = sprite(this, 0, 0, `heroi-${u.heroi.id}`, 96);
    corpo.add(img);
    this.tweens.add({ targets: img, scaleY: img.scaleY * 1.03, duration: 800 + Math.random() * 300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    texto(this, x + 48, y - 36, `${u.heroi.nomeCurto} · nv ${u.heroi.nivel}`, 14, TXT.normal, { fontStyle: 'bold' });
    const vida = new Barra(this, x + 48, y - 10, 170, 11, COR.ok);
    const vidaTxt = texto(this, x + 222, y - 17, '', 11, TXT.suave);
    const energia = new Barra(this, x + 48, y + 6, 170, 6, COR.ouro);
    const h = u.heroi;
    const botao = new Botao(
      this, x + 133, y + 32, 170, 28,
      h.habilidadeDesbloqueada ? h.habilidade.nome : `${h.habilidade.nome} (nv ${Heroi.NIVEL_HABILIDADE})`,
      () => this.batalha.usarHabilidade(u) && this.processarEventos(), COR.ouro, 12,
    );
    this.herois.push({ unidade: u, corpo, vida, vidaTxt, energia, botao });
  }

  private criarInimigos() {
    for (const v of this.inimigos) v.corpo.destroy();
    this.inimigos = [];
    const lista = this.batalha.inimigos;
    const ys = lista.length === 1 ? [270] : lista.length === 2 ? [200, 340] : [140, 265, 390];
    lista.forEach((u, i) => {
      const tam = u.subchefe ? 200 : u.chefe ? 230 : 90;
      const x = u.chefe ? 740 : 700 + (i % 2) * 90;
      const y = ys[i] ?? 270;
      const corpo = this.add.container(x + 300, y);
      const forma = sprite(this, 0, 0, `inimigo-${u.nome}`, tam).setFlipX(u.nome === 'Loop Infinito');
      const nome = texto(this, 0, -tam / 2 - 12, u.nome, 13, TXT.normal, { fontStyle: 'bold' }).setOrigin(0.5);
      const vida = new Barra(this, -45, tam / 2 + 8, 90, 8, COR.perigo);
      const marca = texto(this, 0, tam / 2 + 22, '', 11, TXT.ouro).setOrigin(0.5);
      corpo.add([forma, nome, ...vida.objetos(), marca]);
      this.tweens.add({ targets: corpo, x, duration: 350, ease: 'Back.Out' });
      this.tweens.add({ targets: forma, scaleY: forma.scaleY * 0.94, duration: 600 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.inimigos.push({ unidade: u, corpo, vida, marca, morto: false });
    });
  }

  update(_t: number, dt: number) {
    this.batalha.atualizar(Math.min(dt, 100) * this.velocidade);
    const resta = Math.max(0, Math.ceil((TEMPO_LIMITE - this.batalha.tempo) / 1000));
    this.relogio.setText(`${Math.floor(resta / 60)}:${String(resta % 60).padStart(2, '0')}`).setColor(resta <= 20 ? TXT.perigo : TXT.normal);
    this.processarEventos();
    this.atualizarBarras();
    if (!this.terminou && this.batalha.estado !== 'lutando') {
      this.terminou = true;
      this.time.delayedCall(600, () => this.finalizar());
    }
  }

  private posicao(uid: number) {
    const h = this.herois.find((v) => v.unidade.uid === uid);
    if (h) return { obj: h.corpo, heroi: true };
    const i = this.inimigos.find((v) => v.unidade.uid === uid);
    if (i) return { obj: i.corpo, heroi: false };
    return undefined;
  }

  private processarEventos() {
    for (const ev of this.batalha.eventos.splice(0)) {
      switch (ev.tipo) {
        case 'onda':
          this.criarInimigos();
          this.cabecalho.setText(`Fase ${this.fase.id} · ${this.fase.nome}   Onda ${ev.onda + 1}/${this.batalha.totalOndas}`);
          this.anuncio(this.batalha.inimigos.some((i) => i.subchefe) ? 'Subchefe!' : this.batalha.inimigos.some((i) => i.chefe) ? 'Chefão!' : `Onda ${ev.onda + 1}`);
          break;
        case 'ataque': {
          const o = this.posicao(ev.origem);
          if (!o || this.tweens.isTweening(o.obj)) break;
          this.tweens.add({ targets: o.obj, x: o.obj.x + (o.heroi ? 24 : -24), duration: 90, yoyo: true });
          break;
        }
        case 'dano': {
          const a = this.posicao(ev.alvo);
          if (!a) break;
          const cor = a.heroi ? TXT.perigo : ev.critico ? TXT.ouro : TXT.normal;
          this.numero(a.obj.x, a.obj.y - 30, `${ev.critico ? 'Fraqueza! ' : ''}-${ev.valor}`, cor, ev.critico ? 20 : 16);
          break;
        }
        case 'cura': {
          const a = this.posicao(ev.alvo);
          if (a) this.numero(a.obj.x, a.obj.y - 30, `+${ev.valor}`, TXT.ok, 15);
          break;
        }
        case 'bloqueio': {
          const a = this.posicao(ev.alvo);
          if (a) this.numero(a.obj.x, a.obj.y - 30, 'Previsto pela Nota G!', TXT.destaque, 14);
          break;
        }
        case 'habilidade': {
          const a = this.posicao(ev.origem);
          if (a) this.tweens.add({ targets: a.obj, scale: 1.25, duration: 150, yoyo: true });
          this.anuncio(`${ev.nome}!`);
          this.cameras.main.flash(150, 255, 220, 120);
          break;
        }
        case 'texto':
          this.anuncio(ev.msg);
          break;
      }
    }
  }

  private atualizarBarras() {
    for (const v of this.herois) {
      const u = v.unidade;
      v.vida.set(u.hp / u.hpMax);
      v.vidaTxt.setText(`${u.hp}/${u.hpMax}`);
      v.energia.set(u.energia / 100);
      v.botao.setHabilitado(this.batalha.podeUsarHabilidade(u));
      v.corpo.setAlpha(u.hp > 0 ? 1 : 0.3);
    }
    for (const v of this.inimigos) {
      const u = v.unidade;
      v.vida.set(u.hp / u.hpMax);
      v.marca.setText(u.marcado > 0 ? `fraqueza revelada (${u.marcado})` : '');
      if (u.hp <= 0 && !v.morto) {
        v.morto = true;
        this.tweens.add({ targets: v.corpo, alpha: 0, scale: 0.6, angle: 20, duration: 300 });
      }
    }
    this.escudo.setText(this.batalha.escudo > 0 ? `Nota G: ${this.batalha.escudo} ataque(s) previsto(s)` : '');
  }

  private numero(x: number, y: number, msg: string, cor: string, tamanho: number) {
    const t = texto(this, x + Phaser.Math.Between(-12, 12), y, msg, tamanho, cor, { fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(500);
    this.tweens.add({ targets: t, y: y - 40, alpha: 0, duration: 800, onComplete: () => t.destroy() });
  }

  private anuncio(msg: string) {
    const t = texto(this, LARGURA / 2, ALTURA / 2 - 40, msg, 34, TXT.ouro, { fontStyle: 'bold', stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5).setDepth(600).setScale(0.6);
    this.tweens.add({ targets: t, scale: 1, duration: 200, ease: 'Back.Out' });
    this.tweens.add({ targets: t, alpha: 0, delay: 700, duration: 400, onComplete: () => t.destroy() });
  }

  private finalizar() {
    if (this.batalha.estado === 'vitoria') {
      const equipe = jogo.equipe;
      const antes = equipe.map((h) => h.habilidadeDesbloqueada);
      const r = jogo.registrarVitoria(this.fase);
      const linhas = [`+${r.xp} XP para cada herói`, `+${r.bytes} Bytes`];
      if (r.commits > 0) linhas.push(`+${r.commits} Commits`);
      if (!r.primeira) linhas.push('(repetição: recompensa pela metade)');
      linhas.push('');
      for (const n of r.niveis) if (n.subiu > 0) linhas.push(`${n.nome} subiu para o nível ${equipe.find((h) => h.nomeCurto === n.nome)!.nivel}!`);
      equipe.forEach((h, i) => {
        if (!antes[i] && h.habilidadeDesbloqueada) linhas.push(`Nova habilidade: ${h.habilidade.nome}! Use quando a barra dourada encher.`);
      });
      let titulo = 'Vitória!';
      const cap = CAPITULOS.find((c) => c.numero === this.fase.capitulo);
      const doCap = fasesDoCapitulo(this.fase.capitulo);
      if (cap && r.primeira && doCap[doCap.length - 1] === this.fase) {
        titulo = cap.vitoriaTitulo;
        linhas.push(cap.vitoriaTexto);
      }
      modal(this, titulo, linhas.join('\n').trim(), 'Voltar ao mapa', () => this.scene.start('Mapa'));
    } else {
      jogo.devolverEnergia(DEVOLUCAO_DERROTA);
      jogo.registrarDerrota();
      const esgotou = this.batalha.tempo >= TEMPO_LIMITE;
      modal(
        this,
        esgotou ? 'O tempo acabou!' : 'Os bugs venceram desta vez',
        `Metade da energia (${DEVOLUCAO_DERROTA}) foi devolvida. ` +
          (this.fase.ondas.some((o) => o.some((m) => m.chefe)) && !jogo.equipe.every((h) => h.habilidadeDesbloqueada)
            ? `Chefões são fortes demais só com atacar(). Leve os heróis ao nível ${Heroi.NIVEL_HABILIDADE} para desbloquear as habilidades. `
            : '') +
          'Monte uma equipe de até 4 heróis (Instanciar e Loja trazem novos). ' +
          'Treine com Bytes ou repita fases para ganhar XP.',
        'Voltar ao mapa',
        () => this.scene.start('Mapa'),
      );
    }
  }
}
