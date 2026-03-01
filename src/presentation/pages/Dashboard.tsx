import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useWorkspaceStore } from '../../application/store/useWorkspaceStore';
import { useAuthStore } from '../../application/store/useAuthStore';

export const Dashboard = () => {
    const user = useAuthStore(state => state.user);
    const { workspaces, tables, isLoading, fetchWorkspacesAndTables, createWorkspace, createTable, deleteWorkspace, deleteTable } = useWorkspaceStore();
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

    const [activeWorkspaceIdForNewTable, setActiveWorkspaceIdForNewTable] = useState<string | null>(null);
    const [newTableName, setNewTableName] = useState('');

    useEffect(() => {
        fetchWorkspacesAndTables();
    }, [fetchWorkspacesAndTables]);

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) return;
        if (!user) return;
        await createWorkspace(newWorkspaceName, user.id);
        setNewWorkspaceName('');
        setIsCreatingWorkspace(false);
    };

    const handleCreateTable = async (workspaceId: string) => {
        if (!newTableName.trim()) return;
        await createTable(newTableName, workspaceId);
        setNewTableName('');
        setActiveWorkspaceIdForNewTable(null);
    };

    if (isLoading && workspaces.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading workspaces...</div>;
    }

    return (
        <div className="p-8 max-w-[1200px] mx-auto w-full">
            <div className="mb-12 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Your Workspaces</h1>

                {!isCreatingWorkspace ? (
                    <button
                        onClick={() => setIsCreatingWorkspace(true)}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                    >
                        Create Workspace
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Workspace name..."
                            value={newWorkspaceName}
                            onChange={e => setNewWorkspaceName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreateWorkspace()}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
                        />
                        <button
                            onClick={handleCreateWorkspace}
                            className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary-hover"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => { setIsCreatingWorkspace(false); setNewWorkspaceName(''); }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {workspaces.length === 0 && !isCreatingWorkspace && !isLoading && (
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-lg text-gray-500">
                    No workspaces found. Create one to get started!
                </div>
            )}

            {workspaces.map(workspace => (
                <div key={workspace.id} className="mb-12">
                    <h2 className="text-2xl mb-6 flex items-center gap-2 font-semibold">
                        {workspace.name}
                        <button
                            onClick={() => { if (window.confirm('Delete this workspace?')) deleteWorkspace(workspace.id); }}
                            className="text-gray-400 hover:text-red-500 ml-4 cursor-pointer bg-transparent border-none"
                            title="Delete Workspace"
                        >
                            <Trash2 size={18} />
                        </button>
                    </h2>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                        {tables.filter(t => t.workspaceId === workspace.id).map(table => (
                            <div key={table.id} className="relative group block">
                                <Link
                                    to={`/b/${table.id}`}
                                    className="bg-card p-4 rounded-md shadow-sm border border-gray-200 h-[100px] flex font-medium transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                                >
                                    {table.name}
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (window.confirm('Delete this board?')) deleteTable(table.id);
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity bg-white/80 p-1 rounded border-none cursor-pointer"
                                    title="Delete Board"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        {activeWorkspaceIdForNewTable === workspace.id ? (
                            <div className="bg-card p-4 rounded-md shadow-sm border border-primary h-[100px] flex flex-col justify-between">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Board title"
                                    value={newTableName}
                                    onChange={e => setNewTableName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCreateTable(workspace.id)}
                                    className="border-b border-gray-300 outline-none text-sm pb-1 mb-2"
                                />
                                <div className="flex gap-2 text-sm justify-end">
                                    <button onClick={() => { setActiveWorkspaceIdForNewTable(null); setNewTableName(''); }} className="text-gray-500 hover:text-gray-700 cursor-pointer border-none bg-transparent">Cancel</button>
                                    <button onClick={() => handleCreateTable(workspace.id)} className="text-primary font-medium hover:text-primary-hover cursor-pointer border-none bg-transparent">Create</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setActiveWorkspaceIdForNewTable(workspace.id)}
                                className="bg-black/5 border border-dashed border-gray-500 p-4 rounded-md h-[100px] flex items-center justify-center gap-2 text-gray-500 cursor-pointer transition-colors hover:bg-black/10"
                            >
                                <Plus size={20} />
                                Create new board
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
