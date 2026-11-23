import Phaser from 'phaser';
import { jogo } from '../core/jogo';
import { buscarFase } from '../core/fases';
import { ENIGMAS, marcoConcluido, marcosDoCapitulo, type Marco } from '../core/progresso';
import { Botao, COR, LARGURA, Moeda, TXT, botaoVoltar, cartao, icone, ouvir, texto, titulo } from './ui';

const POSICOES = [
  { x: 140, y: 330 },
  { x: 330, y: 215 },
  { x: 545, y: 315 },
  { x: 790, y: 205 },
];

type Estado = 'feito' | 'liberado' | 'bloqueado';

/** Mapa do capítulo: um caminho entre as fases, o portão do enigma e o chefão. */
export class MapaScene extends Phaser.Scene {
  private marcos: Marco[] = [];
  private aneis: Phaser.GameObjects.Arc[] = [];
  private detalhe?: Phaser.GameObjects.Container;
  private moedas: Moeda[] = [];

  constructor() { super('Mapa'); }

  create() {
    this.marcos = marcosDoCapitulo();
    this.aneis = [];
    this.add.image(0, 0, 'fundo-mapa').setOrigin(0).setDisplaySize(LARGURA, 540);

    botaoVoltar(this, 'Início', 'Home');
    titulo(this, LARGURA / 2 - 40, 16, 'Capítulo 1 · Vale das Interfaces', 24).setOrigin(0.5, 0);
    this.moedas = [
      new Moeda(this, LARGURA - 262, 14, 'bytes', () => jogo.bytes, 130),
      new Moeda(this, LARGURA - 124, 14, 'commits', () => jogo.commits, 110),
    ];
    ouvir(this, 'idle', () => this.moedas.forEach((m) => m.atualizar()));

    this.desenharCaminho();
    this.marcos.forEach((m, i) => this.criarNo(m, i));

    const proximo = this.marcos.findIndex((m) => this.estado(m) === 'liberado');
    this.selecionar(proximo >= 0 ? proximo : this.marcos.length - 1);
  }

  private estado(m: Marco): Estado {
    if (marcoConcluido(jogo, m)) return 'feito';
    const liberado = m.tipo === 'fase' ? jogo.faseLiberada(buscarFase(m.id)) : jogo.enigmaLiberado(m.id);
    return liberado ? 'liberado' : 'bloqueado';
  }

  private desenharCaminho() {
    const pts = POSICOES.slice(0, this.marcos.length).map((p) => new Phaser.Math.Vector2(p.x, p.y));
    const curva = new Phaser.Curves.Spline(pts);
    const g = this.add.graphics();
    g.lineStyle(22, 0x6b4a2a, 0.9);
    curva.draw(g, 80);
    g.lineStyle(16, 0xf5e6c8, 1);
    curva.draw(g, 80);
    const pontos = curva.getSpacedPoints(60);
    g.fillStyle(0xc9a76a, 1);
    pontos.forEach((p, i) => i % 2 === 0 && g.fillCircle(p.x, p.y, 2.5));
  }

  private criarNo(m: Marco, i: number) {
    const { x, y } = POSICOES[i];
    const est = this.estado(m);
    const chefe = m.tipo === 'fase' && buscarFase(m.id).ondas.some((o) => o.some((e) => e.chefe));
    const r = chefe ? 52 : 40;
    const cor = est === 'feito' ? COR.ok : est === 'liberado' ? (m.tipo === 'enigma' ? COR.ouro : COR.destaque) : 0x6b7489;

    this.add.ellipse(x, y + r - 4, r * 2, r * 0.6, 0x000000, 0.3);
    const anel = this.add.circle(x, y, r + 9, 0xffffff, 0).setStrokeStyle(5, 0xffffff, 0);
    this.aneis.push(anel);
    const base = this.add.circle(x, y + 5, r, Phaser.Display.Color.IntegerToColor(cor).darken(30).color);
    const no = this.add.circle(x, y, r, cor).setStrokeStyle(4, 0xffffff);
    if (chefe) {
      this.add.image(x, y - 4, 'inimigo-O Monolito').setScale((r * 1.7) / 780).setAlpha(est === 'bloqueado' ? 0.5 : 1);
    } else if (m.tipo === 'enigma') {
      icone(this, x, y, 'enigma', 46).setAlpha(est === 'bloqueado' ? 0.5 : 1);
    } else {
      titulo(this, x, y, m.id, 22).setOrigin(0.5);
    }
    if (est === 'bloqueado') icone(this, x + r * 0.6, y + r * 0.55, 'cadeado', 30);
    if (est === 'feito') icone(this, x + r * 0.65, y - r * 0.6, 'check', 28);

    const nome = m.tipo === 'fase' ? buscarFase(m.id).nome : 'Portão do Enigma';
    titulo(this, x, y + r + 10, nome, 15, est === 'bloqueado' ? '#c9d1e0' : '#ffffff').setOrigin(0.5, 0);

    if (est === 'liberado') {
      this.tweens.add({ targets: [no, base], scale: 1.08, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
    no.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selecionar(i));
  }

  private selecionar(i: number) {
    this.aneis.forEach((a, k) => a.setStrokeStyle(5, 0xffffff, k === i ? 0.9 : 0));
    this.detalhe?.destroy(true);
    const c = this.add.container(0, 0);
    this.detalhe = c;
    const m = this.marcos[i];
    const est = this.estado(m);
    const y0 = 428;
    c.add(cartao(this, 20, y0, LARGURA - 40, 100, 0x1d1747, 0.92));

    if (m.tipo === 'fase') {
      const f = buscarFase(m.id);
      c.add(titulo(this, 40, y0 + 12, `Fase ${f.id} · ${f.nome}`, 20, TXT.ouro));
      c.add(texto(this, 40, y0 + 42, f.descricao, 13, TXT.normal, { wordWrap: { width: 420 } }));
      const rec = jogo.faseVencida(f.id)
        ? `Repetir rende metade: +${Math.round(f.recompensa.xp / 2)} XP · +${Math.round(f.recompensa.bytes / 2)} Bytes`
        : `Recompensa: +${f.recompensa.xp} XP · +${f.recompensa.bytes} Bytes${f.recompensa.commits ? ` · +${f.recompensa.commits} Commits` : ''}`;
      c.add(texto(this, 40, y0 + 74, `${f.ondas.length} ondas · ${rec}`, 12, TXT.suave));
      const tipos = [...new Map(f.ondas.flat().map((e) => [e.nome, e])).values()];
      tipos.forEach((e, k) => {
        const img = this.add.image(520 + k * 58, y0 + 50, `inimigo-${e.nome}`);
        img.setScale((e.chefe ? 70 : 50) / img.height);
        c.add(img);
      });
      const rotulo = est === 'bloqueado' ? 'Bloqueada' : est === 'feito' ? 'Repetir' : 'LUTAR!';
      const b = new Botao(this, LARGURA - 120, y0 + 50, 170, 58, rotulo, () => this.scene.start('Batalha', { faseId: f.id }), COR.laranja, 20, { icone: 'icone-espada', tamanhoIcone: 38 });
      b.setHabilitado(est !== 'bloqueado');
      c.add(b);
      if (est === 'bloqueado') {
        const motivo = f.enigmaAntes && !jogo.enigmaResolvido(f.enigmaAntes) ? 'Resolva o Portão do Enigma antes.' : 'Vença a fase anterior antes.';
        c.add(texto(this, LARGURA - 120, y0 + 84, motivo, 11, TXT.perigo).setOrigin(0.5, 0));
      }
    } else {
      const e = ENIGMAS[m.id];
      c.add(titulo(this, 40, y0 + 12, e.titulo, 20, TXT.ouro));
      c.add(texto(this, 40, y0 + 42, e.enunciado, 13, TXT.normal, { wordWrap: { width: 600 } }));
      c.add(texto(this, 40, y0 + 78, `Recompensa: +${e.recompensaCommits} Commits e o caminho até o chefão`, 12, TXT.suave));
      const rotulo = est === 'feito' ? 'Resolvido' : est === 'bloqueado' ? 'Bloqueado' : 'RESOLVER';
      const b = new Botao(this, LARGURA - 120, y0 + 50, 170, 58, rotulo, () => this.scene.start('Enigma'), COR.ouro, 20, { icone: 'icone-enigma', tamanhoIcone: 36 });
      b.setHabilitado(est === 'liberado');
      c.add(b);
    }
  }
}
