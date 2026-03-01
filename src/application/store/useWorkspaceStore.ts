import { create } from 'zustand';
import { Workspace, Table } from '../../domain/entities';
import { WorkspaceRepository } from '../../infrastructure/repositories/WorkspaceRepository';
import { TableRepository } from '../../infrastructure/repositories/TableRepository';
interface WorkspaceState {
    workspaces: Workspace[];
    tables: Table[];
    isLoading: boolean;
    error: string | null;

    fetchWorkspacesAndTables: () => Promise<void>;
    createWorkspace: (name: string, ownerid: string, description?: string) => Promise<void>;
    createTable: (name: string, workspaceId: string) => Promise<void>;
    deleteWorkspace: (id: string) => Promise<void>;
    deleteTable: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    workspaces: [],
    tables: [],
    isLoading: false,
    error: null,

    fetchWorkspacesAndTables: async () => {

        set({ isLoading: true, error: null });
        try {
            const workspaces = await WorkspaceRepository.getAll();

            const tablesPromises = workspaces.map(w => TableRepository.getAllByWorkspace(w.id));
            const tablesResolved = await Promise.all(tablesPromises);
            const tables = tablesResolved.flat();

            set({ workspaces, tables, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch workspaces', isLoading: false });
        }
    },

    createWorkspace: async (name: string, ownerid: string, description?: string) => {
        set({ isLoading: true, error: null });

        try {
            const newWorkspace = await WorkspaceRepository.create(name, ownerid, description);
            set(state => ({
                workspaces: [...state.workspaces, newWorkspace],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to create workspace', isLoading: false });
        }
    },

    createTable: async (name: string, workspaceId: string) => {
        set({ isLoading: true, error: null });
        try {
            const newTable = await TableRepository.create(name, workspaceId);
            set(state => ({
                tables: [...state.tables, newTable],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to create table', isLoading: false });
        }
    },

    deleteWorkspace: async (id: string) => {
        try {
            await WorkspaceRepository.delete(id);
            set(state => ({
                workspaces: state.workspaces.filter(w => w.id !== id)
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete workspace' });
        }
    },

    deleteTable: async (id: string) => {
        try {
            await TableRepository.delete(id);
            set(state => ({
                tables: state.tables.filter(t => t.id !== id)
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete table' });
        }
    }
}));
