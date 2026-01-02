import type { Predictor } from './RaritySystem';

export const creators: Record<string, Predictor> = {
    "Gary Marcus": { name: "Gary Marcus", subscriberCount: 0, isLegacy: true },
    "O Primo Rico": { name: "O Primo Rico", subscriberCount: 0, isLegacy: true },
    "Sabine Hossenfelder": { name: "Sabine Hossenfelder", subscriberCount: 0, isLegacy: true },

    // Epic (100k - 1M)
    "Adam Conover": { name: "Adam Conover", subscriberCount: 500000 },
    "Brianne Worth": { name: "Brianne Worth", subscriberCount: 500000 },
    "Cole Hastings": { name: "Cole Hastings", subscriberCount: 500000 },
    "Man Carrying Thing": { name: "Man Carrying Thing", subscriberCount: 500000 },
    "Georg Rockall-Schmidt": { name: "Georg Rockall-Schmidt", subscriberCount: 500000 },
    "Sasha Yanshin": { name: "Sasha Yanshin", subscriberCount: 500000 },

    // Rare (10k - 100k)
    "OverEasy": { name: "OverEasy", subscriberCount: 50000 },
    "Shade of Code": { name: "Shade of Code", subscriberCount: 50000 },
    "The Ben and Emil Show": { name: "The Ben and Emil Show", subscriberCount: 50000 },
    "Lattice": { name: "Lattice", subscriberCount: 50000 }
};
