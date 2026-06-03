import { api } from '../../api/baseApi';

const adminInternshipApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllInternships: builder.query({
            query: ({ page, limit, searchTerm, sortBy, sortOrder }: { page: number; limit: number; searchTerm: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
                return {
                    url: `/internship`,
                    method: 'GET',
                    params: {
                        page,
                        limit,
                        searchTerm,
                        sortBy,
                        sortOrder,
                    },
                };
            },
        }),
        createInternship: builder.mutation({
            query: (data: any) => {
                return {
                    url: `/internship`,
                    method: 'POST',
                    body: data,
                };
            },
        }),
        updateInternship: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => {
                return {
                    url: `/internship/${id}`,
                    method: 'PATCH',
                    body: data,
                };
            },
        }),
        deleteInternship: builder.mutation({
            query: ({ id }: { id: string }) => {
                return {
                    url: `/internship/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        getInternshipStats: builder.query({
            query: () => {
                return {
                    url: `/internship/stats`,
                    method: 'GET',
                };
            },
        }),
    }),
});

export const {
    useGetAllInternshipsQuery,
    useCreateInternshipMutation,
    useUpdateInternshipMutation,
    useDeleteInternshipMutation,
    useGetInternshipStatsQuery,
} = adminInternshipApi;