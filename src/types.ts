export type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

export interface Stats {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
}

export interface PokemonData {
    name: string;
    sprite: string;
    types: string[];
    stats: Stats;
    abilities: string[];
    moves: string[]; // List of available move names
    height: number;
    weight: number;
    baseStats: Stats;
}

export interface MoveData {
    name: string;
    type: string;
    power: number;
    accuracy: number;
    category: string; // 'physical', 'special', 'status'
}

export interface TeamMember {
    id: string;
    pokemon: PokemonData | null;
    nickname: string;
    item: string;
    ability: string;
    nature: string;
    // We now store full MoveData objects, or null if empty
    moves: [MoveData | null, MoveData | null, MoveData | null, MoveData | null]; 
    evs: Stats;
    ivs: Stats;
    teraType: string;
    shiny: boolean;
}

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    source?: string;
}

export interface ItemCategory {
    name: string;
    items: string[];
}