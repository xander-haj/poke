import { useState } from 'react';
import { Search, Trash2, Box, Swords, Activity, Copy, ChevronRight, Loader2, BarChart2 } from 'lucide-react';
import { TeamMember, StatName, MoveData } from '../types';
import { STAT_NAMES, NATURES, COMMON_MONS } from '../data/constants';
import { calcStat, capitalize } from '../utils/calc';
import { PokeService } from '../services/pokeapi';
import ItemSelector from './ItemSelector';
import TeamAnalysis from './TeamAnalysis';

interface TeamBuilderProps {
    team: TeamMember[];
    setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    selectedSlot: number;
    setSelectedSlot: (index: number) => void;
}

export default function TeamBuilder({ team, setTeam, selectedSlot, setSelectedSlot }: TeamBuilderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false); 

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearchResults(COMMON_MONS.filter(m => m.includes(query.toLowerCase())));
    };

    const fetchPokemon = async (name: string) => {
        setLoading(true);
        try {
            const newMon = await PokeService.fetchPokemon(name);
            updateMember(selectedSlot, {
                pokemon: newMon,
                ability: newMon.abilities[0],
                teraType: newMon.types[0],
                item: '',
                nature: 'Serious',
                moves: [null, null, null, null],
                evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
            });
            setSearchQuery('');
            setSearchResults([]);
        } catch (e) {
            console.error(e);
            alert('Pokemon not found!');
        } finally {
            setLoading(false);
        }
    };

    const updateMember = (index: number, updates: Partial<TeamMember>) => {
        setTeam(prev => {
            const newTeam = [...prev];
            newTeam[index] = { ...newTeam[index], ...updates };
            return newTeam;
        });
    };

    const updateEV = (stat: StatName, value: number) => {
        const member = team[selectedSlot];
        const currentTotal = Object.values(member.evs).reduce((a, b) => a + b, 0);
        const diff = value - member.evs[stat];

        if (currentTotal + diff <= 510) {
            updateMember(selectedSlot, {
                evs: { ...member.evs, [stat]: value }
            });
        }
    };

    const updateMove = async (index: number, moveName: string) => {
        if (!moveName) {
            const member = team[selectedSlot];
            const newMoves = [...member.moves] as [MoveData | null, MoveData | null, MoveData | null, MoveData | null];
            newMoves[index] = null;
            updateMember(selectedSlot, { moves: newMoves });
            return;
        }

        const moveData = await PokeService.fetchMove(moveName);
        const member = team[selectedSlot];
        const newMoves = [...member.moves] as [MoveData | null, MoveData | null, MoveData | null, MoveData | null];
        newMoves[index] = moveData;
        updateMember(selectedSlot, { moves: newMoves });
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

    const exportTeam = () => {
        let text = "";
        team.forEach(m => {
            if (!m.pokemon) return;
            const name = m.nickname ? `${m.nickname} (${capitalize(m.pokemon.name)})` : capitalize(m.pokemon.name);
            const item = m.item ? ` @ ${capitalize(m.item)}` : '';
            text += `${name}${item}\n`;
            text += `Ability: ${capitalize(m.ability)}\n`;
            text += `Tera Type: ${capitalize(m.teraType)}\n`;
            const evs = Object.entries(m.evs).filter(([k, v]) => v > 0).map(([k, v]) => `${v} ${k}`).join(' / ');
            if (evs) text += `EVs: ${evs}\n`;
            text += `${m.nature} Nature\n`;
            m.moves.forEach(move => { if (move) text += `- ${capitalize(move.name)}\n` });
            text += '\n';
        });
        navigator.clipboard.writeText(text);
        alert("Team exported to clipboard!");
    };

    const member = team[selectedSlot];
    const evUsed = member.pokemon ? Object.values(member.evs).reduce((a, b) => a + b, 0) : 0;

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-cyan-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <div className="text-xl font-bold animate-pulse">ACCESSING DATABASE...</div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-950">
            {/* Top Team Grid */}
            <div className="p-4 md:p-6 bg-slate-950 border-b border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Active Team</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setShowAnalysis(!showAnalysis)} className={`text-xs flex items-center gap-2 px-4 py-2 rounded border transition-colors font-bold uppercase tracking-wider ${showAnalysis ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
                            <BarChart2 className="w-4 h-4" /> {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
                        </button>
                        <button onClick={exportTeam} className="text-xs flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded border border-slate-700 transition-colors text-cyan-400 font-bold uppercase tracking-wider">
                            <Copy className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {team.map((m, i) => {
                        const isSel = i === selectedSlot;
                        const activeClass = isSel ? 'border-cyan-400 bg-slate-800 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/50' : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800';
                        if (!m.pokemon) {
                            return (
                                <div key={m.id} onClick={() => setSelectedSlot(i)} className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 h-36 flex flex-col items-center justify-center text-slate-600 ${activeClass}`}>
                                    <Search className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Empty Slot</span>
                                    <div className="absolute top-2 left-3 text-xs font-mono opacity-30">0{i + 1}</div>
                                </div>
                            );
                        }
                        return (
                            <div key={m.id} onClick={() => setSelectedSlot(i)} className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 h-36 overflow-hidden ${activeClass}`}>
                                <div className="absolute right-0 top-0 p-2 opacity-10 pointer-events-none">
                                    <img src={m.pokemon.sprite} className="w-32 h-32 object-contain grayscale brightness-50" />
                                </div>
                                <div className="p-4 h-full flex flex-col relative z-10">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-white leading-tight truncate w-full pr-1">{m.nickname || capitalize(m.pokemon.name)}</div>
                                    </div>
                                    <div className="flex gap-1 mb-2">
                                        {m.pokemon.types.map(t => <span key={t} className="px-1.5 py-0.5 text-[10px] uppercase font-bold text-white rounded bg-slate-600 shadow-sm">{t.substring(0, 3)}</span>)}
                                    </div>
                                    <div className="text-[10px] text-slate-400 mb-auto truncate">{capitalize(m.item) || 'No Item'}</div>
                                    <div className="flex gap-1 h-1.5 mt-2">
                                        {m.moves.map((mv, k) => (
                                            <div key={k} className="flex-1 rounded-full bg-slate-700/50 overflow-hidden" title={mv?.type}>
                                                {mv && <div className="h-full bg-cyan-500 shadow-[0_0_5px_cyan]"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <img src={m.pokemon.sprite} className="absolute bottom-1 right-1 w-16 h-16 object-contain drop-shadow-xl transform group-hover:scale-110 transition-transform duration-200" />
                                <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500">0{i + 1}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Analysis Panel */}
            {showAnalysis && (
                <div className="bg-slate-900 border-b border-slate-800 shadow-inner">
                     <TeamAnalysis team={team} />
                </div>
            )}

            {/* Editor Section */}
            <div className="bg-slate-950 relative min-h-[500px]">
                {!member.pokemon ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-500 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 text-cyan-500 border border-slate-800 shadow-lg"><Search className="w-10 h-10" /></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Select a Pokémon</h3>
                        <p className="text-slate-400 mb-8 max-w-sm">Choose a slot above and search for a Pokémon to begin building your team.</p>
                        <div className="relative w-full max-w-lg">
                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-12 text-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all shadow-xl" placeholder="Search Pokémon by name..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} />
                            <Search className="absolute left-4 top-5 text-slate-500 w-6 h-6" />
                            {searchResults.length > 0 && (
                                <div className="absolute bottom-full mb-4 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50">
                                    {searchResults.map(name => <div key={name} onClick={() => fetchPokemon(name)} className="px-6 py-3 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer capitalize flex justify-between items-center text-lg border-b border-slate-700/50 last:border-0">{name} <ChevronRight className="w-5 h-5 text-slate-600" /></div>)}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-slate-800 pb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img src={member.pokemon.sprite} className="w-full h-full object-contain relative z-10" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white capitalize tracking-tight mb-2">{member.pokemon.name}</h2>
                                    <div className="flex gap-6 text-sm text-slate-400 font-mono border-t border-slate-800/50 pt-2">
                                        <span>Height: {member.pokemon.height / 10}m</span>
                                        <span>Weight: {member.pokemon.weight / 10}kg</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={removeMember} className="group flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                                <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Remove</span>
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Left Col: Config */}
                            <div className="space-y-8">
                                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 mb-6">
                                        <Box className="w-4 h-4" /> Core Config
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <ItemSelector selectedItem={member.item} onSelect={(i) => updateMember(selectedSlot, { item: i })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase">Ability</label>
                                            <div className="relative">
                                                <select value={member.ability} onChange={(e) => updateMember(selectedSlot, { ability: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 outline-none capitalize appearance-none cursor-pointer hover:border-slate-600 transition-colors">{member.pokemon.abilities.map(a => <option key={a} value={a}>{capitalize(a)}</option>)}</select>
                                                <ChevronRight className="w-4 h-4 text-slate-500 absolute right-3 top-3 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase">Nature</label>
                                            <div className="relative">
                                                <select value={member.nature} onChange={(e) => updateMember(selectedSlot, { nature: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer hover:border-slate-600 transition-colors">{Object.keys(NATURES).map(n => <option key={n} value={n}>{n}</option>)}</select>
                                                <ChevronRight className="w-4 h-4 text-slate-500 absolute right-3 top-3 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-slate-500 mb-1.5 font-bold uppercase">Tera Type</label>
                                            <div className="relative">
                                                <select value={member.teraType} onChange={(e) => updateMember(selectedSlot, { teraType: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 outline-none capitalize appearance-none cursor-pointer hover:border-slate-600 transition-colors">{['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'].map(t => <option key={t} value={t}>{capitalize(t)}</option>)}</select>
                                                <ChevronRight className="w-4 h-4 text-slate-500 absolute right-3 top-3 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 mb-6">
                                        <Swords className="w-4 h-4" /> Moveset
                                    </h3>
                                    <div className="space-y-3">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className="relative group">
                                                {member.moves[i]?.type && (
                                                    <div className="absolute right-3 top-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white bg-slate-700 pointer-events-none z-10 shadow-sm">
                                                        {member.moves[i]?.type}
                                                    </div>
                                                )}
                                                <input 
                                                    list={`move-list-${i}`} 
                                                    value={member.moves[i]?.name || ''} 
                                                    onChange={(e) => updateMove(i, e.target.value)} 
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-colors placeholder-slate-600" 
                                                    placeholder={`Move Slot ${i + 1}`} 
                                                />
                                                <datalist id={`move-list-${i}`}>
                                                    {member.pokemon?.moves.sort().map(m => <option key={m} value={m} />)}
                                                </datalist>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Stats */}
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-fit">
                                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Stat Distribution
                                    </h3>
                                    <div className="text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded border border-slate-800">
                                        EVs Remaining: <span className={`font-bold ${evUsed > 510 ? 'text-red-500' : 'text-cyan-400'}`}>{510 - evUsed}</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {STAT_NAMES.map(stat => {
                                        const total = calcStat(stat, member.pokemon!.baseStats[stat], 31, member.evs[stat], member.nature);
                                        const percentage = Math.min((total / 500) * 100, 100); 
                                        return (
                                            <div key={stat} className="group">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-xs font-bold uppercase text-slate-400">{stat}</span>
                                                    <span className="text-sm font-bold text-white">{total}</span>
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-2 text-xs font-mono text-slate-600 text-right">{member.pokemon!.baseStats[stat]}</div>
                                                    <div className="col-span-8 relative h-6 flex items-center">
                                                        <div className="absolute w-full h-1.5 bg-slate-800 rounded-full"></div>
                                                        <div className="absolute h-1.5 bg-cyan-900/50 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="252" 
                                                            step="4" 
                                                            value={member.evs[stat]} 
                                                            onChange={(e) => updateEV(stat, parseInt(e.target.value))} 
                                                            className="slider-thumb w-full h-1.5 opacity-0 cursor-pointer relative z-10" 
                                                        />
                                                        <div 
                                                            className="pointer-events-none absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan] transition-all duration-75"
                                                            style={{ left: `calc(${member.evs[stat] / 2.52}% - 8px)` }}
                                                        ></div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <input 
                                                            type="number" 
                                                            value={member.evs[stat]} 
                                                            onChange={(e) => updateEV(stat, parseInt(e.target.value) || 0)}
                                                            className="w-full bg-slate-950 border border-slate-700 rounded px-1 py-0.5 text-xs text-center text-white focus:border-cyan-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}