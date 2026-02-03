import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://api.waqi.info",
    params: {
        token: import.meta.env.VITE_WAQI_TOKEN,
    },
});
