import React from 'react';
import { getRarity } from '../data/RaritySystem';

interface RarityBadgeProps {
    subscriberCount: number;
    isLegacy?: boolean;
}

const RarityBadge: React.FC<RarityBadgeProps> = ({ subscriberCount, isLegacy = false }) => {
    const rarity = getRarity(subscriberCount, isLegacy);

    return (
        <span
            className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full border ${rarity.className}`}
            style={{ backgroundColor: `${rarity.color}33` }} // 33 is approx 20% opacity hex
        >
            {rarity.label}
        </span>
    );
};

export default RarityBadge;
