import Phaser from 'phaser';

export const LARGURA = 960;
export const ALTURA = 540;

export const COR = {
  fundo: 0x161a23,
  painel: 0x222838,
  painelClaro: 0x2c3448,
  borda: 0x3b4357,
  destaque: 0x4fc3f7,
  ok: 0x5cd65c,
  perigo: 0xe05561,
  ouro: 0xf5c542,
  desabilitado: 0x3a3f4b,
};

export const TXT = {
  normal: '#e8ecf4',
  suave: '#9aa4b8',
  ouro: '#f5c542',
  ok: '#7ee07e',
  perigo: '#ff7b86',
  destaque: '#7fd6ff',
};

const FONTE = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export const MONO = 'ui-monospace, "Cascadia Code", Consolas, monospace';

export function texto(
  cena: Phaser.Scene, x: number, y: number, conteudo: string, tamanho = 16, cor = TXT.normal,
  extra: Phaser.Types.GameObjects.Text.TextStyle = {},
) {
  return cena.add.text(x, y, conteudo, { fontFamily: FONTE, fontSize: `${tamanho}px`, color: cor, ...extra });
}

export function painel(cena: Phaser.Scene, x: number, y: number, w: number, h: number, cor = COR.painel) {
  return cena.add.rectangle(x, y, w, h, cor).setOrigin(0).setStrokeStyle(1, COR.borda);
}

export class Botao extends Phaser.GameObjects.Container {
  private fundo: Phaser.GameObjects.Rectangle;
  private rotulo: Phaser.GameObjects.Text;
  private habilitado = true;

  constructor(
    cena: Phaser.Scene, x: number, y: number, w: number, h: number, rotulo: string,
    private aoClicar: () => void, private cor = COR.destaque, tamanho = 15,
  ) {
    super(cena, x, y);
    this.fundo = cena.add.rectangle(0, 0, w, h, cor).setStrokeStyle(1, 0xffffff, 0.15);
    this.rotulo = texto(cena, 0, 0, rotulo, tamanho, '#0e1118', { fontStyle: 'bold', align: 'center' }).setOrigin(0.5);
    this.add([this.fundo, this.rotulo]);
    this.setSize(w, h);
    this.fundo.setInteractive({ useHandCursor: true });
    this.fundo.on('pointerover', () => this.habilitado && this.fundo.setAlpha(0.85));
    this.fundo.on('pointerout', () => this.fundo.setAlpha(1));
    this.fundo.on('pointerdown', () => {
      if (!this.habilitado) return;
      this.cena().tweens.add({ targets: this, scale: 0.95, duration: 60, yoyo: true });
      this.aoClicar();
    });
    cena.add.existing(this);
  }

  private cena() { return this.scene; }

  setHabilitado(v: boolean) {
    if (v === this.habilitado) return this;
    this.habilitado = v;
    this.fundo.setFillStyle(v ? this.cor : COR.desabilitado);
    this.rotulo.setColor(v ? '#0e1118' : TXT.suave);
    if (this.fundo.input) this.fundo.input.cursor = v ? 'pointer' : 'default';
    return this;
  }

  setRotulo(t: string) {
    if (this.rotulo.text !== t) this.rotulo.setText(t);
    return this;
  }
}

export class Barra {
  private frente: Phaser.GameObjects.Rectangle;
  readonly fundo: Phaser.GameObjects.Rectangle;

  constructor(cena: Phaser.Scene, x: number, y: number, private w: number, h: number, cor: number) {
    this.fundo = cena.add.rectangle(x, y, w, h, 0x0e1118).setOrigin(0, 0.5).setStrokeStyle(1, COR.borda);
    this.frente = cena.add.rectangle(x, y, w, h, cor).setOrigin(0, 0.5);
  }

  set(fracao: number) {
    this.frente.width = Math.max(0, Math.min(1, fracao)) * this.w;
  }

  setCor(cor: number) { this.frente.setFillStyle(cor); }

  objetos() { return [this.fundo, this.frente]; }
}

/** Retrato simples do herói: círculo colorido com as iniciais. */
export function retrato(cena: Phaser.Scene, x: number, y: number, raio: number, cor: number, iniciais: string) {
  const c = cena.add.container(x, y);
  c.add(cena.add.circle(0, 0, raio, cor).setStrokeStyle(3, 0xffffff, 0.35));
  c.add(texto(cena, 0, 0, iniciais, Math.round(raio * 0.75), '#0e1118', { fontStyle: 'bold' }).setOrigin(0.5));
  return c;
}

export function formatarTempo(ms: number) {
  const min = Math.floor(ms / 60000);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

/** Janela modal simples com título, corpo e um botão. */
export function modal(cena: Phaser.Scene, titulo: string, corpo: string, rotuloBotao: string, aoFechar?: () => void) {
  const c = cena.add.container(0, 0).setDepth(1000);
  const veu = cena.add.rectangle(0, 0, LARGURA, ALTURA, 0x000000, 0.6).setOrigin(0).setInteractive();
  const w = 520;
  const corpoTxt = texto(cena, LARGURA / 2, 0, corpo, 16, TXT.normal, { align: 'center', wordWrap: { width: w - 60 }, lineSpacing: 6 }).setOrigin(0.5, 0);
  const h = 150 + corpoTxt.height;
  const y0 = (ALTURA - h) / 2;
  const fundo = painel(cena, (LARGURA - w) / 2, y0, w, h, COR.painelClaro).setStrokeStyle(2, COR.destaque);
  const tituloTxt = texto(cena, LARGURA / 2, y0 + 24, titulo, 22, TXT.destaque, { fontStyle: 'bold' }).setOrigin(0.5, 0);
  corpoTxt.setY(y0 + 66);
  const botao = new Botao(cena, LARGURA / 2, y0 + h - 36, 220, 40, rotuloBotao, () => {
    c.destroy();
    aoFechar?.();
  });
  c.add([veu, fundo, tituloTxt, corpoTxt, botao]);
  return c;
}
