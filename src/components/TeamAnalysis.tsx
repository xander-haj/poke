import { TeamMember } from '../types';
import { TYPE_CHART, TYPE_COLORS, ABILITY_IMMUNITIES } from '../data/constants';
import StatRadar from './StatRadar';
import ItemSelector from './ItemSelector';
import { Search, ChevronRight, Copy, Trash2 } from 'lucide-react';
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

    // --- LOGIC: Team Coverage ---
    const calculateCoverage = (defensiveType: string) => {
        let coverageCount = 0;
        team.forEach(member => {
            if (!member.pokemon) return;
            const hasMove = member.moves.some(move => {
                if (!move || move.category === 'status') return false;
                return TYPE_CHART[defensiveType]?.weak.includes(move.type);
            });
            if (hasMove) coverageCount++;
        });
        return coverageCount;
    };

    // --- LOGIC: Synergy Donut Data ---
    const getTeamTypeDistribution = () => {
        const dist: Record<string, number> = {};
        let total = 0;
        team.forEach(m => {
            if(m.pokemon) {
                m.pokemon.types.forEach(t => {
                    dist[t] = (dist[t] || 0) + 1;
                    total++;
                });
            }
        });
        return { dist, total };
    };

    const { dist: typeDist, total: totalTypes } = getTeamTypeDistribution();
    
    // SVG Donut Logic
    let currentAngle = 0;
    const donutRadius = 15.9155;
    const donutCircumference = 100;

    return (
        <div className="h-full flex flex-col space-y-8 p-1">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Team Analysis & Config</h2>
            </div>

            {/* 1. Global Team Synergy (Donut) */}
            <div className="flex flex-col items-center">
                <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Type Synergy</h3>
                <div className="relative w-40 h-40">
                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                        <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#1e293b" strokeWidth="6" />
                        {Object.entries(typeDist).map(([type, count]) => {
                            const percentage = (count / totalTypes) * 100;
                            const offset = 100 - currentAngle;
                            currentAngle += percentage;
                            return (
                                <circle
                                    key={type}
                                    cx="21" cy="21" r="15.9155"
                                    fill="transparent"
                                    stroke={TYPE_COLORS[type]}
                                    strokeWidth="6"
                                    strokeDasharray={`${percentage} ${100 - percentage}`}
                                    strokeDashoffset={offset}
                                    className="transition-all duration-500 hover:opacity-80"
                                />
                            );
                        })}
                        {totalTypes === 0 && <text x="21" y="21" fill="#475569" textAnchor="middle" dy="0.3em" className="text-[3px] font-bold rotate-90">EMPTY</text>}
                    </svg>
                    {totalTypes > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xs font-bold text-slate-300">Synergy</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Global Coverage Grid */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 mb-3 text-center uppercase tracking-wider">Coverage</h3>
                <div className="grid grid-cols-5 gap-1.5">
                    {types.map(type => {
                        const count = calculateCoverage(type);
                        const opacity = count === 0 ? 'opacity-30 grayscale' : 'opacity-100';
                        return (
                            <div key={type} className={`flex flex-col items-center p-1 rounded bg-slate-800/50 border border-slate-700 ${opacity}`}>
                                <div className="text-[9px] font-bold text-white uppercase px-1 rounded w-full text-center" style={{ backgroundColor: TYPE_COLORS[type] }}>
                                    {type.substring(0, 3)}
                                </div>
                                <div className="text-[10px] font-mono mt-0.5 text-slate-300">
                                    {count > 0 ? `${count * 10}%` : '0%'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-slate-800 my-4"></div>

            {/* 3. Individual Editor (Radar & Config) */}
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
                        stats={selectedMember.pokemon.baseStats} 
                        evs={selectedMember.evs}
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