# 🌿 Jungle Dash — Endless Runner

> A fast-paced, Temple Run–inspired browser game built with **HTML, CSS, and vanilla JavaScript**. Dodge obstacles, collect coins, and see how long you can survive in the jungle!

![Game](https://img.shields.io/badge/Game-Endless%20Runner-8bc34a?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-Structure-e34f26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Design-1572b6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Gameplay-f7df1e?style=flat-square&logo=javascript&logoColor=222)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-2ea44f?style=flat-square)

## 🎮 About the Game

**Jungle Dash** is a lightweight endless-runner game that runs directly in your web browser. Switch between three lanes, jump over rocks, slide under barriers, and collect glowing coins while the game gradually gets faster.

This beginner-friendly project demonstrates how HTML, CSS, JavaScript, and the HTML Canvas API work together to create an interactive game.

## ✨ Features

- 🏃 **Three-lane running** — move left and right to dodge obstacles.
- 🦘 **Jump mechanic** — leap over ground obstacles.
- 🛝 **Slide mechanic** — duck under overhead barriers.
- 🪙 **Collectible coins** — collect coins to boost your score.
- 📈 **Increasing difficulty** — the game gets faster as you survive.
- 🧮 **Live HUD** — track score, coins, and speed.
- 🏆 **Best-score tracking** — your best score is saved using browser `localStorage`.
- 📱 **Touch controls** — swipe on touch-enabled devices.
- 🔁 **Restart system** — quickly start another run after a collision.
- 🎨 **Custom canvas graphics** — jungle scenery and game objects are drawn in JavaScript.
- ⚡ **No build tools required** — no framework or package manager needed.

## 🕹️ Controls

| Action | Keyboard | Touchscreen |
|---|---|---|
| Move left | `←` or `A` | Swipe left |
| Move right | `→` or `D` | Swipe right |
| Jump | `↑`, `W`, or `Space` | Swipe up |
| Slide | `↓` or `S` | Swipe down |
| Start | Click Start Running or press `Enter` | Tap the start button |

## 🚀 Getting Started

### Prerequisites

You only need:

- A modern web browser, such as Google Chrome.
- Visual Studio Code (optional, but recommended).
- The project files.

No additional JavaScript libraries are required.

### Option 1: Run directly

1. Download or clone this project.
2. Extract the ZIP file if needed.
3. Open the project folder.
4. Double-click `index.html`.
5. Click **Start Running**.

### Option 2: Run using VS Code

1. Open the project folder in VS Code.
2. Ensure all three main files are in the same folder.
3. Install the **Live Server** extension by Ritwick Dey.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. Your browser will open the game on a local address, commonly `http://127.0.0.1:5500`.

> **Note:** The game itself has no external JavaScript dependencies. Google Fonts requires an internet connection; fallback fonts are used if it is unavailable.

## 📁 Project Structure

```text
jungle_dash_game/
├── index.html    # Game layout, HUD, overlays, and buttons
├── style.css     # Theme, responsive layout, and visual styling
├── script.js     # Rendering, movement, obstacles, collisions, and scoring
└── README.md     # Project documentation
```

## 🧠 How It Works

### HTML — Structure

`index.html` defines the game canvas, score and coin displays, start screen, game-over screen, and control hints.

### CSS — Design

`style.css` handles the jungle-inspired interface, HUD panels, buttons, typography, layout, and responsive styling.

### JavaScript — Gameplay

`script.js` uses the Canvas API and an animation loop to draw the environment and player. It also manages keyboard and touch input, lane movement, jumping, sliding, object spawning, collisions, scoring, speed progression, and best-score storage.

## 🛠️ Customization Ideas

Make the game your own by adding:

- 🌄 New jungle environments and backgrounds.
- 🧍 Animated character sprites.
- 🔊 Sound effects and background music.
- ⚡ Power-ups, shields, and coin magnets.
- 🏅 Missions, achievements, and leaderboards.
- 🎭 Unlockable characters and skins.
- 🌐 Online scoreboards.

After changing the files, save your work and refresh the browser to see your updates.

## 🧩 Built With

- **HTML5** — page structure.
- **CSS3** — styling and responsive layout.
- **JavaScript (ES6+)** — game logic and interactions.
- **HTML Canvas API** — rendering the game scene.
- **Browser localStorage** — saving the best score locally.

## 🌱 Learning Outcomes

This project helps you practise:

- DOM manipulation and event listeners.
- Canvas drawing and animation with `requestAnimationFrame`.
- Keyboard and touch input handling.
- Game loops and delta-time updates.
- Basic collision detection.
- Object spawning and difficulty balancing.
- Responsive UI design.
- Persistent browser storage using `localStorage`.

## 🐛 Troubleshooting

**The browser shows a blank page**
- Check that `index.html`, `style.css`, and `script.js` are present in the same folder.
- Open the browser developer console with `F12` and check for errors.

**The page has no styling**
- Verify that the HTML includes `<link rel="stylesheet" href="style.css" />`.
- Ensure the stylesheet is named exactly `style.css`.

**The controls or buttons do not work**
- Verify that the HTML includes `<script src="script.js"></script>`.
- Confirm the JavaScript filename is exactly `script.js`.
- Save your files and refresh the browser.

**Live Server is not available**
- Open Extensions using `Ctrl + Shift + X`.
- Search for Live Server, install it, and try again.

## 🤝 Contributing

Contributions and suggestions are welcome!

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and test the game.
4. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

5. Push your branch and open a pull request.

## 📄 License

No license has been specified yet. If you want others to reuse, modify, or distribute this project, consider adding a suitable `LICENSE` file.

---

**Made with 🌿, curiosity, and JavaScript.**

*Run wild. Dodge fast. Beat your best.*
