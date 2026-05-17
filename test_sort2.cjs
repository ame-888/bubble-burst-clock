function calculateScores(item, keys, method, globalHardestKey) {
    const rawVals = keys.map(k => {
        let v = item[k];
        if (v === 'INVALID') return { val: 0, isAttempted: true };
        if (v === 'UNAVAILABLE') return { val: 0, isAttempted: false };
        if (typeof v === 'number') return { val: v, isAttempted: true };
        return { val: 0, isAttempted: false };
    });

    if (method === 'baseline') {
        return rawVals.map(r => r.val);
    } else if (method === 'average') {
        let sum = 0;
        let attemptedCount = 0;
        rawVals.forEach(r => {
            if (r.isAttempted) {
                sum += r.val;
                attemptedCount++;
            }
        });
        return attemptedCount > 0 ? sum / attemptedCount : 0;
    } else if (method === 'crucible') {
        return rawVals.reduce((sum, r, i) => sum + (r.isAttempted ? r.val * (i + 1) : 0), 0);
    } else if (method === 'resilience') {
        const lvl1 = rawVals[0];
        if (!lvl1.isAttempted) return 'UNKNOWN';
        if (lvl1.val === 0) return 0;

        if (!globalHardestKey) return 'UNKNOWN';

        const hardestVal = item[globalHardestKey];
        if (hardestVal === 'UNAVAILABLE' || (typeof hardestVal !== 'number' && hardestVal !== 'INVALID')) {
            return 'UNKNOWN';
        }
        const hardestScore = hardestVal === 'INVALID' ? 0 : hardestVal;

        return (hardestScore / lvl1.val) * 100;
    }
    return 0;
}

const mockItem1 = { name: 'Z', lvl1: 0, lvl2: 10 };
const mockItem2 = { name: 'Y', lvl1: 'INVALID', lvl2: 10 };
const keys = ['lvl1', 'lvl2'];
console.log('Z:', calculateScores(mockItem1, keys, 'resilience', 'lvl2'));
console.log('Y:', calculateScores(mockItem2, keys, 'resilience', 'lvl2'));
