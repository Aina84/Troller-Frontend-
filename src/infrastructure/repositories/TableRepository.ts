import { Table } from '../../domain/entities';
import { axiosClient } from '../api/axiosClient';

export const TableRepository = {
    getAllByWorkspace: async (workspaceId: string): Promise<Table[]> => {
        const response = await axiosClient.get<Table[]>(`/table/workspace/${workspaceId}`);
        return response.data;
    },

    getById: async (id: string): Promise<Table> => {
        const response = await axiosClient.get<Table>(`/table/${id}`);
        return response.data;
    },

    create: async (name: string, workspaceId: string): Promise<Table> => {
        const response = await axiosClient.post<Table>('/table', { name, workspaceId });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(`/table/${id}`);
    }
};
