import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.share-network.org/api/v1',
        // baseUrl: 'http://10.10.7.72:8000/api/v1',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: [
        'Facility',
        'Package',
        'Review',
        'Profile',
        'Chat-Rooms',
        'Chat-Messages',
        'TimeTracks',
        'Class',
        'Resourse',
        'Assignment',
        'Submission',
        'MentorWoops',
    ],
    endpoints: () => ({}),
});

export const imageUrl = 'https://api.share-network.org/uploads';
export const socketUrl = 'https://api.share-network.org';
// export const imageUrl = 'http://10.10.7.72:8000/uploads';
// export const socketUrl = 'http://10.10.7.72:8000';
