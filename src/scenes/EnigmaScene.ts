import Phaser from 'phaser';
import { ENIGMAS, ENIGMA_LINHA_DO_TEMPO, type EnigmaLinhaDoTempo, type ItemLinhaDoTempo } from '../core/enigmas';
import { CAPITULOS } from '../core/fases';
import { faseDoEnigma } from '../core/progresso';
import { jogo } from '../core/jogo';
import { Botao, COR, LARGURA, TXT, modal, painel, texto } from './ui';

interface Opcao {
  item: ItemLinhaDoTempo;
  fundo: Phaser.GameObjects.Rectangle;
  rotulo: Phaser.GameObjects.Text;
}

interface Espaco {
  fundo: Phaser.GameObjects.Rectangle;
  rotulo: Phaser.GameObjects.Text;
}

export class EnigmaScene extends Phaser.Scene {
  private escolhidos: ItemLinhaDoTempo[] = [];
  private opcoes: Opcao[] = [];
  private espacos: Espaco[] = [];
  private verificar!: Botao;
  private retorno!: Phaser.GameObjects.Text;
  private tentativas = 0;
  private enigma: EnigmaLinhaDoTempo = ENIGMA_LINHA_DO_TEMPO;

  constructor() { super('Enigma'); }

  init(data?: { id?: string }) {
    const e = data?.id ? ENIGMAS[data.id] : undefined;
    this.enigma = e && e.tipo === 'linha-do-tempo' ? e : ENIGMA_LINHA_DO_TEMPO;
    this.escolhidos = [];
    this.opcoes = [];
    this.espacos = [];
    this.tentativas = 0;
  }

  create() {
    const e = this.enigma;
    const fundo = CAPITULOS.find((c) => c.numero === faseDoEnigma(e.id)?.capitulo)?.fundo ?? 'fundo-home';
    this.add.image(0, 0, fundo).setOrigin(0).setDisplaySize(LARGURA, 540);
    this.add.rectangle(0, 0, LARGURA, 540, 0x0b0820, 0.6).setOrigin(0);
    texto(this, 20, 14, e.titulo, 22, TXT.ouro, { fontStyle: 'bold' });
    new Botao(this, LARGURA - 70, 30, 110, 36, '‹ Mapa', () => this.scene.start('Mapa'), COR.cinzaBotao, 14);

    painel(this, 20, 56, LARGURA - 40, 78, COR.painelClaro);
    texto(this, 36, 66, `${e.narrador} diz:`, 13, TXT.destaque, { fontStyle: 'bold' });
    texto(this, 36, 86, e.enunciado, 15, TXT.normal, { wordWrap: { width: LARGURA - 80 }, lineSpacing: 3 });

    texto(this, 20, 150, 'Clique nos marcos na ordem certa (mais antigo primeiro). Clique num espaço preenchido para devolver.', 13, TXT.suave);

    const embaralhados = Phaser.Utils.Array.Shuffle([...e.itens]);
    const w = 170;
    const gap = (LARGURA - 40 - w * embaralhados.length) / (embaralhados.length - 1);
    embaralhados.forEach((item, i) => {
      const x = 20 + i * (w + gap);
      const fundo = this.add.rectangle(x, 178, w, 92, COR.painel).setOrigin(0).setStrokeStyle(2, COR.ouro).setInteractive({ useHandCursor: true });
      const rotulo = texto(this, x + w / 2, 224, item.nome, 15, TXT.normal, { align: 'center', wordWrap: { width: w - 20 }, fontStyle: 'bold' }).setOrigin(0.5);
      const opcao = { item, fundo, rotulo };
      fundo.on('pointerdown', () => this.escolher(opcao));
      this.opcoes.push(opcao);
    });

    // Linha do tempo
    this.add.rectangle(20, 372, LARGURA - 40, 4, COR.borda).setOrigin(0, 0.5);
    texto(this, 20, 296, 'Mais antigo', 12, TXT.suave);
    texto(this, LARGURA - 20, 296, 'Mais recente', 12, TXT.suave).setOrigin(1, 0);
    for (let i = 0; i < e.itens.length; i++) {
      const x = 20 + i * (w + gap);
      const fundo = this.add.rectangle(x, 322, w, 100, 0x0e1118).setOrigin(0).setStrokeStyle(2, COR.borda).setInteractive({ useHandCursor: true });
      texto(this, x + 10, 328, `${i + 1}`, 14, TXT.suave, { fontStyle: 'bold' });
      const rotulo = texto(this, x + w / 2, 376, '', 14, TXT.normal, { align: 'center', wordWrap: { width: w - 20 } }).setOrigin(0.5);
      fundo.on('pointerdown', () => this.devolver(i));
      this.espacos.push({ fundo, rotulo });
    }

    this.retorno = texto(this, LARGURA / 2, 444, '', 14, TXT.perigo, { align: 'center', wordWrap: { width: LARGURA - 80 } }).setOrigin(0.5, 0);
    new Botao(this, LARGURA / 2 - 120, 506, 200, 40, 'Limpar', () => { this.escolhidos = []; this.atualizar(); }, COR.painelClaro + 0x202020);
    this.verificar = new Botao(this, LARGURA / 2 + 120, 506, 200, 40, 'Verificar', () => this.conferir(), COR.ouro);
    this.atualizar();
  }

  private escolher(o: Opcao) {
    if (this.escolhidos.includes(o.item) || this.escolhidos.length >= this.espacos.length) return;
    this.escolhidos.push(o.item);
    this.retorno.setText('');
    this.atualizar();
  }

  private devolver(i: number) {
    if (i >= this.escolhidos.length) return;
    this.escolhidos.splice(i, 1);
    this.retorno.setText('');
    this.atualizar();
  }

  private atualizar(marcarCertos = false) {
    const certo = [...this.enigma.itens].sort((a, b) => a.ano - b.ano);
    for (const o of this.opcoes) {
      const usado = this.escolhidos.includes(o.item);
      o.fundo.setAlpha(usado ? 0.3 : 1);
      o.rotulo.setAlpha(usado ? 0.3 : 1);
    }
    this.espacos.forEach((s, i) => {
      const item = this.escolhidos[i];
      s.rotulo.setText(item ? item.nome : '');
      let borda = item ? COR.destaque : COR.borda;
      if (marcarCertos && item) borda = item === certo[i] ? COR.ok : COR.perigo;
      s.fundo.setStrokeStyle(2, borda);
    });
    this.verificar.setHabilitado(this.escolhidos.length === this.espacos.length);
  }

  private conferir() {
    const e = this.enigma;
    const certo = [...e.itens].sort((a, b) => a.ano - b.ano);
    const acertos = this.escolhidos.filter((it, i) => it === certo[i]).length;
    this.tentativas++;
    if (acertos === certo.length) {
      const ganhos = jogo.registrarEnigma(e.id, e.recompensaCommits);
      const resumo = certo.map((it) => `${it.ano}: ${it.detalhe}`).join('\n');
      modal(
        this,
        'Portão aberto!',
        `${resumo}\n\n+${ganhos} Commits. O caminho até ${faseDoEnigma(e.id)?.nome ?? 'o chefão'} está livre.`,
        'Voltar ao mapa',
        () => this.scene.start('Mapa'),
      );
      return;
    }
    this.atualizar(true);
    const dica = this.tentativas >= 2 ? `\nDica: ${e.dica}` : '';
    this.retorno.setText(`${acertos} de ${certo.length} na posição certa (verde). Ajuste os vermelhos e tente de novo.${dica}`);
  }
}
