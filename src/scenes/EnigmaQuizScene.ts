import Phaser from 'phaser';
import { ENIGMAS, type EnigmaQuiz } from '../core/enigmas';
import { jogo } from '../core/jogo';
import { Botao, COR, LARGURA, MONO, TXT, cartao, modal, texto, titulo } from './ui';

/** Enigma de perguntas: algumas com código (clique na linha certa), outras de múltipla escolha. */
export class EnigmaQuizScene extends Phaser.Scene {
  private enigma!: EnigmaQuiz;
  private indice = 0;
  private conteudo?: Phaser.GameObjects.Container;
  private erros = 0;

  constructor() { super('EnigmaQuiz'); }

  init(data: { id: string }) {
    this.enigma = ENIGMAS[data.id] as EnigmaQuiz;
    this.indice = 0;
    this.erros = 0;
  }

  create() {
    this.add.image(0, 0, 'fundo-cidadela').setOrigin(0).setDisplaySize(LARGURA, 540);
    this.add.rectangle(0, 0, LARGURA, 540, 0x0b0820, 0.62).setOrigin(0);
    titulo(this, 20, 14, this.enigma.titulo, 22, TXT.ouro);
    new Botao(this, LARGURA - 70, 30, 110, 36, '‹ Mapa', () => this.scene.start('Mapa'), COR.cinzaBotao, 14);
    cartao(this, 20, 56, LARGURA - 40, 56, 0x1d1747, 0.9);
    texto(this, 36, 64, `${this.enigma.narrador} diz:`, 13, TXT.destaque, { fontStyle: 'bold' });
    texto(this, 36, 84, this.enigma.enunciado, 14, TXT.normal);
    this.mostrarPergunta();
  }

  private mostrarPergunta() {
    this.conteudo?.destroy(true);
    const c = this.add.container(0, 0);
    this.conteudo = c;
    const p = this.enigma.perguntas[this.indice];
    const total = this.enigma.perguntas.length;
    c.add(titulo(this, 20, 124, `Pergunta ${this.indice + 1} de ${total}`, 15, TXT.ouro));
    c.add(texto(this, 20, 148, p.pergunta, 17, '#ffffff', { fontStyle: 'bold', wordWrap: { width: LARGURA - 40 } }));

    const retorno = texto(this, LARGURA / 2, 500, '', 14, TXT.perigo, { align: 'center', wordWrap: { width: LARGURA - 80 } }).setOrigin(0.5, 0);
    c.add(retorno);

    const responder = (escolha: number, fundo: Phaser.GameObjects.Rectangle) => {
      if (escolha === p.correta) {
        fundo.setStrokeStyle(3, COR.ok);
        const ultima = this.indice === total - 1;
        modal(this, 'Correto!', p.explicacao, ultima ? 'Abrir o portão' : 'Próxima pergunta', () => {
          if (!ultima) {
            this.indice++;
            this.mostrarPergunta();
            return;
          }
          const ganhos = jogo.registrarEnigma(this.enigma.id, this.enigma.recompensaCommits);
          modal(this, 'Portão aberto!', `+${ganhos} Commits. O caminho até o chefão está livre.`, 'Voltar ao mapa', () => this.scene.start('Mapa'));
        });
      } else {
        this.erros++;
        fundo.setStrokeStyle(3, COR.perigo);
        retorno.setText(this.erros >= 2 ? `Ainda não. Dica: ${p.explicacao.split('.')[0]}.` : 'Ainda não. Leia de novo e tente outra opção.');
      }
    };

    if (p.codigo) {
      const y0 = 196;
      const alturaLinha = 34;
      c.add(this.add.rectangle(20, y0 - 8, LARGURA - 40, p.codigo.length * alturaLinha + 16, 0x0e1118, 0.95).setOrigin(0));
      p.codigo.forEach((linha, i) => {
        const y = y0 + i * alturaLinha;
        const fundo = this.add.rectangle(28, y, LARGURA - 56, alturaLinha - 4, 0x1d2333).setOrigin(0).setStrokeStyle(2, 0x3b4357).setInteractive({ useHandCursor: true });
        fundo.on('pointerover', () => fundo.setFillStyle(0x2c3448));
        fundo.on('pointerout', () => fundo.setFillStyle(0x1d2333));
        fundo.on('pointerdown', () => responder(i, fundo));
        c.add(fundo);
        c.add(texto(this, 40, y + 6, `${String(i + 1).padStart(2, ' ')}`, 15, TXT.suave, { fontFamily: MONO }));
        c.add(texto(this, 76, y + 6, linha, 16, '#c8f7c5', { fontFamily: MONO }));
      });
    } else if (p.opcoes) {
      p.opcoes.forEach((op, i) => {
        const x = 40 + (i % 2) * 450;
        const y = 210 + Math.floor(i / 2) * 110;
        const fundo = this.add.rectangle(x, y, 430, 90, 0x1d1747, 0.95).setOrigin(0).setStrokeStyle(2, COR.ouro).setInteractive({ useHandCursor: true });
        fundo.on('pointerdown', () => responder(i, fundo));
        c.add(fundo);
        c.add(titulo(this, x + 215, y + 45, op, 22).setOrigin(0.5));
      });
    }
  }
}
