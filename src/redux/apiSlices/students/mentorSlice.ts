import { api } from "../../api/baseApi";


const mentorStudentResources = api.injectEndpoints({
    endpoints: (build) => ({
        getMentorProfile: build.query({
            query: (id) => {
                return {
                    url: `/coordinator/${id}`,
                    method: "GET",
                }
            },
        }),
        getMentorId: build.query({
            query: (id) => {
                console.log(id)
                return {
                    url: `/admin-mentor/${id}`,
                    method: "GET",
                }
            },
        }),


    })
});


export const {

    useGetMentorProfileQuery,
    // useUplloadAssignmentMutation
    useGetMentorIdQuery

} = mentorStudentResources;