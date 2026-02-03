export interface IAqiStation {
    uid: number;
    aqi: string; // Sometimes "-" or value
    lat: number;
    lon: number;
    station: {
        name: string;
        time: string;
        url?: string;
    };
}

export interface ISearchResult {
    uid: number;
    aqi: string;
    station: {
        name: string;
        geo: [number, number]; // lat, lon
        url?: string;
        country?: string;
    };
    time: {
        tz: string;
        stime: string;
        vtime: number;
    };
}

export interface IPollutant {
    avg: number;
    day: number;
    max: number;
    min: number;
}

export interface ICityFeed {
    aqi: number;
    idx: number;
    attributions: { url: string; name: string }[];
    city: {
        geo: [number, number];
        name: string;
        url: string;
    };
    dominentpol: string;
    iaqi: Record<string, { v: number }>; // pm25, pm10, etc.
    time: {
        s: string;
        tz: string;
        v: number;
    };
    forecast: {
        daily: {
            o3: IPollutant[];
            pm10: IPollutant[];
            pm25: IPollutant[];
            uvi: IPollutant[];
        };
    };
    debug?: {
        sync: string;
    };
}

export interface IApiResponse<T> {
    status: "ok" | "error";
    data: T;
    message?: string;
}
