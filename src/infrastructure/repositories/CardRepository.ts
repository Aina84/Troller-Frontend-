import { Card } from '../../domain/entities';
import { axiosClient } from '../api/axiosClient';

export const CardRepository = {
    getAllByList: async (listId: string): Promise<Card[]> => {
        const response = await axiosClient.get<Card[]>(`/card/list/${listId}`);
        return response.data;
    },

    getAllByTable: async (tableId: string): Promise<Card[]> => {
        const response = await axiosClient.get<Card[]>(`/card/table/${tableId}`);
        return response.data;
    },

    create: async (title: string, listId: string, tableId: string): Promise<Card> => {
        const response = await axiosClient.post<Card>('/card', { title, listId, tableId });
        return response.data;
    },

    update: async (id: string, updates: Partial<Card>): Promise<Card> => {
        const response = await axiosClient.patch<Card>(`/card/${id}`, updates);
        return response.data;
    },

    moveCard: async (id: string, listId: string, position: number): Promise<Card> => {
        const response = await axiosClient.patch<Card>(`/card/${id}`, { listId, position });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(`/card/${id}`);
    }
};
