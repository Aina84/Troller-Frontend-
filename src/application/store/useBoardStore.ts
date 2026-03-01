import { create } from 'zustand';
import { List, Card, Table } from '../../domain/entities';
import { ListRepository } from '../../infrastructure/repositories/ListRepository';
import { CardRepository } from '../../infrastructure/repositories/CardRepository';
import { TableRepository } from '../../infrastructure/repositories/TableRepository';

interface BoardState {
    currentTable: Table | null;
    lists: List[];
    cards: Card[];
    isLoading: boolean;
    error: string | null;

    fetchBoardData: (tableId: string) => Promise<void>;
    addList: (tableId: string, name: string) => Promise<void>;
    addCard: (listId: string, title: string, tableId: string) => Promise<void>;
    moveList: (listId: string, newPosition: number) => Promise<void>;
    moveCard: (cardId: string, sourceListId: string, destListId: string, newPosition: number) => Promise<void>;

    deleteList: (id: string) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;

    optimisticMoveList: (lists: List[]) => void;
    optimisticMoveCard: (cards: Card[]) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    currentTable: null,
    lists: [],
    cards: [],
    isLoading: false,
    error: null,

    fetchBoardData: async (tableId: string) => {
        set({ isLoading: true, error: null });
        try {
            const [table, lists] = await Promise.all([
                TableRepository.getById(tableId),
                ListRepository.getAllByTable(tableId),
                CardRepository.getAllByTable(tableId)
            ]);
            set({ currentTable: table, lists, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch board data', isLoading: false });
        }
    },

    addList: async (tableId: string, name: string) => {
        try {
            const newList = await ListRepository.create(name, tableId);
            set(state => ({ lists: [...state.lists, newList] }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to create list' });
        }
    },

    addCard: async (listId: string, title: string, tableId: string) => {
        try {
            const newCard = await CardRepository.create(title, listId, tableId);
            set(state => ({ cards: [...state.cards, newCard] }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to create card' });
        }
    },

    optimisticMoveList: (lists: List[]) => {
        set({ lists });
    },

    optimisticMoveCard: (cards: Card[]) => {
        set({ cards });
    },

    moveList: async (listId: string, newPosition: number) => {
        try {
            await ListRepository.updatePosition(listId, newPosition);
        } catch (error: any) {
            set({ error: error.message || 'Failed to move list' });
        }
    },

    moveCard: async (cardId: string, _sourceListId: string, destListId: string, newPosition: number) => {
        try {
            await CardRepository.moveCard(cardId, destListId, newPosition);
        } catch (error: any) {
            set({ error: error.message || 'Failed to move card' });
        }
    },

    deleteList: async (id: string) => {
        try {
            await ListRepository.delete(id);
            set(state => ({ lists: state.lists.filter(l => l.id !== id) }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete list' });
        }
    },

    deleteCard: async (id: string) => {
        try {
            await CardRepository.delete(id);
            set(state => ({ cards: state.cards.filter(c => c.id !== id) }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete card' });
        }
    }
}));
