import { api } from '../../api/baseApi';

const studentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudentProfile: builder.query({ query: (id: string) => `/student-admin/${id}` }),
        getActiveAssignments: builder.query({
            query: ({ userGroup, studentId }: { userGroup?: string; studentId?: string }) => {
                const params = new URLSearchParams();
                if (userGroup) params.append('userGroup', userGroup);
                if (studentId) params.append('studentId', studentId);
                return `/assignment?${params.toString()}`;
            },
        }),
        getStudentUpcomingEvents: builder.query({
            query: ({ targetGroup }) => `/admin-event?targetGroup=${targetGroup}`,
        }),
        getStudentSchedule: builder.query({
            query: ({ userGroup, userGroupTrack, filterType }) => `/class?userGroup=${userGroup}&filterType=${filterType}${userGroupTrack ? `&userGroupTrack=${userGroupTrack}` : ''
                }`
        }),
    }),
});

export const { useGetStudentProfileQuery, useGetActiveAssignmentsQuery, useGetStudentUpcomingEventsQuery, useGetStudentScheduleQuery } = studentApi;
