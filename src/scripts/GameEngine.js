// --- GameEngine.js ---

// Utility Classes
export class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.lastPlayed = {};
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type) {
        if (!this.enabled) return;
        this.init();

        const now = this.ctx.currentTime;

        // Throttle check
        if (this.lastPlayed[type] && (now - this.lastPlayed[type] < 0.05)) {
            return;
        }
        this.lastPlayed[type] = now;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        switch (type) {
            case 'pop': // Bubble Pop
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'move': // Soft blip
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'score': // High ping
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'gameover': // Deep wobble
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(20, now + 1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0, now + 1);
                osc.start(now);
                osc.stop(now + 1);
                break;
        }
    }
}

export class MusicManager {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.timer = null;
        this.noteIndex = 0;
        this.tempo = 140;
        this.currentTrack = null;
        this.tracks = {
            tetris: {
                tempo: 140,
                notes: [
                    {f: 659.25, d: 1}, {f: 493.88, d: 0.5}, {f: 523.25, d: 0.5}, {f: 587.33, d: 1}, {f: 523.25, d: 0.5}, {f: 493.88, d: 0.5},
                    {f: 440.00, d: 1}, {f: 440.00, d: 0.5}, {f: 523.25, d: 0.5}, {f: 659.25, d: 1}, {f: 587.33, d: 0.5}, {f: 523.25, d: 0.5},
                    {f: 493.88, d: 1.5}, {f: 523.25, d: 0.5}, {f: 587.33, d: 1}, {f: 659.25, d: 1},
                    {f: 523.25, d: 1}, {f: 440.00, d: 1}, {f: 440.00, d: 2},
                ]
            },
            breakout: {
                tempo: 120,
                notes: [
                    {f: 130.81, d: 0.5}, {f: 196.00, d: 0.5}, {f: 261.63, d: 0.5}, {f: 311.13, d: 0.5},
                    {f: 261.63, d: 0.5}, {f: 196.00, d: 0.5}, {f: 130.81, d: 0.5}, {f: 0, d: 0.5},
                ]
            }
        };
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    playTrack(trackName) {
        this.stop();
        if (this.tracks[trackName]) {
            this.currentTrack = this.tracks[trackName];
            this.tempo = this.currentTrack.tempo;
            this.noteIndex = 0;
            this.isPlaying = true;
            this.init();
            this.playNext();
        }
    }

    stop() {
        this.isPlaying = false;
        if (this.timer) clearTimeout(this.timer);
        this.currentTrack = null;
    }

    playNext() {
        if (!this.isPlaying || !this.currentTrack) return;

        const note = this.currentTrack.notes[this.noteIndex];
        const beatLen = (60 / this.tempo) * 1000;
        const duration = note.d * beatLen;

        if (note.f > 0) {
            this.playTone(note.f, duration);
        }

        this.noteIndex = (this.noteIndex + 1) % this.currentTrack.notes.length;
        this.timer = setTimeout(() => this.playNext(), duration);
    }

    playTone(freq, dur) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur/1000);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + dur/1000);
    }
}

export class ScoreManager {
    constructor() {
        this.key = 'ai_arcade_scores';
    }

    getScores() {
        const defaults = { tetris: [], snake: [], breakout: [], tictactoe: 0, pool: [] };
        try {
            const stored = JSON.parse(localStorage.getItem(this.key));
            return { ...defaults, ...stored };
        } catch (e) {
            return defaults;
        }
    }

    saveScore(game, score) {
        const scores = this.getScores();
        let isHigh = false;

        if (game === 'tictactoe') {
            if (score > (scores.tictactoe || 0)) {
                scores.tictactoe = score;
                isHigh = true;
            }
        } else {
            if (!scores[game]) scores[game] = [];
            scores[game].push({ score, date: new Date().toISOString() });
            scores[game].sort((a, b) => b.score - a.score);
            scores[game] = scores[game].slice(0, 5);
            isHigh = scores[game].some(s => s.score === score);
        }

        try {
            localStorage.setItem(this.key, JSON.stringify(scores));
        } catch (e) { console.error('Score save failed', e); }

        return isHigh;
    }
}

// --- Game Logic ---

export const GameLogic = {
    // Snake
    snake: {
        init: (canvas) => {
             return {
                grid: 20,
                snake: [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}],
                dir: {x: 1, y: 0},
                nextDir: {x: 1, y: 0},
                food: GameLogic.snake.spawnFood(canvas),
                score: 0,
                speed: 100,
                timer: 0
            };
        },
        spawnFood: (canvas) => {
            const grid = 20;
            const cols = canvas.width / grid;
            const rows = canvas.height / grid;
            return {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            };
        },
        onKeyDown: (e, state, callbacks) => {
            const keys = { 'ArrowUp': {x:0,y:-1}, 'ArrowDown': {x:0,y:1}, 'ArrowLeft': {x:-1,y:0}, 'ArrowRight': {x:1,y:0} };
            const newDir = keys[e.key];
            if (newDir) {
                // Prevent 180 reverse
                if (newDir.x !== -state.dir.x && newDir.y !== -state.dir.y) {
                    state.nextDir = newDir;
                }
            }
            return state;
        },
        update: (dt, state, canvas, callbacks) => {
             state.timer += dt;
             if (state.timer < state.speed) return state;
             state.timer = 0;

             state.dir = state.nextDir;
             const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };
             const grid = state.grid;
             const cols = canvas.width / grid;
             const rows = canvas.height / grid;

             // Collision Check
             if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
                 state.snake.some(s => s.x === head.x && s.y === head.y)) {
                 callbacks.onGameOver(state.score);
                 return state;
             }

             state.snake.unshift(head);
             callbacks.playSound('move');

             if (head.x === state.food.x && head.y === state.food.y) {
                 state.score += 10;
                 callbacks.onScore(state.score);
                 callbacks.playSound('pop');
                 state.food = GameLogic.snake.spawnFood(canvas);
                 state.speed = Math.max(50, state.speed * 0.98);
             } else {
                 state.snake.pop();
             }
             return state;
        },
        draw: (ctx, state, canvas) => {
            const g = state.grid;
            // Food
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#F59E0B';
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(state.food.x * g + g/2, state.food.y * g + g/2, g/2 - 2, 0, Math.PI * 2);
            ctx.fill();

            // Snake
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#60A5FA';
            state.snake.forEach((seg, i) => {
                ctx.fillStyle = i === 0 ? '#FFFFFF' : '#60A5FA';
                ctx.beginPath();
                ctx.arc(seg.x * g + g/2, seg.y * g + g/2, g/2 - 1, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0;
        }
    },

    // Tetris
    tetris: {
        shapes: [
            [[1,1,1,1]],
            [[1,1],[1,1]],
            [[0,1,0],[1,1,1]],
            [[1,0,0],[1,1,1]],
            [[0,0,1],[1,1,1]],
            [[0,1,1],[1,1,0]],
            [[1,1,0],[0,1,1]]
        ],
        colors: ['#06B6D4', '#F59E0B', '#8B5CF6', '#3B82F6', '#F97316', '#10B981', '#EF4444'],
        init: (canvas) => {
            const state = {
                grid: 20,
                cols: 10,
                rows: 20,
                board: Array(20).fill().map(() => Array(10).fill(0)),
                score: 0,
                timer: 0,
                speed: 1000,
                piece: null
            };
            canvas.width = state.cols * state.grid;
            canvas.height = state.rows * state.grid;
            state.piece = GameLogic.tetris.spawnPiece(state);
            return state;
        },
        spawnPiece: (state) => {
             const id = Math.floor(Math.random() * GameLogic.tetris.shapes.length);
             return {
                 shape: GameLogic.tetris.shapes[id],
                 color: GameLogic.tetris.colors[id],
                 x: 3,
                 y: 0
             };
        },
        rotate: (piece) => {
            const shape = piece.shape;
            const N = shape.length;
            const M = shape[0].length;
            const newShape = Array(M).fill().map(() => Array(N).fill(0));
            for (let y = 0; y < N; y++) {
                for (let x = 0; x < M; x++) {
                    newShape[x][N - 1 - y] = shape[y][x];
                }
            }
            return { ...piece, shape: newShape };
        },
        checkCollide: (state, offX=0, offY=0, shape=null) => {
            const s = shape || state.piece.shape;
            const px = state.piece.x + offX;
            const py = state.piece.y + offY;

            for (let y = 0; y < s.length; y++) {
                for (let x = 0; x < s[y].length; x++) {
                    if (s[y][x]) {
                        const bx = px + x;
                        const by = py + y;
                        if (bx < 0 || bx >= state.cols || by >= state.rows) return true;
                        if (by >= 0 && state.board[by][bx]) return true;
                    }
                }
            }
            return false;
        },
        onKeyDown: (e, state, callbacks) => {
            if (!state.piece) return state;

            if (e.key === 'ArrowLeft') {
                if (!GameLogic.tetris.checkCollide(state, -1, 0)) {
                    state.piece.x--;
                    callbacks.playSound('move');
                }
            } else if (e.key === 'ArrowRight') {
                if (!GameLogic.tetris.checkCollide(state, 1, 0)) {
                    state.piece.x++;
                    callbacks.playSound('move');
                }
            } else if (e.key === 'ArrowDown') {
                 if (!GameLogic.tetris.checkCollide(state, 0, 1)) {
                    state.piece.y++;
                    callbacks.playSound('move');
                }
            } else if (e.key === 'ArrowUp') {
                const rotated = GameLogic.tetris.rotate(state.piece);
                if (!GameLogic.tetris.checkCollide(state, 0, 0, rotated.shape)) {
                    state.piece = rotated;
                    callbacks.playSound('move');
                }
            }
            return state;
        },
        update: (dt, state, canvas, callbacks) => {
            state.timer += dt;
            if (state.timer > state.speed) {
                state.timer = 0;
                if (!GameLogic.tetris.checkCollide(state, 0, 1)) {
                    state.piece.y++;
                } else {
                    // Lock
                    if (state.piece.y <= 0) {
                         callbacks.onGameOver(state.score);
                         return state;
                    }

                    const p = state.piece;
                    p.shape.forEach((row, y) => {
                        row.forEach((val, x) => {
                            if (val && p.y + y >= 0) {
                                state.board[p.y + y][p.x + x] = p.color;
                            }
                        });
                    });

                    // Lines
                    let lines = 0;
                    for (let y = state.rows - 1; y >= 0; y--) {
                        if (state.board[y].every(c => c !== 0)) {
                            state.board.splice(y, 1);
                            state.board.unshift(Array(state.cols).fill(0));
                            lines++;
                            y++;
                        }
                    }

                    if (lines > 0) {
                        state.score += lines * 100;
                        callbacks.onScore(state.score);
                        callbacks.playSound('score');
                        state.speed *= 0.95;
                    } else {
                        callbacks.playSound('pop');
                    }
                    state.piece = GameLogic.tetris.spawnPiece(state);
                    if (GameLogic.tetris.checkCollide(state)) {
                        callbacks.onGameOver(state.score);
                    }
                }
            }
            return state;
        },
        draw: (ctx, state, canvas) => {
            const g = state.grid;
            ctx.strokeStyle = '#1F2937';
            ctx.lineWidth = 1;
            for(let x=0; x<=canvas.width; x+=g) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }

            // Board
            state.board.forEach((row, y) => {
                row.forEach((color, x) => {
                    if (color) GameLogic.tetris.drawBubble(ctx, x, y, color, false, g);
                });
            });
            // Piece
            if (state.piece) {
                state.piece.shape.forEach((row, y) => {
                    row.forEach((val, x) => {
                        if (val) GameLogic.tetris.drawBubble(ctx, state.piece.x + x, state.piece.y + y, state.piece.color, true, g);
                    });
                });
            }
        },
        drawBubble: (ctx, gx, gy, color, active, g) => {
            const x = gx * g + g/2;
            const y = gy * g + g/2;
            const r = g/2 - 2;
            ctx.fillStyle = color;
            ctx.shadowBlur = active ? 10 : 0;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    },

    // Breakout
    breakout: {
        init: (canvas) => {
            const cols = 8;
            const rows = 5;
            const padding = 10;
            const w = (canvas.width - padding * (cols + 1)) / cols;
            const h = 20;
            const colors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6'];
            const bricks = [];
            for(let c=0; c<cols; c++) {
                for(let r=0; r<rows; r++) {
                    bricks.push({
                        x: padding + c * (w + padding),
                        y: padding + r * (h + padding) + 40,
                        w: w, h: h,
                        color: colors[r % colors.length],
                        active: true
                    });
                }
            }
            return {
                paddle: { x: canvas.width / 2 - 40, y: canvas.height - 30, w: 80, h: 10 },
                ball: { x: canvas.width/2, y: canvas.height/2, r: 6, dx: 3, dy: -3 },
                bricks: bricks,
                score: 0,
                cleared: false
            };
        },
        update: (dt, state, canvas, callbacks, input) => {
            const p = state.paddle;
            const b = state.ball;
            const paddleSpeed = 0.5 * dt;

            if (input.keys['ArrowLeft']) p.x = Math.max(0, p.x - paddleSpeed);
            if (input.keys['ArrowRight']) p.x = Math.min(canvas.width - p.w, p.x + paddleSpeed);

            b.x += b.dx;
            b.y += b.dy;

            // Walls
            if (b.x + b.r > canvas.width || b.x - b.r < 0) { b.dx = -b.dx; callbacks.playSound('move'); }
            if (b.y - b.r < 0) { b.dy = -b.dy; callbacks.playSound('move'); }
            if (b.y + b.r > canvas.height) { callbacks.onGameOver(state.score); return state; }

            // Paddle
            if (b.y + b.r > p.y && b.y - b.r < p.y + p.h && b.x > p.x && b.x < p.x + p.w) {
                b.dy = -Math.abs(b.dy);
                b.dx += (b.x - (p.x + p.w/2)) * 0.1;
                callbacks.playSound('move');
            }

            // Bricks
            let active = 0;
            state.bricks.forEach(brick => {
                if (!brick.active) return;
                active++;
                if (b.x > brick.x && b.x < brick.x + brick.w &&
                    b.y > brick.y && b.y < brick.y + brick.h) {
                    brick.active = false;
                    b.dy = -b.dy;
                    state.score += 10;
                    callbacks.onScore(state.score);
                    callbacks.playSound('pop');
                }
            });

            if (active === 0) {
                state.cleared = true;
                callbacks.onGameOver(state.score + 1000);
            }
            return state;
        },
        draw: (ctx, state) => {
             const p = state.paddle;
             ctx.shadowBlur = 10;
             ctx.shadowColor = '#60A5FA';
             ctx.fillStyle = '#60A5FA';
             ctx.fillRect(p.x, p.y, p.w, p.h);

             const b = state.ball;
             ctx.fillStyle = '#FFFFFF';
             ctx.beginPath();
             ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
             ctx.fill();

             state.bricks.forEach(brick => {
                 if (!brick.active) return;
                 ctx.shadowColor = brick.color;
                 ctx.fillStyle = brick.color;
                 ctx.beginPath();
                 ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 5);
                 ctx.fill();
             });
             ctx.shadowBlur = 0;
        }
    },

    // Tic Tac Toe
    tictactoe: {
        init: (canvas) => {
             return {
                board: Array(9).fill(null),
                player: 'X',
                streak: 0,
                winner: null,
                hardMode: false
            };
        },
        handleClick: (e, state, canvas, callbacks) => {
            if (state.winner || state.player !== 'X') return state;

            // Adjust coordinates based on canvas display size vs internal size
            const rect = canvas.getBoundingClientRect();
            // Scaling factor: internal width / display width
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = e.offsetX * scaleX;
            const y = e.offsetY * scaleY;

            const cellW = canvas.width / 3;
            const cellH = canvas.height / 3;

            const col = Math.floor(x / cellW);
            const row = Math.floor(y / cellH);
            const idx = row * 3 + col;

            if (col < 0 || col > 2 || row < 0 || row > 2) return state;

            if (state.board[idx] === null) {
                state.board[idx] = 'X';
                callbacks.playSound('pop');
                GameLogic.tictactoe.checkWin(state, callbacks);
                if (!state.winner) {
                    state.player = 'O';
                    setTimeout(() => GameLogic.tictactoe.cpuMove(state, callbacks), 500);
                }
            }
            return state;
        },
        cpuMove: (state, callbacks) => {
             if (state.winner) return;

             let move = -1;

             // Invincible Mode (Minimax)
             if (state.hardMode) {
                move = GameLogic.tictactoe.minimax(state.board, 'O').index;
             } else {
                // Challenging Mode
                // 1. Can CPU win?
                const winMove = GameLogic.tictactoe.findBestMove(state.board, 'O');
                if (winMove !== -1) {
                    move = winMove;
                } else {
                    // 2. Can Player win? Block it.
                    const blockMove = GameLogic.tictactoe.findBestMove(state.board, 'X');
                    if (blockMove !== -1) {
                        // 20% chance to make a mistake and not block
                        if (Math.random() > 0.2) move = blockMove;
                    }
                }
                // 3. Random if no immediate threat/win
                if (move === -1) {
                    const empty = state.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
                    if (empty.length > 0) {
                        move = empty[Math.floor(Math.random() * empty.length)];
                    }
                }
             }

             if (move !== -1) {
                 state.board[move] = 'O';
                 callbacks.playSound('move');
                 GameLogic.tictactoe.checkWin(state, callbacks);
                 if (!state.winner) state.player = 'X';
             }
        },
        findBestMove: (board, player) => {
            const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = player;
                    let win = false;
                    for(let w of wins) {
                        const [a,b,c] = w;
                        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                            win = true;
                            break;
                        }
                    }
                    board[i] = null; // Backtrack
                    if (win) return i;
                }
            }
            return -1;
        },
        minimax: (board, player) => {
            const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);

            // Check Terminal States
            const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for (let w of wins) {
                const [a,b,c] = w;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return { score: board[a] === 'O' ? 10 : -10 };
                }
            }
            if (empty.length === 0) return { score: 0 };

            const moves = [];
            for (let i = 0; i < empty.length; i++) {
                const idx = empty[i];
                const move = {};
                move.index = idx;
                board[idx] = player;

                if (player === 'O') {
                    const result = GameLogic.tictactoe.minimax(board, 'X');
                    move.score = result.score;
                } else {
                    const result = GameLogic.tictactoe.minimax(board, 'O');
                    move.score = result.score;
                }
                board[idx] = null;
                moves.push(move);
            }

            let bestMove;
            if (player === 'O') {
                let bestScore = -10000;
                for(let i=0; i<moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else {
                let bestScore = 10000;
                for(let i=0; i<moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        },
        checkWin: (state, callbacks) => {
             const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
             for (let w of wins) {
                const [a,b,c] = w;
                if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
                    state.winner = state.board[a];
                    if (state.winner === 'X') {
                        state.streak++;
                        callbacks.onScore(state.streak);
                        callbacks.playSound('score');

                        // Check for Streak 7 Trigger
                        if (state.streak === 7 && !state.hardMode) {
                            state.hardMode = true;
                            if (callbacks.onCutscene) callbacks.onCutscene();
                        }

                        setTimeout(() => {
                            state.board.fill(null);
                            state.winner = null;
                            state.player = 'X';
                        }, 1000);
                    } else {
                        // AI Wins - Reset Streak
                        callbacks.onGameOver(state.streak);
                    }
                    return;
                }
             }
             if (!state.board.includes(null)) {
                 // Draw - Continue Streak
                 state.winner = 'draw';
                 setTimeout(() => {
                    state.board.fill(null);
                    state.winner = null;
                    state.player = 'X';
                }, 1000);
             }
        },
        draw: (ctx, state, canvas) => {
            const w = canvas.width / 3;
            const h = canvas.height / 3;
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.strokeStyle = state.hardMode ? '#EF4444' : '#374151'; // Red border in hard mode
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(w, 0); ctx.lineTo(w, canvas.height);
            ctx.moveTo(w*2, 0); ctx.lineTo(w*2, canvas.height);
            ctx.moveTo(0, h); ctx.lineTo(canvas.width, h);
            ctx.moveTo(0, h*2); ctx.lineTo(canvas.width, h*2);
            ctx.stroke();

            state.board.forEach((cell, i) => {
                if (!cell) return;
                const col = i % 3;
                const row = Math.floor(i / 3);
                const cx = col * w + w/2;
                const cy = row * h + h/2;
                ctx.shadowBlur = 20;
                if (cell === 'X') {
                    ctx.fillStyle = '#3B82F6';
                    ctx.shadowColor = '#3B82F6';
                } else {
                    ctx.fillStyle = '#EF4444';
                    ctx.shadowColor = '#EF4444';
                }
                ctx.beginPath();
                ctx.arc(cx, cy, w/3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
    },

    // Pool
    pool: {
        init: (canvas) => {
            const w = canvas.width;
            const h = canvas.height;
            // 15 balls + cue ball
            const balls = [];
            const r = 10;
            const startX = w * 0.75;
            const startY = h / 2;

            // Rack of 15
            let count = 0;
            for(let col=0; col<5; col++) {
                for(let row=0; row<=col; row++) {
                    // Slight gap added (r * 2.1 instead of r * 2) to prevent instant collision on spawn
                    const x = startX + col * (r * 2.1 * 0.866);
                    const y = startY - (col * r * 1.05) + (row * r * 2.1);
                    // Color logic: 1-7 solid, 8 black, 9-15 stripe
                    // Simplification: Just different colors
                    balls.push({
                        x: x, y: y, vx: 0, vy: 0, r: r,
                        color: count === 4 ? '#111827' : (count % 2 === 0 ? '#EF4444' : '#3B82F6'), // 8-ball black, others Red/Blue
                        id: count,
                        active: true
                    });
                    count++;
                }
            }

            return {
                balls: balls,
                cueBall: { x: w * 0.25, y: h/2, vx: 0, vy: 0, r: r, color: '#FFFFFF', active: true },
                dragging: false,
                power: 0,
                angle: 0,
                turn: 'player', // or 'ai'
                vsAI: false, // toggled via UI
                stopped: true,
                score: 0,
                shots: 0,
                gameOver: false
            };
        },
        handleMouseDown: (e, state, canvas) => {
            if (!state.stopped || (state.turn === 'ai' && state.vsAI) || state.gameOver) return state;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mx = e.offsetX * scaleX;
            const my = e.offsetY * scaleY;

            // Check if clicking near cue ball
            const dx = mx - state.cueBall.x;
            const dy = my - state.cueBall.y;
            if (dx*dx + dy*dy < 2000) { // Reasonable radius
                state.dragging = true;
            }
            return state;
        },
        handleMouseMove: (e, state, canvas) => {
            if (state.dragging) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const mx = e.offsetX * scaleX;
                const my = e.offsetY * scaleY;

                const dx = mx - state.cueBall.x;
                const dy = my - state.cueBall.y;
                state.angle = Math.atan2(dy, dx);
                const dist = Math.sqrt(dx*dx + dy*dy);
                state.power = Math.min(dist, 200) / 4; // Max power 50
            }
            return state;
        },
        handleMouseUp: (e, state, canvas, callbacks) => {
            if (state.dragging) {
                state.dragging = false;
                // Shoot
                const speed = state.power; // multiplier
                state.cueBall.vx = Math.cos(state.angle + Math.PI) * speed; // Pull back to shoot forward
                state.cueBall.vy = Math.sin(state.angle + Math.PI) * speed;
                state.stopped = false;
                state.shots++;
                callbacks.playSound('move');

                // If vs AI, next turn will be AI after stop
            }
            return state;
        },
        update: (dt, state, canvas, callbacks, input) => {
             if (state.gameOver) return state;

             // Physics Sub-steps for stability
             const steps = 4;
             const subDt = 1 / steps;

             let movement = false;
             const friction = 0.985;
             const wallBounce = 0.8;

             const allBalls = [state.cueBall, ...state.balls];

             for(let s=0; s<steps; s++) {
                 for(let b of allBalls) {
                     if (!b.active && b !== state.cueBall) continue;

                     if (Math.abs(b.vx) > 0.05 || Math.abs(b.vy) > 0.05) {
                         b.x += b.vx * subDt;
                         b.y += b.vy * subDt;
                         b.vx *= friction;
                         b.vy *= friction;
                         movement = true;
                     } else {
                         b.vx = 0; b.vy = 0;
                     }

                     // Walls
                     if (b.x < b.r) { b.x = b.r; b.vx = -b.vx * wallBounce; }
                     if (b.x > canvas.width - b.r) { b.x = canvas.width - b.r; b.vx = -b.vx * wallBounce; }
                     if (b.y < b.r) { b.y = b.r; b.vy = -b.vy * wallBounce; }
                     if (b.y > canvas.height - b.r) { b.y = canvas.height - b.r; b.vy = -b.vy * wallBounce; }

                     // Pockets (Simple corners)
                     // If close to corner, pot it
                     const corners = [
                         {x:0, y:0}, {x:canvas.width/2, y:0}, {x:canvas.width, y:0},
                         {x:0, y:canvas.height}, {x:canvas.width/2, y:canvas.height}, {x:canvas.width, y:canvas.height}
                     ];
                     const pocketR = 25;

                     for(let p of corners) {
                         const dx = b.x - p.x;
                         const dy = b.y - p.y;
                         if (dx*dx + dy*dy < pocketR*pocketR) {
                             if (b === state.cueBall) {
                                 // Scratch
                                 b.x = canvas.width * 0.25;
                                 b.y = canvas.height / 2;
                                 b.vx = 0; b.vy = 0;
                                 callbacks.playSound('gameover'); // Bad sound
                             } else {
                                 b.active = false; // Potted
                                 // Remove from array or mark inactive
                                 const idx = state.balls.indexOf(b);
                                 if (idx > -1) state.balls.splice(idx, 1);
                                 state.score += 100;
                                 callbacks.onScore(state.score);
                                 callbacks.playSound('pop');
                             }
                         }
                     }
                 }

                 // Collisions
                 for(let i=0; i<allBalls.length; i++) {
                     for(let j=i+1; j<allBalls.length; j++) {
                         const b1 = allBalls[i];
                         const b2 = allBalls[j];
                         // Skip if ball removed
                         if (state.balls.indexOf(b1) === -1 && b1 !== state.cueBall) continue;
                         if (state.balls.indexOf(b2) === -1 && b2 !== state.cueBall) continue;

                         const dx = b2.x - b1.x;
                         const dy = b2.y - b1.y;
                         const dist = Math.sqrt(dx*dx + dy*dy);

                         if (dist < b1.r + b2.r) {
                             // Collision Response
                             const angle = Math.atan2(dy, dx);
                             const sin = Math.sin(angle);
                             const cos = Math.cos(angle);

                             // Rotate velocity
                             const vx1 = b1.vx * cos + b1.vy * sin;
                             const vy1 = b1.vy * cos - b1.vx * sin;
                             const vx2 = b2.vx * cos + b2.vy * sin;
                             const vy2 = b2.vy * cos - b2.vx * sin;

                             // Swap velocity (elastic)
                             const vx1Final = vx2;
                             const vx2Final = vx1;

                             // Update velocity
                             b1.vx = vx1Final * cos - vy1 * sin;
                             b1.vy = vy1 * cos + vx1Final * sin;
                             b2.vx = vx2Final * cos - vy2 * sin;
                             b2.vy = vy2 * cos + vx2Final * sin;

                             // Separate balls
                             const overlap = (b1.r + b2.r - dist) / 2;
                             b1.x -= overlap * Math.cos(angle);
                             b1.y -= overlap * Math.sin(angle);
                             b2.x += overlap * Math.cos(angle);
                             b2.y += overlap * Math.sin(angle);

                             callbacks.playSound('score'); // clack sound
                         }
                     }
                 }
             }

             if (!movement && !state.stopped) {
                 state.stopped = true;
                 if (state.vsAI && state.turn === 'player') {
                     state.turn = 'ai';
                     setTimeout(() => GameLogic.pool.aiTurn(state, callbacks), 500);
                 } else if (state.vsAI && state.turn === 'ai') {
                     state.turn = 'player';
                 }

                 if (state.balls.length === 0) {
                     state.gameOver = true;
                     callbacks.onGameOver(state.score);
                 }
             }

             return state;
        },
        aiTurn: (state, callbacks) => {
            // Simple AI: Find a target ball and shoot
            if (state.balls.length === 0) return;
            const target = state.balls[Math.floor(Math.random() * state.balls.length)];
            const dx = target.x - state.cueBall.x;
            const dy = target.y - state.cueBall.y;
            const angle = Math.atan2(dy, dx);

            state.cueBall.vx = Math.cos(angle) * 12; // Fixed power
            state.cueBall.vy = Math.sin(angle) * 12;
            state.stopped = false;
            callbacks.playSound('move');
        },
        draw: (ctx, state, canvas) => {
            // Felt
            ctx.fillStyle = '#064E3B'; // Dark Green
            ctx.fillRect(0,0,canvas.width, canvas.height);

            // Pockets
            const pocketR = 15;
            const corners = [
                 {x:0, y:0}, {x:canvas.width/2, y:0}, {x:canvas.width, y:0},
                 {x:0, y:canvas.height}, {x:canvas.width/2, y:canvas.height}, {x:canvas.width, y:canvas.height}
             ];
             corners.forEach(p => {
                 // Radial gradient for depth
                 const grad = ctx.createRadialGradient(p.x, p.y, pocketR * 0.2, p.x, p.y, pocketR);
                 grad.addColorStop(0, '#000');
                 grad.addColorStop(1, '#333');
                 ctx.fillStyle = grad;
                 ctx.beginPath();
                 ctx.arc(p.x, p.y, pocketR, 0, Math.PI*2);
                 ctx.fill();

                 // Rim
                 ctx.strokeStyle = '#4B5563';
                 ctx.lineWidth = 1;
                 ctx.stroke();
             });

             // Balls
             [...state.balls, state.cueBall].forEach(b => {
                 ctx.shadowBlur = 5;
                 ctx.shadowColor = 'rgba(0,0,0,0.5)';
                 ctx.fillStyle = b.color;
                 ctx.beginPath();
                 ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
                 ctx.fill();

                 // Shine
                 ctx.fillStyle = 'rgba(255,255,255,0.3)';
                 ctx.beginPath();
                 ctx.arc(b.x - b.r/3, b.y - b.r/3, b.r/3, 0, Math.PI*2);
                 ctx.fill();
                 ctx.shadowBlur = 0;

                 // Numbers
                 if (typeof b.id !== 'undefined') {
                     ctx.fillStyle = '#FFFFFF';
                     ctx.font = 'bold 10px Inter, sans-serif';
                     ctx.textAlign = 'center';
                     ctx.textBaseline = 'middle';
                     // +1 because ids start at 0
                     ctx.fillText(b.id + 1, b.x, b.y);
                 }
             });

             // Aim Line
             if (state.dragging && state.stopped && (state.turn === 'player' || !state.vsAI)) {
                 ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                 ctx.lineWidth = 2;
                 ctx.setLineDash([5, 5]);
                 ctx.beginPath();
                 ctx.moveTo(state.cueBall.x, state.cueBall.y);
                 const aimLength = 50 + state.power * 5; // Dynamic length based on power
                 const aimX = state.cueBall.x + Math.cos(state.angle + Math.PI) * aimLength;
                 const aimY = state.cueBall.y + Math.sin(state.angle + Math.PI) * aimLength;
                 ctx.lineTo(aimX, aimY);
                 ctx.stroke();
                 ctx.setLineDash([]);
             }
        }
    }
};
