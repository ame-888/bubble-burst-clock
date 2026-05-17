const assert = require('assert');

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
        if (!lvl1.isAttempted || lvl1.val === 0) return 'UNKNOWN';
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

function sortAndRank(rawList, keys, method) {
    let list = [...rawList];

    let globalHardestKey = null;
    for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        const hasData = list.some(item => typeof item[key] === 'number' || item[key] === 'INVALID');
        if (hasData) {
            globalHardestKey = key;
            break;
        }
    }

    list.forEach(item => {
        const rawVals = keys.map(k => {
            let v = item[k];
            if (v === 'INVALID') return { val: 0, isAttempted: true };
            if (v === 'UNAVAILABLE') return { val: 0, isAttempted: false };
            if (typeof v === 'number') return { val: v, isAttempted: true };
            return { val: 0, isAttempted: false };
        });
        item.isTotalFail = rawVals.every(r => r.val === 0);
        item._sortValue = calculateScores(item, keys, method, globalHardestKey);
    });

    let sorted = list.sort((a, b) => {
        if (method === 'baseline') {
            for (const key of keys) {
                const valA = a[key];
                const valB = b[key];
                const numA = (valA === 'INVALID') ? 0 : (typeof valA === 'number' ? valA : 0);
                const numB = (valB === 'INVALID') ? 0 : (typeof valB === 'number' ? valB : 0);
                if (numB !== numA) return numB - numA;
            }
            return 0;
        } else if (method === 'resilience') {
            if (a._sortValue === 'UNKNOWN' && b._sortValue === 'UNKNOWN') return 0;
            if (a._sortValue === 'UNKNOWN') return 1;
            if (b._sortValue === 'UNKNOWN') return -1;
            return b._sortValue - a._sortValue;
        } else {
            return b._sortValue - a._sortValue;
        }
    });

    const unknownResilience = sorted.filter(i => i._sortValue === 'UNKNOWN');
    const nonUnknown = sorted.filter(i => i._sortValue !== 'UNKNOWN');

    const eligible = nonUnknown.filter(i => !i.isTotalFail);
    const fails = nonUnknown.filter(i => i.isTotalFail).sort((a,b) => a.name.localeCompare(b.name));

    const bottomFails = unknownResilience.sort((a,b) => a.name.localeCompare(b.name));

    let currentRank = 1;
    let previousItem = null;
    let rankedItems = [];

    eligible.forEach((item) => {
        if (previousItem !== null) {
            let isWorse = false;
            if (method === 'baseline') {
                for (const key of keys) {
                    const valA = item[key];
                    const prevA = previousItem[key];
                    const numA = (valA === 'INVALID') ? 0 : (typeof valA === 'number' ? valA : 0);
                    const prevNumA = (prevA === 'INVALID') ? 0 : (typeof prevA === 'number' ? prevA : 0);

                    if (numA < prevNumA) {
                        isWorse = true;
                        break;
                    } else if (numA > prevNumA) {
                        break;
                    }
                }
            } else {
                if (item._sortValue < previousItem._sortValue) {
                    isWorse = true;
                }
            }

            if (isWorse) {
                currentRank++;
            }
        }
        item.rank = currentRank;
        rankedItems.push(item);
        previousItem = item;
    });

    fails.forEach(item => {
        item.rank = 'INVALID';
        rankedItems.push(item);
    });

    bottomFails.forEach(item => {
        item.rank = '-';
        rankedItems.push(item);
    });

    return rankedItems;
}

const mockData = [
    { name: 'A', lvl1: 24, lvl2: 'UNAVAILABLE', lvl3: 'UNAVAILABLE' },
    { name: 'B', lvl1: 13, lvl2: 'INVALID', lvl3: 'INVALID' },
    { name: 'C', lvl1: 20, lvl2: 11, lvl3: 11 },
    { name: 'D', lvl1: 10, lvl2: 10, lvl3: 10 }
];

let res = sortAndRank(mockData, ['lvl1', 'lvl2', 'lvl3'], 'average');
console.log(res.map(i => `${i.name}: ${i._sortValue}`));
let resCrucible = sortAndRank(mockData, ['lvl1', 'lvl2', 'lvl3'], 'crucible');
console.log(resCrucible.map(i => `${i.name}: ${i._sortValue}`));
let resResilience = sortAndRank(mockData, ['lvl1', 'lvl2', 'lvl3'], 'resilience');
console.log(resResilience.map(i => `${i.name}: ${i._sortValue} (Rank: ${i.rank})`));
