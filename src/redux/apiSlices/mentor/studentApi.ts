import { api } from '../../api/baseApi';

const studentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudentProfile: builder.query({ query: (id: string) => `/student-admin/${id}` }),
        getActiveAssignments: builder.query({ query: ({ userGroup }) => `/assignment?userGroup=${userGroup}` }),
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
