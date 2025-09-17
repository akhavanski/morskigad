/**
 * Snake Nokia Web - Game Logic Implementation
 * Features Nokia LCD green theme and classic Snake gameplay
 */

class SnakeGame {
    constructor() {
        // Game configuration from requirements
        this.GRID_SIZE = 20;
        this.CELL_SIZE = 18;
        this.CANVAS_SIZE = this.GRID_SIZE * this.CELL_SIZE;
        this.INITIAL_LENGTH = 3;
        this.TICK_MS_DEFAULT = 150;
        this.TICK_MS_MIN = 70;
        
        // Mobile detection
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0);
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, game_over
        this.score = 0;
        this.highScore = this.loadHighScore();
        
        // Snake properties
        this.snake = [];
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.nextDirection = { x: 1, y: 0 };
        
        // Food
        this.food = { x: 0, y: 0 };
        
        // Game loop
        this.gameLoop = null;
        this.tickRate = this.TICK_MS_DEFAULT;
        
        // Initialize canvas and UI
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.CANVAS_SIZE;
        this.canvas.height = this.CANVAS_SIZE;
        
        // Mobile-specific optimizations
        if (this.isMobile) {
            // Disable image smoothing for crisp pixels on mobile
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.mozImageSmoothingEnabled = false;
            this.ctx.msImageSmoothingEnabled = false;
        }
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameStateElement = document.getElementById('gameState');
        this.scoresListElement = document.getElementById('scoresList');
        
        // Initialize
        this.setupEventListeners();
        this.updateUI();
        this.loadHighScores();
        this.draw();
        
        // Mobile-specific initialization
        if (this.isMobile) {
            this.initMobileFeatures();
        }
    }
    
    initMobileFeatures() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Update mobile instructions
        this.updateMobileInstructions();
    }
    
    updateMobileInstructions() {
        if (this.gameState === 'menu') {
            this.gameStateElement.innerHTML = 'Tap game area or press OK to start';
        }
    }
    
    // Mobile haptic feedback
    vibrate(pattern = [50]) {
        if (this.isMobile && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Virtual keypad for mobile/touch
        document.querySelectorAll('.key').forEach(key => {
            // Touch events for better mobile responsiveness
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                key.classList.add('active');
            });
            
            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                key.classList.remove('active');
                const keyCode = key.dataset.key;
                if (keyCode) {
                    this.handleKeyPress({ code: keyCode, preventDefault: () => {} });
                }
            });
            
            key.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                key.classList.remove('active');
            });
            
            // Fallback for non-touch devices
            key.addEventListener('click', (e) => {
                e.preventDefault();
                const keyCode = key.dataset.key;
                if (keyCode) {
                    this.handleKeyPress({ code: keyCode, preventDefault: () => {} });
                }
            });
        });
        
        // Swipe gesture support on canvas
        this.setupSwipeGestures();
        
        // Prevent default arrow key behavior
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        // Prevent context menu on canvas (mobile)
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent scroll on touch devices when playing
        document.addEventListener('touchmove', (e) => {
            if (this.gameState === 'playing') {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupSwipeGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 30;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (e.changedTouches.length === 0) return;
            
            const touch = e.changedTouches[0];
            touchEndX = touch.clientX;
            touchEndY = touch.clientY;
            
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY, minSwipeDistance);
        });
        
        // Mouse events for desktop testing
        let mouseDown = false;
        
        this.canvas.addEventListener('mousedown', (e) => {
            mouseDown = true;
            touchStartX = e.clientX;
            touchStartY = e.clientY;
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (mouseDown) {
                touchEndX = e.clientX;
                touchEndY = e.clientY;
                this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY, minSwipeDistance);
                mouseDown = false;
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            mouseDown = false;
        });
    }
    
    handleSwipe(startX, startY, endX, endY, minDistance) {
        if (this.gameState !== 'playing') {
            // If not playing, treat tap as start/restart
            if (Math.abs(endX - startX) < 10 && Math.abs(endY - startY) < 10) {
                if (this.gameState === 'menu' || this.gameState === 'game_over') {
                    this.handleKeyPress({ code: 'Space', preventDefault: () => {} });
                } else if (this.gameState === 'paused') {
                    this.handleKeyPress({ code: 'Escape', preventDefault: () => {} });
                }
            }
            return;
        }
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Check if swipe is long enough
        if (Math.max(absDeltaX, absDeltaY) < minDistance) return;
        
        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0) {
                this.changeDirection(1, 0); // Right
            } else {
                this.changeDirection(-1, 0); // Left
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                this.changeDirection(0, 1); // Down
            } else {
                this.changeDirection(0, -1); // Up
            }
        }
    }
    
    handleKeyPress(e) {
        e.preventDefault();
        
        switch (e.code) {
            case 'Space':
                if (this.gameState === 'menu' || this.gameState === 'game_over') {
                    this.startGame();
                }
                break;
                
            case 'Escape':
                if (this.gameState === 'playing') {
                    this.pauseGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                }
                break;
                
            case 'ArrowUp':
                if (this.gameState === 'playing') {
                    this.changeDirection(0, -1);
                }
                break;
                
            case 'ArrowDown':
                if (this.gameState === 'playing') {
                    this.changeDirection(0, 1);
                }
                break;
                
            case 'ArrowLeft':
                if (this.gameState === 'playing') {
                    this.changeDirection(-1, 0);
                }
                break;
                
            case 'ArrowRight':
                if (this.gameState === 'playing') {
                    this.changeDirection(1, 0);
                }
                break;
        }
    }
    
    changeDirection(x, y) {
        // Prevent 180-degree turns (as per requirements)
        if (this.direction.x === -x && this.direction.y === -y) {
            return;
        }
        
        this.nextDirection = { x, y };
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.tickRate = this.TICK_MS_DEFAULT;
        
        // Initialize snake in center, moving right
        this.snake = [];
        const startX = Math.floor(this.GRID_SIZE / 2) - 1;
        const startY = Math.floor(this.GRID_SIZE / 2);
        
        for (let i = 0; i < this.INITIAL_LENGTH; i++) {
            this.snake.push({ x: startX - i, y: startY });
        }
        
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        this.spawnFood();
        this.updateUI();
        this.startGameLoop();
    }
    
    pauseGame() {
        this.gameState = 'paused';
        this.stopGameLoop();
        this.updateUI();
    }
    
    resumeGame() {
        this.gameState = 'playing';
        this.startGameLoop();
        this.updateUI();
    }
    
    gameOver() {
        this.gameState = 'game_over';
        this.stopGameLoop();
        
        // Mobile haptic feedback for game over
        this.vibrate([100, 50, 100]);
        
        // Check for high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            // Extra vibration for new high score
            this.vibrate([200, 100, 200, 100, 200]);
        }
        
        this.saveScore();
        this.updateUI();
        this.loadHighScores();
    }
    
    startGameLoop() {
        this.stopGameLoop();
        this.gameLoop = setInterval(() => this.tick(), this.tickRate);
    }
    
    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    tick() {
        if (this.gameState !== 'playing') return;
        
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Move snake
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.GRID_SIZE || 
            head.y < 0 || head.y >= this.GRID_SIZE) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 1;
            this.spawnFood();
            this.updateUI();
            
            // Mobile haptic feedback for eating food
            this.vibrate([30]);
            
            // Optional speedup (disabled as per requirements)
            // this.tickRate = Math.max(this.TICK_MS_MIN, this.tickRate - 2);
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
        
        this.draw();
    }
    
    spawnFood() {
        // Get all empty cells
        const emptyCells = [];
        for (let x = 0; x < this.GRID_SIZE; x++) {
            for (let y = 0; y < this.GRID_SIZE; y++) {
                if (!this.snake.some(segment => segment.x === x && segment.y === y)) {
                    emptyCells.push({ x, y });
                }
            }
        }
        
        // Spawn food on random empty cell
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            this.food = emptyCells[randomIndex];
        }
    }
    
    draw() {
        // Clear canvas with Nokia LCD green background
        this.ctx.fillStyle = '#9bb654';
        this.ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
        
        // Draw grid lines (subtle)
        this.ctx.strokeStyle = '#7a9a42';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.GRID_SIZE; i++) {
            const pos = i * this.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.CANVAS_SIZE);
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.CANVAS_SIZE, pos);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.ctx.fillStyle = '#2a3d1a';
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.CELL_SIZE;
            const y = segment.y * this.CELL_SIZE;
            
            if (index === 0) {
                // Snake head - slightly different style
                this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                
                // Draw eyes
                this.ctx.fillStyle = '#9bb654';
                const eyeSize = 2;
                const eyeOffset = 4;
                
                if (this.direction.x === 1) { // Moving right
                    this.ctx.fillRect(x + this.CELL_SIZE - eyeOffset, y + 3, eyeSize, eyeSize);
                    this.ctx.fillRect(x + this.CELL_SIZE - eyeOffset, y + this.CELL_SIZE - 5, eyeSize, eyeSize);
                } else if (this.direction.x === -1) { // Moving left
                    this.ctx.fillRect(x + 2, y + 3, eyeSize, eyeSize);
                    this.ctx.fillRect(x + 2, y + this.CELL_SIZE - 5, eyeSize, eyeSize);
                } else if (this.direction.y === -1) { // Moving up
                    this.ctx.fillRect(x + 3, y + 2, eyeSize, eyeSize);
                    this.ctx.fillRect(x + this.CELL_SIZE - 5, y + 2, eyeSize, eyeSize);
                } else { // Moving down
                    this.ctx.fillRect(x + 3, y + this.CELL_SIZE - eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(x + this.CELL_SIZE - 5, y + this.CELL_SIZE - eyeOffset, eyeSize, eyeSize);
                }
                
                this.ctx.fillStyle = '#2a3d1a';
            } else {
                // Snake body
                this.ctx.fillRect(x + 2, y + 2, this.CELL_SIZE - 4, this.CELL_SIZE - 4);
            }
        });
        
        // Draw food
        if (this.gameState === 'playing' || this.gameState === 'paused') {
            this.ctx.fillStyle = '#2a3d1a';
            const foodX = this.food.x * this.CELL_SIZE;
            const foodY = this.food.y * this.CELL_SIZE;
            const center = this.CELL_SIZE / 2;
            const radius = center - 3;
            
            this.ctx.beginPath();
            this.ctx.arc(foodX + center, foodY + center, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
        
        // Mobile-friendly text
        const isMobile = this.isMobile;
        
        switch (this.gameState) {
            case 'menu':
                this.gameStateElement.textContent = isMobile ? 
                    'Tap game area or press OK to start' : 
                    'Press SPACE to start';
                break;
            case 'playing':
                this.gameStateElement.textContent = isMobile ? 
                    'Playing... Tap ESC to pause' : 
                    'Playing... ESC to pause';
                break;
            case 'paused':
                this.gameStateElement.textContent = isMobile ? 
                    'PAUSED - Tap ESC to resume' : 
                    'PAUSED - ESC to resume';
                break;
            case 'game_over':
                this.gameStateElement.textContent = isMobile ? 
                    `Game Over! Score: ${this.score} - Tap OK to restart` : 
                    `Game Over! Score: ${this.score} - SPACE to restart`;
                break;
        }
    }
    
    // High Score Management
    loadHighScore() {
        const saved = localStorage.getItem('snake.highscore.v1');
        return saved ? parseInt(saved) : 0;
    }
    
    saveHighScore() {
        localStorage.setItem('snake.highscore.v1', this.highScore.toString());
    }
    
    loadHighScores() {
        const saved = localStorage.getItem('snake.highscores.v1');
        const scores = saved ? JSON.parse(saved) : [];
        
        this.scoresListElement.innerHTML = '';
        
        if (scores.length === 0) {
            this.scoresListElement.innerHTML = '<div class="score-entry">No scores yet</div>';
            return;
        }
        
        scores.slice(0, 10).forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = 'score-entry';
            div.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
            this.scoresListElement.appendChild(div);
        });
    }
    
    saveScore() {
        if (this.score === 0) return;
        
        const saved = localStorage.getItem('snake.highscores.v1');
        let scores = saved ? JSON.parse(saved) : [];
        
        // Get player name (simplified - could add input dialog)
        const playerName = 'YOU';
        
        scores.push({
            name: playerName,
            score: this.score,
            date: new Date().toISOString()
        });
        
        // Sort by score descending and keep top 10
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);
        
        localStorage.setItem('snake.highscores.v1', JSON.stringify(scores));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.snakeGame = new SnakeGame();
});
