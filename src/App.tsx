import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TeamBuilder from './components/TeamBuilder';
import AutoForge from './components/AutoForge';
import MetaAnalysis from './components/MetaAnalysis';
import { TeamMember } from './types';

function App() {
    const [view, setView] = useState('builder');
    const [selectedSlot, setSelectedSlot] = useState(0);

    const [team, setTeam] = useState<TeamMember[]>(
        Array(6).fill(null).map(() => ({
            id: Math.random().toString(36),
            pokemon: null,
            nickname: '',
            item: '',
            ability: '',
            nature: 'Serious',
            moves: [null, null, null, null],
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            teraType: 'normal',
            shiny: false
        }))
    );

    const handleAutoForgeComplete = (newTeam: TeamMember[]) => {
        const fullTeam = [...newTeam];
        while (fullTeam.length < 6) {
             fullTeam.push({
                id: Math.random().toString(36),
                pokemon: null, nickname: '', item: '', ability: '', nature: 'Serious',
                moves: [null, null, null, null],
                evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
                ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
                teraType: 'normal',
                shiny: false
             });
        }
        setTeam(fullTeam);
        setView('builder');
        alert("Auto-Forge Complete: Team optimized for current parameters.");
    };

    return (
        <div className="flex w-full h-full bg-slate-950 text-slate-300">
            <Sidebar view={view} setView={setView} />
            <main className="flex-1 min-w-0 overflow-hidden relative">
                {view === 'builder' && (
                    <TeamBuilder 
                        team={team} 
                        setTeam={setTeam} 
                        selectedSlot={selectedSlot} 
                        setSelectedSlot={setSelectedSlot} 
                    />
                )}
                {view === 'forge' && <AutoForge onTeamGenerated={handleAutoForgeComplete} />}
                {view === 'meta' && <MetaAnalysis />}
            </main>
        </div>
    );
}

export default App;