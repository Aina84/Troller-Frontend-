import { User } from '../../domain/entities';
import { axiosClient } from '../api/axiosClient';

export interface AuthResponse {
    access_token: string;
    user: User;
}

export const AuthRepository = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    },

    register: async (name: string, email: string, _avatar: string, password: string): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/auth/register', { name, email, avatar: "default", password });
        return response.data;
    },

    me: async (): Promise<User> => {
        const response = await axiosClient.get<User>('/auth/me');
        return response.data;
    }
};
