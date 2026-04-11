import { api } from '../../api/baseApi';

const learningApi = api.injectEndpoints({
    endpoints: (build) => ({
        getLearningMaterials: build.query<any, any>({
            query: ({ targertGroup, page = 1, limit = 10, searchTerm, targetTrack }) => ({
                url: `/learning?targeteAudience=MENTOR&targertGroup=${targertGroup}&page=${page}&limit=${limit}&searchTerm=${searchTerm}${targetTrack ? `&targetTrack=${targetTrack}` : ''}`,
                method: 'GET',
            }),
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
