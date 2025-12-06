import { achievements } from '../data/achievements';

class AchievementManager {
    constructor() {
        this.unlocked = new Set();
        this.sessionData = {
            clicks: 0,
            languageChanges: 0,
            startTime: Date.now()
        };
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

    handleGlobalClick(e) {
        this.sessionData.clicks++;
        if (this.sessionData.clicks >= 50) {
            this.unlock('serial_clicker');
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

    unlock(id) {
        if (this.unlocked.has(id)) return;

        const achievement = achievements.find(a => a.id === id);
        if (!achievement) return;

        this.unlocked.add(id);
        this.save();
        this.showNotification(achievement);
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
