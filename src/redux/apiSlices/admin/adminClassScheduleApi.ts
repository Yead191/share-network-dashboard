import { api } from '../../api/baseApi';

const adminClassScheduleApi = api.injectEndpoints({
    endpoints: (build) => ({
        getClassSchedule: build.query({
            query: ({
                page,
                limit,
                searchTerm,
                userGroup,
                userGroupTrack,
                filterType
            }: {
                page: number;
                limit: number;
                searchTerm: string;
                userGroup?: string;
                userGroupTrack?: string;
                filterType?: "upcoming" | "completed"
            }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    searchTerm: searchTerm,
                });
                if (userGroup) params.append('userGroup', userGroup);
                if (userGroupTrack) params.append('userGroupTrack', userGroupTrack);
                if (filterType) params.append('filterType', filterType);

                return {
                    url: `/class?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        addClassSchedule: build.mutation({
            query: ({ data }: { data: any }) => ({
                url: '/class',
                method: 'POST',
                body: data,
            }),
        }),
        updateClassSchedule: build.mutation({
            query: ({ data, id }: { data: any; id: string }) => ({
                url: `/class/${id}`,
                method: 'PATCH',
                body: data,
            }),
        }),
        deleteClassSchedule: build.mutation({
            query: ({ id }: { id: string }) => ({
                url: `/class/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetClassScheduleQuery,
    useAddClassScheduleMutation,
    useUpdateClassScheduleMutation,
    useDeleteClassScheduleMutation,
} = adminClassScheduleApi;
