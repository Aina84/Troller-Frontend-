import React, { useState } from 'react';
import { useBoardStore } from '../../application/store/useBoardStore';
import { CheckCircle2, Circle, User, AlignLeft, Plus, X } from 'lucide-react';

export const ChecklistView = () => {
    const { cards, checklists, checklistItems, updateChecklistItem, addChecklist, addChecklistItem } = useBoardStore();

    const [addingChecklistToCardId, setAddingChecklistToCardId] = useState<string | null>(null);
    const [newChecklistTitle, setNewChecklistTitle] = useState('');

    const [addingItemToChecklistId, setAddingItemToChecklistId] = useState<string | null>(null);
    const [newItemTitle, setNewItemTitle] = useState('');

    const handleToggleStatus = (itemId: string, currentStatus: boolean) => {
        updateChecklistItem(itemId, { isDone: !currentStatus });
    };

    const handleUpdateDescription = (itemId: string, description: string) => {
        updateChecklistItem(itemId, { description });
    };

    const handleUpdateAssignedTo = (itemId: string, assignedTo: string) => {
        updateChecklistItem(itemId, { assignedTo });
    };

    const handleAddChecklist = async (cardId: string) => {
        if (!newChecklistTitle.trim()) return;
        await addChecklist(cardId, newChecklistTitle);
        setNewChecklistTitle('');
        setAddingChecklistToCardId(null);
    };

    const handleAddChecklistItem = async (checklistId: string) => {
        if (!newItemTitle.trim()) return;
        await addChecklistItem(checklistId, newItemTitle);
        setNewItemTitle('');
        setAddingItemToChecklistId(null);
    };

    // Prepare data structure
    const cardsData = cards.map(card => {
        const cardChecklists = checklists.filter(cl => cl.cardId === card.id);
        const cardWithItems = cardChecklists.map(cl => ({
            ...cl,
            items: checklistItems.filter(item => item.checklistId === cl.id)
        }));
        return { ...card, checklists: cardWithItems };
    });

    return (
        <div className="flex-1 overflow-auto p-6 bg-white/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Board Checklists</h2>
                        <p className="text-gray-500 mt-1">Manage and track all checklist items across your cards.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {cardsData.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                            No cards found in this board.
                        </div>
                    ) : (
                        cardsData.map(card => (
                            <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs uppercase tracking-wider">Card</span>
                                        {card.title}
                                    </h3>

                                    {!addingChecklistToCardId && (
                                        <button
                                            onClick={() => setAddingChecklistToCardId(card.id)}
                                            className="text-primary hover:text-primary-hover flex items-center gap-1 text-xs font-semibold border-none bg-transparent cursor-pointer"
                                        >
                                            <Plus size={14} /> Add Checklist
                                        </button>
                                    )}
                                </div>

                                <div className="p-0">
                                    {addingChecklistToCardId === card.id && (
                                        <div className="px-6 py-4 bg-primary/5 border-b border-gray-100 flex gap-2">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Checklist title..."
                                                value={newChecklistTitle}
                                                onChange={e => setNewChecklistTitle(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddChecklist(card.id)}
                                                className="flex-1 text-sm border border-gray-300 rounded px-3 py-1.5 focus:border-primary outline-none"
                                            />
                                            <button
                                                onClick={() => handleAddChecklist(card.id)}
                                                className="bg-primary text-white text-xs px-3 py-1.5 rounded font-medium border-none cursor-pointer"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => setAddingChecklistToCardId(null)}
                                                className="text-gray-500 hover:text-gray-700 p-1.5 border-none bg-transparent cursor-pointer"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}

                                    {card.checklists.length === 0 ? (
                                        <div className="px-6 py-8 text-center text-gray-400 text-sm">
                                            No checklists yet for this card.
                                        </div>
                                    ) : (
                                        card.checklists.map(cl => (
                                            <div key={cl.id} className="border-b border-gray-100 last:border-none">
                                                <div className="px-6 py-2 bg-gray-50/30 flex justify-between items-center">
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-tighter">{cl.title}</h4>
                                                    <button
                                                        onClick={() => setAddingItemToChecklistId(cl.id)}
                                                        className="text-gray-400 hover:text-primary p-1 border-none bg-transparent cursor-pointer"
                                                        title="Add item"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <table className="w-full text-left border-collapse">
                                                    <tbody className="divide-y divide-gray-50">
                                                        {cl.items.map(item => (
                                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                                                <td className="px-6 py-3 w-1/4">
                                                                    <div className="text-sm font-medium text-gray-700">{item.title}</div>
                                                                </td>
                                                                <td className="px-6 py-3 w-12 text-center">
                                                                    <button
                                                                        onClick={() => handleToggleStatus(item.id, item.isDone)}
                                                                        className={`p-1 rounded-full transition-colors border-none bg-transparent cursor-pointer ${item.isDone ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                                                                    >
                                                                        {item.isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                                                    </button>
                                                                </td>
                                                                <td className="px-6 py-3 w-1/3">
                                                                    <div className="flex items-center gap-2">
                                                                        <AlignLeft size={14} className="text-gray-400 flex-shrink-0" />
                                                                        <input
                                                                            type="text"
                                                                            value={item.description || ''}
                                                                            onChange={(e) => handleUpdateDescription(item.id, e.target.value)}
                                                                            placeholder="Add description..."
                                                                            className="w-full text-sm bg-transparent border-none focus:outline-none text-gray-600 placeholder:text-gray-400 focus:bg-gray-100 px-2 py-1 rounded transition-colors"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <User size={14} className="text-gray-400 flex-shrink-0" />
                                                                        <input
                                                                            type="text"
                                                                            value={item.assignedTo || ''}
                                                                            onChange={(e) => handleUpdateAssignedTo(item.id, e.target.value)}
                                                                            placeholder="Assign to..."
                                                                            className="w-full text-sm bg-transparent border-none focus:outline-none text-gray-600 placeholder:text-gray-400 focus:bg-gray-100 px-2 py-1 rounded transition-colors"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {addingItemToChecklistId === cl.id && (
                                                            <tr className="bg-primary/5">
                                                                <td colSpan={4} className="px-6 py-2">
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            autoFocus
                                                                            type="text"
                                                                            placeholder="New item title..."
                                                                            value={newItemTitle}
                                                                            onChange={e => setNewItemTitle(e.target.value)}
                                                                            onKeyDown={e => e.key === 'Enter' && handleAddChecklistItem(cl.id)}
                                                                            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:border-primary outline-none"
                                                                        />
                                                                        <button
                                                                            onClick={() => handleAddChecklistItem(cl.id)}
                                                                            className="bg-primary text-white text-xs px-3 py-1 rounded font-medium border-none cursor-pointer"
                                                                        >
                                                                            Add
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setAddingItemToChecklistId(null)}
                                                                            className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer"
                                                                        >
                                                                            <X size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
