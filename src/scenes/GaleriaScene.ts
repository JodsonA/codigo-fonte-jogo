import Phaser from 'phaser';
import { jogo } from '../core/jogo';
import { sprite } from './BootScene';
import { ALTURA, Botao, COR, LARGURA, TXT, botaoVoltar, cartao, estrelas, texto, titulo } from './ui';

interface Ficha {
  chave: string;
  nome: string;
  tipo: string;
  descricao: string;
  altura: number;
  estrelas?: number;
  bloqueado?: boolean;
}

const INIMIGOS: Ficha[] = [
  { chave: 'inimigo-NullPointer', nome: 'NullPointer', tipo: 'Bug · Capítulo 1', altura: 100, descricao: 'Besouro de casco vazio. Ataca quem tenta usar algo que não existe.' },
  { chave: 'inimigo-Loop Infinito', nome: 'Loop Infinito', tipo: 'Bug · Capítulo 1', altura: 100, descricao: 'Lagarta enrolada em forma de infinito. Ataca rápido e nunca para sozinha.' },
  { chave: 'inimigo-Vazamento', nome: 'Vazamento', tipo: 'Bug · Capítulo 1', altura: 100, descricao: 'Mosquito que suga memória e deixa pingar o que não devolve.' },
  { chave: 'inimigo-O Monolito', nome: 'O Monolito', tipo: 'Chefão · Capítulo 1', altura: 142, descricao: 'Um bloco de código gigante que faz tudo dentro de um único main().' },
  { chave: 'inimigo-Race Condition', nome: 'Race Condition', tipo: 'Bug · Capítulo 2', altura: 100, descricao: 'Besouros gêmeos que disputam o mesmo recurso ao mesmo tempo.' },
  { chave: 'inimigo-Stack Overflow', nome: 'Stack Overflow', tipo: 'Bug · Capítulo 2', altura: 100, descricao: 'Uma pilha de chamadas que cresceu demais e vive tombando.' },
  { chave: 'inimigo-Variável Global', nome: 'Variável Global', tipo: 'Bug · Capítulo 2', altura: 100, descricao: 'Fantasma que entra em qualquer lugar e mexe em tudo. Golpes fortes.' },
  { chave: 'inimigo-O Global Mutável', nome: 'O Global Mutável', tipo: 'Chefão · Capítulo 2', altura: 142, descricao: 'Gosma que qualquer um pode alterar. Roubou as chaves da Cidadela.' },
];

const POR_PAGINA = 6;

export class GaleriaScene extends Phaser.Scene {
  private pagina = 0;
  private conteudo?: Phaser.GameObjects.Container;
  private fichas: Ficha[] = [];

  constructor() { super('Galeria'); }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.add.rectangle(0, 0, LARGURA, ALTURA, 0x0b0820, 0.5).setOrigin(0);
    botaoVoltar(this, 'Início', 'Home');
    titulo(this, LARGURA / 2, 12, 'Galeria de personagens', 24).setOrigin(0.5, 0);

    const herois: Ficha[] = jogo.todos.map((h) => {
      const tem = jogo.colecao.has(h.id);
      return {
        chave: `heroi-${h.id}`,
        nome: tem ? h.nome : '???',
        tipo: `${h.raridade > 3 ? 'Herói do Instanciar' : 'Herói inicial'} · ${h.papel}`,
        descricao: tem
          ? `Inspiração: ${h.inspiracao} (não é um retrato). Habilidade: ${h.habilidade.nome}.`
          : 'Ainda não está na sua coleção. Consiga no Instanciar ou compre na Loja.',
        altura: 128,
        estrelas: h.raridade > 3 ? h.raridade : undefined,
        bloqueado: !tem,
      };
    });
    this.fichas = [...herois, ...INIMIGOS];
    const paginas = Math.ceil(this.fichas.length / POR_PAGINA);
    this.pagina = Math.min(this.pagina, paginas - 1);

    const anterior = new Botao(this, LARGURA - 170, 32, 46, 38, '‹', () => this.irPara(this.pagina - 1), COR.cinzaBotao, 24);
    const proxima = new Botao(this, LARGURA - 50, 32, 46, 38, '›', () => this.irPara(this.pagina + 1), COR.cinzaBotao, 24);
    const rotulo = texto(this, LARGURA - 110, 32, '', 14, TXT.normal, { fontStyle: 'bold' }).setOrigin(0.5);
    this.irPara = (p: number) => {
      this.pagina = Phaser.Math.Clamp(p, 0, paginas - 1);
      rotulo.setText(`${this.pagina + 1}/${paginas}`);
      anterior.setHabilitado(this.pagina > 0);
      proxima.setHabilitado(this.pagina < paginas - 1);
      this.montar();
    };
    this.irPara(this.pagina);
  }

  private irPara: (p: number) => void = () => {};

  private montar() {
    this.conteudo?.destroy(true);
    const c = this.add.container(0, 0);
    this.conteudo = c;
    const w = 300;
    const h = 238;
    this.fichas.slice(this.pagina * POR_PAGINA, (this.pagina + 1) * POR_PAGINA).forEach((f, i) => {
      const x = 20 + (i % 3) * (w + 10);
      const y = 58 + Math.floor(i / 3) * (h + 4);
      c.add(cartao(this, x, y, w, h - 2, 0x1d1747, 0.9));
      const img = sprite(this, x + w / 2, y + 80, f.chave, f.altura);
      if (f.bloqueado) img.setTintFill(0x0b0820).setAlpha(0.8);
      c.add(img);
      this.tweens.add({ targets: img, scaleY: img.scaleY * 1.04, duration: 900 + i * 80, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      c.add(texto(this, x + 14, y + 150, f.nome, 15, TXT.normal, { fontStyle: 'bold' }));
      c.add(texto(this, x + 14, y + 170, f.tipo, 11, f.tipo.startsWith('Chef') ? TXT.perigo : TXT.ouro));
      if (f.estrelas) c.add(estrelas(this, x + 22, y + 18, f.estrelas, 16));
      c.add(texto(this, x + 14, y + 188, f.descricao, 12, TXT.suave, { wordWrap: { width: w - 28 }, lineSpacing: 2 }));
    });
  }
}
