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
        getMentorOverviewResources: build.query<
            any,
            { targeteAudience: string; targertGroup: string; targetTrack?: string }
        >({
            query: ({ targeteAudience, targertGroup, targetTrack }) => ({
                url: `/learning?targeteAudience=${targeteAudience}&targertGroup=${targertGroup}${targetTrack ? `&targetTrack=${targetTrack}` : ''
                    }`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetMentorOverviewQuery, useGetUpcomingEventsQuery, useGetMentorOverviewResourcesQuery } =
    mentorOverviewApi;
