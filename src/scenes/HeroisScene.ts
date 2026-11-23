import Phaser from 'phaser';
import { jogo } from '../core/jogo';
import { Heroi, type Atributo } from '../core/herois';
import { sprite } from './BootScene';
import { mostrarCodigo } from './codigo';
import { ALTURA, Barra, Botao, COR, LARGURA, Moeda, TXT, aviso, botaoVoltar, cartao, estrelas, icone, ouvir, texto, titulo } from './ui';
import { TAMANHO_EQUIPE } from '../core/jogo';

const MARCOS_EVOLUCAO = [
  { nivel: 1, nome: 'atacar()', desc: 'Ataque básico' },
  { nivel: Heroi.NIVEL_HABILIDADE, nome: 'Habilidade', desc: 'Especial' },
  { nivel: 10, nome: 'Sobrescrever', desc: 'Em breve' },
];

/** Tela dos heróis: escolha um herói, veja sua evolução e treine atributos. */
export class HeroisScene extends Phaser.Scene {
  private moedas: Moeda[] = [];
  private conteudo?: Phaser.GameObjects.Container;
  private abas: Phaser.GameObjects.Graphics[] = [];

  constructor() { super('Herois'); }

  private get selecionado() {
    const i = jogo.herois.findIndex((h) => h.id === this.registry.get('liderId'));
    return i >= 0 ? i : 0;
  }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.add.rectangle(0, 0, LARGURA, ALTURA, 0x0b0820, 0.45).setOrigin(0);
    botaoVoltar(this, 'Início', 'Home');
    titulo(this, 330, 14, 'Heróis', 28).setOrigin(0.5, 0);
    this.moedas = [
      new Moeda(this, LARGURA - 262, 14, 'bytes', () => jogo.bytes, 130),
      new Moeda(this, LARGURA - 124, 14, 'commits', () => jogo.commits, 110),
    ];

    this.abas = [];
    this.marcasEquipe = [];
    jogo.herois.forEach((h, i) => this.criarAba(h, i));
    texto(this, 16, 466, 'E = está na equipe', 11, TXT.suave);
    this.mostrar();

    ouvir(this, 'idle', (g: { niveis: { nome: string; subiu: number }[] }) => {
      for (const n of g.niveis) if (n.subiu > 0) aviso(this, `${n.nome} subiu de nível!`);
      this.mostrar(false);
    });
  }

  private posAba(i: number) {
    return { x: 16 + (i % 2) * 74, y: 74 + Math.floor(i / 2) * 96 };
  }

  private criarAba(h: Heroi, i: number) {
    const { x, y } = this.posAba(i);
    const g = this.add.graphics();
    this.abas.push(g);
    const rosto = this.add.image(x + 34, y, `heroi-${h.id}`);
    rosto.setScale(100 / rosto.height).setY(y + 6 + 50 - 6);
    const mascara = this.make.graphics({}, false).fillRoundedRect(x + 4, y + 4, 60, 58, 10);
    rosto.setMask(mascara.createGeometryMask());
    if (h.raridade > 3) estrelas(this, x + 34, y + 70, h.raridade, 11, true);
    titulo(this, x + 34, y + 76, h.nomeCurto, 12).setOrigin(0.5, 0);
    const marca = texto(this, x + 60, y + 2, 'E', 11, '#0e1118', { fontStyle: 'bold', backgroundColor: '#f5c542', padding: { x: 4, y: 1 } }).setOrigin(1, 0);
    this.marcasEquipe.push({ id: h.id, marca });
    const zona = this.add.zone(x, y, 68, 92).setOrigin(0).setInteractive({ useHandCursor: true });
    zona.on('pointerdown', () => { this.registry.set('liderId', h.id); this.mostrar(); });
  }

  private marcasEquipe: { id: string; marca: Phaser.GameObjects.Text }[] = [];

  private desenharAbas() {
    this.abas.forEach((g, i) => {
      const { x, y } = this.posAba(i);
      const sel = i === this.selecionado;
      g.clear();
      g.fillStyle(0x000000, 0.25).fillRoundedRect(x, y + 3, 68, 92, 12);
      g.fillStyle(sel ? 0x3b2fa0 : 0x1d1747, 0.95).fillRoundedRect(x, y, 68, 92, 12);
      g.fillStyle(jogo.herois[i].cor, 1).fillRoundedRect(x + 4, y + 4, 60, 58, 10);
      g.lineStyle(sel ? 3 : 2, sel ? COR.ouro : 0xffffff, sel ? 1 : 0.25).strokeRoundedRect(x, y, 68, 92, 12);
    });
    for (const m of this.marcasEquipe) m.marca.setVisible(jogo.naEquipe(m.id));
  }

  private assinatura = '';

  private mostrar(forcar = true) {
    const h0 = jogo.herois[this.selecionado];
    const assinatura = [this.selecionado, h0.nivel, Math.floor(h0.xp), jogo.bytes >= h0.custoTreino('ataque'), jogo.bytes >= h0.custoTreino('vida')].join('|');
    this.moedas.forEach((m) => m.atualizar());
    if (!forcar && assinatura === this.assinatura) return;
    this.assinatura = assinatura;
    this.desenharAbas();
    this.moedas.forEach((m) => m.atualizar());
    this.conteudo?.destroy(true);
    const c = this.add.container(0, 0);
    this.conteudo = c;
    const h = jogo.herois[this.selecionado];

    // Palco
    const palco = this.add.graphics();
    palco.fillStyle(0x1a1250, 0.6).fillEllipse(318, 470, 250, 60);
    palco.fillStyle(h.cor, 1).fillEllipse(320, 460, 230, 52);
    palco.fillStyle(0x2b6fd6, 1).fillEllipse(320, 456, 200, 40);
    c.add(palco);
    const img = sprite(this, 320, 300, `heroi-${h.id}`, 300);
    c.add(img);
    this.tweens.add({ targets: img, scaleY: img.scaleY * 1.025, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    // Painel de informações
    const x = 480;
    c.add(cartao(this, x, 70, 460, 456, 0x1d1747, 0.92));
    c.add(titulo(this, x + 20, 80, h.nome, 22, TXT.ouro));
    if (h.raridade > 3) c.add(estrelas(this, x + 28, 122, h.raridade, 16));
    c.add(texto(this, x + 20 + (h.raridade > 3 ? h.raridade * 14 + 8 : 0), 114, `${h.papel} · inspiração: ${h.inspiracao}`, 12, TXT.suave));
    const naEquipe = jogo.naEquipe(h.id);
    c.add(new Botao(this, x + 384, 96, 130, 30, naEquipe ? 'Na equipe ✓' : 'Pôr na equipe', () => {
      aviso(this, jogo.alternarEquipe(h.id));
      this.mostrar();
    }, naEquipe ? COR.ok : COR.destaque, 13));
    c.add(texto(this, x + 384, 116, `Equipe ${jogo.equipeIds.length}/${TAMANHO_EQUIPE}`, 11, TXT.suave).setOrigin(0.5, 0));

    c.add(titulo(this, x + 20, 142, `Nível ${h.nivel}`, 20));
    c.add(texto(this, x + 440, 148, `${Math.floor(h.xp)} / ${h.xpParaProximo} XP`, 12, TXT.suave).setOrigin(1, 0));
    const barra = new Barra(this, x + 20, 178, 420, 12, COR.destaque);
    barra.set(h.xp / h.xpParaProximo);
    c.add(barra.objetos());

    // Atributos
    const linha = (y: number, nome: string, valor: number, attr: Atributo, ganho: string, cor: number) => {
      c.add(texto(this, x + 20, y - 10, nome, 13, TXT.suave));
      c.add(titulo(this, x + 20, y + 6, `${valor}`, 22));
      const custo = h.custoTreino(attr);
      const b = new Botao(this, x + 330, y + 8, 210, 40, `Treinar ${ganho} · ${custo} Bytes`, () => this.treinar(h, attr), cor, 14, { icone: 'icone-bytes', tamanhoIcone: 26 });
      b.setHabilitado(jogo.bytes >= custo);
      c.add(b);
    };
    linha(212, 'ATAQUE', h.ataque, 'ataque', '+2', COR.laranja);
    linha(266, 'VIDA', h.vidaMax, 'vida', '+10', COR.ok);

    // Trilha de evolução
    const y = 340;
    c.add(texto(this, x + 20, y - 26, 'EVOLUÇÃO', 13, TXT.suave));
    const x0 = x + 50;
    const x1 = x + 410;
    const maxNivel = MARCOS_EVOLUCAO[MARCOS_EVOLUCAO.length - 1].nivel;
    const posX = (n: number) => x0 + ((n - 1) / (maxNivel - 1)) * (x1 - x0);
    c.add(this.add.rectangle(x0, y, x1 - x0, 8, 0x0e1118).setOrigin(0, 0.5));
    c.add(this.add.rectangle(x0, y, Math.min(x1, posX(h.nivel)) - x0, 8, COR.ouro).setOrigin(0, 0.5));
    for (const mrc of MARCOS_EVOLUCAO) {
      const ok = h.nivel >= mrc.nivel;
      const px = posX(mrc.nivel);
      c.add(this.add.circle(px, y, 13, ok ? COR.ouro : 0x3a3f4b).setStrokeStyle(3, 0xffffff, ok ? 1 : 0.4));
      c.add(texto(this, px, y, `${mrc.nivel}`, 12, ok ? TXT.escuro : TXT.suave, { fontStyle: 'bold' }).setOrigin(0.5));
      c.add(texto(this, px, y + 18, mrc.nome, 12, ok ? '#ffffff' : TXT.suave, { fontStyle: 'bold' }).setOrigin(0.5, 0));
      c.add(texto(this, px, y + 33, mrc.desc, 11, TXT.suave).setOrigin(0.5, 0));
    }

    // Habilidade
    const yh = 396;
    const g = this.add.graphics();
    g.fillStyle(h.habilidadeDesbloqueada ? 0x2a5a2a : 0x2a2f3f, 1).fillRoundedRect(x + 20, yh, 420, 72, 10);
    c.add(g);
    c.add(titulo(this, x + 34, yh + 8, h.habilidade.nome, 16, h.habilidadeDesbloqueada ? TXT.ok : '#ffffff'));
    c.add(texto(this, x + 426, yh + 10, h.habilidadeDesbloqueada ? 'Desbloqueada' : `Nível ${Heroi.NIVEL_HABILIDADE}`, 12, h.habilidadeDesbloqueada ? TXT.ok : TXT.ouro, { fontStyle: 'bold' }).setOrigin(1, 0));
    c.add(texto(this, x + 34, yh + 32, h.habilidade.descricao, 12, TXT.normal, { wordWrap: { width: 395 }, lineSpacing: 1 }));

    c.add(new Botao(this, x + 230, 498, 420, 38, 'Ver código de atacar() e curiosidade', () => mostrarCodigo(this, h), COR.roxo, 14));
  }

  private treinar(h: Heroi, attr: Atributo) {
    if (jogo.treinar(h, attr)) aviso(this, `${h.nomeCurto}.treinar("${attr}") executado!`);
    this.mostrar();
  }
}
