import { TeamMember, PokemonData, MoveData } from "../types";
import { PokeService } from "./pokeapi";

const META_POOL = [
    "great-tusk", "kingambit", "gholdengo", "iron-valiant", "walking-wake", 
    "iron-treads", "pelipper", "barraskewda", "zapdos", "glimmora", 
    "volcarona", "alomomola", "blissey", "dondozo", "gliscor", "clefable", 
    "corviknight", "archaludon", "roaring-moon", "iron-moth", "hatterene",
    "zamazenta-crowned", "dragapult", "rillaboom", "ogerpon-wellspring", 
    "ting-lu", "toxapex", "slowking-galar", "skeledirge", "garganacl", 
    "samurott-hisui", "sneasler", "enamorus", "baxcalibur", "meowscarada", 
    "ceruledge", "dragapult", "amoonguss", "heatran", "landorus-therian"
];

export const AutoForgeEngine = {
    async generateTeam(archetype: 'balanced' | 'offense' | 'stall'): Promise<TeamMember[]> {
        const team: TeamMember[] = [];
        
        // 1. Select a Core based on Archetype
        let coreName = "";
        if (archetype === 'balanced') coreName = "great-tusk"; 
        if (archetype === 'offense') coreName = "kingambit";   
        if (archetype === 'stall') coreName = "alomomola";     

        // If core request fails, fallback to a safe meta pick
        try {
            const coreMon = await PokeService.fetchPokemon(coreName);
            team.push(await this.createMember(coreMon, archetype));
        } catch (e) {
            const fallback = await PokeService.fetchPokemon("landorus-therian");
            team.push(await this.createMember(fallback, archetype));
        }

        // 2. Fill remaining 5 slots iteratively
        for (let i = 0; i < 5; i++) {
            const nextMon = await this.pickSynergisticMon(team, archetype);
            team.push(await this.createMember(nextMon, archetype));
        }

        return team;
    },

    async pickSynergisticMon(currentTeam: TeamMember[], style: string): Promise<PokemonData> {
        let bestCandidate: PokemonData | null = null;
        let bestScore = -Infinity;

        // Pick 6 random candidates from pool to evaluate
        const candidatesNames = [...META_POOL].sort(() => 0.5 - Math.random()).slice(0, 6);

        for (const name of candidatesNames) {
            if (currentTeam.find(m => m.pokemon?.name === name)) continue;

            try {
                const mon = await PokeService.fetchPokemon(name);
                let score = 0;

                // 1. Type Synergy Scoring
                mon.types.forEach(t => {
                    if (currentTeam.some(m => m.pokemon?.types.includes(t))) score -= 15;
                    score += 5;
                });

                // 2. Role Scoring
                const s = mon.baseStats;
                if (style === 'stall') {
                    if (s.hp > 90) score += 5;
                    if (s.def > 100 || s.spd > 100) score += 10;
                    if (s.def < 70 && s.spd < 70) score -= 20;
                } else if (style === 'offense') {
                    if (s.spe > 100) score += 10;
                    if (s.atk > 110 || s.spa > 110) score += 10;
                    if (s.atk < 80 && s.spa < 80) score -= 15;
                } else {
                    const bst = s.hp + s.atk + s.def + s.spa + s.spd + s.spe;
                    if (bst > 520) score += 5;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestCandidate = mon;
                }
            } catch (e) {
                console.warn(`Skipping ${name} due to fetch error`);
            }
        }

        if (!bestCandidate) {
            return await PokeService.fetchPokemon(META_POOL[Math.floor(Math.random() * META_POOL.length)]);
        }
        return bestCandidate;
    },

    async createMember(data: PokemonData, archetype: string): Promise<TeamMember> {
        const stats = data.baseStats;
        
        // --- 1. Determine Role & Nature ---
        let nature = "Serious";
        const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
        
        const isFast = stats.spe >= 95;
        const isPhysical = stats.atk >= stats.spa;
        
        if (isFast || archetype === 'offense') {
            evs.spe = 252;
            evs.hp = 4;
            if (isPhysical) {
                evs.atk = 252;
                nature = "Jolly";
            } else {
                evs.spa = 252;
                nature = "Timid";
            }
        } else {
            evs.hp = 252;
            if (stats.def >= stats.spd) {
                evs.def = 252;
                evs.spd = 4;
                nature = "Impish"; 
                if (!isPhysical) nature = "Bold"; 
            } else {
                evs.spd = 252;
                evs.def = 4;
                nature = "Careful";
                if (!isPhysical) nature = "Calm"; 
            }
        }

        // --- 2. Determine Optimal Item ---
        const item = this.determineOptimalItem(data, isFast, isPhysical, archetype);

        // --- 3. Determine Moves & Fetch Move Data ---
        // Take first 4 moves or fill with empty if not available
        const moveNames = data.moves.slice(0, 4);
        const resolvedMoves = await Promise.all(moveNames.map(async (name) => {
             return await PokeService.fetchMove(name);
        }));
        
        // Pad with nulls if less than 4 moves
        const moves: [MoveData | null, MoveData | null, MoveData | null, MoveData | null] = [null, null, null, null];
        resolvedMoves.forEach((m, i) => { if(i < 4) moves[i] = m; });

        return {
            id: Math.random().toString(36),
            pokemon: data,
            nickname: "",
            item: item,
            ability: data.abilities[0],
            nature: nature,
            moves: moves,
            evs: evs,
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            teraType: data.types[0],
            shiny: Math.random() < 0.05
        };
    },

    determineOptimalItem(data: PokemonData, isFast: boolean, isPhysical: boolean, archetype: string): string {
        const name = data.name.toLowerCase();
        const ability = data.abilities[0]?.toLowerCase() || "";

        if (ability === 'poison-heal') return 'toxic-orb';
        if (ability === 'guts') return 'flame-orb';
        if (ability === 'multiscale') return 'heavy-duty-boots';
        if (ability === 'regenerator') return 'heavy-duty-boots';
        if (ability === 'unburden') return 'white-herb';
        if (ability === 'quark-drive' || ability === 'protosynthesis') return 'booster-energy';

        if (name.includes('ogerpon')) return 'hearthflame-mask';
        if (name === 'zamazenta-crowned') return 'rusted-shield';
        if (name === 'zacian-crowned') return 'rusted-sword';
        
        if (isFast) {
            if (isPhysical) {
                if (data.baseStats.atk >= 110) return 'choice-band';
                return 'life-orb';
            } else {
                if (data.baseStats.spa >= 110) return 'choice-specs';
                return 'life-orb';
            }
        }

        if (archetype === 'stall' || (!isFast && data.baseStats.hp >= 80)) {
            const weakToRocks = data.types.some(t => ['flying', 'bug', 'fire', 'ice'].includes(t));
            if (weakToRocks) return 'heavy-duty-boots';
            return 'leftovers';
        }

        if (['glimmora', 'great-tusk', 'ting-lu', 'iron-treads'].includes(name)) {
            if (data.baseStats.hp < 80) return 'focus-sash';
            return 'leftovers';
        }

        return 'leftovers';
    }
};