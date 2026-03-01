import { Member } from '../../domain/entities';
import { axiosClient } from '../api/axiosClient';

export const MemberRepository = {
    inviteUserToWorkspace: async (workspaceId: string, email: string, role: string): Promise<Member> => {
        const response = await axiosClient.post<Member>(`/workspace/${workspaceId}/members`, { email, role });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(`/member/${id}`);
    }
};
