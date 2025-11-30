import { NATURES } from "../data/constants";

export const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ') : '';

export const calcStat = (name: string, base: number, iv: number, ev: number, nature: string, level = 100) => {
    if (name === 'hp') {
        return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    }
    let val = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
    const mods = NATURES[nature] || { up: '', down: '' };
    if (mods.up === name) val = Math.floor(val * 1.1);
    if (mods.down === name) val = Math.floor(val * 0.9);
    return val;
};

// Simple Synergy Score Calculator
export const calculateSynergy = (types: string[]): number => {
    // Logic: Diversity is good. 
    const uniqueTypes = new Set(types);
    return (uniqueTypes.size / 18) * 100; // Normalized score
};