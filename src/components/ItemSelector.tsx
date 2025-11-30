import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { capitalize } from '../utils/calc';
import { PokeService } from '../services/pokeapi';
import { ItemCategory } from '../types';

interface ItemSelectorProps {
    selectedItem: string;
    onSelect: (item: string) => void;
}

export default function ItemSelector({ selectedItem, onSelect }: ItemSelectorProps) {
    const [categories, setCategories] = useState<ItemCategory[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        PokeService.fetchAllItems().then(setCategories);
    }, []);

    // Flatten for search
    const allItems = categories.flatMap(c => c.items);
    const filteredItems = filter 
        ? allItems.filter(i => i.includes(filter.toLowerCase())) 
        : [];

    return (
        <div className="relative">
            <label className="block text-xs text-slate-500 mb-1">Held Item</label>
            <div 
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus-within:border-cyan-500 flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedItem ? 'text-white' : 'text-slate-500'}>
                    {selectedItem ? capitalize(selectedItem) : 'Select Item...'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl mt-1 max-h-80 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-slate-800 border-b border-slate-700">
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Search items..." 
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-cyan-500"
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    
                    {filter ? (
                        <div className="p-1">
                            {filteredItems.map(item => (
                                <div 
                                    key={item}
                                    onClick={() => { onSelect(item); setIsOpen(false); setFilter(''); }}
                                    className="px-3 py-1.5 hover:bg-slate-700 text-sm text-slate-300 cursor-pointer rounded"
                                >
                                    {capitalize(item)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-1">
                            {categories.map(cat => (
                                <div key={cat.name} className="mb-2">
                                    <div className="px-2 py-1 text-[10px] font-bold text-cyan-500 uppercase tracking-wider bg-slate-900/50">
                                        {cat.name}
                                    </div>
                                    {cat.items.map(item => (
                                        <div 
                                            key={item}
                                            onClick={() => { onSelect(item); setIsOpen(false); }}
                                            className={`px-3 py-1.5 hover:bg-slate-700 text-sm cursor-pointer rounded ${selectedItem === item ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
                                        >
                                            {capitalize(item)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
}