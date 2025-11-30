import { TeamMember } from '../types';
import { TYPE_CHART, TYPE_COLORS } from '../data/constants';
import StatRadar from './StatRadar';
import ItemSelector from './ItemSelector';
import { Search, ChevronRight, Trash2 } from 'lucide-react';
import { capitalize } from '../utils/calc';

interface TeamAnalysisProps {
    team: TeamMember[];
    selectedMember: TeamMember | null;
    onUpdateMember: (updates: Partial<TeamMember>) => void;
    onRemoveMember: () => void;
    onSearchOpen: () => void;
}

export default function TeamAnalysis({ 
    team, 
    selectedMember, 
    onUpdateMember, 
    onRemoveMember,
    onSearchOpen 
}: TeamAnalysisProps) {
    const types = Object.keys(TYPE_CHART);

    // --- LOGIC: Offensive Coverage Grid ---
    // Returns a list of Pokemon sprites that hit this type Super Effectively
    const getCoverageSprites = (targetType: string) => {
        const coveringMons: string[] = [];
        
        team.forEach(member => {
            if (!member.pokemon) return;
            
            // Check if any move is Super Effective against targetType
            const hasCoverage = member.moves.some(move => {
                if (!move || move.category === 'status') return false;
                // If the target type is in the move type's 'weak' list (meaning move type is strong against it)
                // Wait, TYPE_CHART[type].weak means "What is THIS type weak to?"
                // So if we have a Fire Move, we check TYPE_CHART[targetType].weak includes 'fire'.
                return TYPE_CHART[targetType]?.weak.includes(move.type);
            });

            if (hasCoverage) {
                coveringMons.push(member.pokemon.sprite);
            }
        });
        
        // Remove duplicates if same pokemon covers multiple ways (unlikely with this logic but good practice)
        return [...new Set(coveringMons)];
    };

    return (
        <div className="flex flex-col space-y-8 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Team Analysis & Config</h2>
            </div>

            {/* 1. Global Coverage Grid (Replaced) */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 mb-3 text-center uppercase tracking-wider">Offensive Coverage</h3>
                <div className="grid grid-cols-1 gap-1">
                    {types.map(type => {
                        const sprites = getCoverageSprites(type);
                        const isCovered = sprites.length > 0;
                        
                        return (
                            <div key={type} className="flex items-center h-8 bg-slate-900/50 rounded border border-slate-800 overflow-hidden">
                                {/* Type Label */}
                                <div 
                                    className="w-12 h-full flex items-center justify-center text-[9px] font-bold text-white uppercase flex-shrink-0" 
                                    style={{ backgroundColor: TYPE_COLORS[type] }}
                                >
                                    {type.substring(0, 3)}
                                </div>
                                
                                {/* Covered By Icons */}
                                <div className="flex-1 flex items-center px-2 gap-1 overflow-x-auto no-scrollbar">
                                    {isCovered ? (
                                        sprites.map((s, i) => (
                                            <img key={i} src={s} className="w-6 h-6 object-contain" title="Covers this type" />
                                        ))
                                    ) : (
                                        <span className="text-[9px] text-slate-600 italic">No coverage</span>
                                    )}
                                </div>

                                {/* Count Badge */}
                                <div className={`px-2 text-[10px] font-mono font-bold ${isCovered ? 'text-green-400' : 'text-red-500/50'}`}>
                                    {sprites.length}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-slate-800 my-4"></div>

            {/* 2. Individual Editor */}
            {selectedMember && selectedMember.pokemon ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <img src={selectedMember.pokemon.sprite} className="w-8 h-8 object-contain" />
                            {selectedMember.pokemon.name}
                         </h3>
                         <button onClick={onRemoveMember} className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                         </button>
                    </div>

                    <StatRadar 
                        baseStats={selectedMember.pokemon.baseStats} 
                        evs={selectedMember.evs}
                        ivs={selectedMember.ivs}
                        nature={selectedMember.nature}
                        color={TYPE_COLORS[selectedMember.pokemon.types[0]]} 
                    />

                    <div className="space-y-4">
                        <div>
                             <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Item</label>
                             <ItemSelector selectedItem={selectedMember.item} onSelect={(i) => onUpdateMember({ item: i })} />
                        </div>
                        <div>
                             <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Tera Type</label>
                             <div className="relative">
                                <select 
                                    value={selectedMember.teraType} 
                                    onChange={(e) => onUpdateMember({ teraType: e.target.value })} 
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white uppercase focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                                    style={{ color: TYPE_COLORS[selectedMember.teraType] || 'white' }}
                                >
                                    {types.map(t => <option key={t} value={t}>{capitalize(t)}</option>)}
                                </select>
                                <ChevronRight className="w-3 h-3 text-slate-500 absolute right-2 top-2 rotate-90 pointer-events-none" />
                             </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <p className="text-xs mb-4">Select a slot to configure</p>
                    {selectedMember && (
                        <button 
                            onClick={onSearchOpen}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <Search className="w-3 h-3" /> Add Pokemon
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}