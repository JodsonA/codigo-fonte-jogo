import Phaser from 'phaser';
import { ARTES as ARTES_PERSONAGENS, dataUri } from '../arte/personagens';
import { ARTES_CENARIO } from '../arte/cenario';
import { ARTES_NOVAS } from '../arte/novos';
import { ARTES_CAPITULOS_3_4 } from '../arte/capitulos34';

const ARTES = [...ARTES_PERSONAGENS, ...ARTES_CENARIO, ...ARTES_NOVAS, ...ARTES_CAPITULOS_3_4];
import { TXT, texto, LARGURA, ALTURA } from './ui';

/** Converte a arte SVG em texturas antes de abrir o jogo. */
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    texto(this, LARGURA / 2, ALTURA / 2, 'Compilando heróis...', 20, TXT.suave).setOrigin(0.5);
    let faltam = ARTES.length;
    const pronto = () => { if (--faltam === 0) this.scene.start('Home'); };
    this.textures.on(Phaser.Textures.Events.ADD, pronto);
    this.textures.on(Phaser.Textures.Events.ERROR, pronto);
    for (const a of ARTES) this.textures.addBase64(a.chave, dataUri(a.svg));
    this.events.once('shutdown', () => {
      this.textures.off(Phaser.Textures.Events.ADD, pronto);
      this.textures.off(Phaser.Textures.Events.ERROR, pronto);
    });
  }
}

/** Sprite de um personagem com altura fixa em pixels de tela. */
export function sprite(cena: Phaser.Scene, x: number, y: number, chave: string, altura: number) {
  const img = cena.add.image(x, y, chave);
  img.setScale(altura / img.height);
  return img;
}
