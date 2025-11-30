export const STAT_NAMES = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const;

export const NATURES: Record<string, { up: string, down: string }> = {
    Adamant: { up: 'atk', down: 'spa' }, Bashful: { up: '', down: '' }, Bold: { up: 'def', down: 'atk' },
    Brave: { up: 'atk', down: 'spe' }, Calm: { up: 'spd', down: 'atk' }, Careful: { up: 'spd', down: 'spa' },
    Docile: { up: '', down: '' }, Gentle: { up: 'spd', down: 'def' }, Hardy: { up: '', down: '' },
    Hasty: { up: 'spe', down: 'def' }, Impish: { up: 'def', down: 'spa' }, Jolly: { up: 'spe', down: 'spa' },
    Lax: { up: 'def', down: 'spd' }, Lonely: { up: 'atk', down: 'def' }, Mild: { up: 'spa', down: 'def' },
    Modest: { up: 'spa', down: 'atk' }, Naive: { up: 'spe', down: 'spd' }, Naughty: { up: 'atk', down: 'spd' },
    Quiet: { up: 'spa', down: 'spe' }, Quirky: { up: '', down: '' }, Rash: { up: 'spa', down: 'spd' },
    Relaxed: { up: 'def', down: 'spe' }, Sassy: { up: 'spd', down: 'spe' }, Serious: { up: '', down: '' },
    Timid: { up: 'spe', down: 'atk' },
};

export const TYPE_CHART: Record<string, { weak: string[], resist: string[], immune: string[] }> = {
    normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
    fire: { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] },
    water: { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
    grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'electric', 'grass', 'ground'], immune: [] },
    electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
    ice: { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
    fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['bug', 'rock', 'dark'], immune: [] },
    poison: { weak: ['ground', 'psychic'], resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immune: [] },
    ground: { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
    flying: { weak: ['electric', 'ice', 'rock'], resist: ['grass', 'fighting', 'bug'], immune: ['ground'] },
    psychic: { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
    bug: { weak: ['fire', 'flying', 'rock'], resist: ['grass', 'fighting', 'ground'], immune: [] },
    rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
    ghost: { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
    dragon: { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'electric', 'grass'], immune: [] },
    steel: { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
    dark: { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
    fairy: { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] },
};

export const TYPE_COLORS: Record<string, string> = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', steel: '#B7B7CE',
    dark: '#705746', fairy: '#D685AD'
};

export const TYPE_GRADIENTS: Record<string, string> = {
    normal: 'from-slate-800 to-slate-600',
    fire: 'from-orange-900/80 to-red-900/80',
    water: 'from-blue-900/80 to-cyan-900/80',
    electric: 'from-yellow-900/80 to-amber-900/80',
    grass: 'from-green-900/80 to-emerald-900/80',
    ice: 'from-cyan-900/80 to-sky-900/80',
    fighting: 'from-red-950/80 to-orange-950/80',
    poison: 'from-purple-950/80 to-fuchsia-950/80',
    ground: 'from-yellow-950/80 to-orange-950/80',
    flying: 'from-indigo-900/80 to-blue-900/80',
    psychic: 'from-pink-900/80 to-rose-900/80',
    bug: 'from-lime-900/80 to-green-900/80',
    rock: 'from-stone-800/80 to-amber-950/80',
    ghost: 'from-violet-950/80 to-indigo-950/80',
    dragon: 'from-indigo-900/80 to-purple-900/80',
    steel: 'from-slate-700/80 to-gray-700/80',
    dark: 'from-gray-950 to-neutral-950',
    fairy: 'from-pink-950/80 to-rose-950/80',
};

export const ABILITY_IMMUNITIES: Record<string, string[]> = {
    'levitate': ['ground'],
    'volt-absorb': ['electric'],
    'lightning-rod': ['electric'],
    'motor-drive': ['electric'],
    'water-absorb': ['water'],
    'storm-drain': ['water'],
    'dry-skin': ['water'],
    'flash-fire': ['fire'],
    'sap-sipper': ['grass'],
    'earth-eater': ['ground'],
    'well-baked-body': ['fire'],
    'purifying-salt': ['ghost']
};

export const COMMON_MONS = [
    "great-tusk", "kingambit", "gholdengo", "iron-valiant", "walking-wake", 
    "iron-treads", "pelipper", "barraskewda", "zapdos", "glimmora", 
    "volcarona", "alomomola", "blissey", "dondozo", "gliscor", "clefable", 
    "corviknight", "archaludon", "roaring-moon", "iron-moth", "hatterene", 
    "zamazenta-crowned", "dragapult", "rillaboom", "ogerpon-wellspring", 
    "ting-lu", "toxapex", "slowking-galar", "skeledirge", "garganacl", 
    "samurott-hisui", "sneasler", "enamorus", "baxcalibur", "meowscarada", 
    "ceruledge", "dragapult", "amoonguss", "heatran", "landorus-therian",
    "pikachu", "charizard", "bulbasaur", "squirtle", "gengar", "dragonite", "mewtwo", 
    "lucario", "greninja"
];

export const COMPETITIVE_ITEMS = {
    "Choice Items": ["choice-band", "choice-specs", "choice-scarf"],
    "Health Recovery": ["leftovers", "black-sludge", "shell-bell"],
    "Damage Boosting": ["life-orb", "expert-belt", "muscle-band", "wise-glasses"],
    "Defensive": ["rocky-helmet", "heavy-duty-boots", "assault-vest", "eviolite"],
    "Consumables": ["focus-sash", "white-herb", "power-herb", "mental-herb", "booster-energy"],
    "Berries": ["sitrus-berry", "lum-berry", "salac-berry", "liechi-berry", "petaya-berry"],
    "Terrain/Weather": ["light-clay", "damp-rock", "heat-rock", "smooth-rock", "icy-rock", "electric-seed", "grassy-seed", "misty-seed", "psychic-seed"],
    "Status": ["flame-orb", "toxic-orb", "lagging-tail", "iron-ball"]
};

// Hand-picked meta movesets for popular mons to prevent "legal but garbage" defaults
export const COMPETITIVE_MOVES: Record<string, string[]> = {
    "great-tusk": ["headlong-rush", "close-combat", "ice-spinner", "rapid-spin"],
    "kingambit": ["kowtow-cleave", "sucker-punch", "iron-head", "swords-dance"],
    "gholdengo": ["make-it-rain", "shadow-ball", "nasty-plot", "recover"],
    "iron-valiant": ["moonblast", "close-combat", "booster-energy", "calm-mind"],
    "walking-wake": ["hydro-steam", "draco-meteor", "flamethrower", "flip-turn"],
    "glimmora": ["stealth-rock", "mortal-spin", "earth-power", "power-gem"],
    "volcarona": ["quiver-dance", "fiery-dance", "bug-buzz", "morning-sun"],
    "dragapult": ["shadow-ball", "draco-meteor", "u-turn", "flamethrower"],
    "landorus-therian": ["earthquake", "u-turn", "stealth-rock", "stone-edge"],
    "samurott-hisui": ["ceaseless-edge", "razor-shell", "sacred-sword", "aqua-jet"],
    "ribombee": ["sticky-web", "moonblast", "stun-spore", "u-turn"],
    "toxapex": ["recover", "toxic", "scald", "haze"]
};

// High priority moves if not in the specific list
export const PRIORITY_MOVES = [
    "stealth-rock", "spikes", "sticky-web", "defog", "rapid-spin", "mortal-spin",
    "recover", "roost", "slack-off", "soft-boiled", "moonlight", "morning-sun", "synthesis",
    "swords-dance", "nasty-plot", "calm-mind", "dragon-dance", "quiver-dance", "bulk-up", "coil",
    "will-o-wisp", "thunder-wave", "toxic", "glare", "spore", "yawn",
    "u-turn", "volt-switch", "flip-turn", "parting-shot",
    "knock-off", "earthquake", "scald", "ice-beam", "thunderbolt", "flamethrower", "surf", "close-combat", "moonblast"
];