import { api } from '../../api/baseApi';

const adminMentorsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminMentors: builder.query({
            query: ({
                page,
                searchTerm,
                userGroup,
                limit,
            }: {
                page?: number;
                searchTerm?: string;
                userGroup?: string;
                limit?: number;
            }) => {
                const params = new URLSearchParams();
                if (userGroup) params.append('userGroup', userGroup);
                if (searchTerm) params.append('searchTerm', searchTerm);
                params.append('page', (page ?? 0).toString());
                params.append('limit', (limit ?? 0).toString());
                return {
                    url: `/admin-mentor?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        updateAdminMentor: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/admin-mentor/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteAdminMentor: builder.mutation({
            query: (id: string) => ({
                url: `/admin-mentor/${id}`,
                method: 'DELETE',
            }),
        }),
        addMentor: builder.mutation({
            query: ({ data }: { data: any }) => ({
                url: '/admin/create-admin',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAdminMentorsQuery,
    useUpdateAdminMentorMutation,
    useDeleteAdminMentorMutation,
    useAddMentorMutation,
} = adminMentorsApi;
