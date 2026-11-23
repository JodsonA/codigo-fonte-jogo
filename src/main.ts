import Phaser from 'phaser';
import { jogo } from './core/jogo';
import { HubScene } from './scenes/HubScene';
import { BatalhaScene } from './scenes/BatalhaScene';
import { EnigmaScene } from './scenes/EnigmaScene';
import { ALTURA, COR, LARGURA } from './scenes/ui';

const offline = jogo.coletarOffline();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'jogo',
  width: LARGURA,
  height: ALTURA,
  backgroundColor: COR.fundo,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [HubScene, BatalhaScene, EnigmaScene],
  callbacks: { preBoot: (g) => g.registry.set('offline', offline) },
});

// Salva ao sair da aba e calcula o progresso offline ao voltar.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    jogo.salvar();
  } else {
    const g = jogo.coletarOffline();
    if (g) game.events.emit('offline', g);
  }
});
window.addEventListener('beforeunload', () => jogo.salvar());
