import { api } from '../../api/baseApi';

const mentorWoopsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMentorWoops: builder.query({
            query: (id) => `/mentor/woops/${id}`,
            providesTags: ['MentorWoops'],
        }),
        createMentorWoops: builder.mutation({
            query: (data) => ({
                url: '/mentor/woops',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['MentorWoops'],
        }),
        updateMentorWoops: builder.mutation({
            query: ({ id, data }) => ({
                url: `/mentor/woops/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['MentorWoops'],
        }),
        deleteMentorWoops: builder.mutation({
            query: (id) => ({
                url: `/mentor/woops/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MentorWoops'],
        }),
    }),
});

export const { 
    useGetMentorWoopsQuery, 
    useCreateMentorWoopsMutation,
    useUpdateMentorWoopsMutation,
    useDeleteMentorWoopsMutation
} = mentorWoopsApi;
