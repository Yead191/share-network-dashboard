import { api } from '../../api/baseApi';

const adminStudentApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllStudents: build.query({
            query: ({ page, searchTerm }: { page: number; searchTerm: string }) => ({
                url: `/student-admin`,
                method: 'GET',
                params: {
                    page,
                    limit: 10,
                    searchTerm,
                },
            }),
        }),
        updateStudent: build.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/user/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        updateMentor: build.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/user/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        getUserGroups: build.query({
            query: () => ({
                url: `/user-group`,
                method: 'GET',
            }),
        }),
        getUserTracks: build.query({
            query: () => ({
                url: `/user-group/tracks`,
                method: 'GET',
            }),
        }),
        deleteStudent: build.mutation({
            query: (id: string) => ({
                url: `/auth/delete-account/${id}`,
                method: 'DELETE',
            }),
        }),

        // GOALS
        getAllGoals: build.query({
            query: () => ({
                url: `/goal`,
                method: 'GET',
            }),
        }),
        createGoal: build.mutation({
            query: ({ studentId, data }) => {
                return {
                    url: `/goal/${studentId}`,
                    method: 'PUT',
                    body: data,
                };
            },
        }),
        updateGoal: build.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/goal/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteGoal: build.mutation({
            query: (id: string) => ({
                url: `/goal/${id}`,
                method: 'DELETE',
            }),
        }),

        // ATTENDANCE
        takeAttendance: build.mutation({
            query: (data: any) => ({
                url: `/student-attendance`,
                method: 'POST',
                body: data,
            }),
        }),
        getAllClasses: build.query({
            query: () => ({
                url: `/class`,
                method: 'GET',
            }),
        }),
        getAttendanceLogs: build.query({
            query: ({ classId, date }: { classId: string; date: string }) => ({
                url: `/student-attendance`,
                method: 'GET',
                params: {
                    classId,
                    date,
                },
            }),
        }),
        updateIndividualAttendance: build.mutation({
            query: (data: any) => ({
                url: `/student-attendance/update-student-status`,
                method: 'PATCH',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAllStudentsQuery,
    useUpdateStudentMutation,
    useUpdateMentorMutation,
    useGetUserGroupsQuery,
    useGetUserTracksQuery,
    useGetAllGoalsQuery,
    useCreateGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
    useTakeAttendanceMutation,
    useGetAllClassesQuery,
    useDeleteStudentMutation,
    useGetAttendanceLogsQuery,
    useUpdateIndividualAttendanceMutation,
} = adminStudentApi;
