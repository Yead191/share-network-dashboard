import { api } from '../../api/baseApi';

const weeklyReportsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getWeeklyReports: build.query({
            query: ({id}) => ({
                url: `/mentor/report/student/${id}`,
                method: 'GET',
            }),
        }),
        addWeeklyReport: build.mutation({
            query: (data: any) => ({
                url: '/mentor/report',
                method: 'POST',
                body: data,
            }),
        }),
        updateWeeklyReport: build.mutation({
            query: (data: any) => ({
                url: `/mentor/report/${data.id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteWeeklyReport: build.mutation({
            query: (id: string) => ({
                url: `/mentor/report/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetWeeklyReportsQuery,
    useAddWeeklyReportMutation,
    useUpdateWeeklyReportMutation,
    useDeleteWeeklyReportMutation,
} = weeklyReportsApi;
