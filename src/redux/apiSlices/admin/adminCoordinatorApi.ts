import { api } from '../../api/baseApi';

const adminCoordinatorApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCoordinator: builder.query({
            query: ({ searchTerm, page }) => ({
                url: '/admin/coordinator',
                method: 'GET',
                params: {
                    searchTerm,
                    page,
                    limit: 10,
                },
            }),
        }),
        createCoordinator: builder.mutation({
            query: ({ data }: { data: any }) => ({
                url: '/admin/create-admin',
                method: 'POST',
                body: data,
            }),
        }),
        updateCoordinator: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/user/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteCoordinator: builder.mutation({
            query: (id: string) => ({
                url: `/admin/coordinator/${id}`,
                method: 'DELETE',
            }),
        }),
        getMentors: builder.query({
            query: ({ page, searchTerm, limit, company }: { page?: number; searchTerm?: string; limit?: number; company?: string }) => {
                const params = new URLSearchParams();
                if (searchTerm) params.append('searchTerm', searchTerm);
                params.append('page', (page ?? 1).toString());
                params.append('limit', (limit ?? 10).toString());
                if (company) params.append('company', company);
                return {
                    url: `/admin-mentor?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
    }),
});

export const {
    useGetCoordinatorQuery,
    useCreateCoordinatorMutation,
    useUpdateCoordinatorMutation,
    useDeleteCoordinatorMutation,
    useGetMentorsQuery,
} = adminCoordinatorApi;
