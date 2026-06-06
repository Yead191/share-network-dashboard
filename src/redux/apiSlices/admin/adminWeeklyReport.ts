import { api } from '../../api/baseApi';

const adminWeeklyReportApi = api.injectEndpoints({
    endpoints: (build) => ({
        getWeeklyReport: build.query({
            query: ({ page, limit, searchTerm, mentorId, selectedGroup, startDate, endDate }: { page: number; limit: number; searchTerm: string; mentorId?: string; selectedGroup?: string; startDate?: string; endDate?: string }) => ({
                url: `/mentor/report?page=${page}&limit=${limit}&searchTerm=${searchTerm}${mentorId ? `&mentorId=${mentorId}` : ''}${selectedGroup ? `&selectedGroup=${selectedGroup}` : ''}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`,
                method: 'GET',
            }),
        }),
        createWeeklyReport: build.mutation({
            query: (data: any) => ({
                url: `/mentor/report`,
                method: 'POST',
                body: data,
            }),
        }),
        updateWeeklyReport: build.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/mentor/report/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteWeeklyReport: build.mutation({
            query: (id) => ({
                url: `/mentor/report/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetWeeklyReportQuery,
    useUpdateWeeklyReportMutation,
    useDeleteWeeklyReportMutation,
    useCreateWeeklyReportMutation,
} = adminWeeklyReportApi;
