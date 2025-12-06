import { predictions } from '../data/predictions';

// Match the simulated date in index.astro
const SIMULATED_NOW = new Date('2025-12-03T00:00:00Z');

class BettingManager {
    constructor() {
        this.bets = {};
        this.init();
    }

    init() {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem('user_bets');
            if (saved) {
                this.bets = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load bets', e);
        }
    }

    getBet(id) {
        return this.bets[id] || null;
    }

    placeBet(id, type) {
        if (typeof window === 'undefined') return;

        // type should be 'correct' or 'incorrect'
        // 'correct' = User thinks claim will happen (Success)
        // 'incorrect' = User thinks claim will fail (Expire)

        // Toggle logic: if clicking same bet, remove it
        if (this.bets[id] === type) {
            delete this.bets[id];
        } else {
            this.bets[id] = type;
        }

        this.save();
        this.checkAchievements();

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('bets-updated'));
    }

    save() {
        try {
            localStorage.setItem('user_bets', JSON.stringify(this.bets));
        } catch (e) {
            console.error('Failed to save bets', e);
        }
    }

    // Calculate stats based on current bets and prediction statuses
    getStats() {
        let totalBets = 0;
        let pending = 0;
        let resolved = 0;
        let wins = 0;
        let losses = 0;

        const betIds = Object.keys(this.bets);
        totalBets = betIds.length;

        betIds.forEach(id => {
            const prediction = predictions.find(p => p.id === id);
            if (!prediction) return; // Should not happen

            const status = this.getPredictionStatus(prediction);
            const userBet = this.bets[id];

            if (status === 'FUTURE PREDICTION' || status === 'ACTIVE') {
                pending++;
            } else {
                resolved++;
                // Resolution Logic
                // If Status is EXPIRED -> Claim Failed -> 'incorrect' bet WINS
                // If Status is SUCCESS (hypothetically) -> Claim True -> 'correct' bet WINS

                // Currently only 'EXPIRED' exists as a terminal state
                if (status === 'EXPIRED') {
                    if (userBet === 'incorrect') wins++;
                    else losses++;
                } else if (status === 'SUCCESS') {
                     if (userBet === 'correct') wins++;
                     else losses++;
                }
            }
        });

        return {
            totalBets,
            pending,
            resolved,
            wins,
            losses,
            winRate: resolved > 0 ? Math.round((wins / resolved) * 100) : 0
        };
    }

    getPredictionStatus(p) {
        const start = p.validityStart ? new Date(p.validityStart) : null;
        const end = p.validityEnd ? new Date(p.validityEnd) : null;
        const now = SIMULATED_NOW;

        if (start && end) {
            if (now < start) {
                return 'FUTURE PREDICTION';
            } else if (now >= start && now <= end) {
                return 'ACTIVE';
            } else {
                return 'EXPIRED';
            }
        }
        return 'FUTURE PREDICTION'; // Fallback
    }

    checkAchievements() {
        if (typeof window === 'undefined' || !window.AchievementManager) return;

        const stats = this.getStats();

        // Placing bets
        if (stats.totalBets >= 1) window.AchievementManager.unlock('first_bet');
        if (stats.totalBets >= 5) window.AchievementManager.unlock('market_mover');
        if (stats.totalBets >= 10) window.AchievementManager.unlock('hedge_fund');

        // Winning (requires resolved bets)
        if (stats.wins >= 1) window.AchievementManager.unlock('first_win');
        if (stats.wins >= 10) window.AchievementManager.unlock('oracle');

        // Check for "All In" Patterns
        this.checkPatterns(stats);
    }

    checkPatterns(stats) {
        if (stats.totalBets < 5) return; // Need a minimum sample size

        const betValues = Object.values(this.bets);
        const allIncorrect = betValues.every(v => v === 'incorrect');
        const allCorrect = betValues.every(v => v === 'correct');

        if (allIncorrect) {
            window.AchievementManager.unlock('skeptic_supreme');
        }

        if (allCorrect) {
            window.AchievementManager.unlock('doomer_king');
        }
    }
}

export const bettingManager = new BettingManager();

if (typeof window !== 'undefined') {
    window.BettingManager = bettingManager;
}
