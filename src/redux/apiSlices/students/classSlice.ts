import { api } from '../../api/baseApi';

const classSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getStudentClassSchedule: build.query({
            query: ({ page, limit, searchTerm, userGroup }) => {
                return {
                    url: `/class?page=${page}&limit=${limit}&searchTerm=${searchTerm}&userGroup=${userGroup}`,
                    method: 'GET',
                };
            },
        }),
    }),
});

export const { useGetStudentClassScheduleQuery } = classSlice;
