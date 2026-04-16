import { api } from '../../api/baseApi';

const classSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getStudentClassSchedule: build.query({
            query: ({ page, limit, searchTerm, userGroup, filterType }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    searchTerm: searchTerm,
                });
                if (userGroup) params.append('userGroup', userGroup);
                if (filterType) params.append('filterType', filterType);

                return {
                    url: `/class?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
    }),
});

export const { useGetStudentClassScheduleQuery } = classSlice;
