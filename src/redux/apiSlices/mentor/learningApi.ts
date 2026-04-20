import { api } from '../../api/baseApi';

const learningApi = api.injectEndpoints({
    endpoints: (build) => ({
        getLearningMaterials: build.query<any, any>({
            query: ({ targertGroup, page = 1, limit = 10, searchTerm, targetTrack, targeteAudience }) => {
                const params = new URLSearchParams();
                if (targeteAudience) params.append('targeteAudience', targeteAudience);
                if (targertGroup) params.append('targertGroup', targertGroup);
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (searchTerm) params.append('searchTerm', searchTerm);
                if (targetTrack) params.append('targetTrack', targetTrack);

                return {
                    url: `/learning/all?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        addMaterials: build.mutation({
            query: (data: any) => ({
                url: '/learning',
                method: 'POST',
                body: data,
            }),
        }),
        deleteMaterials: build.mutation({
            query: ({ id }) => ({
                url: `/learning/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetLearningMaterialsQuery, useAddMaterialsMutation, useDeleteMaterialsMutation } = learningApi;
