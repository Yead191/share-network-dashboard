import { api } from '../../api/baseApi';

const studentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudentProfile: builder.query({ query: (id: string) => `/student-admin/${id}` }),
        getActiveAssignments: builder.query({ query: ({ userGroup }) => `/assignment?userGroup=${userGroup}` }),
        getStudentUpcomingEvents: builder.query({
            query: ({ targetGroup }) => `/admin-event?targetGroup=${targetGroup}`,
        }),
    }),
});

export const { useGetStudentProfileQuery, useGetActiveAssignmentsQuery, useGetStudentUpcomingEventsQuery } = studentApi;
