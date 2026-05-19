import { api } from "../../api/baseApi";


const overviewAnalytics = api.injectEndpoints({
    endpoints: (build) => ({
        getstudentOverview: build.query({
            query: () => {
                return {
                    url: "/student-stats",
                    method: "GET",
                }
            },

        }),

        getprofile: build.query({
            query: () => {
                return {
                    url: "/user/profile",
                    method: "GET",
                }
            },

        }),

        getUpcomingSessions: build.query({
            query: () => {
                return {
                    url: "/student-stats/events",
                    method: "GET",
                }
            },

        }),

        getActiveAssignments: build.query({
            query: () => {
                return {
                    url: "/student-stats/assignments",
                    method: "GET",
                }
            },

        }),

        getprofileById: build.query({
            query: (id) => {
                return {
                    url: `/admin-mentor/${id}`,
                    method: "GET",
                }
            },

        }),
    })
});


export const { useGetstudentOverviewQuery, useGetprofileQuery, useGetUpcomingSessionsQuery, useGetActiveAssignmentsQuery, useGetprofileByIdQuery } = overviewAnalytics;