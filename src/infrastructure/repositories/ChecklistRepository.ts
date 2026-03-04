import { Checklist, ChecklistItem } from '../../domain/entities';
import { axiosClient } from '../api/axiosClient';

export const ChecklistRepository = {
    getAll: async (): Promise<Checklist[]> => {
        const response = await axiosClient.get<Checklist[]>('/checklist');
        return response.data;
    },

    getById: async (id: string): Promise<Checklist> => {
        const response = await axiosClient.get<Checklist>(`/checklist/${id}`);
        return response.data;
    },

    create: async (cardId: string, title: string): Promise<Checklist> => {
        const response = await axiosClient.post<Checklist>('/checklist', { cardId, title });
        return response.data;
    },

    update: async (id: string, updates: Partial<Checklist>): Promise<Checklist> => {
        const response = await axiosClient.patch<Checklist>(`/checklist/${id}`, updates);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(`/checklist/${id}`);
    },

    // Checklist Items
    getAllItems: async (): Promise<ChecklistItem[]> => {
        const response = await axiosClient.get<ChecklistItem[]>('/checklistitem');
        return response.data;
    },

    getItemById: async (id: string): Promise<ChecklistItem> => {
        const response = await axiosClient.get<ChecklistItem>(`/checklistitem/${id}`);
        return response.data;
    },

    createItem: async (checklistId: string, title: string): Promise<ChecklistItem> => {
        const response = await axiosClient.post<ChecklistItem>('/checklistitem', { checklistId, title });
        return response.data;
    },

    updateItem: async (id: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem> => {
        const response = await axiosClient.patch<ChecklistItem>(`/checklistitem/${id}`, updates);
        return response.data;
    },

    deleteItem: async (id: string): Promise<void> => {
        await axiosClient.delete(`/checklistitem/${id}`);
    }
};
