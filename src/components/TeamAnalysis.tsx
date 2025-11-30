import { TeamMember } from '../types';
import { TYPE_CHART, TYPE_COLORS, ABILITY_IMMUNITIES } from '../data/constants';

interface TeamAnalysisProps {
    team: TeamMember[];
}

export default function TeamAnalysis({ team }: TeamAnalysisProps) {
    const types = Object.keys(TYPE_CHART);

    // --- LOGIC 1: Defensive Analysis (Weaknesses & Resistances) ---
    // Calculates how many team members are Weak/Resistant/Immune to each type
    const calculateDefense = (type: string) => {
        let weak = 0;
        let resist = 0;
        let immune = 0;

        team.forEach(member => {
            if (!member.pokemon) return;

            // 1. Check Ability Immunity FIRST
            const ability = member.ability?.toLowerCase().replace(' ', '-');
            if (ABILITY_IMMUNITIES[ability]?.includes(type)) {
                immune++;
                return; // Stop processing this pokemon for this type
            }

            // 2. Calculate Damage Multiplier based on Typing
            let multiplier = 1;
            member.pokemon.types.forEach(pType => {
                if (TYPE_CHART[pType].weak.includes(type)) multiplier *= 2;
                if (TYPE_CHART[pType].resist.includes(type)) multiplier *= 0.5;
                if (TYPE_CHART[pType].immune.includes(type)) multiplier = 0;
            });

            // 3. Apply Filter/Solid Rock (Reduces SE damage)
            if (['filter', 'solid-rock', 'prism-armor'].includes(ability) && multiplier > 1) {
                multiplier *= 0.75; 
            }
            // 3.1 Apply Dry Skin (Fire weakness)
            if (ability === 'dry-skin' && type === 'fire') multiplier *= 1.25; // Technically 1.25, treated as weak

            if (multiplier === 0) immune++;
            else if (multiplier > 1) weak++;
            else if (multiplier < 1) resist++;
        });

        return { weak, resist, immune };
    };

    // --- LOGIC 2: Offensive Coverage ---
    // Calculates how many team members have a MOVE that hits this type Super Effectively
    const calculateCoverage = (defensiveType: string) => {
        let coverageCount = 0;

        team.forEach(member => {
            if (!member.pokemon) return;

            // Iterate actual moves, not just pokemon type
            const hasMove = member.moves.some(move => {
                if (!move || move.category === 'status') return false;
                
                // Does this move hit 'defensiveType' super effectively?
                // Logic: Look up the MOVE'S type in the chart. Does its 'weak' array contain 'defensiveType'?
                // (Wait, Chart structure is: TYPE_CHART[type].weak = types that hit IT super effectively)
                // So if we have a Fire Move, we check TYPE_CHART[defensiveType].weak.includes('fire')
                
                return TYPE_CHART[defensiveType]?.weak.includes(move.type);
            });

            if (hasMove) coverageCount++;
        });

        return coverageCount;
    };

    return (
        <div className="bg-slate-900 border-t border-slate-800 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                Team Synergy Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Defensive Grid */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-3 text-center">Defensive Profile (Weaknesses vs Resistances)</h4>
                    <div className="grid grid-cols-6 gap-2">
                        {types.map(type => {
                            const { weak, resist, immune } = calculateDefense(type);
                            return (
                                <div key={type} className="flex flex-col items-center bg-slate-800 rounded p-2 border border-slate-700">
                                    <div className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase mb-2 w-full text-center" style={{ backgroundColor: TYPE_COLORS[type] }}>
                                        {type.substring(0, 3)}
                                    </div>
                                    <div className="flex gap-1 h-4 items-end">
                                        {/* Weaknesses (Red) */}
                                        {Array.from({ length: weak }).map((_, i) => (
                                            <div key={`w-${i}`} className="w-1.5 h-3 bg-red-500 rounded-sm" title="Weak"></div>
                                        ))}
                                        {/* Resistances (Blue) */}
                                        {Array.from({ length: resist }).map((_, i) => (
                                            <div key={`r-${i}`} className="w-1.5 h-3 bg-blue-500 rounded-sm" title="Resist"></div>
                                        ))}
                                        {/* Immunities (Purple/Outline) */}
                                        {Array.from({ length: immune }).map((_, i) => (
                                            <div key={`i-${i}`} className="w-1.5 h-3 border border-purple-400 rounded-sm" title="Immune"></div>
                                        ))}
                                        {weak === 0 && resist === 0 && immune === 0 && <div className="w-1 h-1 bg-slate-700 rounded-full"></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Coverage Grid */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-3 text-center">Offensive Coverage (Moves hitting SE)</h4>
                    <div className="grid grid-cols-6 gap-2">
                        {types.map(type => {
                            const count = calculateCoverage(type);
                            return (
                                <div key={type} className="flex flex-col items-center bg-slate-800 rounded p-2 border border-slate-700">
                                    <div className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase mb-2 w-full text-center" style={{ backgroundColor: TYPE_COLORS[type] }}>
                                        {type.substring(0, 3)}
                                    </div>
                                    <div className="flex gap-1 h-4 items-end">
                                        {Array.from({ length: count }).map((_, i) => (
                                            <div key={`c-${i}`} className="w-1.5 h-3 bg-green-500 rounded-sm" title="Coverage"></div>
                                        ))}
                                        {count === 0 && <div className="text-[10px] text-red-500/50 font-mono">X</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="text-center mt-4 text-[10px] text-slate-500 font-mono">
                Analysis accounts for <strong>Abilities</strong> (e.g. Levitate, Flash Fire) and <strong>Actual Movesets</strong>.
            </div>
        </div>
    );
}