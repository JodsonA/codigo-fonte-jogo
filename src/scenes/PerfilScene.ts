import Phaser from 'phaser';
import { CAPITULOS, FASES, fasesDoCapitulo } from '../core/fases';
import { ENIGMAS } from '../core/progresso';
import { NICK_MAX, jogo, validarNickname } from '../core/jogo';
import { capituloAtual } from './MapaScene';
import { ALTURA, Botao, COR, LARGURA, TXT, aviso, botaoVoltar, cartao, icone, texto, titulo } from './ui';

/** Título do jogador, conforme os chefões derrotados. */
export function tituloJogador() {
  const titulos = ['Aprendiz de Código', 'Mestre da Abstração', 'Sentinela do Encapsulamento', 'Mestre das Linhagens', 'Mestre dos Quatro Pilares'];
  const vencidos = CAPITULOS.filter((c) => {
    const f = fasesDoCapitulo(c.numero);
    return f.length > 0 && jogo.faseVencida(f[f.length - 1].id);
  }).length;
  return titulos[Math.min(vencidos, titulos.length - 1)];
}

/** Perfil do jogador: nickname, avatar e estatísticas. */
export class PerfilScene extends Phaser.Scene {
  private nick!: Phaser.GameObjects.Text;
  private avatar!: Phaser.GameObjects.Image;
  private editor?: HTMLInputElement;
  private edicao?: Phaser.GameObjects.Container;
  private avatares?: Phaser.GameObjects.Container;

  constructor() { super('Perfil'); }

  create() {
    this.add.image(0, 0, 'fundo-home').setOrigin(0).setDisplaySize(LARGURA, ALTURA);
    this.add.rectangle(0, 0, LARGURA, ALTURA, 0x0b0820, 0.55).setOrigin(0);
    botaoVoltar(this, 'Início', 'Home');
    titulo(this, LARGURA / 2, 14, 'Perfil', 28).setOrigin(0.5, 0);

    this.criarCartaoPrincipal();
    this.criarAvatares();
    this.criarEstatisticas();
    this.events.once('shutdown', () => this.fecharEditor());
  }

  // ------------------------------------------------------------ Nickname e avatar

  private criarCartaoPrincipal() {
    cartao(this, 20, 70, 340, 452, 0x1d1747, 0.92);
    const cx = 190;
    const g = this.add.graphics();
    g.fillStyle(0xf5c542).fillCircle(cx, 170, 82);
    g.fillStyle(0x2b6fd6).fillCircle(cx, 170, 75);
    this.avatar = this.add.image(cx, 170, `heroi-${jogo.perfil.avatarId}`);
    this.avatar.setMask(this.make.graphics({}, false).fillCircle(cx, 170, 75).createGeometryMask());
    this.ajustarAvatar();

    this.nick = titulo(this, cx, 270, jogo.perfil.nickname, 26).setOrigin(0.5, 0);
    this.ajustarNick();
    texto(this, cx, 306, tituloJogador(), 14, TXT.ouro, { fontStyle: 'bold' }).setOrigin(0.5, 0);
    const desde = new Date(jogo.perfil.criadoEm).toLocaleDateString('pt-BR');
    texto(this, cx, 330, `Jogando desde ${desde}`, 12, TXT.suave).setOrigin(0.5, 0);

    new Botao(this, cx, 380, 240, 44, 'Mudar nickname', () => this.abrirEditor(), COR.destaque, 16, { icone: 'icone-editar', tamanhoIcone: 26 });
    texto(this, cx, 412, `De 3 a ${NICK_MAX} caracteres: letras, números, espaço, ponto, hífen e _.`, 11, TXT.suave, {
      align: 'center', wordWrap: { width: 290 },
    }).setOrigin(0.5, 0);
    texto(this, cx, 460, 'O nickname e o avatar ficam salvos neste navegador.', 11, TXT.suave, { align: 'center', wordWrap: { width: 290 } }).setOrigin(0.5, 0);
  }

  private ajustarAvatar() {
    this.avatar.setScale(320 / this.avatar.height).setY(170 + 54);
  }

  private ajustarNick() {
    this.nick.setText(jogo.perfil.nickname).setScale(1);
    if (this.nick.width > 300) this.nick.setScale(300 / this.nick.width);
  }

  private criarAvatares() {
    this.avatares?.destroy(true);
    const c = this.add.container(0, 0);
    this.avatares = c;
    const x0 = 376;
    c.add(cartao(this, x0, 70, 564, 176, 0x1d1747, 0.92));
    c.add(titulo(this, x0 + 18, 82, 'Avatar', 18));
    c.add(texto(this, x0 + 546, 86, 'Heróis da sua coleção podem ser seu avatar', 12, TXT.suave).setOrigin(1, 0));
    jogo.todos.forEach((h, i) => {
      const x = x0 + 50 + i * 66;
      const y = 166;
      const tem = jogo.colecao.has(h.id);
      const escolhido = jogo.perfil.avatarId === h.id;
      const anel = this.add.circle(x, y, 30, escolhido ? COR.ouro : 0x2c3448).setStrokeStyle(3, escolhido ? 0xffffff : 0x4a5370);
      const img = this.add.image(x, y, `heroi-${h.id}`);
      img.setScale(130 / img.height).setY(y + 22);
      img.setMask(this.make.graphics({}, false).fillCircle(x, y, 26).createGeometryMask());
      if (!tem) img.setTintFill(0x0b0820).setAlpha(0.8);
      c.add([anel, img]);
      if (!tem) c.add(icone(this, x + 18, y + 18, 'cadeado', 20));
      c.add(texto(this, x, y + 38, tem ? h.nomeCurto : '???', 11, escolhido ? TXT.ouro : TXT.normal, { fontStyle: 'bold' }).setOrigin(0.5, 0));
      if (tem) {
        anel.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
          jogo.definirAvatar(h.id);
          this.avatar.setTexture(`heroi-${h.id}`);
          this.ajustarAvatar();
          this.criarAvatares();
        });
      }
    });
  }

  private criarEstatisticas() {
    const x0 = 376;
    cartao(this, x0, 256, 564, 266, 0x1d1747, 0.92);
    icone(this, x0 + 32, 280, 'trofeu', 30);
    titulo(this, x0 + 54, 268, 'Estatísticas', 18);
    const nEnigmas = Object.keys(ENIGMAS).length;
    const nivelEquipe = jogo.equipe.reduce((s, h) => s + h.nivel, 0);
    const p = jogo.perfil;
    const dados: [string, string][] = [
      ['Capítulo atual', `${capituloAtual().numero} · ${capituloAtual().nome}`],
      ['Fases vencidas', `${jogo.fasesVencidas.length} de ${FASES.length}`],
      ['Enigmas resolvidos', `${jogo.enigmasResolvidos.length} de ${nEnigmas}`],
      ['Heróis na coleção', `${jogo.colecao.size} de ${jogo.todos.length}`],
      ['Nível da equipe', `${nivelEquipe}`],
      ['Batalhas vencidas', `${p.vitorias}`],
      ['Derrotas', `${p.derrotas}`],
      ['Giros no Instanciar', `${jogo.gacha.total}`],
    ];
    dados.forEach(([rotulo, valor], i) => {
      const col = i % 2;
      const lin = Math.floor(i / 2);
      const x = x0 + 18 + col * 276;
      const y = 312 + lin * 50;
      const fundo = this.add.graphics();
      fundo.fillStyle(0x2c3448, 0.8).fillRoundedRect(x, y, 260, 42, 10);
      texto(this, x + 12, y + 5, rotulo, 11, TXT.suave);
      titulo(this, x + 12, y + 19, valor, 15);
    });
  }

  // ------------------------------------------------------------ Editor do nickname (campo HTML sobre o canvas)

  private abrirEditor() {
    if (this.editor) return;
    const c = this.add.container(0, 0).setDepth(1000);
    this.edicao = c;
    c.add(this.add.rectangle(0, 0, LARGURA, ALTURA, 0x050214, 0.75).setOrigin(0).setInteractive());
    c.add(cartao(this, LARGURA / 2 - 220, 150, 440, 230, 0x1d1747, 0.98, COR.ouro));
    c.add(titulo(this, LARGURA / 2, 168, 'Novo nickname', 22).setOrigin(0.5, 0));
    const erro = texto(this, LARGURA / 2, 282, '', 13, TXT.perigo, { align: 'center' }).setOrigin(0.5, 0);
    c.add(erro);

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = NICK_MAX;
    input.value = jogo.perfil.nickname;
    input.setAttribute('aria-label', 'Nickname');
    input.autocomplete = 'off';
    input.spellcheck = false;
    Object.assign(input.style, {
      position: 'fixed', zIndex: '10', boxSizing: 'border-box', border: '3px solid #4fc3f7', borderRadius: '10px',
      background: '#0e1118', color: '#ffffff', fontFamily: '"Trebuchet MS", system-ui, sans-serif', fontWeight: 'bold',
      textAlign: 'center', outline: 'none', padding: '0 10px',
    } satisfies Partial<CSSStyleDeclaration>);
    document.body.appendChild(input);
    this.editor = input;
    const posicionar = () => {
      const r = this.game.canvas.getBoundingClientRect();
      const k = r.width / LARGURA;
      Object.assign(input.style, {
        left: `${r.left + (LARGURA / 2 - 170) * k}px`, top: `${r.top + 214 * k}px`,
        width: `${340 * k}px`, height: `${52 * k}px`, fontSize: `${22 * k}px`,
      });
    };
    posicionar();
    this.scale.on('resize', posicionar);
    window.addEventListener('resize', posicionar);
    input.focus();
    input.select();

    const salvar = () => {
      const msg = jogo.definirNickname(input.value);
      if (msg) {
        erro.setText(msg);
        input.style.borderColor = '#e05561';
        input.focus();
        return;
      }
      this.fecharEditor();
      this.ajustarNick();
      aviso(this, `Agora você é ${jogo.perfil.nickname}!`);
    };
    input.addEventListener('input', () => {
      const msg = validarNickname(input.value);
      erro.setText(input.value.trim().length >= 3 ? msg ?? '' : '');
      input.style.borderColor = msg && input.value.trim().length >= 3 ? '#e05561' : '#4fc3f7';
    });
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') salvar();
      if (ev.key === 'Escape') this.fecharEditor();
    });
    c.add(new Botao(this, LARGURA / 2 - 104, 340, 180, 44, 'Cancelar', () => this.fecharEditor(), COR.cinzaBotao, 16));
    c.add(new Botao(this, LARGURA / 2 + 104, 340, 180, 44, 'Salvar', salvar, COR.ok, 16));
    this.posicionar = posicionar;
  }

  private posicionar?: () => void;

  private fecharEditor() {
    if (this.posicionar) {
      this.scale.off('resize', this.posicionar);
      window.removeEventListener('resize', this.posicionar);
      this.posicionar = undefined;
    }
    this.editor?.remove();
    this.editor = undefined;
    this.edicao?.destroy(true);
    this.edicao = undefined;
  }
}
