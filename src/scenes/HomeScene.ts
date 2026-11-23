import Phaser from 'phaser';
import { jogo, LIMITE_OFFLINE_MS, type Ganhos } from '../core/jogo';
import { progressoCapitulo, marcosDoCapitulo, marcoConcluido } from '../core/progresso';
import { sprite } from './BootScene';
import {
  ALTURA, Barra, Botao, COR, LARGURA, Moeda, TXT, aviso, cartao, formatarTempo, icone, modal, ouvir, texto, titulo,
} from './ui';

export function textoGanhos(g: Ganhos) {
  const linhas = [
    `Seus heróis rodaram em segundo plano por ${formatarTempo(g.tempoMs)}${g.tempoMs >= LIMITE_OFFLINE_MS ? ' (limite de 8h)' : ''}.`,
    '',
    `+${Math.floor(g.bytes)} Bytes`,
    `+${Math.floor(g.xp)} XP para cada herói`,
  ];
  for (const n of g.niveis) if (n.subiu > 0) linhas.push(`${n.nome} subiu ${n.subiu} nível(is)!`);
  return linhas.join('\n');
}

/** Tela inicial: o herói líder no palco, moedas, jornada do capítulo e o botão LUTAR. */
export class HomeScene extends Phaser.Scene {
  private moedas: Moeda[] = [];
  private heroiImg!: Phaser.GameObjects.Image;
  private heroiNome!: Phaser.GameObjects.Text;
  private heroiNivel!: Phaser.GameObjects.Text;
  private avatar!: Phaser.GameObjects.Image;
  private equipe!: Phaser.GameObjects.Text;
  private barraJornada!: Barra;
  private jornadaTxt!: Phaser.GameObjects.Text;
  private taxa!: Phaser.GameObjects.Text;
  private respiracao?: Phaser.Tweens.Tween;

  constructor() { super('Home'); }

  private get lider() { return (this.registry.get('lider') as number | undefined) ?? 0; }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.criarPerfil();
    this.moedas = [
      new Moeda(this, 330, 18, 'bytes', () => jogo.bytes, 130),
      new Moeda(this, 472, 18, 'commits', () => jogo.commits, 110),
    ];
    this.criarJornada();
    this.criarMenuLateral();
    this.criarPalco();
    this.criarProcessos();

    new Botao(this, LARGURA - 140, ALTURA - 56, 240, 78, 'LUTAR!', () => this.scene.start('Mapa'), COR.laranja, 30, {
      icone: 'icone-espada', tamanhoIcone: 54, raio: 22,
    });

    this.atualizar();
    ouvir(this, 'idle', (g: Ganhos) => {
      for (const n of g.niveis) if (n.subiu > 0) aviso(this, `${n.nome} subiu de nível!`, 380);
      this.atualizar();
    });
    ouvir(this, 'offline', (g: Ganhos) => {
      this.atualizar();
      modal(this, 'Bem-vindo de volta!', textoGanhos(g), 'Coletar');
    });
    this.mostrarBoasVindas();
  }

  private criarPerfil() {
    cartao(this, 14, 12, 300, 82, 0x1d1747, 0.85);
    const g = this.add.graphics();
    g.fillStyle(0xf5c542).fillCircle(56, 52, 32);
    g.fillStyle(0x2b6fd6).fillCircle(56, 52, 28);
    this.avatar = this.add.image(56, 52, 'heroi-ada');
    const mascara = this.make.graphics({}, false).fillCircle(56, 52, 28);
    this.avatar.setMask(mascara.createGeometryMask());
    titulo(this, 98, 20, 'Desenvolvedor(a)', 18);
    this.equipe = texto(this, 98, 46, '', 13, TXT.ouro, { fontStyle: 'bold' });
    icone(this, 104, 76, 'coroa', 18);
    this.barraJornada = new Barra(this, 118, 76, 120, 9, COR.ok);
    this.jornadaTxt = texto(this, 246, 69, '', 12, TXT.normal);
  }

  private criarJornada() {
    const x = 640;
    cartao(this, x, 12, 306, 60, 0x1d1747, 0.85);
    icone(this, x + 30, 42, 'coroa', 38);
    titulo(this, x + 58, 18, 'JORNADA', 16);
    texto(this, x + 290, 21, 'Capítulo 1', 12, TXT.suave).setOrigin(1, 0);
    const marcos = marcosDoCapitulo();
    marcos.forEach((m, i) => {
      const cx = x + 66 + i * 26;
      const feito = marcoConcluido(jogo, m);
      this.add.circle(cx, 54, 8, feito ? COR.ok : 0x0e1118).setStrokeStyle(2, feito ? 0xffffff : 0x6b7489);
      if (i < marcos.length - 1) this.add.rectangle(cx + 8, 54, 10, 3, 0x6b7489).setOrigin(0, 0.5);
    });

    // Cartão do capítulo atual
    cartao(this, x, 82, 306, 192, 0x1d1747, 0.85);
    const ilustra = this.add.graphics();
    ilustra.fillStyle(0x38a873).fillRoundedRect(x + 10, 92, 286, 96, 10);
    ilustra.fillStyle(0x2d6a8a).fillRoundedRect(x + 10, 92, 286, 40, { tl: 10, tr: 10, bl: 0, br: 0 });
    this.add.image(x + 230, 140, 'inimigo-O Monolito').setScale(86 / 780);
    this.add.image(x + 60, 156, 'inimigo-NullPointer').setScale(54 / 360);
    this.add.image(x + 120, 160, 'inimigo-Loop Infinito').setScale(50 / 360).setFlipX(true);
    this.add.image(x + 168, 150, 'inimigo-Vazamento').setScale(50 / 360);
    texto(this, x + 18, 98, 'CAPÍTULO 1/4', 12, '#ffffff', { fontStyle: 'bold', backgroundColor: '#e05561', padding: { x: 6, y: 2 } });
    titulo(this, x + 14, 192, 'Vale das Interfaces', 19);
    texto(this, x + 14, 216, 'Reino da Abstração · 3 fases + 1 enigma', 12, TXT.suave);
    new Botao(this, x + 153, 254, 160, 26, 'VER MAPA', () => this.scene.start('Mapa'), COR.destaque, 13, { raio: 13 });
  }

  private criarMenuLateral() {
    const itens: [string, string, () => void][] = [
      ['herois', 'Heróis', () => this.scene.start('Herois')],
      ['galeria', 'Galeria', () => this.scene.start('Galeria')],
      ['ajuda', 'Como jogar', () => this.comoJogar()],
    ];
    itens.forEach(([ic, nome, acao], i) => {
      const y = 152 + i * 96;
      new Botao(this, 58, y, 76, 66, '', acao, [COR.roxo, COR.destaque, COR.ok][i], 13, { icone: `icone-${ic}`, tamanhoIcone: 48, raio: 16 });
      titulo(this, 58, y + 38, nome, 14).setOrigin(0.5, 0);
    });
  }

  private criarPalco() {
    const cx = LARGURA / 2;
    this.heroiImg = sprite(this, cx, 320, 'heroi-ada', 250);
    this.heroiImg.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('Herois'));
    icone(this, cx, 154, 'coroa', 30);
    this.heroiNome = titulo(this, cx, 176, '', 24, TXT.ouro).setOrigin(0.5, 0);
    this.heroiNivel = texto(this, cx, 206, '', 14, '#ffffff', { fontStyle: 'bold', backgroundColor: '#1d1747', padding: { x: 8, y: 2 } }).setOrigin(0.5, 0);
    new Botao(this, cx - 190, 330, 46, 46, '‹', () => this.trocarLider(-1), COR.cinzaBotao, 28);
    new Botao(this, cx + 190, 330, 46, 46, '›', () => this.trocarLider(1), COR.cinzaBotao, 28);
  }

  private criarProcessos() {
    cartao(this, 14, ALTURA - 76, 300, 62, 0x1d1747, 0.85);
    icone(this, 46, ALTURA - 45, 'bytes', 40);
    titulo(this, 76, ALTURA - 68, 'PROCESSOS EM SEGUNDO PLANO', 13);
    this.taxa = texto(this, 76, ALTURA - 44, '', 13, TXT.normal, { wordWrap: { width: 230 } });
  }

  private trocarLider(d: number) {
    const n = jogo.herois.length;
    this.registry.set('lider', (this.lider + d + n) % n);
    this.atualizar();
  }

  private atualizar() {
    for (const m of this.moedas) m.atualizar();
    const h = jogo.herois[this.lider];
    const chave = `heroi-${h.id}`;
    if (this.heroiImg.texture.key !== chave) {
      this.heroiImg.setTexture(chave);
      this.avatar.setTexture(chave);
    }
    this.avatar.setScale(150 / this.avatar.height).setY(82);
    this.heroiImg.setScale(250 / this.heroiImg.height);
    this.respiracao?.remove();
    this.respiracao = this.tweens.add({ targets: this.heroiImg, scaleY: this.heroiImg.scaleY * 1.025, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.heroiNome.setText(h.nome);
    this.heroiNivel.setText(`Nível ${h.nivel} · ${h.papel}`);
    this.equipe.setText(`Equipe nível ${jogo.herois.reduce((s, x) => s + x.nivel, 0)}`);
    const p = progressoCapitulo(jogo);
    this.barraJornada.set(p.feitos / p.total);
    this.jornadaTxt.setText(`${p.feitos}/${p.total} marcos`);
    const t = jogo.taxaPorMinuto();
    this.taxa.setText(t.bytes > 0 ? `+${t.bytes} Bytes/min · +${t.xp} XP/min, mesmo com o jogo fechado` : 'Vença a primeira fase para ativar');
  }

  private comoJogar() {
    modal(
      this,
      'Como jogar',
      '1. Toque em LUTAR e escolha uma fase no mapa.\n' +
        '2. A batalha é automática. Quando a barra dourada encher, use a habilidade especial.\n' +
        '3. Vença para ganhar XP e Bytes. No nível 5 cada herói desbloqueia sua habilidade.\n' +
        '4. Use Bytes na tela de Heróis para treinar ataque e vida.\n' +
        '5. Resolva o enigma do portão para enfrentar o chefão.\n\n' +
        'Depois da primeira vitória, seus heróis continuam ganhando Bytes e XP mesmo com o jogo fechado (até 8 horas).',
      'Entendi',
    );
  }

  private mostrarBoasVindas() {
    const offline = this.registry.get('offline') as Ganhos | null;
    this.registry.set('offline', null);
    if (offline) {
      modal(this, 'Bem-vindo de volta!', textoGanhos(offline), 'Coletar', () => this.atualizar());
    } else if (jogo.fasesVencidas.length === 0 && !this.registry.get('introVista')) {
      this.registry.set('introVista', true);
      modal(
        this,
        'O mundo de Runtime precisa de você',
        'A Exceção, um erro que nunca foi tratado, corrompeu os quatro reinos.\n\n' +
          'Você despertou Ada, a Analista, e Turing, o Decifrador, lendas guardadas como objetos na memória. ' +
          'Vença as fases, evolua os heróis e resolva o enigma para enfrentar O Monolito.',
        'Começar',
      );
    }
  }
}
