# matthewcodergamer.github.io

Public launcher and guide site for **Minecraft Java Edition v26.3** in the
browser.

The launcher keeps the Play button, news feed, and Google AdSense integration.
The game shell, WebAssembly client, and resource archive are served from the
canonical Hugging Face Space because the production Wasm module is larger than
the GitHub repository file limit.

Canonical build: https://matthewcodergamer-minecraft-browser.static.hf.space/

The launcher currently embeds build **26.3-20261127c** from
`/game.html?v=26.3-20261127c&host=pages2`. While the game is open the body is
locked with `position:fixed`, `100dvh`, and `touch-action:none`, so mobile
browsers cannot scroll or rubber-band the page behind the canvas. Touch clients
start at render distance 4.
