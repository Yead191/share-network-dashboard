import { api } from '../../api/baseApi';

const assignmentsResources = api.injectEndpoints({
    endpoints: (build) => ({
        getAssignmentsStudent: build.query({
            query: (params?: { userGroup?: string }) => {
                return {
                    url: '/submission-assignment',
                    method: 'GET',
                    params: params?.userGroup ? { userGroup: params.userGroup } : undefined,
                };
            },
        }),

        uplloadAssignment: build.mutation({
            query: ({ assignmentId, formData }) => ({
                url: `/submission-assignment/${assignmentId}`,
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const { useGetAssignmentsStudentQuery, useUplloadAssignmentMutation } = assignmentsResources;
