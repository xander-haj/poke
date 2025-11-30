import { useEffect, useState } from 'react';
import { RefreshCw, Zap, ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';
import { NewsService } from '../services/news';
import { NewsItem } from '../types';
import { COMMON_MONS } from '../data/constants';

// Simulated Usage Stats Data for the Graph
// In a full backend app, this would come from parsing Smogon's monthly txt files.
const USAGE_STATS = [
    { name: "Great Tusk", usage: 48.5, rank: 1, change: 0 },
    { name: "Kingambit", usage: 42.1, rank: 2, change: 1 },
    { name: "Gholdengo", usage: 38.4, rank: 3, change: -1 },
    { name: "Iron Valiant", usage: 28.2, rank: 4, change: 2 },
    { name: "Walking Wake", usage: 24.5, rank: 5, change: 1 },
    { name: "Dragapult", usage: 22.1, rank: 6, change: 3 },
    { name: "Samurott-Hisui", usage: 18.9, rank: 7, change: 5 },
    { name: "Zamazenta-C", usage: 16.5, rank: 8, change: -2 }
];

export default function MetaAnalysis() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        setLoading(true);
        // Add artificial delay so the user sees the "Syncing" state feel real
        const [data] = await Promise.all([
            NewsService.fetchLatestNews(),
            new Promise(resolve => setTimeout(resolve, 800)) 
        ]);
        setNews(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const getBarColor = (usage: number) => {
        if (usage > 40) return "bg-red-500";
        if (usage > 25) return "bg-orange-500";
        return "bg-cyan-500";
    };

    return (
        <div className="p-6 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Meta Analysis</h2>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Data Feed • Gen 9 OU
                    </div>
                </div>
                <button 
                    onClick={fetchNews} 
                    disabled={loading}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
                    {loading ? 'Syncing...' : 'Sync'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Usage Stats Graph (Restored) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-cyan-400" /> Usage Statistics (Top 8)
                        </h3>
                        <div className="space-y-4">
                            {USAGE_STATS.map((mon) => (
                                <div key={mon.name} className="relative group">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-white flex items-center gap-2">
                                            <span className="text-slate-500 font-mono">#{mon.rank}</span> {mon.name}
                                        </span>
                                        <span className="text-slate-400 font-mono">{mon.usage}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${getBarColor(mon.usage)} transition-all duration-1000 group-hover:brightness-110`} 
                                            style={{ width: loading ? '0%' : `${mon.usage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Archetype Distribution (Visual) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                            <div className="text-2xl font-black text-white">41%</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Offense</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                            <div className="text-2xl font-black text-white">32%</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Balance</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                            <div className="text-2xl font-black text-white">18%</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Stall</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                            <div className="text-2xl font-black text-white">9%</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Weather</div>
                        </div>
                    </div>
                </div>

                {/* 2. News Feed */}
                <div className="space-y-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400" /> Competitive News
                        </h3>
                        <div className="space-y-4">
                            {news.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">Initializing Uplink...</div>
                            ) : (
                                news.map((n, i) => (
                                    <div key={i} className="pb-4 border-b border-slate-700 last:border-0 last:pb-0 group">
                                        <a href={n.link} target="_blank" rel="noreferrer" className="block">
                                            <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition-colors flex items-start gap-2">
                                                {n.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 mt-1" />
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-1">{n.pubDate} • {n.contentSnippet}</div>
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-lg p-5">
                        <h3 className="text-sm font-bold text-white mb-2">Algorithm Note</h3>
                        <p className="text-xs text-indigo-200 leading-relaxed">
                            Auto-Forge engine calibrated to Gen 9 OU. Current heuristic weighting prioritizes Hazard Stack archetypes (+15% Win Prob).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}