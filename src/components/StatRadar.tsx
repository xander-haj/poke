import { STAT_NAMES } from '../data/constants';
import { Stats } from '../types';

interface StatRadarProps {
    stats: Stats;
    evs: Stats;
    color: string;
}

export default function StatRadar({ stats, evs, color }: StatRadarProps) {
    const size = 200;
    const center = size / 2;
    const radius = 70; // usable radius
    const maxStat = 255; // Approximate max base stat for scaling

    // Helper to calculate point coordinates
    const getPoint = (value: number, index: number, total: number, scale = 1) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (value / maxStat) * radius * scale;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    };

    // Helper for labels
    const getLabelPos = (index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = radius + 20; // Text offset
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    const basePoints = STAT_NAMES.map((stat, i) => getPoint(stats[stat], i, 6)).join(' ');
    // We scale EVs a bit differently to make them visible, adding them to base for visualization
    // Or just visualize the total resulting stat? For now, let's visualize the Base Stats shape.
    
    // Background Hexagon
    const bgPoints = STAT_NAMES.map((_, i) => getPoint(maxStat, i, 6)).join(' ');
    const midPoints = STAT_NAMES.map((_, i) => getPoint(maxStat / 2, i, 6)).join(' ');

    return (
        <div className="flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Stat Distribution</h4>
            <div className="relative">
                <svg width={size} height={size} className="overflow-visible">
                    {/* Background Grid */}
                    <polygon points={bgPoints} fill="none" stroke="#1e293b" strokeWidth="1" />
                    <polygon points={midPoints} fill="none" stroke="#1e293b" strokeWidth="1" />
                    
                    {/* Spokes */}
                    {STAT_NAMES.map((_, i) => {
                        const p = getPoint(maxStat, i, 6);
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

                    {/* Data Shape */}
                    <polygon 
                        points={basePoints} 
                        fill={color} 
                        fillOpacity="0.2" 
                        stroke={color} 
                        strokeWidth="2"
                    />

                    {/* Labels */}
                    {STAT_NAMES.map((stat, i) => {
                        const { x, y } = getLabelPos(i, 6);
                        return (
                            <text 
                                key={stat} 
                                x={x} 
                                y={y} 
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                className="fill-slate-400 text-[10px] uppercase font-bold"
                            >
                                {stat}
                            </text>
                        );
                    })}
                </svg>
            </div>
            
            {/* Quick EV Summary below chart */}
            <div className="mt-4 grid grid-cols-3 gap-2 w-full">
                 {STAT_NAMES.map(stat => (
                     evs[stat] > 0 && (
                        <div key={stat} className="text-[10px] text-center bg-slate-800/50 rounded px-1 py-0.5 border border-slate-700">
                            <span className="text-slate-400 uppercase mr-1">{stat}</span>
                            <span className="text-white font-mono">{evs[stat]}</span>
                        </div>
                     )
                 ))}
            </div>
        </div>
    );
}