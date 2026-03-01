import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useParams, Link } from 'react-router-dom';
import { MoreHorizontal, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { useBoardStore } from '../../application/store/useBoardStore';

export const BoardView = () => {
    const { boardId } = useParams();
    const {
        currentTable, lists, cards, fetchBoardData, isLoading, error,
        addList, addCard, moveList, moveCard,
        optimisticMoveList, optimisticMoveCard,
        deleteList, deleteCard
    } = useBoardStore();

    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    const [addingCardToListId, setAddingCardToListId] = useState<string | null>(null);
    const [newCardTitle, setNewCardTitle] = useState('');

    useEffect(() => {
        if (boardId) {
            console.log(boardId);
            fetchBoardData(boardId);
            setIsAddingList(false);
            setAddingCardToListId(null);
        }
    }, [boardId, fetchBoardData]);

    const handleAddList = async () => {
        if (!newListTitle.trim() || !boardId) return;
        await addList(boardId, newListTitle);
        setNewListTitle('');
        setIsAddingList(false);
    };

    const handleAddCard = async (listId: string) => {
        if (!newCardTitle.trim()) return;
        if (!boardId) return;
        await addCard(listId, newCardTitle, boardId);
        setNewCardTitle('');
        setAddingCardToListId(null);
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'list') {
            const newLists = Array.from(lists);
            const [removed] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, removed);

            const updatedLists = newLists.map((list, index) => ({ ...list, position: index + 1 }));
            optimisticMoveList(updatedLists);

            moveList(draggableId, destination.index + 1);
            return;
        }

        const destListId = destination.droppableId;
        const sourceListId = source.droppableId;

        const newCards = Array.from(cards);
        const movedCardIndex = newCards.findIndex(c => c.id === draggableId);
        const movedCard = { ...newCards[movedCardIndex], listId: destListId };

        newCards.splice(movedCardIndex, 1);

        const destCards = newCards.filter(c => c.listId === destListId).sort((a, b) => a.position - b.position);

        destCards.splice(destination.index, 0, movedCard);

        const finalizedCards = newCards.map(c => {
            if (c.listId === destListId) {
                const pos = destCards.findIndex(dc => dc.id === c.id) + 1;
                return { ...c, position: pos };
            }
            return c;
        });

        if (!finalizedCards.find(c => c.id === movedCard.id)) {
            const finalPos = destination.index + 1;
            finalizedCards.push({ ...movedCard, position: finalPos });
        }

        optimisticMoveCard(finalizedCards);

        moveCard(draggableId, sourceListId, destListId, destination.index + 1);
    };

    if (isLoading && !currentTable) {
        return <div className="flex-1 flex items-center justify-center">Loading board...</div>;
    }

    if (error && !currentTable) {
        console.log(`current table ${currentTable}`)
        return <div className="flex-1 flex items-center justify-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-board-bg flex-1 flex flex-col overflow-hidden">
            <div className="py-4 px-6 bg-white/40 flex items-center gap-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="text-xl font-bold text-gray-900">{currentTable?.name || `Board ${boardId}`}</h2>
            </div>

            <div className="flex-1 overflow-x-auto py-4 px-6">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" type="list" direction="horizontal">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-4 items-start h-full"
                            >
                                {lists.sort((a, b) => a.position - b.position).map((list, index) => (
                                    <Draggable key={list.id} draggableId={list.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="bg-bg rounded-md w-[280px] min-w-[280px] flex flex-col max-h-full shadow-sm"
                                                style={provided.draggableProps.style}
                                            >
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="py-3 px-4 flex justify-between items-center cursor-grab active:cursor-grabbing"
                                                >
                                                    <h3 className="text-sm font-semibold text-gray-900">{list.name}</h3>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('Delete this list?')) deleteList(list.id);
                                                            }}
                                                            className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-500"
                                                            title="Delete list"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <button className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700">
                                                            <MoreHorizontal size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <Droppable droppableId={list.id} type="card">
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                            className={`px-2 flex-1 overflow-y-auto min-h-[30px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-black/5' : 'bg-transparent'}`}
                                                        >
                                                            {cards
                                                                .filter(c => c.listId === list.id)
                                                                .sort((a, b) => a.position - b.position)
                                                                .map((card, idx) => (
                                                                    <Draggable key={card.id} draggableId={card.id} index={idx}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className={`relative group bg-card p-3 rounded-md mb-2 border border-gray-200 cursor-grab text-sm active:cursor-grabbing ${snapshot.isDragging ? 'shadow-md' : 'shadow-sm'}`}
                                                                                style={provided.draggableProps.style}
                                                                            >
                                                                                {card.title}
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        if (window.confirm('Delete this card?')) deleteCard(card.id);
                                                                                    }}
                                                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white/80 p-0.5 rounded border-none cursor-pointer"
                                                                                    title="Delete card"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>

                                                <div className="p-2">
                                                    {addingCardToListId === list.id ? (
                                                        <div className="bg-white p-2 rounded-md shadow-sm border border-primary">
                                                            <textarea
                                                                autoFocus
                                                                placeholder="Enter a title for this card..."
                                                                className="w-full resize-none outline-none text-sm p-1"
                                                                rows={2}
                                                                value={newCardTitle}
                                                                onChange={e => setNewCardTitle(e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleAddCard(list.id);
                                                                    }
                                                                }}
                                                            />
                                                            <div className="flex items-center justify-between mt-2">
                                                                <button
                                                                    className="bg-primary text-white text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-primary-hover border-none font-medium"
                                                                    onClick={() => handleAddCard(list.id)}
                                                                >
                                                                    Add card
                                                                </button>
                                                                <button
                                                                    className="text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer"
                                                                    onClick={() => { setAddingCardToListId(null); setNewCardTitle(''); }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setAddingCardToListId(list.id)}
                                                            className="w-full flex items-center gap-2 p-2 rounded-md bg-transparent border-none text-gray-500 cursor-pointer text-sm hover:bg-black/5 transition-colors"
                                                        >
                                                            <Plus size={16} />
                                                            Add a card
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                <div className="min-w-[280px]">
                                    {isAddingList ? (
                                        <div className="bg-bg p-2 rounded-md shadow-sm">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Enter list title..."
                                                value={newListTitle}
                                                onChange={e => setNewListTitle(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddList()}
                                                className="w-full p-2 mb-2 border border-primary rounded outline-none text-sm"
                                            />
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={handleAddList}
                                                    className="bg-primary text-white text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-primary-hover border-none font-medium"
                                                >
                                                    Add list
                                                </button>
                                                <button
                                                    onClick={() => setIsAddingList(false)}
                                                    className="text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsAddingList(true)}
                                            className="w-full bg-white/20 hover:bg-white/30 text-gray-900 border-none py-3 px-4 rounded-md flex items-center gap-2 cursor-pointer font-medium transition-colors"
                                        >
                                            <Plus size={20} />
                                            Add another list
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};
