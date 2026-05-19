import { api } from "../../api/baseApi";

const groupScheduleSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getClassesSchedule: build.query({
            query: ({ page, limit, searchTerm, userGroup, filterType }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    searchTerm: searchTerm,
                });
                // if (userGroup?.length) {
                //     userGroup.forEach((id: string, index: number) => {
                //         params.append(`userGroup[${index}]`, id);
                //     });
                // }
                if (userGroup?.length) {
                    if (userGroup) {
                        const groups = Array.isArray(userGroup)
                            ? userGroup
                            : [userGroup];

                        groups.forEach((id: string, index: number) => {
                            params.append(`userGroup[${index}]`, id);
                        });
                    }
                }
                if (filterType) params.append('filterType', filterType);

                return {
                    url: `/class?${params.toString()}`,
                    method: 'GET',
                };
            },

        }),
        updateStatus: build.mutation({
            query: ({ id, status }) => {
                return {
                    url: `/coordinator/classes/${id}`,
                    method: "PATCH",
                    body: { status },
                }
            },
        }),
    }),
});

export const {
    useGetClassesScheduleQuery,
    useUpdateStatusMutation

} = groupScheduleSlice;