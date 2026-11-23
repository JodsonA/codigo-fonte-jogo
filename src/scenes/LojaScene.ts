import Phaser from 'phaser';
import { PACOTES_LOJA } from '../core/gacha';
import { jogo } from '../core/jogo';
import { sprite } from './BootScene';
import { ALTURA, Botao, COR, LARGURA, Moeda, TXT, aviso, botaoVoltar, cartao, estrelas, icone, texto, titulo } from './ui';

/** Loja: troque Fichas (vindas do Instanciar) por heróis ou pacotes. */
export class LojaScene extends Phaser.Scene {
  private conteudo?: Phaser.GameObjects.Container;
  private moedas: Moeda[] = [];

  constructor() { super('Loja'); }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.add.rectangle(0, 0, LARGURA, ALTURA, 0x0b0820, 0.5).setOrigin(0);
    botaoVoltar(this, 'Início', 'Home');
    titulo(this, 330, 14, 'Loja de Fichas', 28).setOrigin(0.5, 0);
    this.moedas = [new Moeda(this, LARGURA - 150, 14, 'fichas', () => jogo.fichas, 130)];
    this.montar();
  }

  private montar() {
    this.moedas.forEach((m) => m.atualizar());
    this.conteudo?.destroy(true);
    const c = this.add.container(0, 0);
    this.conteudo = c;

    const herois = jogo.todos.filter((h) => h.raridade > 3).sort((a, b) => b.raridade - a.raridade);
    const w = 196;
    const h = 222;
    herois.forEach((heroi, i) => {
      const x = 20 + (i % 3) * (w + 8);
      const y = 70 + Math.floor(i / 3) * (h + 8);
      const tem = jogo.colecao.has(heroi.id);
      const preco = jogo.precoHeroi(heroi);
      c.add(cartao(this, x, y, w, h, heroi.raridade === 5 ? 0x4a3410 : 0x2e1a52, 0.92, heroi.raridade === 5 ? 0xf5c542 : 0xb39cff));
      c.add(sprite(this, x + w / 2, y + 74, `heroi-${heroi.id}`, 120).setAlpha(tem ? 0.55 : 1));
      c.add(titulo(this, x + w / 2, y + 136, heroi.nome, 13).setOrigin(0.5, 0));
      c.add(estrelas(this, x + w / 2, y + 162, heroi.raridade, 14, true));
      c.add(texto(this, x + w / 2, y + 172, heroi.papel, 11, TXT.suave).setOrigin(0.5, 0));
      const b = new Botao(this, x + w / 2, y + 202, w - 24, 30, tem ? 'Na coleção' : `${preco} Fichas`, () => {
        if (jogo.comprarHeroi(heroi.id)) {
          aviso(this, `${heroi.nome} entrou para a coleção!`);
          this.montar();
        }
      }, COR.ok, 14, tem ? {} : { icone: 'icone-fichas', tamanhoIcone: 22 });
      b.setHabilitado(!tem && jogo.fichas >= preco);
      c.add(b);
    });

    const x = 644;
    c.add(cartao(this, x, 70, 296, 452, 0x1d1747, 0.92));
    c.add(titulo(this, x + 18, 84, 'Pacotes', 18));
    PACOTES_LOJA.forEach((p, i) => {
      const y = 124 + i * 120;
      c.add(icone(this, x + 44, y + 34, p.id === 'xp' ? 'herois' : 'bytes', 52));
      c.add(titulo(this, x + 80, y + 6, p.nome, 16));
      c.add(texto(this, x + 80, y + 30, p.descricao, 12, TXT.normal, { wordWrap: { width: 196 } }));
      const b = new Botao(this, x + 148, y + 82, 260, 32, `${p.preco} Fichas`, () => {
        if (jogo.comprarPacote(p.id)) {
          aviso(this, `${p.nome} usado!`);
          this.montar();
        }
      }, COR.laranja, 14, { icone: 'icone-fichas', tamanhoIcone: 22 });
      b.setHabilitado(jogo.fichas >= p.preco);
      c.add(b);
    });
    c.add(texto(this, x + 18, 380,
      'Como ganhar Fichas:\n• Giros do Instanciar sem herói podem dar Fichas.\n• Herói repetido no Instanciar vira Fichas (4★: 25, 5★: 80).',
      12, TXT.suave, { wordWrap: { width: 262 }, lineSpacing: 4 }));
  }
}
