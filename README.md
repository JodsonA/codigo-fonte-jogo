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
  - `fases.ts` capítulos, fases, ondas e inimigos
  - `enigmas.ts` enigmas (linha do tempo e quiz de código)
  - `gacha.ts` regras do Instanciar (chances, garantias, prêmios) e preços da Loja
  - `jogo.ts` estado do jogador, energia, coleção, equipe, salvamento e progresso offline
- `src/arte/` personagens, inimigos, ícones e cenários em SVG
- `src/scenes/` telas em Phaser: Home, Perfil, Mapa, Heróis, Instanciar, Loja, Galeria, Batalha e Enigmas

## Sistemas

- **Capítulos:** 1 Vale das Interfaces (Abstração), 2 Cidadela Privada (Encapsulamento), 3 Floresta das Linhagens (Herança) e 4 Arena dos Mil Rostos (Polimorfismo). Os capítulos 3 e 4 têm 10 fases, um subchefe e dois portões de enigma cada.
- **Perfil:** nickname editável, avatar escolhido entre os heróis da coleção, título e estatísticas.
- **Instanciar (gacha):** cada giro custa 10 Commits. 5★ tem 1,5% por giro, a chance sobe a partir do 41º giro e o 50º é garantido. 4★ tem 10%, sobe a partir do 9º e o 10º é garantido. Giro sem herói dá XP, Bytes ou Fichas. Herói repetido vira Fichas.
- **Loja:** heróis 4★ por 200 Fichas e 5★ por 600, além de pacotes de XP e Bytes.
- **Energia:** máximo de 60, cada fase custa 6, recarrega 1 a cada 12 minutos (cerca de 20 fases por dia). Derrota ou fuga devolve 3.
- **Equipe:** até 4 heróis lutam e recebem XP.

O progresso fica salvo no `localStorage` do navegador.

## Publicar online

- **GitHub Pages:** o workflow `.github/workflows/pages.yml` gera o build e publica a cada push na `main`. Para ativar, vá em Settings > Pages e escolha "GitHub Actions" como fonte. Em conta gratuita, o repositório precisa ser público.
- **itch.io ou qualquer hospedagem estática:** rode `npm run build` e envie o conteúdo da pasta `dist/` (no itch.io, compacte em .zip e marque "This file will be played in the browser").
