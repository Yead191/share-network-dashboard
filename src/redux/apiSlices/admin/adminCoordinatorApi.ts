import { api } from '../../api/baseApi';

const adminCoordinatorApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCoordinator: builder.query({
            query: () => ({
                url: '/admin/coordinator',
                method: 'GET',
            }),
        }),
        createCoordinator: builder.mutation({
            query: ({ data }: { data: any }) => ({
                url: '/admin/create-admin',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useGetCoordinatorQuery, useCreateCoordinatorMutation } = adminCoordinatorApi;
