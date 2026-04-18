import { api } from "../../api/baseApi";


const resourcesDetails = api.injectEndpoints({
  endpoints: (build) => ({
    getCoordinatorResources: build.query<any, any>({
      query: ({ targertGroup, page = 1, limit = 10, searchTerm, targetTrack, targeteAudience }: any) => {
        const params = new URLSearchParams();
        if (targeteAudience) params.append('targeteAudience', targeteAudience);
        if (targertGroup?.length) {
          targertGroup.forEach((id: string, index: number) => {
            params.append(`targertGroup[${index}]`, id);
          });
        }
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (targetTrack) params.append('targetTrack', targetTrack);

        return {
          url: `/learning?${params.toString()}`,
          method: 'GET',
        };
      },
    }),

    getResourceById: build.query<any, string>({
      query: (id) => ({
        url: `/coordinator/resources/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCoordinatorResourcesQuery,
  useGetResourceByIdQuery,
} = resourcesDetails;