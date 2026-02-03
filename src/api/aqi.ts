import { apiClient } from "./client";
import type { IApiResponse, ICityFeed, ISearchResult } from "@/types/aqi";

export const AQIService = {
    searchStations: async (keyword: string) => {
        const response = await apiClient.get<IApiResponse<ISearchResult[]>>("/search/", {
            params: { keyword },
        });
        return response.data;
    },

    getFeedByUid: async (uid: number) => {
        const response = await apiClient.get<IApiResponse<ICityFeed>>(`/feed/@${uid}/`);
        return response.data;
    },

    getFeedByGeo: async (lat: number, lon: number) => {
        const response = await apiClient.get<IApiResponse<ICityFeed>>(`/feed/geo:${lat};${lon}/`);
        return response.data;
    },

    getFeedHere: async () => {
        const response = await apiClient.get<IApiResponse<ICityFeed>>(`/feed/here/`);
        return response.data;
    },

    getStationsInBounds: async (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const response = await apiClient.get<IApiResponse<ISearchResult[]>>(`/map/bounds`, {
            params: {
                latlng: `${lat1},${lng1},${lat2},${lng2}`
            }
        });
        return response.data;
    }
};
