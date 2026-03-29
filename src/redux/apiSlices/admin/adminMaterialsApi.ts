import { api } from '../../api/baseApi';

const adminMaterialsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getMaterials: build.query({
            query: ({
                page,
                limit,
                searchTerm,
                targeteAudience,
                targertGroup,
            }: {
                page: number;
                limit: number;
                searchTerm: string;
                targeteAudience?: string;
                targertGroup?: string;
            }) => {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                    searchTerm: searchTerm || '',
                });

                if (targeteAudience) params.append('targeteAudience', targeteAudience);
                if (targertGroup) params.append('targertGroup', targertGroup);

                return {
                    url: `/learning?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        addMaterials: build.mutation({
            query: ( data: any ) => { 
                return {
                    url: '/learning',
                    method: 'POST',
                    body: data,
                }
            },
        }),
        updateMaterials: build.mutation({
            query: ({ data, id }: { data: any; id: string }) => ({
                url: `/learning/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteMaterials: build.mutation({
            query: ({ id }: { id: string }) => ({
                url: `/learning/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetMaterialsQuery,
    useAddMaterialsMutation,
    useUpdateMaterialsMutation,
    useDeleteMaterialsMutation,
} = adminMaterialsApi;
