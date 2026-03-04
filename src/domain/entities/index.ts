export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt?: string;
}

export interface Workspace {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    createdAt: string;
}

export interface Member {
    id: string;
    cardId?: string;
    userId: string;
    role: 'admin' | 'member';
}

export interface Table {
    id: string;
    name: string;
    workspaceId: string;
    position: number;
    createdAt: string;
}

export interface List {
    id: string;
    name: string;
    tableId: string;
    position: number;
}

export interface Card {
    id: string;
    title: string;
    description?: string;
    listId: string;
    dueDate?: string;
    position: number;
}

export interface Label {
    id: string;
    name: string;
    color: string;
    workspaceId: string;
}

export interface Commentary {
    id: string;
    cardId: string;
    userId: string;
    content: string;
    createdAt: string;
}

export interface Checklist {
    id: string;
    cardId: string;
    title: string;
}

export interface ChecklistItem {
    id: string;
    checklistId: string;
    title: string;
    isDone: boolean;
    description?: string;
    assignedTo?: string;
}

export interface Attachment {
    id: string;
    cardId: string;
    filename: string;
    url: string;
    createdAt: string;
}

export interface Activity {
    id: string;
    userId: string;
    cardId?: string;
    tableId?: string;
    workspaceId?: string;
    action: string;
    createdAt: string;
}
