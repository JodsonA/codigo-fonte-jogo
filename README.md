# Código Fonte: As Crônicas do Compilador (protótipo)

RPG idle educativo para navegador sobre os pilares da orientação a objetos e a história da programação.

## Rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a pasta dist/ para publicar
```

## Estrutura

- `src/core/` lógica pura do jogo, sem desenho (dá para testar sem navegador)
  - `herois.ts` classe abstrata `Heroi` e os heróis (herança, encapsulamento, polimorfismo)
  - `batalha.ts` simulação da batalha automática
  - `fases.ts` fases, ondas e inimigos
  - `enigmas.ts` banco do enigma da linha do tempo
  - `jogo.ts` estado do jogador, salvamento e progresso offline
- `src/scenes/` telas em Phaser: mapa e heróis (`HubScene`), batalha (`BatalhaScene`) e enigma (`EnigmaScene`)

O progresso fica salvo no `localStorage` do navegador.
