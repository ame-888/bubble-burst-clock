// Deterministic RPG Stats Generator and Logic for Players
export function getRPGStats(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const rng = (seed) => {
        const x = Math.sin(seed) * 10000;
        return Math.floor((Math.abs(x - Math.floor(x))) * 100); // 0-99
    };
    const scale = (val) => 10 + Math.floor(val * 0.89);

    return {
        STR: scale(rng(hash)),
        INT: scale(rng(hash + 1)),
        CHA: scale(rng(hash + 2)),
        LUCK: scale(rng(hash + 3))
    };
}

export function getPlayerCardData(creatorName, predictions = []) {
    // Calculate aggregate stats
    const total = predictions.length;
    let successes = 0;
    let failures = 0;

    // Use current date for status calculation if not provided in prediction objects
    // Note: This logic duplicates some status logic from players.astro but we assume predictions passed in have 'status' or we recalc here?
    // Ideally, predictions passed here should already be processed with status.
    // If not, we might miss status counts.

    // For simplicity, we trust the caller passes processed predictions or we recount based on status if present
    predictions.forEach(p => {
        if (p.status === 'EXPIRED') failures++;
        else if (p.status === 'SUCCESS') successes++; // Assuming 'SUCCESS' status exists or logical equivalent
        // Note: Logic in players.astro treated anything not EXPIRED or ACTIVE/FUTURE as success?
        // Actually: if (p.status === 'EXPIRED') failures++; else if (ACTIVE/FUTURE) pending++; else successes++;

        // Let's replicate the exact logic from players.astro if possible, but we don't have the date here easily without recalculating.
        // The caller should ideally pass the summary stats or the predictions array with statuses.
    });

    // However, players.astro calculates these first.
    // For the Favorite Player feature, we need to generate the "Card" properties (Class, Rarity, Color, Flavor).

    const stats = getRPGStats(creatorName);

    // Assign a "Class" based on stats or name
    let rpgClass = "Doomer"; // Default
    if (stats.INT > 85) rpgClass = "Technomancer";
    else if (stats.CHA > 85) rpgClass = "Cult Leader";
    else if (stats.STR > 85) rpgClass = "Bubble Burster";
    else if (stats.LUCK > 85) rpgClass = "Oracle";

    // Rarity Map
    const rarityMap = {
        "Gary Marcus": "Legendary",
        "O Primo Rico": "Legendary",
        "Sabine Hossenfelder": "Legendary",
        "Adam Conover": "Epic",
        "Brianne Worth": "Epic",
        "Cole Hastings": "Epic",
        "Man Carrying Thing": "Epic",
        "Georg Rockall-Schmidt": "Epic",
        "Sasha Yanshin": "Epic",
        "OverEasy": "Rare",
        "Shade of Code": "Rare"
    };

    const rarity = rarityMap[creatorName] || "Common";

    // MTG Color Mapping
    let mtgColor = "white"; // Doomer/Default
    if (rpgClass === "Technomancer") mtgColor = "blue";
    else if (rpgClass === "Cult Leader") mtgColor = "black";
    else if (rpgClass === "Bubble Burster") mtgColor = "red";
    else if (rpgClass === "Oracle") mtgColor = "green";

    // Flavor Text
    const flavorTextMap = {
        "Technomancer": "Logic is a prison waiting to be broken.",
        "Cult Leader": "Belief is the only currency that matters.",
        "Bubble Burster": "Reality has a way of asserting itself.",
        "Oracle": "I see what you refuse to acknowledge.",
        "Doomer": "The end is not near, it is here."
    };
    const flavorText = flavorTextMap[rpgClass] || "A watcher of the bubble.";

    return {
        name: creatorName,
        stats,
        rpgClass,
        rarity,
        mtgColor,
        flavorText
    };
}
