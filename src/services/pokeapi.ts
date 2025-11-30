import { PokemonData, ItemCategory, MoveData } from "../types";

// Cache to prevent rate limiting
const POKEMON_CACHE = new Map<string, PokemonData>();
const MOVE_CACHE = new Map<string, MoveData>();

export const PokeService = {
    async fetchPokemon(name: string): Promise<PokemonData> {
        if (POKEMON_CACHE.has(name)) return POKEMON_CACHE.get(name)!;

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!res.ok) throw new Error(`Pokemon ${name} not found`);
        const data = await res.json();

        const stats: any = {};
        data.stats.forEach((s: any) => {
            let sName = s.stat.name;
            if (sName === 'special-attack') sName = 'spa';
            if (sName === 'special-defense') sName = 'spd';
            if (sName === 'attack') sName = 'atk';
            if (sName === 'defense') sName = 'def';
            if (sName === 'speed') sName = 'spe';
            stats[sName] = s.base_stat;
        });

        const pokemon: PokemonData = {
            name: data.name,
            sprite: data.sprites.front_default || data.sprites.other['official-artwork'].front_default,
            types: data.types.map((t: any) => t.type.name),
            stats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            baseStats: stats,
            abilities: data.abilities.map((a: any) => a.ability.name),
            moves: data.moves.map((m: any) => m.move.name),
            height: data.height,
            weight: data.weight
        };

        POKEMON_CACHE.set(name, pokemon);
        return pokemon;
    },

    async fetchMove(name: string): Promise<MoveData> {
        if (!name) return { name: '', type: 'normal', power: 0, accuracy: 100, category: 'status' };
        if (MOVE_CACHE.has(name)) return MOVE_CACHE.get(name)!;

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/move/${name.toLowerCase()}`);
            if (!res.ok) throw new Error('Move not found');
            const data = await res.json();

            const move: MoveData = {
                name: data.name,
                type: data.type.name,
                power: data.power || 0,
                accuracy: data.accuracy || 100,
                category: data.damage_class.name
            };

            MOVE_CACHE.set(name, move);
            return move;
        } catch {
            // Fallback for custom/unknown moves
            return { name: name, type: 'normal', power: 0, accuracy: 100, category: 'status' };
        }
    },

    async fetchAllItems(): Promise<ItemCategory[]> {
        const { COMPETITIVE_ITEMS } = await import('../data/constants');
        return Object.entries(COMPETITIVE_ITEMS).map(([cat, items]) => ({
            name: cat,
            items: items.sort()
        }));
    }
};