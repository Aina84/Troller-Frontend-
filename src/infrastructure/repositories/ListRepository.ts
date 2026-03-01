import { List } from '../../domain/entities';
import { axiosClient } from '../api/axiosClient';

export const ListRepository = {
    getAllByTable: async (tableId: string): Promise<List[]> => {
        const response = await axiosClient.get<List[]>(`/list/table/${tableId}`);
        return response.data;
    },

    create: async (name: string, tableId: string): Promise<List> => {
        const response = await axiosClient.post<List>('/list', { name, tableId });
        return response.data;
    },

    updatePosition: async (id: string, position: number): Promise<List> => {
        const response = await axiosClient.patch<List>(`/list/${id}`, { position });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(`/list/${id}`);
    }
};
