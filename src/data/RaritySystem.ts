export interface RarityObject {
    label: string; // "Common", "Rare", "Epic", "Legendary"
    tierTitle: string; // "Scrappy Skeptic", "Rising Bear", etc.
    color: string; // Hex code
    className: string; // Tailwind class for styling
}

export interface Predictor {
    name: string;
    subscriberCount: number;
    isLegacy?: boolean;
}

export const getRarity = (subscriberCount: number, isLegacy: boolean = false): RarityObject => {
    // The "Gary Marcus" Clause: Legacy status overrides count
    if (isLegacy || subscriberCount > 1000000) {
        return {
            label: "Legendary",
            tierTitle: "The Arch-Doom",
            color: "#F59E0B", // Orange/Gold
            className: "border-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        };
    }

    if (subscriberCount >= 100000) {
        return {
            label: "Epic",
            tierTitle: "Industry Prophet",
            color: "#8B5CF6", // Purple
            className: "border-purple-500"
        };
    }

    if (subscriberCount >= 10000) {
        return {
            label: "Rare",
            tierTitle: "Rising Bear",
            color: "#3B82F6", // Blue
            className: "border-blue-500"
        };
    }

    // Default: Common
    return {
        label: "Common",
        tierTitle: "Scrappy Skeptic",
        color: "#9CA3AF", // Gray
        className: "border-gray-400"
    };
};
