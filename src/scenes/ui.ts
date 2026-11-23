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
  laranja: 0xff9f1c,
  roxo: 0x8e7cf0,
  cinzaBotao: 0x4a5370,
  desabilitado: 0x3a3f4b,
};

export const TXT = {
  normal: '#e8ecf4',
  suave: '#9aa4b8',
  ouro: '#f5c542',
  ok: '#7ee07e',
  perigo: '#ff7b86',
  destaque: '#7fd6ff',
  escuro: '#0e1118',
};

const FONTE = '"Trebuchet MS", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export const MONO = 'ui-monospace, "Cascadia Code", Consolas, monospace';

export function texto(
  cena: Phaser.Scene, x: number, y: number, conteudo: string, tamanho = 16, cor = TXT.normal,
  extra: Phaser.Types.GameObjects.Text.TextStyle = {},
) {
  return cena.add.text(x, y, conteudo, { fontFamily: FONTE, fontSize: `${tamanho}px`, color: cor, ...extra });
}

/** Texto grosso com contorno, para títulos e rótulos sobre cenários coloridos. */
export function titulo(cena: Phaser.Scene, x: number, y: number, conteudo: string, tamanho = 22, cor = '#ffffff') {
  return texto(cena, x, y, conteudo, tamanho, cor, { fontStyle: 'bold', stroke: '#1a1240', strokeThickness: Math.max(3, Math.round(tamanho / 5)) });
}

export function escurecer(cor: number, pct = 25) {
  return Phaser.Display.Color.IntegerToColor(cor).darken(pct).color;
}

export function clarear(cor: number, pct = 20) {
  return Phaser.Display.Color.IntegerToColor(cor).lighten(pct).color;
}

/** Painel retangular simples (mantido para telas internas). */
export function painel(cena: Phaser.Scene, x: number, y: number, w: number, h: number, cor = COR.painel) {
  return cena.add.rectangle(x, y, w, h, cor).setOrigin(0).setStrokeStyle(1, COR.borda);
}

/** Painel arredondado com borda, no estilo dos cartões da tela inicial. */
export function cartao(cena: Phaser.Scene, x: number, y: number, w: number, h: number, cor = 0x1d1747, alpha = 0.85, borda = 0xffffff, raio = 14) {
  const g = cena.add.graphics();
  g.fillStyle(0x000000, 0.25).fillRoundedRect(x, y + 4, w, h, raio);
  g.fillStyle(cor, alpha).fillRoundedRect(x, y, w, h, raio);
  g.lineStyle(2, borda, 0.25).strokeRoundedRect(x, y, w, h, raio);
  return g;
}

interface OpcoesBotao {
  icone?: string;
  tamanhoIcone?: number;
  corTexto?: string;
  raio?: number;
}

/** Botão arredondado com sombra, brilho e ícone opcional. */
export class Botao extends Phaser.GameObjects.Container {
  private g: Phaser.GameObjects.Graphics;
  private rotulo: Phaser.GameObjects.Text;
  private icone?: Phaser.GameObjects.Image;
  private habilitado = true;
  private apertado = false;

  constructor(
    cena: Phaser.Scene, x: number, y: number, private bw: number, private bh: number, rotulo: string,
    private aoClicar: () => void, private cor: number = COR.destaque, tamanho = 15, private op: OpcoesBotao = {},
  ) {
    super(cena, x, y);
    this.g = cena.add.graphics();
    this.add(this.g);
    const w = bw;
    const h = bh;
    let xTexto = 0;
    if (op.icone) {
      const ti = op.tamanhoIcone ?? Math.round(h * 0.7);
      this.icone = cena.add.image(0, -2, op.icone);
      this.icone.setScale(ti / this.icone.height);
      if (rotulo) {
        this.icone.setX(-w / 2 + ti / 2 + 12);
        xTexto = ti / 2 + 6;
      }
      this.add(this.icone);
    }
    this.rotulo = texto(cena, xTexto, -2, rotulo, tamanho, op.corTexto ?? '#ffffff', {
      fontStyle: 'bold', align: 'center', stroke: '#000000', strokeThickness: op.corTexto ? 0 : 3,
    }).setOrigin(0.5);
    this.add(this.rotulo);
    this.desenhar();

    const zona = cena.add.zone(0, 0, w, h + 4).setInteractive({ useHandCursor: true });
    this.add(zona);
    zona.on('pointerover', () => this.habilitado && this.setScale(1.03));
    zona.on('pointerout', () => { this.setScale(1); this.apertado = false; this.desenhar(); });
    zona.on('pointerdown', () => {
      if (!this.habilitado) return;
      this.apertado = true;
      this.desenhar();
    });
    zona.on('pointerup', () => {
      if (!this.habilitado || !this.apertado) return;
      this.apertado = false;
      this.desenhar();
      this.aoClicar();
    });
    cena.add.existing(this);
  }

  private desenhar() {
    const w = this.bw;
    const h = this.bh;
    const r = this.op.raio ?? Math.min(14, h / 2);
    const cor = this.habilitado ? this.cor : COR.desabilitado;
    const dy = this.apertado ? 3 : 0;
    this.g.clear();
    if (!this.apertado) this.g.fillStyle(escurecer(cor, 28), 1).fillRoundedRect(-w / 2, -h / 2 + 4, w, h, r);
    this.g.fillStyle(cor, 1).fillRoundedRect(-w / 2, -h / 2 + dy, w, h - 2, r);
    this.g.fillStyle(0xffffff, this.habilitado ? 0.18 : 0.05).fillRoundedRect(-w / 2 + 4, -h / 2 + dy + 3, w - 8, h * 0.38, Math.max(2, r - 3));
    this.rotulo.setY(-2 + dy);
    this.icone?.setY(-2 + dy);
  }

  setHabilitado(v: boolean) {
    if (v === this.habilitado) return this;
    this.habilitado = v;
    this.rotulo.setAlpha(v ? 1 : 0.55);
    this.icone?.setAlpha(v ? 1 : 0.5);
    this.desenhar();
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

/** Ícone de uma textura com tamanho fixo em pixels. */
export function icone(cena: Phaser.Scene, x: number, y: number, nome: string, tamanho: number) {
  const img = cena.add.image(x, y, `icone-${nome}`);
  return img.setScale(tamanho / img.height);
}

/** Pílula de moeda (Bytes, Commits) como na tela inicial. */
export class Moeda {
  private valor: Phaser.GameObjects.Text;

  constructor(
    cena: Phaser.Scene, x: number, y: number, nomeIcone: string, private ler: () => number, w = 120,
    private formatar: (v: number) => string = (v) => `${Math.floor(v)}`,
  ) {
    cartao(cena, x, y, w, 34, 0x120d33, 0.75, 0xffffff, 17);
    icone(cena, x + 16, y + 17, nomeIcone, 34);
    this.valor = titulo(cena, x + w - 14, y + 17, '', 17).setOrigin(1, 0.5);
    this.atualizar();
  }

  atualizar() { this.valor.setText(this.formatar(this.ler())); }
}

export function formatarTempo(ms: number) {
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'menos de 1 min';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

/** Janela modal simples com título, corpo e um botão. */
export function modal(cena: Phaser.Scene, tituloTxt: string, corpo: string, rotuloBotao: string, aoFechar?: () => void) {
  const c = cena.add.container(0, 0).setDepth(1000);
  const veu = cena.add.rectangle(0, 0, LARGURA, ALTURA, 0x000000, 0.6).setOrigin(0).setInteractive();
  const w = 540;
  const corpoTxt = texto(cena, LARGURA / 2, 0, corpo, 16, TXT.normal, { align: 'center', wordWrap: { width: w - 60 }, lineSpacing: 6 }).setOrigin(0.5, 0);
  const h = 160 + corpoTxt.height;
  const y0 = (ALTURA - h) / 2;
  const fundo = cartao(cena, (LARGURA - w) / 2, y0, w, h, 0x231a5c, 0.97, 0x9be3ff, 18);
  const t = titulo(cena, LARGURA / 2, y0 + 22, tituloTxt, 24, TXT.ouro).setOrigin(0.5, 0);
  corpoTxt.setY(y0 + 70);
  const botao = new Botao(cena, LARGURA / 2, y0 + h - 40, 230, 46, rotuloBotao, () => {
    c.destroy();
    aoFechar?.();
  }, COR.ok, 17);
  c.add([veu, fundo, t, corpoTxt, botao]);
  return c;
}

/** Mensagem rápida que sobe e some. */
export function aviso(cena: Phaser.Scene, msg: string, y = ALTURA - 60) {
  const t = texto(cena, LARGURA / 2, y, msg, 15, TXT.destaque, { backgroundColor: '#0e1118', padding: { x: 12, y: 7 } }).setOrigin(0.5).setDepth(900);
  cena.tweens.add({ targets: t, y: y - 30, alpha: 0, delay: 1500, duration: 600, onComplete: () => t.destroy() });
}

/** Botão "voltar" padrão no canto superior esquerdo. */
export function botaoVoltar(cena: Phaser.Scene, rotulo: string, destino: string) {
  return new Botao(cena, 78, 32, 130, 40, `‹ ${rotulo}`, () => cena.scene.start(destino), COR.cinzaBotao, 15);
}

/** Escuta um evento global do jogo enquanto a cena estiver aberta. */
export function ouvir(cena: Phaser.Scene, evento: string, fn: (...args: any[]) => void) {
  cena.game.events.on(evento, fn);
  cena.events.once('shutdown', () => cena.game.events.off(evento, fn));
}

/** Fileira de estrelas de raridade. */
export function estrelas(cena: Phaser.Scene, x: number, y: number, n: number, tamanho = 16, centro = false) {
  const imgs: Phaser.GameObjects.Image[] = [];
  const x0 = centro ? x - ((n - 1) * (tamanho - 2)) / 2 : x;
  for (let i = 0; i < n; i++) imgs.push(icone(cena, x0 + i * (tamanho - 2), y, 'estrela', tamanho));
  return imgs;
}
