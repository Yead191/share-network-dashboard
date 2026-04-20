import { api } from '../../api/baseApi';

const resourcesStudents = api.injectEndpoints({
    endpoints: (build) => ({
        getStudentResources: build.query({
            query: ({ page = 1, limit = 10, targeteAudience, targertGroup, searchTerm, type }: any) => {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (searchTerm) params.append('searchTerm', searchTerm);
                if (targeteAudience) {
                    params.append('targeteAudience', targeteAudience);
                } else {
                    params.append('targeteAudience', 'STUDENT');
                }
                if (targertGroup) params.append('targertGroup', targertGroup);
                if (type && type !== 'ALL') params.append('type', type);

                return {
                    url: `/learning/all?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
    }),
});

export const { useGetStudentResourcesQuery } = resourcesStudents;
