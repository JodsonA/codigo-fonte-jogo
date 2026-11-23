import Phaser from 'phaser';
import { jogo, LIMITE_OFFLINE_MS, type Ganhos } from '../core/jogo';
import { FASES } from '../core/fases';
import { Heroi } from '../core/herois';
import { ENIGMA_LINHA_DO_TEMPO } from '../core/enigmas';
import { ALTURA, Barra, Botao, COR, LARGURA, MONO, TXT, formatarTempo, modal, painel, texto } from './ui';
import { sprite } from './BootScene';

interface CartaoHeroi {
  heroi: Heroi;
  nivel: Phaser.GameObjects.Text;
  xp: Phaser.GameObjects.Text;
  barraXp: Barra;
  status: Phaser.GameObjects.Text;
  habilidade: Phaser.GameObjects.Text;
  treinarAtaque: Botao;
  treinarVida: Botao;
}

interface LinhaMapa {
  status: Phaser.GameObjects.Text;
  botao: Botao;
  atualizar: () => void;
}

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

export class HubScene extends Phaser.Scene {
  private cartoes: CartaoHeroi[] = [];
  private linhas: LinhaMapa[] = [];
  private moedas!: Phaser.GameObjects.Text;
  private taxa!: Phaser.GameObjects.Text;
  private acumulado = 0;
  private desdeSalvar = 0;
  private confirmarReinicio = false;

  constructor() { super('Hub'); }

  create() {
    this.cartoes = [];
    this.linhas = [];
    this.cameras.main.setBackgroundColor(COR.fundo);

    texto(this, 20, 12, 'Código Fonte', 26, TXT.normal, { fontStyle: 'bold' });
    texto(this, 22, 44, 'Capítulo 1 · Vale das Interfaces (reino da Abstração)', 14, TXT.suave);
    this.moedas = texto(this, LARGURA - 20, 14, '', 18, TXT.ouro, { fontStyle: 'bold' }).setOrigin(1, 0);
    this.taxa = texto(this, LARGURA - 20, 44, '', 13, TXT.suave).setOrigin(1, 0);

    jogo.herois.forEach((h, i) => this.criarCartao(h, 20 + i * 305, 76));
    this.criarMapa(640, 76);

    const reiniciar = texto(this, LARGURA - 20, ALTURA - 14, 'Reiniciar progresso', 12, TXT.suave).setOrigin(1, 1).setInteractive({ useHandCursor: true });
    reiniciar.on('pointerdown', () => {
      if (!this.confirmarReinicio) {
        this.confirmarReinicio = true;
        reiniciar.setText('Clique de novo para apagar tudo').setColor(TXT.perigo);
        this.time.delayedCall(3000, () => { this.confirmarReinicio = false; reiniciar.setText('Reiniciar progresso').setColor(TXT.suave); });
        return;
      }
      jogo.reiniciar();
      window.location.reload();
    });
    texto(this, 20, ALTURA - 14, 'Protótipo · o progresso fica salvo neste navegador', 12, TXT.suave).setOrigin(0, 1);
    const galeria = texto(this, LARGURA / 2, ALTURA - 14, 'Galeria de personagens', 13, TXT.destaque, { fontStyle: 'bold' }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true });
    galeria.on('pointerdown', () => this.scene.start('Galeria'));

    this.atualizarTudo();

    const offline = this.registry.get('offline') as Ganhos | null;
    this.registry.set('offline', null);
    if (offline) {
      modal(this, 'Bem-vindo de volta!', textoGanhos(offline), 'Coletar', () => this.atualizarTudo());
    } else if (jogo.fasesVencidas.length === 0 && !this.registry.get('introVista')) {
      this.registry.set('introVista', true);
      modal(
        this,
        'O mundo de Runtime precisa de você',
        'A Exceção, um erro que nunca foi tratado, corrompeu os quatro reinos.\n\n' +
          'Você despertou Ada Lovelace e Alan Turing, lendas guardadas como objetos na memória. ' +
          'Vença as fases, suba o nível dos heróis e resolva o enigma para enfrentar O Monolito.\n\n' +
          'Depois da primeira vitória, seus heróis continuam ganhando Bytes e XP mesmo com o jogo fechado.',
        'Começar',
      );
    }

    this.game.events.on('offline', this.aoVoltar, this);
    this.events.once('shutdown', () => this.game.events.off('offline', this.aoVoltar, this));
  }

  private aoVoltar(g: Ganhos) {
    this.atualizarTudo();
    modal(this, 'Bem-vindo de volta!', textoGanhos(g), 'Coletar');
  }

  update(_t: number, dt: number) {
    // Rendimento idle enquanto o jogo está aberto.
    this.acumulado += dt;
    this.desdeSalvar += dt;
    if (this.acumulado >= 1000) {
      const g = jogo.aplicarTempo(this.acumulado);
      this.acumulado = 0;
      for (const n of g.niveis) if (n.subiu > 0) this.aviso(`${n.nome} subiu de nível!`);
      this.atualizarTudo();
    }
    if (this.desdeSalvar >= 10000) {
      this.desdeSalvar = 0;
      jogo.salvar();
    }
  }

  private criarCartao(h: Heroi, x: number, y: number) {
    const w = 295;
    painel(this, x, y, w, 410);
    const img = sprite(this, x + 50, y + 56, `heroi-${h.id}`, 100);
    this.tweens.add({ targets: img, scaleY: img.scaleY * 1.03, duration: 900 + Math.random() * 300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    texto(this, x + 98, y + 26, h.nome, 20, TXT.normal, { fontStyle: 'bold' });
    texto(this, x + 98, y + 54, `${h.papel} · reino da Abstração`, 13, TXT.suave);

    const nivel = texto(this, x + 16, y + 104, '', 16, TXT.normal, { fontStyle: 'bold' });
    const xp = texto(this, x + w - 16, y + 106, '', 12, TXT.suave).setOrigin(1, 0);
    const barraXp = new Barra(this, x + 16, y + 134, w - 32, 10, COR.destaque);
    const status = texto(this, x + 16, y + 150, '', 14, TXT.normal);
    const habilidade = texto(this, x + 16, y + 178, '', 14, TXT.normal, { fontStyle: 'bold' });
    texto(this, x + 16, y + 200, h.habilidade.descricao, 12, TXT.suave, { wordWrap: { width: w - 32 }, lineSpacing: 2 });

    new Botao(this, x + w / 2, y + 290, w - 32, 30, 'Ver código de atacar()', () => this.mostrarCodigo(h), COR.painelClaro + 0x202020, 13);
    const treinarAtaque = new Botao(this, x + w / 2, y + 332, w - 32, 34, '', () => this.treinar(h, 'ataque'), COR.ouro, 14);
    const treinarVida = new Botao(this, x + w / 2, y + 374, w - 32, 34, '', () => this.treinar(h, 'vida'), COR.ok, 14);

    this.cartoes.push({ heroi: h, nivel, xp, barraXp, status, habilidade, treinarAtaque, treinarVida });
  }

  private treinar(h: Heroi, attr: 'ataque' | 'vida') {
    if (jogo.treinar(h, attr)) this.aviso(`${h.nome}: treinar("${attr}") executado`);
    this.atualizarTudo();
  }

  private criarMapa(x: number, y: number) {
    const w = 300;
    painel(this, x, y, w, 410);
    texto(this, x + 16, y + 14, 'Mapa do capítulo', 18, TXT.normal, { fontStyle: 'bold' });

    let yy = y + 56;
    const passo = 86;
    for (const fase of FASES) {
      if (fase.enigmaAntes) {
        this.criarLinhaEnigma(x, yy, w);
        yy += passo;
      }
      const titulo = texto(this, x + 16, yy, `Fase ${fase.id} · ${fase.nome}`, 15, TXT.normal, { fontStyle: 'bold' });
      const status = texto(this, x + 16, yy + 22, '', 12, TXT.suave);
      const botao = new Botao(this, x + w - 62, yy + 52, 100, 30, 'Lutar', () => this.scene.start('Batalha', { faseId: fase.id }), COR.destaque, 14);
      const descricao = texto(this, x + 16, yy + 40, fase.descricao, 11, TXT.suave, { wordWrap: { width: w - 140 } });
      this.linhas.push({
        status,
        botao,
        atualizar: () => {
          const liberada = jogo.faseLiberada(fase);
          const vencida = jogo.faseVencida(fase.id);
          titulo.setAlpha(liberada ? 1 : 0.45);
          descricao.setAlpha(liberada ? 1 : 0.45);
          status.setText(vencida ? '✓ Vencida · repetir rende metade' : liberada ? `${fase.ondas.length} ondas` : 'Bloqueada').setColor(vencida ? TXT.ok : TXT.suave);
          botao.setHabilitado(liberada).setRotulo(vencida ? 'Repetir' : 'Lutar');
        },
      });
      yy += passo;
    }
  }

  private criarLinhaEnigma(x: number, y: number, w: number) {
    const e = ENIGMA_LINHA_DO_TEMPO;
    const titulo = texto(this, x + 16, y, 'Portão do Enigma', 15, TXT.ouro, { fontStyle: 'bold' });
    const status = texto(this, x + 16, y + 22, '', 12, TXT.suave);
    const descricao = texto(this, x + 16, y + 40, 'Linha do tempo da programação', 11, TXT.suave);
    const botao = new Botao(this, x + w - 62, y + 52, 100, 30, 'Resolver', () => this.scene.start('Enigma'), COR.ouro, 14);
    this.linhas.push({
      status,
      botao,
      atualizar: () => {
        const liberado = jogo.enigmaLiberado(e.id);
        const feito = jogo.enigmaResolvido(e.id);
        titulo.setAlpha(liberado ? 1 : 0.45);
        descricao.setAlpha(liberado ? 1 : 0.45);
        status.setText(feito ? '✓ Resolvido' : liberado ? 'Abre o caminho até o chefão' : 'Vença a fase anterior').setColor(feito ? TXT.ok : TXT.suave);
        botao.setHabilitado(liberado && !feito).setRotulo(feito ? 'Resolvido' : 'Resolver');
      },
    });
  }

  private atualizarTudo() {
    this.moedas.setText(`${Math.floor(jogo.bytes)} Bytes   ${jogo.commits} Commits`);
    const t = jogo.taxaPorMinuto();
    this.taxa.setText(t.bytes > 0 ? `Processos em segundo plano: +${t.bytes} Bytes/min · +${t.xp} XP/min` : 'Vença a primeira fase para ativar o progresso em segundo plano');
    for (const c of this.cartoes) {
      const h = c.heroi;
      c.nivel.setText(`Nível ${h.nivel}`);
      c.xp.setText(`${Math.floor(h.xp)} / ${h.xpParaProximo} XP`);
      c.barraXp.set(h.xp / h.xpParaProximo);
      c.status.setText(`Ataque ${h.ataque}   ·   Vida ${h.vidaMax}`);
      c.habilidade
        .setText(h.habilidadeDesbloqueada ? `Habilidade: ${h.habilidade.nome} ✓` : `Habilidade: ${h.habilidade.nome} (nível ${Heroi.NIVEL_HABILIDADE})`)
        .setColor(h.habilidadeDesbloqueada ? TXT.ok : TXT.normal);
      const ca = h.custoTreino('ataque');
      const cv = h.custoTreino('vida');
      c.treinarAtaque.setRotulo(`Treinar ataque +2   (${ca} Bytes)`).setHabilitado(jogo.bytes >= ca);
      c.treinarVida.setRotulo(`Treinar vida +10   (${cv} Bytes)`).setHabilitado(jogo.bytes >= cv);
    }
    for (const l of this.linhas) l.atualizar();
  }

  private mostrarCodigo(h: Heroi) {
    const c = this.add.container(0, 0).setDepth(1000);
    const veu = this.add.rectangle(0, 0, LARGURA, ALTURA, 0x000000, 0.65).setOrigin(0).setInteractive();
    const w = 640;
    const h0 = 450;
    const x0 = (LARGURA - w) / 2;
    const y0 = (ALTURA - h0) / 2;
    const fundo = painel(this, x0, y0, w, h0, COR.painelClaro).setStrokeStyle(2, COR.destaque);
    const titulo = texto(this, x0 + 24, y0 + 20, `Polimorfismo: como ${h.nome} ataca`, 20, TXT.destaque, { fontStyle: 'bold' });
    const caixa = this.add.rectangle(x0 + 24, y0 + 60, w - 48, 196, 0x0e1118).setOrigin(0);
    const codigo = texto(this, x0 + 38, y0 + 72, h.codigoAtacar, 14, '#c8f7c5', { fontFamily: MONO, lineSpacing: 4 });
    const explicacao = texto(
      this, x0 + 24, y0 + 270,
      'Ada e Turing herdam da mesma classe Heroi e os dois têm o método atacar(). ' +
        'A batalha só chama heroi.atacar(), sem saber quem é o herói. Cada classe decide o que acontece: isso é polimorfismo.\n\n' +
        `Fato: ${h.fato}`,
      14, TXT.normal, { wordWrap: { width: w - 48 }, lineSpacing: 4 },
    );
    const fechar = new Botao(this, LARGURA / 2, y0 + h0 - 30, 180, 36, 'Fechar', () => c.destroy());
    c.add([veu, fundo, titulo, caixa, codigo, explicacao, fechar]);
  }

  private aviso(msg: string) {
    const t = texto(this, LARGURA / 2, ALTURA - 40, msg, 15, TXT.destaque, { backgroundColor: '#0e1118', padding: { x: 10, y: 6 } }).setOrigin(0.5).setDepth(900);
    this.tweens.add({ targets: t, y: t.y - 30, alpha: 0, delay: 1400, duration: 600, onComplete: () => t.destroy() });
  }
}
