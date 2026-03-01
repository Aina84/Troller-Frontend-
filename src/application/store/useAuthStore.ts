import { create } from 'zustand';
import { User } from '../../domain/entities';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('troller_token'),
    setAuth: (user, token) => {
        localStorage.setItem('troller_token', token);
        set({ user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('troller_token');
        set({ user: null, isAuthenticated: false });
    },
}));
