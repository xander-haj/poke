import { Box, Swords, Cpu, TrendingUp } from 'lucide-react';

interface SidebarProps {
    view: string;
    setView: (view: string) => void;
}

export default function Sidebar({ view, setView }: SidebarProps) {
    const navItems = [
        { id: 'builder', icon: Swords, label: 'Team Builder' },
        { id: 'forge', icon: Cpu, label: 'Auto-Forge', badge: 'New' },
        { id: 'meta', icon: TrendingUp, label: 'Meta Analysis' },
    ];

    return (
        <aside className="w-20 md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300">
            <div className="p-4 border-b border-slate-800 flex items-center justify-center md:justify-start gap-3">
                <Box className="text-cyan-400 w-8 h-8 md:w-6 md:h-6" />
                <h1 className="hidden md:block text-xl font-bold tracking-tighter italic text-cyan-400">
                    META<span className="text-white">FORGE</span>
                </h1>
            </div>

            <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            view === item.id
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="hidden md:inline font-medium">{item.label}</span>
                        {item.badge && (
                            <span className="hidden md:inline ml-auto text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded uppercase font-bold">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 bg-slate-800/50 hidden md:block">
                <div className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">Format</div>
                <select className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded p-2 text-sm focus:border-cyan-500 outline-none">
                    <option>Gen 9 OU</option>
                    <option>Gen 9 VGC</option>
                    <option>National Dex</option>
                </select>
            </div>
        </aside>
    );
}