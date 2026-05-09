import re

with open('src/pages/index.astro', 'r') as f:
    content = f.read()

new_computeRanks = """function computeRanks(items, scoreKeys) {
    const keys = Array.isArray(scoreKeys) ? scoreKeys : [scoreKeys];

    // 1. Sort
    let sorted = [...items].sort((a, b) => {
        // Human Baseline always on top if it exists, though score usually handles it
        if (a.name === 'Human Baseline') return -1;
        if (b.name === 'Human Baseline') return 1;

        for (const key of keys) {
            if (b[key] !== a[key]) {
                return b[key] - a[key];
            }
        }
        return 0;
    });

    // 2. Separate Zeroes
    // A model is an "EPIC FAIL" if ALL its scores for the provided keys are 0
    const eligible = sorted.filter(i => keys.some(key => i[key] > 0));
    const fails = sorted.filter(i => keys.every(key => i[key] === 0)).sort((a,b) => a.name.localeCompare(b.name));

    // 3. Assign ranks to eligible
    let currentRank = 1;
    let previousItem = null;
    let rankedItems = [];

    eligible.forEach((item) => {
        if (item.name === 'Human Baseline') {
            rankedItems.push({ ...item, rank: '-', isFail: false });
            return;
        }

        if (previousItem !== null) {
            let isWorse = false;
            for (const key of keys) {
                if (item[key] < previousItem[key]) {
                    isWorse = true;
                    break;
                } else if (item[key] > previousItem[key]) {
                    break;
                }
            }
            if (isWorse) {
                currentRank++;
            }
        }

        rankedItems.push({ ...item, rank: currentRank, isFail: false });
        previousItem = item;
    });

    // 4. Append Fails
    fails.forEach(item => {
        rankedItems.push({ ...item, rank: 'EPIC FAIL', isFail: true });
    });

    return rankedItems;
}"""

content = re.sub(r'function computeRanks\(items, scoreKey\) \{.*?(?=\n// --- Unify Benchmark Data for Visual Mode ---)', new_computeRanks + '\n\n', content, flags=re.DOTALL)

with open('src/pages/index.astro', 'w') as f:
    f.write(content)
