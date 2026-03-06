import { api } from '../../api/baseApi';

const mentorWoopsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMentorWoops: builder.query({
            query: () => '/mentor/woops',
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
    }),
});

export const { useGetMentorWoopsQuery, useCreateMentorWoopsMutation } = mentorWoopsApi;
