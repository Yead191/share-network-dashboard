import { api } from "../api/baseApi";

export interface INotificationItem {
    _id: string;
    receiver: string | { _id: string; name?: string; email?: string; image?: string; role?: string };
    sender?: { _id: string; name?: string; email?: string; image?: string; role?: string } | null;
    title: string;
    message?: string;
    text?: string;
    refId?: string;
    path?: string;
    seen: boolean;
    read?: boolean;
    type?: string;
    createdAt: string;
    updatedAt: string;
}

export interface INotificationResponse {
    unreadCount: number;
    data: INotificationItem[];
}

const notificationSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<
            { success: boolean; data: INotificationResponse; pagination?: any },
            { page?: number; limit?: number; seen?: boolean; type?: string; searchTerm?: string } | void
        >({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append('page', String(params.page));
                if (params?.limit) queryParams.append('limit', String(params.limit));
                if (params?.seen !== undefined) queryParams.append('seen', String(params.seen));
                if (params?.type && params.type !== 'ALL') queryParams.append('type', params.type);
                if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);

                const queryString = queryParams.toString();
                return {
                    url: `/notification${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Notification'],
        }),

        readSingleNotification: builder.mutation<any, string>({
            query: (id) => ({
                url: `/notification/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),

        readAllNotifications: builder.mutation<any, void>({
            query: () => ({
                url: '/notification',
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),

        deleteNotification: builder.mutation<any, string>({
            query: (id) => ({
                url: `/notification/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notification'],
        }),

        clearAllNotifications: builder.mutation<any, void>({
            query: () => ({
                url: '/notification/clear-all',
                method: 'DELETE',
            }),
            invalidatesTags: ['Notification'],
        }),

        // Legacy aliases
        getNotification: builder.query<any, { query?: string } | void>({
            query: (params) => ({
                url: `/notification${params?.query ? `?${params.query}` : ''}`,
            }),
            providesTags: ['Notification'],
        }),
        changeStatusNotification: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                method: 'PATCH',
                url: `/notification/${id}`,
            }),
            invalidatesTags: ['Notification'],
        }),
        readAllNotification: builder.mutation<any, void>({
            query: () => ({
                method: 'PATCH',
                url: '/notification',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useReadSingleNotificationMutation,
    useReadAllNotificationsMutation,
    useDeleteNotificationMutation,
    useClearAllNotificationsMutation,
    useGetNotificationQuery,
    useChangeStatusNotificationMutation,
    useReadAllNotificationMutation,
} = notificationSlice;

export default notificationSlice;