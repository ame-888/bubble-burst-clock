// src/scripts/TimeUtils.js

// Fixed Anchor for Real World (Assumed Today is roughly Feb 2025)
const REAL_ANCHOR = new Date('2025-02-18T00:00:00Z').getTime();

// Fixed Anchor for Simulated World (Starts Feb 18, 2026)
const SIM_ANCHOR = new Date('2026-02-18T00:00:00Z').getTime();

// Calculate the offset once (Approx 1 year)
const SIMULATED_OFFSET = SIM_ANCHOR - REAL_ANCHOR;

/**
 * Returns the current simulated date based on the real system time.
 * If the real system time is behind 2025 (e.g., 2024), it ensures the year is at least 2026.
 * @returns {Date} The simulated date.
 */
export function getSimulatedDate() {
    const realNow = Date.now();
    let simTime = realNow + SIMULATED_OFFSET;

    const simDate = new Date(simTime);

    // Safety check: Ensure we are at least in 2026
    // This handles cases where the real system clock is in 2024
    if (simDate.getUTCFullYear() < 2026) {
        simDate.setUTCFullYear(simDate.getUTCFullYear() + 1);
        simTime = simDate.getTime();
    }

    return new Date(simTime);
}

// Export offset for potential client-side raw calcs
export const TIME_OFFSET = SIMULATED_OFFSET;
