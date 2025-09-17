# Snake Nokia Web 🐍

A static web implementation of the classic Snake game, featuring the iconic Nokia LCD green theme and authentic retro gameplay. Perfect for hosting on GitHub Pages!

## Features ✨

- **Classic Snake Gameplay**: 20×20 grid with traditional Snake mechanics
- **Nokia LCD Green Theme**: Authentic retro visual styling
- **Local High Scores**: Top 10 scores stored in browser localStorage
- **Responsive Controls**: Arrow keys + ESC for pause
- **Full Mobile Support**: 
  - Responsive design for all screen sizes
  - Swipe gesture controls
  - Touch-friendly virtual keypad
  - Haptic feedback (vibration)
  - Optimized for portrait and landscape modes
- **Static Site**: Pure HTML/CSS/JS - no server required!
- **GitHub Pages Ready**: Deploy instantly to GitHub Pages

## Quick Start 🚀

### Option 1: GitHub Pages (Recommended)
1. **Fork this repository** on GitHub
2. **Enable GitHub Pages** in repository settings
3. **Play the game** at `https://yourusername.github.io/snake`

### Option 2: Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/snake.git
   cd snake
   ```

2. **Open locally**:
   Simply open `index.html` in your web browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. **Play the game**:
   Navigate to `http://localhost:8000`

## Game Controls 🎮

### Desktop Controls
- **Arrow Keys**: Move the snake (↑ ↓ ← →)
- **SPACE**: Start game / Restart after game over
- **ESC**: Pause/Resume game

### Mobile Controls
- **Swipe Gestures**: Swipe on the game area to move the snake
  - Swipe up/down/left/right to change direction
  - Tap the game area to start/restart/resume
- **Virtual Keypad**: Touch-friendly button controls
- **Haptic Feedback**: Vibration for food eating, game over, and high scores (if supported)

## Game Rules 📋

- Snake starts with length 3 and grows by +1 for each food eaten
- Collision with walls or self ends the game
- No 180-degree turns allowed (prevents accidental self-collision)
- Score increases by 1 point per food item
- High scores are automatically saved locally

## Technical Implementation 🔧

- **Frontend**: Pure HTML5 Canvas with JavaScript game logic
- **Styling**: CSS with Nokia LCD green color scheme
- **Storage**: Browser localStorage for persistent high scores
- **Architecture**: Static site - no server required!
- **Deployment**: GitHub Pages with automated workflow

## File Structure 📁

```
snake/
├── index.html          # Main game interface
├── snake.js           # Game logic and controls
├── README.md          # Documentation
├── .gitignore         # Git ignore rules
└── .github/
    └── workflows/
        └── pages.yml  # GitHub Pages deployment
```

## GitHub Pages Setup 📤

1. **Create a new repository** on GitHub
2. **Upload these files** to your repository
3. **Go to Settings** → **Pages**
4. **Set Source** to "GitHub Actions"
5. **Push to main branch** - the game will auto-deploy!

The included GitHub Actions workflow will automatically deploy your site whenever you push changes.

## Game States 🎯

The game implements a finite state machine with these states:

- **Menu**: Initial state, waiting for player to start
- **Playing**: Active gameplay with snake movement
- **Paused**: Game temporarily stopped, can be resumed
- **Game Over**: Snake died, showing final score

## Nokia Theme Details 🎨

The visual design recreates the classic Nokia phone gaming experience:

- **Colors**: Authentic LCD green color palette (#9bb654, #2a3d1a)
- **Typography**: Monospace font (Courier New)
- **Layout**: Phone-style container with screen bezel
- **Grid**: Pixelated rendering for retro feel
- **UI**: Simple, functional interface matching Nokia UX

## Development Notes 💡

Built following the original requirements specification:
- Fixed 20×20 grid size
- 18px cell size for optimal visibility
- Snake grows exactly +1 per food item
- Wall and self-collision detection
- Top 10 high score table with localStorage persistence
- Classic Nokia LCD green monochrome theme

Enjoy the nostalgic Snake gaming experience! 🎮
