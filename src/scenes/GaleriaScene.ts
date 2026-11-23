import Phaser from 'phaser';
import { sprite } from './BootScene';
import { Botao, COR, LARGURA, TXT, painel, texto } from './ui';

interface Ficha {
  chave: string;
  nome: string;
  tipo: string;
  descricao: string;
  altura: number;
}

const FICHAS: Ficha[] = [
  {
    chave: 'heroi-ada', nome: 'Ada, a Analista', tipo: 'Heroína · Suporte', altura: 130,
    descricao: 'Inspirada em Ada Lovelace. Carrega um cartão perfurado que brilha quando ela prevê o próximo passo do inimigo.',
  },
  {
    chave: 'heroi-turing', nome: 'Turing, o Decifrador', tipo: 'Herói · Dano', altura: 130,
    descricao: 'Inspirado em Alan Turing. Usa um rotor para decifrar fraquezas e uma fita infinita de 0 e 1.',
  },
  {
    chave: 'inimigo-O Monolito', nome: 'O Monolito', tipo: 'Chefão · reino da Abstração', altura: 150,
    descricao: 'Um bloco de código gigante que faz tudo dentro de um único main(). Não esconde nenhum detalhe.',
  },
  {
    chave: 'inimigo-NullPointer', nome: 'NullPointer', tipo: 'Bug comum', altura: 110,
    descricao: 'Besouro de casco vazio. Ataca quem tenta usar algo que não existe.',
  },
  {
    chave: 'inimigo-Loop Infinito', nome: 'Loop Infinito', tipo: 'Bug comum', altura: 110,
    descricao: 'Lagarta enrolada em forma de infinito. Ataca rápido e nunca para sozinha.',
  },
  {
    chave: 'inimigo-Vazamento', nome: 'Vazamento', tipo: 'Bug comum', altura: 110,
    descricao: 'Mosquito que suga memória e deixa pingar o que não devolve. Golpes fortes.',
  },
];

export class GaleriaScene extends Phaser.Scene {
  constructor() { super('Galeria'); }

  create() {
    this.cameras.main.setBackgroundColor(COR.fundo);
    texto(this, 20, 12, 'Galeria de personagens', 22, TXT.normal, { fontStyle: 'bold' });
    new Botao(this, LARGURA - 70, 26, 100, 32, 'Voltar', () => this.scene.start('Hub'), COR.painelClaro + 0x202020, 13);

    const w = 300;
    const h = 236;
    FICHAS.forEach((f, i) => {
      const x = 20 + (i % 3) * (w + 10);
      const y = 50 + Math.floor(i / 3) * (h + 6);
      painel(this, x, y, w, h);
      const img = sprite(this, x + w / 2, y + 12 + 75, f.chave, f.altura);
      img.setY(y + 12 + Math.min(150, f.altura) / 2 + (150 - Math.min(150, f.altura)) / 2);
      this.tweens.add({ targets: img, scaleY: img.scaleY * 1.04, duration: 900 + i * 80, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      texto(this, x + 14, y + 166, f.nome, 15, TXT.normal, { fontStyle: 'bold' });
      texto(this, x + w - 14, y + 168, f.tipo, 11, f.tipo.startsWith('Chef') ? TXT.perigo : TXT.suave).setOrigin(1, 0);
      texto(this, x + 14, y + 188, f.descricao, 12, TXT.suave, { wordWrap: { width: w - 28 }, lineSpacing: 2 });
    });
  }
}
