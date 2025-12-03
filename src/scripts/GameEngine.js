// --- GameEngine.js ---

// Utility Classes
export class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
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
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        switch (type) {
            case 'pop': // Bubble Pop
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'move': // Soft blip
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'score': // High ping
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'gameover': // Deep wobble
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(20, now + 1);
                gain.gain.setValueAtTime(0.1, now);
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
        const defaults = { tetris: [], snake: [], breakout: [], tictactoe: 0 };
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
                winner: null
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
             const empty = state.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
             if (empty.length > 0) {
                 const pick = empty[Math.floor(Math.random() * empty.length)];
                 state.board[pick] = 'O';
                 callbacks.playSound('move');
                 GameLogic.tictactoe.checkWin(state, callbacks);
                 if (!state.winner) state.player = 'X';
             }
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
                        setTimeout(() => {
                            state.board.fill(null);
                            state.winner = null;
                            state.player = 'X';
                        }, 1000);
                    } else {
                        callbacks.onGameOver(state.streak);
                    }
                    return;
                }
             }
             if (!state.board.includes(null)) {
                 // Draw
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
            ctx.strokeStyle = '#374151';
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
    }
};
