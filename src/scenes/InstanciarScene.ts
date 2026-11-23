import Phaser from 'phaser';
import {
  CUSTO_GIRO, FICHAS_REPETIDO, GARANTIA_4, GARANTIA_5, GIROS_LOTE, INICIO_SUAVE_4, INICIO_SUAVE_5, PREMIOS, TAXA_4, TAXA_5,
} from '../core/gacha';
import { jogo, type ResultadoInstanciar } from '../core/jogo';
import { sprite } from './BootScene';
import {
  ALTURA, Barra, Botao, COR, LARGURA, Moeda, TXT, botaoVoltar, cartao, estrelas, icone, modal, texto, titulo,
} from './ui';

const pct = (v: number) => `${(v * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;

/** Instanciar: o gacha do jogo. Cada giro é um "new Heroi()" que pode trazer um herói ou um prêmio. */
export class InstanciarScene extends Phaser.Scene {
  private moedas: Moeda[] = [];
  private garantia4!: Phaser.GameObjects.Text;
  private garantia5!: Phaser.GameObjects.Text;
  private barra4!: Barra;
  private barra5!: Barra;
  private botoes: { b: Botao; qtd: number }[] = [];

  constructor() { super('Instanciar'); }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.add.rectangle(0, 0, LARGURA, ALTURA, 0x1a0a40, 0.55).setOrigin(0);
    botaoVoltar(this, 'Início', 'Home');
    titulo(this, 330, 14, 'Instanciar', 28).setOrigin(0.5, 0);
    this.moedas = [
      new Moeda(this, LARGURA - 262, 14, 'commits', () => jogo.commits, 130),
      new Moeda(this, LARGURA - 124, 14, 'fichas', () => jogo.fichas, 110),
    ];

    this.criarBanner();
    this.criarRegras();

    this.botoes = [1, GIROS_LOTE].map((qtd, i) => {
      const b = new Botao(this, 175 + i * 290, 482, 270, 70, `Instanciar x${qtd}`, () => this.girar(qtd), i ? COR.laranja : COR.roxo, 21, {
        icone: 'icone-instanciar', tamanhoIcone: 44, raio: 20,
      });
      const y = 528;
      icone(this, 110 + i * 290, y, 'commits', 16);
      texto(this, 122 + i * 290, y - 8, `${qtd * CUSTO_GIRO} Commits`, 13, TXT.ouro, { fontStyle: 'bold' });
      return { b, qtd };
    });
    this.atualizar();
  }

  private criarBanner() {
    cartao(this, 20, 70, 570, 370, 0x2a1670, 0.92, 0xf5c542, 18);
    const g = this.add.graphics();
    g.fillStyle(0xf5c542, 0.18).fillCircle(190, 260, 130);
    g.fillStyle(0x4fc3f7, 0.18).fillCircle(420, 260, 130);
    titulo(this, 40, 84, 'Banner: Pioneiros da Computação', 20, TXT.ouro);
    texto(this, 40, 112, 'Todos os heróis 4★ e 5★ podem sair. Cada giro custa 10 Commits.', 13, TXT.normal);
    const destaque = jogo.todos.filter((h) => h.raridade === 5);
    destaque.forEach((h, i) => {
      const x = 190 + i * 230;
      const img = sprite(this, x, 280, `heroi-${h.id}`, 230);
      this.tweens.add({ targets: img, y: 272, duration: 1400 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      titulo(this, x, 396, h.nome, 16).setOrigin(0.5, 0);
      estrelas(this, x, 424, 5, 18, true);
    });
    const quatro = jogo.todos.filter((h) => h.raridade === 4);
    texto(this, 40, 140, `4★: ${quatro.map((h) => h.nomeCurto).join(', ')}`, 12, TXT.suave);
  }

  private criarRegras() {
    const x = 604;
    cartao(this, x, 70, 336, 370, 0x1d1747, 0.92);
    titulo(this, x + 18, 84, 'Garantias', 18);
    this.garantia4 = texto(this, x + 18, 116, '', 14, TXT.normal, { fontStyle: 'bold' });
    this.barra4 = new Barra(this, x + 18, 144, 300, 10, COR.roxo);
    this.garantia5 = texto(this, x + 18, 160, '', 14, TXT.normal, { fontStyle: 'bold' });
    this.barra5 = new Barra(this, x + 18, 188, 300, 10, COR.ouro);

    titulo(this, x + 18, 210, 'Chances', 18);
    const linhas = [
      `5★: ${pct(TAXA_5)} por giro. A chance sobe a partir do ${INICIO_SUAVE_5 + 1}º giro sem 5★ e o ${GARANTIA_5}º é garantido.`,
      `4★: ${pct(TAXA_4)} por giro. Sobe a partir do ${INICIO_SUAVE_4 + 1}º giro e o ${GARANTIA_4}º é garantido.`,
      `Sem herói: ${PREMIOS.map((p) => `+${p.quantidade} ${p.nome}`).join(', ')}.`,
      `Herói repetido vira Fichas (4★: ${FICHAS_REPETIDO[4]}, 5★: ${FICHAS_REPETIDO[5]}). Fichas compram heróis na Loja.`,
    ];
    texto(this, x + 18, 238, linhas.join('\n'), 12, TXT.normal, { wordWrap: { width: 300 }, lineSpacing: 5 });
  }

  private atualizar() {
    this.moedas.forEach((m) => m.atualizar());
    const faltam4 = GARANTIA_4 - jogo.gacha.semQuatro;
    const faltam5 = GARANTIA_5 - jogo.gacha.semCinco;
    this.garantia4.setText(`4★ garantido em até ${faltam4} giro(s)`);
    this.garantia5.setText(`5★ garantido em até ${faltam5} giro(s)`);
    this.barra4.set(jogo.gacha.semQuatro / GARANTIA_4);
    this.barra5.set(jogo.gacha.semCinco / GARANTIA_5);
    for (const { b, qtd } of this.botoes) b.setHabilitado(jogo.commits >= qtd * CUSTO_GIRO);
  }

  private girar(qtd: number) {
    const r = jogo.instanciar(qtd);
    if (!r) {
      modal(this, 'Commits insuficientes', 'Ganhe Commits vencendo fases pela primeira vez, resolvendo enigmas e repetindo fases.', 'Entendi');
      return;
    }
    this.atualizar();
    this.mostrarResultados(r);
  }

  private mostrarResultados(lista: ResultadoInstanciar[]) {
    const c = this.add.container(0, 0).setDepth(1000);
    c.add(this.add.rectangle(0, 0, LARGURA, ALTURA, 0x050214, 0.88).setOrigin(0).setInteractive());
    c.add(titulo(this, LARGURA / 2, 18, lista.length > 1 ? `new Heroi() x${lista.length}` : 'new Heroi()', 24, TXT.ouro).setOrigin(0.5, 0));
    const w = 160;
    const h = 196;
    const porLinha = Math.min(5, lista.length);
    const linhas = Math.ceil(lista.length / porLinha);
    const x0 = LARGURA / 2 - ((porLinha - 1) * (w + 12)) / 2;
    const y0 = linhas === 1 ? 250 : 160;
    let melhor = 0;
    lista.forEach((r, i) => {
      const x = x0 + (i % porLinha) * (w + 12);
      const y = y0 + Math.floor(i / porLinha) * (h + 12);
      const carta = this.criarCarta(r, w, h);
      carta.setPosition(x, y).setScale(0, 1);
      c.add(carta);
      this.tweens.add({ targets: carta, scaleX: 1, duration: 180, delay: 150 + i * 140, ease: 'Back.Out' });
      if (r.tipo === 'heroi') melhor = Math.max(melhor, r.raridade);
    });
    const fim = 150 + lista.length * 140 + 200;
    if (melhor === 5) this.time.delayedCall(fim - 300, () => this.cameras.main.flash(400, 255, 215, 90));
    const ok = new Botao(this, LARGURA / 2, ALTURA - 34, 220, 46, 'Continuar', () => c.destroy(), COR.ok, 18);
    ok.setAlpha(0);
    this.tweens.add({ targets: ok, alpha: 1, delay: fim, duration: 200 });
    c.add(ok);
  }

  private criarCarta(r: ResultadoInstanciar, w: number, h: number) {
    const c = this.add.container(0, 0);
    const cor = r.tipo === 'heroi' ? (r.raridade === 5 ? 0xf5a623 : 0x8e44ad) : 0x34405a;
    const g = this.add.graphics();
    g.fillStyle(cor, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    g.fillStyle(0xffffff, 0.12).fillRoundedRect(-w / 2 + 6, -h / 2 + 6, w - 12, h * 0.45, 10);
    g.lineStyle(3, r.tipo === 'heroi' ? 0xffffff : 0x6b7489, 0.8).strokeRoundedRect(-w / 2, -h / 2, w, h, 14);
    c.add(g);
    if (r.tipo === 'heroi') {
      const heroi = jogo.buscar(r.heroiId)!;
      c.add(sprite(this, 0, -24, `heroi-${heroi.id}`, 120));
      c.add(titulo(this, 0, 42, heroi.nomeCurto, 16).setOrigin(0.5, 0));
      c.add(estrelas(this, 0, 70, r.raridade, 16, true));
      const extra = r.novo
        ? texto(this, 0, -h / 2 + 8, 'NOVO!', 13, '#ffffff', { fontStyle: 'bold', backgroundColor: '#e05561', padding: { x: 6, y: 2 } }).setOrigin(0.5, 0)
        : texto(this, 0, 82, `Repetido: +${r.fichasConvertidas} Fichas`, 11, '#ffffff').setOrigin(0.5, 0);
      c.add(extra);
    } else {
      const nome = r.tipo === 'xp' ? 'herois' : r.tipo;
      c.add(icone(this, 0, -26, nome, 70));
      const rotulo = r.tipo === 'xp' ? `+${r.quantidade} XP` : r.tipo === 'bytes' ? `+${r.quantidade} Bytes` : `+${r.quantidade} Fichas`;
      c.add(titulo(this, 0, 30, rotulo, 18).setOrigin(0.5, 0));
      if (r.tipo === 'xp') c.add(texto(this, 0, 58, 'para a equipe', 12, TXT.normal).setOrigin(0.5, 0));
    }
    return c;
  }
}
