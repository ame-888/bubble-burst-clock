import { achievements } from '../data/achievements';

class AchievementManager {
    constructor() {
        this.unlocked = new Set();
        this.sessionData = {
            clicks: 0,
            languageChanges: 0,
            startTime: Date.now()
        };
        this.audioContext = null;
        this.init();
    }

    init() {
        if (typeof window === 'undefined') return;
        if (this.initialized) return;
        this.initialized = true;

        // Load unlocked achievements
        try {
            const saved = localStorage.getItem('achievements_unlocked');
            if (saved) {
                JSON.parse(saved).forEach(id => this.unlocked.add(id));
            }
        } catch (e) {
            console.error('Failed to load achievements', e);
        }

        // Check 'first_visit' immediately
        this.unlock('first_visit');

        // Start time tracker
        setInterval(() => this.checkTime(), 30000); // Check every 30s

        // Start Lottery
        this.startLottery();

        // Attach global listeners
        this.attachListeners();
    }

    attachListeners() {
        document.addEventListener('click', (e) => this.handleGlobalClick(e));

        // Listen for custom events
        window.addEventListener('language-changed', () => this.handleLanguageChange());
        window.addEventListener('game-center-opened', () => this.unlock('gamer'));
        window.addEventListener('clock-clicked', () => this.unlock('master_of_time'));
        window.addEventListener('bug-report-opened', () => this.unlock('bug_hunter'));
    }

    startLottery() {
        // 1/666 chance every 60 seconds
        setInterval(() => {
            if (Math.random() < (1 / 666)) {
                this.unlock('lucky_devil');
            }
        }, 60000);
    }

    handleGlobalClick(e) {
        this.sessionData.clicks++;
        if (this.sessionData.clicks >= 50) {
            this.unlock('serial_clicker');
        }

        // Initialize AudioContext on first interaction
        this.ensureAudioContext();
    }

    ensureAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API not supported", e);
            }
        }

        // Resume if suspended (common browser policy)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => console.error("Audio resume failed", e));
        }
    }

    handleLanguageChange() {
        this.sessionData.languageChanges++;
        if (this.sessionData.languageChanges >= 3) {
            this.unlock('polyglot');
        }
    }

    checkTime() {
        const elapsed = Date.now() - this.sessionData.startTime;
        if (elapsed > 5 * 60 * 1000) { // 5 minutes
            this.unlock('void_gazer');
        }
    }

    playUnlockSound() {
        this.ensureAudioContext();
        if (!this.audioContext) return;

        try {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            osc.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // "Nice popping sound" - High pitch short burst
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            osc.start();
            osc.stop(this.audioContext.currentTime + 0.15);
        } catch (e) {
            console.error("Error playing sound", e);
        }
    }

    unlock(id) {
        if (this.unlocked.has(id)) return;

        const achievement = achievements.find(a => a.id === id);
        if (!achievement) return;

        this.unlocked.add(id);
        this.save();
        this.playUnlockSound();
        this.showNotification(achievement);

        // Dispatch global event for instant UI updates
        window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id } }));

        this.checkCompletionist();
    }

    checkCompletionist() {
        // Exclude completionist itself to avoid recursion
        const allOthers = achievements.filter(a => a.id !== 'completionist');
        const allUnlocked = allOthers.every(a => this.unlocked.has(a.id));

        if (allUnlocked) {
            this.unlock('completionist');
        }
    }

    save() {
        try {
            localStorage.setItem('achievements_unlocked', JSON.stringify([...this.unlocked]));
        } catch (e) {
            console.error('Failed to save achievements', e);
        }
    }

    showNotification(achievement) {
        const container = document.getElementById('achievement-toast-container');
        if (!container) return; // Should be in Layout

        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.title}</div>
            </div>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 500); // Wait for fade out
        }, 5000);
    }
}

// Export singleton
export const achievementManager = new AchievementManager();

// Expose to window for inline scripts to use
if (typeof window !== 'undefined') {
    window.AchievementManager = achievementManager;
}
