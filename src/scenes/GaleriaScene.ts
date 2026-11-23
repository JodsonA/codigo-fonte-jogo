import Phaser from 'phaser';
import { sprite } from './BootScene';
import { ALTURA, LARGURA, TXT, botaoVoltar, cartao, texto, titulo } from './ui';

interface Ficha {
  chave: string;
  nome: string;
  tipo: string;
  descricao: string;
  altura: number;
}

const FICHAS: Ficha[] = [
  {
    chave: 'heroi-ada', nome: 'Ada, a Analista', tipo: 'Heroína · Suporte', altura: 128,
    descricao: 'Inspirada em Ada Lovelace, sem ser um retrato dela. Seu cartão perfurado brilha ao prever o inimigo.',
  },
  {
    chave: 'heroi-turing', nome: 'Turing, o Decifrador', tipo: 'Herói · Dano', altura: 128,
    descricao: 'Inspirado em Alan Turing, sem ser um retrato dele. Usa um rotor e uma fita de 0 e 1.',
  },
  {
    chave: 'inimigo-O Monolito', nome: 'O Monolito', tipo: 'Chefão · reino da Abstração', altura: 142,
    descricao: 'Um bloco de código gigante que faz tudo dentro de um único main(). Não esconde nenhum detalhe.',
  },
  {
    chave: 'inimigo-NullPointer', nome: 'NullPointer', tipo: 'Bug comum', altura: 100,
    descricao: 'Besouro de casco vazio. Ataca quem tenta usar algo que não existe.',
  },
  {
    chave: 'inimigo-Loop Infinito', nome: 'Loop Infinito', tipo: 'Bug comum', altura: 100,
    descricao: 'Lagarta enrolada em forma de infinito. Ataca rápido e nunca para sozinha.',
  },
  {
    chave: 'inimigo-Vazamento', nome: 'Vazamento', tipo: 'Bug comum', altura: 100,
    descricao: 'Mosquito que suga memória e deixa pingar o que não devolve. Golpes fortes.',
  },
];

export class GaleriaScene extends Phaser.Scene {
  constructor() { super('Galeria'); }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.add.rectangle(0, 0, LARGURA, ALTURA, 0x0b0820, 0.5).setOrigin(0);
    botaoVoltar(this, 'Início', 'Home');
    titulo(this, LARGURA / 2, 12, 'Galeria de personagens', 24).setOrigin(0.5, 0);

    const w = 300;
    const h = 238;
    FICHAS.forEach((f, i) => {
      const x = 20 + (i % 3) * (w + 10);
      const y = 58 + Math.floor(i / 3) * (h + 4);
      cartao(this, x, y, w, h - 2, 0x1d1747, 0.9);
      const img = sprite(this, x + w / 2, y + 12 + 75, f.chave, f.altura);
      img.setY(y + 8 + 72);
      this.tweens.add({ targets: img, scaleY: img.scaleY * 1.04, duration: 900 + i * 80, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      texto(this, x + 14, y + 158, f.nome, 15, TXT.normal, { fontStyle: 'bold' });
      texto(this, x + w - 14, y + 160, f.tipo, 11, f.tipo.startsWith('Chef') ? TXT.perigo : TXT.suave).setOrigin(1, 0);
      texto(this, x + 14, y + 180, f.descricao, 12, TXT.suave, { wordWrap: { width: w - 28 }, lineSpacing: 2 });
    });
  }
}
