import { STAT_NAMES } from '../data/constants';
import { Stats } from '../types';
import { calcStat } from '../utils/calc';

interface StatRadarProps {
    baseStats: Stats;
    evs: Stats;
    ivs: Stats;
    nature: string;
    level?: number;
    color: string;
}

export default function StatRadar({ baseStats, evs, ivs, nature, level = 100, color }: StatRadarProps) {
    const size = 200;
    const center = size / 2;
    const radius = 70; 
    
    // We normalize based on a "high" stat value. 
    // Max possible stat (e.g. Blissey HP) is huge (~700), but most stats cap around 400-500.
    const maxScale = 500; 

    const calculatedStats = {
        hp: calcStat('hp', baseStats.hp, ivs.hp, evs.hp, nature, level),
        atk: calcStat('atk', baseStats.atk, ivs.atk, evs.atk, nature, level),
        def: calcStat('def', baseStats.def, ivs.def, evs.def, nature, level),
        spa: calcStat('spa', baseStats.spa, ivs.spa, evs.spa, nature, level),
        spd: calcStat('spd', baseStats.spd, ivs.spd, evs.spd, nature, level),
        spe: calcStat('spe', baseStats.spe, ivs.spe, evs.spe, nature, level),
    };

    const getPoint = (value: number, index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        // Clamp value to maxScale for drawing purposes so it doesn't leave the SVG
        const r = (Math.min(value, maxScale) / maxScale) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    };

    const getLabelPos = (index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = radius + 20;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    // Background shapes
    const bgOuter = STAT_NAMES.map((_, i) => getPoint(maxScale, i, 6)).join(' ');
    const bgMid = STAT_NAMES.map((_, i) => getPoint(maxScale * 0.66, i, 6)).join(' ');
    const bgInner = STAT_NAMES.map((_, i) => getPoint(maxScale * 0.33, i, 6)).join(' ');

    const statPoints = STAT_NAMES.map((stat, i) => getPoint(calculatedStats[stat], i, 6)).join(' ');

    return (
        <div className="flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Real Stats (Lvl 100)</h4>
            <div className="relative">
                <svg width={size} height={size} className="overflow-visible">
                    {/* Grid */}
                    <polygon points={bgOuter} fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                    <polygon points={bgMid} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 2" />
                    <polygon points={bgInner} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 2" />
                    
                    {/* Axes */}
                    {STAT_NAMES.map((_, i) => {
                        const p = getPoint(maxScale, i, 6);
                        return (
                            <line 
                                key={i} 
                                x1={center} y1={center} 
                                x2={p.split(',')[0]} y2={p.split(',')[1]} 
                                stroke="#1e293b" 
                                strokeWidth="1" 
                            />
                        );
                    })}

                    {/* Stat Shape */}
                    <polygon 
                        points={statPoints} 
                        fill={color} 
                        fillOpacity="0.3" 
                        stroke={color} 
                        strokeWidth="2"
                        className="transition-all duration-300 ease-out"
                    />

                    {/* Value Labels on Tips */}
                    {STAT_NAMES.map((stat, i) => {
                        const p = getPoint(calculatedStats[stat], i, 6).split(',');
                        return (
                             <circle key={`dot-${i}`} cx={p[0]} cy={p[1]} r="2" fill="white" />
                        );
                    })}

                    {/* Text Labels */}
                    {STAT_NAMES.map((stat, i) => {
                        const { x, y } = getLabelPos(i, 6);
                        return (
                            <g key={stat}>
                                <text 
                                    x={x} 
                                    y={y - 7} 
                                    textAnchor="middle" 
                                    className="fill-slate-500 text-[9px] uppercase font-bold"
                                >
                                    {stat}
                                </text>
                                <text 
                                    x={x} 
                                    y={y + 3} 
                                    textAnchor="middle" 
                                    className="fill-white text-[10px] font-mono font-bold"
                                >
                                    {calculatedStats[stat]}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
            
            <div className="mt-2 text-[9px] text-slate-600 text-center max-w-[200px] leading-tight">
                Stats calculated with current EVs, IVs (31), and Nature.
            </div>
        </div>
    );
}