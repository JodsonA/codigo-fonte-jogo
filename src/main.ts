import Phaser from 'phaser';
import { jogo } from './core/jogo';
import { BootScene } from './scenes/BootScene';
import { HomeScene } from './scenes/HomeScene';
import { MapaScene } from './scenes/MapaScene';
import { HeroisScene } from './scenes/HeroisScene';
import { GaleriaScene } from './scenes/GaleriaScene';
import { BatalhaScene } from './scenes/BatalhaScene';
import { EnigmaScene } from './scenes/EnigmaScene';
import { EnigmaQuizScene } from './scenes/EnigmaQuizScene';
import { InstanciarScene } from './scenes/InstanciarScene';
import { LojaScene } from './scenes/LojaScene';
import { ALTURA, COR, LARGURA } from './scenes/ui';

const offline = jogo.coletarOffline();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'jogo',
  width: LARGURA,
  height: ALTURA,
  backgroundColor: COR.fundo,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, HomeScene, MapaScene, HeroisScene, GaleriaScene, BatalhaScene, EnigmaScene, EnigmaQuizScene, InstanciarScene, LojaScene],
  callbacks: { preBoot: (g) => g.registry.set('offline', offline) },
});

// "Processos em segundo plano": o time rende a cada segundo enquanto a aba está aberta.
let desdeSalvar = 0;
setInterval(() => {
  if (document.hidden) return;
  const g = jogo.aplicarTempo(1000);
  game.events.emit('idle', g);
  if (++desdeSalvar >= 10) {
    desdeSalvar = 0;
    jogo.salvar();
  }
}, 1000);

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
