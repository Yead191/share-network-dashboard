import { IRecentActivitiesResponse } from '../../../types/teacher/home/activity.types';
import { IGetAllClassesResponse } from '../../../types/teacher/home/class.type';
import { ITeacherOverview } from '../../../types/teacher/home/overview.types';
import { IMyStudentsResponse } from '../../../types/teacher/home/stundent.type';
import { api } from '../../api/baseApi';

const homeSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getOverViewTeacher: build.query<{ data: ITeacherOverview }, void>({
            query: () => {
                return {
                    url: '/teacher/overview',
                    method: 'GET',
                    cache: 'no-store',
                };
            },
        }),

        getTeacherClasses: build.query<IGetAllClassesResponse, any>({
            query: ({ page, limit, searchTerm, userGroup, filterType }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    searchTerm: searchTerm,
                });
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
                if (filterType) {
                    params.append('filterType', filterType);
                }
                return {
                    url: '/class',
                    method: 'GET',
                    params,
                    cache: 'no-store',
                };
            },
            providesTags: ['Class'],
        }),

        addClassTeacher: build.mutation({
            query: (data) => {
                return {
                    url: '/class',
                    method: 'POST',
                    body: data,
                };
            },
            invalidatesTags: ['Class'],
        }),

        updateClassTeacher: build.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/class/${id}`,
                    method: 'PATCH',
                    body: data,
                };
            },
            invalidatesTags: ['Class'],
        }),

        deleteClassTeacher: build.mutation({
            query: (id) => {
                return {
                    url: `/class/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Class'],
        }),

        getTeacherActivity: build.query<IRecentActivitiesResponse, any>({
            query: (params) => {
                return {
                    url: '/recent-activity',
                    method: 'GET',
                    params,
                };
            },
        }),

        getMyStudents: build.query<IMyStudentsResponse, any>({
            query: (params) => {
                return {
                    url: '/teacher/my-students',
                    method: 'GET',
                    params,
                };
            },
        }),
    }),
});

export const {
    useGetOverViewTeacherQuery,
    useGetTeacherClassesQuery,
    useGetTeacherActivityQuery,
    useGetMyStudentsQuery,
    useAddClassTeacherMutation,
    useUpdateClassTeacherMutation,
    useDeleteClassTeacherMutation,
} = homeSlice;
