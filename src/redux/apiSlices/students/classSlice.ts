import { api } from '../../api/baseApi';

const classSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getStudentClassSchedule: build.query({
            query: ({ page = 1, limit = 10, searchTerm = '', userGroup, filterType, studentId }: {
                page?: number;
                limit?: number;
                searchTerm?: string;
                userGroup?: string;
                filterType?: string;
                studentId?: string;
            } = {}) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    searchTerm: searchTerm || '',
                });
                if (userGroup) params.append('userGroup', userGroup);
                if (filterType) params.append('filterType', filterType);
                if (studentId) params.append('studentId', studentId);

                return {
                    url: `/class?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
    }),
});

export const { useGetStudentClassScheduleQuery } = classSlice;
