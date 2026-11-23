import Phaser from 'phaser';
import { jogo, LIMITE_OFFLINE_MS, type Ganhos } from '../core/jogo';
import { progressoCapitulo, marcosDoCapitulo, marcoConcluido } from '../core/progresso';
import { fasesDoCapitulo } from '../core/fases';
import { BONUS_BOAS_VINDAS } from '../core/jogo';
import { capituloAtual, textoEnergia } from './MapaScene';
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

  private get lider() {
    const i = jogo.herois.findIndex((h) => h.id === this.registry.get('liderId'));
    return i >= 0 ? i : 0;
  }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.criarPerfil();
    this.moedas = [
      new Moeda(this, 324, 18, 'bytes', () => jogo.bytes, 104),
      new Moeda(this, 434, 18, 'commits', () => jogo.commits, 92),
      new Moeda(this, 532, 18, 'energia', () => jogo.energiaAtual(), 100, textoEnergia),
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
    const cap = capituloAtual();
    cartao(this, x, 12, 306, 60, 0x1d1747, 0.85);
    icone(this, x + 30, 42, 'coroa', 38);
    titulo(this, x + 58, 18, 'JORNADA', 16);
    texto(this, x + 290, 21, `Capítulo ${cap.numero}`, 12, TXT.suave).setOrigin(1, 0);
    const marcos = marcosDoCapitulo(cap.numero);
    marcos.forEach((m, i) => {
      const cx = x + 66 + i * 26;
      const feito = marcoConcluido(jogo, m);
      this.add.circle(cx, 54, 8, feito ? COR.ok : 0x0e1118).setStrokeStyle(2, feito ? 0xffffff : 0x6b7489);
      if (i < marcos.length - 1) this.add.rectangle(cx + 8, 54, 10, 3, 0x6b7489).setOrigin(0, 0.5);
    });

    // Cartão do capítulo atual
    cartao(this, x, 82, 306, 192, 0x1d1747, 0.85);
    const ilustra = this.add.image(x + 153, 140, cap.fundo).setDisplaySize(286, 96);
    const mascara = this.make.graphics({}, false).fillRoundedRect(x + 10, 92, 286, 96, 10);
    ilustra.setMask(mascara.createGeometryMask());
    this.add.image(x + 236, 140, `inimigo-${cap.chefe}`).setScale(86 / 780);
    const bugs = [...new Set(fasesDoCapitulo(cap.numero).flatMap((f) => f.ondas.flat()).filter((e) => !e.chefe).map((e) => e.nome))];
    bugs.slice(0, 3).forEach((nome, i) => this.add.image(x + 60 + i * 54, 156, `inimigo-${nome}`).setScale(50 / 360));
    texto(this, x + 18, 98, `CAPÍTULO ${cap.numero}/4`, 12, '#ffffff', { fontStyle: 'bold', backgroundColor: '#e05561', padding: { x: 6, y: 2 } });
    titulo(this, x + 14, 192, cap.nome, 19);
    texto(this, x + 14, 216, `Reino: ${cap.reino} · 3 fases + 1 enigma`, 12, TXT.suave);
    new Botao(this, x + 153, 254, 160, 26, 'VER MAPA', () => {
      this.registry.set('capitulo', cap.numero);
      this.scene.start('Mapa');
    }, COR.destaque, 13, { raio: 13 });
  }

  private criarMenuLateral() {
    const itens: [string, string, () => void, number][] = [
      ['herois', 'Heróis', () => this.scene.start('Herois'), COR.roxo],
      ['instanciar', 'Instanciar', () => this.scene.start('Instanciar'), 0xb455e0],
      ['loja', 'Loja', () => this.scene.start('Loja'), COR.laranja],
      ['galeria', 'Galeria', () => this.scene.start('Galeria'), COR.destaque],
      ['ajuda', 'Como jogar', () => this.comoJogar(), COR.ok],
    ];
    itens.forEach(([ic, nome, acao, cor], i) => {
      const y = 132 + i * 80;
      new Botao(this, 50, y, 64, 52, '', acao, cor, 13, { icone: `icone-${ic}`, tamanhoIcone: 40, raio: 14 });
      titulo(this, 50, y + 28, nome, 13).setOrigin(0.5, 0);
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
    const x = 640;
    const y = 284;
    cartao(this, x, y, 306, 62, 0x1d1747, 0.85);
    icone(this, x + 32, y + 31, 'bytes', 40);
    titulo(this, x + 62, y + 8, 'PROCESSOS EM SEGUNDO PLANO', 13);
    this.taxa = texto(this, x + 62, y + 30, '', 12, TXT.normal, { wordWrap: { width: 236 } });
  }

  private trocarLider(d: number) {
    const n = jogo.herois.length;
    this.registry.set('liderId', jogo.herois[(this.lider + d + n) % n].id);
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
    this.equipe.setText(`Equipe nível ${jogo.equipe.reduce((s, x) => s + x.nivel, 0)} · ${jogo.herois.length} heróis`);
    const p = progressoCapitulo(jogo, capituloAtual().numero);
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
        '4. Use Bytes na tela de Heróis para treinar ataque e vida e monte uma equipe de até 4.\n' +
        '5. Resolva o enigma do portão para enfrentar o chefão.\n' +
        '6. Cada fase gasta 6 de energia, que recarrega +1 a cada 12 min (até 60).\n' +
        '7. Commits compram giros no Instanciar: 4★ garantido a cada 10 giros e 5★ a cada 50. Fichas compram heróis na Loja.\n\n' +
        'Depois da primeira vitória, seus heróis continuam ganhando Bytes e XP mesmo com o jogo fechado (até 8 horas).',
      'Entendi',
    );
  }

  private mostrarBoasVindas() {
    if (jogo.bonusRecebidoAgora) {
      jogo.bonusRecebidoAgora = false;
      jogo.salvar();
      modal(
        this,
        'Presente de boas-vindas!',
        `Você ganhou ${BONUS_BOAS_VINDAS} Commits para usar no Instanciar. Isso dá para um giro x10, com um herói 4★ garantido!`,
        'Oba!',
        () => this.mostrarBoasVindas(),
      );
      return;
    }
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
