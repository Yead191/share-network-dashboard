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
            query: () => ({
                url: '/admin-mentor',
                method: 'GET',
            }),
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
