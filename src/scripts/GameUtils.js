
export class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    play(type) {
        if (!this.enabled) return;
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        switch (type) {
            case 'move': // Short blip
                osc.type = 'square';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'rotate': // Higher blip
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(550, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'drop': // Fast slide down
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;

            case 'clear': // Powerup sound
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.linearRampToValueAtTime(880, now + 0.1);
                osc.frequency.linearRampToValueAtTime(1760, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;

            case 'gameover': // Sad slide down
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(55, now + 1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
                osc.start(now);
                osc.stop(now + 1);
                break;

            case 'eat': // Quick high chirp
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'win': // Fanfare-ish
                this.playNote(523.25, now, 0.1); // C
                this.playNote(659.25, now + 0.1, 0.1); // E
                this.playNote(783.99, now + 0.2, 0.1); // G
                this.playNote(1046.50, now + 0.3, 0.4); // High C
                break;

            case 'click':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
        }
    }

    playNote(freq, time, duration) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc.start(time);
        osc.stop(time + duration);
    }
}

export class ScoreManager {
    constructor() {
        this.storageKey = 'arcade_highscores';
    }

    getScores() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {
                tetris: [],
                snake: [],
                tictactoe: 0 // Max streak
            };
        } catch (e) {
            return { tetris: [], snake: [], tictactoe: 0 };
        }
    }

    saveScore(game, score) {
        const scores = this.getScores();

        if (game === 'tictactoe') {
            // For TTT, score is the streak. Only save if higher.
            if (score > (scores.tictactoe || 0)) {
                scores.tictactoe = score;
                this.persist(scores);
                return true; // New High Score
            }
            return false;
        }

        // For list-based scores
        if (!scores[game]) scores[game] = [];

        scores[game].push({ score, date: new Date().toISOString() });
        scores[game].sort((a, b) => b.score - a.score);
        scores[game] = scores[game].slice(0, 5); // Keep top 5

        this.persist(scores);
        // Return true if this score made the top 5
        return scores[game].some(s => s.score === score);
    }

    persist(scores) {
        localStorage.setItem(this.storageKey, JSON.stringify(scores));
    }
}
