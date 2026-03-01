import { Workspace } from '../../domain/entities';
import { axiosClient } from '../api/axiosClient';

export const WorkspaceRepository = {
    getAll: async (): Promise<Workspace[]> => {
        const response = await axiosClient.get<Workspace[]>('/workspace');
        return response.data;
    },

    getById: async (id: string): Promise<Workspace> => {
        const response = await axiosClient.get<Workspace>(`/workspace/${id}`);
        return response.data;
    },

    create: async (name: string, owner: string, description?: string): Promise<Workspace> => {
        const response = await axiosClient.post<Workspace>('/workspace', { name, description, owner: Number(owner) });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(`/workspace/${id}`);
    }
};
