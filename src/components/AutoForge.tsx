import { useState } from 'react';
import { Cpu, Shield, Swords, Zap, Loader2 } from 'lucide-react';
import { AutoForgeEngine } from '../services/engine';
import { TeamMember } from '../types';

interface AutoForgeProps {
    onTeamGenerated: (team: TeamMember[]) => void;
}

export default function AutoForge({ onTeamGenerated }: AutoForgeProps) {
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async (archetype: 'balanced' | 'offense' | 'stall') => {
        setGenerating(true);
        try {
            // Using the new Engine logic instead of hardcoded lists
            const team = await AutoForgeEngine.generateTeam(archetype);
            onTeamGenerated(team);
        } catch (e) {
            console.error(e);
            alert("Forge Critical Failure: API unreachable.");
        } finally {
            setGenerating(false);
        }
    };

    if (generating) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-white tracking-widest animate-pulse">ANALYZING META...</h2>
                <div className="font-mono text-purple-400 mt-2">Calculating Synergies...</div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 h-full overflow-y-auto flex flex-col items-center">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
                        <Cpu className="text-purple-500 w-10 h-10" />
                        AUTO-FORGE <span className="text-purple-500">AI</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Select a tactical directive. The engine will construct a team based on real-time meta usage statistics and type synergy algorithms.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Balanced Engine */}
                    <div onClick={() => handleGenerate('balanced')} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all group rounded-xl p-8 cursor-pointer relative overflow-hidden">
                        <Swords className="w-32 h-32 absolute -right-6 -bottom-6 text-slate-700 group-hover:text-blue-500/20 transition-colors" />
                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Balanced Core</h3>
                        <p className="text-slate-400 mb-6 relative z-10">Optimized for reliability. Mixes defensive pivots with strong wallbreakers.</p>
                        <button className="w-full py-3 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-600 hover:text-white transition-all font-bold flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" /> Initialize
                        </button>
                    </div>

                    {/* Hyper Offense Engine */}
                    <div onClick={() => handleGenerate('offense')} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-red-500 transition-all group rounded-xl p-8 cursor-pointer relative overflow-hidden">
                        <Zap className="w-32 h-32 absolute -right-6 -bottom-6 text-slate-700 group-hover:text-red-500/20 transition-colors" />
                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Hyper Offense</h3>
                        <p className="text-slate-400 mb-6 relative z-10">Maximize speed and damage output. Focuses on sweepers and hazard setters.</p>
                        <button className="w-full py-3 bg-red-600/20 text-red-400 border border-red-500/50 rounded hover:bg-red-600 hover:text-white transition-all font-bold flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" /> Initialize
                        </button>
                    </div>

                    {/* Stall Engine */}
                    <div onClick={() => handleGenerate('stall')} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-green-500 transition-all group rounded-xl p-8 cursor-pointer relative overflow-hidden">
                        <Shield className="w-32 h-32 absolute -right-6 -bottom-6 text-slate-700 group-hover:text-green-500/20 transition-colors" />
                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Iron Wall</h3>
                        <p className="text-slate-400 mb-6 relative z-10">Defensive attrition. Wins through residual damage and unbreakable walls.</p>
                        <button className="w-full py-3 bg-green-600/20 text-green-400 border border-green-500/50 rounded hover:bg-green-600 hover:text-white transition-all font-bold flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" /> Initialize
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}