import Phaser from 'phaser';
import type { Heroi } from '../core/herois';
import { ALTURA, Botao, COR, LARGURA, MONO, TXT, cartao, texto, titulo } from './ui';

/** Janela que mostra o código de atacar() do herói e explica o polimorfismo. */
export function mostrarCodigo(cena: Phaser.Scene, h: Heroi) {
  const c = cena.add.container(0, 0).setDepth(1000);
  const veu = cena.add.rectangle(0, 0, LARGURA, ALTURA, 0x000000, 0.65).setOrigin(0).setInteractive();
  const w = 660;
  const h0 = 460;
  const x0 = (LARGURA - w) / 2;
  const y0 = (ALTURA - h0) / 2;
  const fundo = cartao(cena, x0, y0, w, h0, 0x231a5c, 0.97, 0x9be3ff, 18);
  const t = titulo(cena, x0 + 24, y0 + 18, `Polimorfismo: como ${h.nomeCurto} ataca`, 22, TXT.destaque);
  const caixa = cena.add.rectangle(x0 + 24, y0 + 62, w - 48, 196, 0x0e1118).setOrigin(0);
  const codigo = texto(cena, x0 + 38, y0 + 74, h.codigoAtacar, 14, '#c8f7c5', { fontFamily: MONO, lineSpacing: 4 });
  const explicacao = texto(
    cena, x0 + 24, y0 + 272,
    'Ada e Turing herdam da mesma classe Heroi e os dois têm o método atacar(). ' +
      'A batalha só chama heroi.atacar(), sem saber quem é o herói. Cada classe decide o que acontece: isso é polimorfismo.\n\n' +
      `Fato: ${h.fato}`,
    14, TXT.normal, { wordWrap: { width: w - 48 }, lineSpacing: 4 },
  );
  const fechar = new Botao(cena, LARGURA / 2, y0 + h0 - 34, 180, 42, 'Fechar', () => c.destroy(), COR.ok);
  c.add([veu, fundo, t, caixa, codigo, explicacao, fechar]);
}
