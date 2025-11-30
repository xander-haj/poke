import { useState } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';
import { TeamMember, MoveData } from '../types';
import { COMMON_MONS, TYPE_COLORS, TYPE_GRADIENTS } from '../data/constants';
import { capitalize } from '../utils/calc';
import { PokeService } from '../services/pokeapi';
import TeamAnalysis from './TeamAnalysis';

interface TeamBuilderProps {
    team: TeamMember[];
    setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    selectedSlot: number;
    setSelectedSlot: (index: number) => void;
}

export default function TeamBuilder({ team, setTeam, selectedSlot, setSelectedSlot }: TeamBuilderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<string[]>([]);

    const member = team[selectedSlot];
    const primaryType = member?.pokemon?.types[0] || 'normal';
    
    // Determine dynamic background styles
    const backgroundClass = member?.pokemon 
        ? `bg-gradient-to-br ${TYPE_GRADIENTS[primaryType]} animate-gradient`
        : 'bg-slate-950';

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearchResults(COMMON_MONS.filter(m => m.includes(query.toLowerCase())));
    };

    const fetchPokemon = async (name: string) => {
        try {
            const newMon = await PokeService.fetchPokemon(name);
            updateMember(selectedSlot, {
                pokemon: newMon,
                ability: newMon.abilities[0],
                teraType: newMon.types[0],
                item: 'leftovers', // Default useful item
                nature: 'Serious',
                moves: [null, null, null, null],
                evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
            });
            setIsSearchOpen(false);
            setSearchQuery('');
        } catch (e) {
            console.error(e);
        }
    };

    const updateMember = (index: number, updates: Partial<TeamMember>) => {
        setTeam(prev => {
            const newTeam = [...prev];
            newTeam[index] = { ...newTeam[index], ...updates };
            return newTeam;
        });
    };

    const updateMove = async (slotIndex: number, moveIndex: number, moveName: string) => {
         const currentMember = team[slotIndex];
         if (!currentMember.pokemon) return;

         if (!moveName) {
             const newMoves = [...currentMember.moves];
             newMoves[moveIndex] = null;
             updateMember(slotIndex, { moves: newMoves as any });
             return;
         }
         
         const moveData = await PokeService.fetchMove(moveName);
         // Explicitly typing the array to satisfy the MoveData type requirement and ensure consistency
         const newMoves = [...currentMember.moves] as [MoveData | null, MoveData | null, MoveData | null, MoveData | null];
         newMoves[moveIndex] = moveData;
         updateMember(slotIndex, { moves: newMoves });
    };

    const removeMember = () => {
        const emptyMember: TeamMember = {
            id: Math.random().toString(36),
            pokemon: null, nickname: '', item: '', ability: '', nature: 'Serious',
            moves: [null, null, null, null],
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            teraType: 'normal',
            shiny: false
        };
        setTeam(prev => {
            const newTeam = [...prev];
            newTeam[selectedSlot] = emptyMember;
            return newTeam;
        });
    };

    return (
        <div className={`flex w-full h-full relative transition-all duration-1000 ${backgroundClass} bg-size-200`}>
             {/* Overlay for readability if gradient is active */}
             <div className="absolute inset-0 bg-slate-950/40 pointer-events-none"></div>

            {/* --- MIDDLE COLUMN: TEAM LIST --- */}
            <div className="flex-1 z-10 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 max-w-4xl mx-auto">
                {team.map((m, i) => {
                    const isSelected = i === selectedSlot;
                    const typeColor = m.pokemon ? TYPE_COLORS[m.pokemon.types[0]] : '#334155';
                    // Used to provide a secondary border or accent if needed, currently unused but available for styling
                    // const secondaryColor = m.pokemon?.types[1] ? TYPE_COLORS[m.pokemon.types[1]] : typeColor;

                    if (!m.pokemon) {
                        return (
                            <div 
                                key={m.id}
                                onClick={() => setSelectedSlot(i)}
                                className={`h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'border-cyan-500 bg-slate-900/80' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50'}`}
                            >
                                <div className="text-center">
                                    <div className="text-xl font-bold text-slate-500 mb-1">Empty Slot {i + 1}</div>
                                    <div className="text-xs text-slate-600 uppercase tracking-widest">Click to Add</div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={m.id}
                            onClick={() => setSelectedSlot(i)}
                            className={`relative h-36 rounded-xl border-l-4 overflow-hidden cursor-pointer transition-all duration-300 group shadow-lg flex ${isSelected ? 'bg-slate-900 ring-1 ring-white/20 translate-x-2' : 'bg-slate-900/60 hover:bg-slate-900 hover:translate-x-1'}`}
                            style={{ borderLeftColor: typeColor }}
                        >
                            {/* Card Content Grid */}
                            <div className="flex w-full h-full">
                                {/* 1. Sprite Section */}
                                <div className="w-32 h-full flex items-center justify-center relative flex-shrink-0 bg-gradient-to-br from-slate-800/50 to-transparent">
                                    <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500">0{i + 1}</div>
                                    <img 
                                        src={m.pokemon.sprite} 
                                        className="w-24 h-24 object-contain drop-shadow-2xl transition-transform group-hover:scale-110" 
                                    />
                                </div>

                                {/* 2. Info Section */}
                                <div className="w-48 py-3 px-4 flex flex-col justify-center border-r border-slate-800/50 flex-shrink-0">
                                    <h3 className="text-xl font-black text-white leading-none mb-2">{m.nickname || capitalize(m.pokemon.name)}</h3>
                                    <div className="flex gap-1 mb-2">
                                        {m.pokemon.types.map(t => (
                                            <span 
                                                key={t} 
                                                className="px-1.5 py-0.5 text-[9px] uppercase font-bold text-white rounded shadow-sm flex items-center gap-1"
                                                style={{ backgroundColor: TYPE_COLORS[t] }}
                                            >
                                                {t === 'dragon' ? 'DRG' : t.substring(0, 3)}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-auto">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Ability</div>
                                        <div className="text-xs text-slate-300 truncate">{capitalize(m.ability)}</div>
                                    </div>
                                    <div className="mt-1">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Item</div>
                                        <div className="text-xs text-slate-300 truncate">{capitalize(m.item) || '-'}</div>
                                    </div>
                                </div>

                                {/* 3. Moves Section */}
                                <div className="flex-1 py-2 px-4 grid grid-rows-4 gap-1">
                                    {m.moves.map((move, moveIdx) => (
                                        <div key={moveIdx} className="flex items-center justify-between bg-slate-950/30 rounded px-3 border border-slate-800/50 group/move relative">
                                            {/* Move Input */}
                                            <input 
                                                list={`moves-${m.id}`}
                                                value={move?.name || ''}
                                                onChange={(e) => updateMove(i, moveIdx, e.target.value)}
                                                className="bg-transparent border-none text-xs text-slate-300 focus:text-white w-full outline-none placeholder-slate-600"
                                                placeholder="-"
                                            />
                                            {move && (
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="px-1.5 py-0.5 text-[8px] font-bold uppercase rounded text-slate-900 min-w-[30px] text-center"
                                                        style={{ backgroundColor: TYPE_COLORS[move.type] }}
                                                    >
                                                        {move.type.substring(0,3)}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500 w-6 text-right">{move.power || '-'}</span>
                                                </div>
                                            )}
                                            <datalist id={`moves-${m.id}`}>
                                                {m.pokemon?.moves.sort().map(mv => <option key={mv} value={mv} />)}
                                            </datalist>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- RIGHT COLUMN: ANALYSIS & CONFIG --- */}
            <div className="w-80 z-20 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 shadow-2xl flex flex-col">
                <TeamAnalysis 
                    team={team}
                    selectedMember={member}
                    onUpdateMember={(updates) => updateMember(selectedSlot, updates)}
                    onRemoveMember={removeMember}
                    onSearchOpen={() => setIsSearchOpen(true)}
                />
            </div>

            {/* Search Modal Overlay */}
            {isSearchOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                            <Search className="w-5 h-5 text-slate-500" />
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Search Pokémon..." 
                                className="flex-1 bg-transparent outline-none text-white placeholder-slate-600"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <button onClick={() => setIsSearchOpen(false)}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {searchResults.map(name => (
                                <div 
                                    key={name} 
                                    onClick={() => fetchPokemon(name)}
                                    className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center text-slate-300 hover:text-white capitalize border-b border-slate-800/50 last:border-0"
                                >
                                    {name}
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                </div>
                            ))}
                            {searchResults.length === 0 && searchQuery && (
                                <div className="p-8 text-center text-slate-500 text-sm">No Pokemon found.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}