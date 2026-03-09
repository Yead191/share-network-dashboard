import { api } from '../../api/baseApi';

const resourcesStudents = api.injectEndpoints({
    endpoints: (build) => ({
        getStudentResources: build.query({
            query: ({ page = 1, limit = 10 }) => {
                console.log(page, limit);
                return {
                    url: `/learning?targeteAudience=STUDENT&page=${page}&limit=${limit}`,
                    method: 'GET',
                };
            },
        }),
    }),
});

export const { useGetStudentResourcesQuery } = resourcesStudents;
