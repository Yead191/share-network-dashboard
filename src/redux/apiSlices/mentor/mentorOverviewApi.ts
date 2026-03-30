import { api } from '../../api/baseApi';

const mentorOverviewApi = api.injectEndpoints({
    endpoints: (build) => ({
        getMentorOverview: build.query<any, void>({
            query: () => ({
                url: '/mentor-dashboard',
                method: 'GET',
            }),
        }),
        // upcoming
        getUpcomingEvents: build.query<any, void>({
            query: () => ({
                url: '/mentor-dashboard/upcoming',
                method: 'GET',
            }),
        }),
        // mentor overview resources
        getMentorOverviewResources: build.query<any, { targetedAudience: string; targertGroup: string }>({
            query: ({ targetedAudience, targertGroup }) => ({
                url: `/learning?targeteAudience=${targetedAudience}&targertGroup=${targertGroup}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetMentorOverviewQuery, useGetUpcomingEventsQuery, useGetMentorOverviewResourcesQuery } =
    mentorOverviewApi;
