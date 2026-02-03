import { useEffect, useState } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { AQIMap } from './components/map/AQIMap';
import { Toaster, toast } from 'sonner';
import type { ISearchResult } from './types/aqi';
import { AQIService } from './api/aqi';
import { useAppStore } from './store/useAppStore';

function App() {
    const [stations, setStations] = useState<ISearchResult[]>([]);
    const { setLastMapCenter } = useAppStore();

    useEffect(() => {
        const fetchLocalStation = async () => {
            try {
                const res = await AQIService.getFeedHere();
                if (res.status === 'ok') {
                    const local = res.data;
                    const result: ISearchResult = {
                        uid: local.idx,
                        aqi: local.aqi.toString(),
                        station: {
                            name: local.city.name,
                            geo: local.city.geo,
                            url: local.city.url,
                        },
                        time: {
                            tz: local.time.tz,
                            stime: local.time.s,
                            vtime: local.time.v,
                        },
                    };
                    setStations([result]);
                    setLastMapCenter(local.city.geo);
                    toast.success(`Showing local station: ${local.city.name}`, {
                        description: `AQI: ${local.aqi}`,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch local station', error);
            }
        };

        fetchLocalStation();
    }, [setLastMapCenter]);

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
            <Sidebar onSearchResults={setStations} />

            <div className="flex-1 relative h-full">
                <AQIMap stations={stations} />

                {stations.length === 0 && (
                    <div className="absolute top-4 right-4 z-[400] bg-zinc-950/80 backdrop-blur-sm p-4 rounded-lg border border-zinc-800 max-w-sm shadow-lg pointer-events-none">
                        <h2 className="font-bold text-white mb-1">Welcome to AQI Visualizer</h2>
                        <p className="text-sm text-zinc-400">
                            Search for a city (e.g., "Tokyo", "London") to visualize air quality stations on the map.
                        </p>
                    </div>
                )}
            </div>

            <Toaster position="bottom-right" theme="dark" richColors />
        </div>
    );
}

export default App;
