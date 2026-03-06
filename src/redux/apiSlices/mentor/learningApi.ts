import { api } from '../../api/baseApi';

const learningApi = api.injectEndpoints({
    endpoints: (build) => ({
        getLearningMaterials: build.query<any, void>({
            query: () => ({
                url: '/learning?targeteAudience=MENTOR',
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
