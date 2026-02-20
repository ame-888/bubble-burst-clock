// src/scripts/TimeUtils.js

/**
 * Returns the current simulated date based on the real system time.
 * In this version, we align the simulation directly with the real world time,
 * as the application is now running in the target year (2026).
 * @returns {Date} The simulated date.
 */
export function getSimulatedDate() {
    return new Date();
}

// Export offset for potential client-side raw calcs (0 now)
export const TIME_OFFSET = 0;
