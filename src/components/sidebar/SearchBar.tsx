import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Crosshair, Loader2 } from 'lucide-react';
import { AQIService } from '@/api/aqi';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import type { ISearchResult } from '@/types/aqi';

interface SearchBarProps {
    onResults: (results: ISearchResult[]) => void;
}

export function SearchBar({ onResults }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const { setLastMapCenter, addToHistory } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);

        try {
            const res = await AQIService.searchStations(query);
            if (res.status === 'ok') {
                if (res.data.length === 0) {
                    toast.error('No stations found');
                } else {
                    onResults(res.data);
                    toast.success(`Found ${res.data.length} stations in ${query}`);

                    const first = res.data[0];
                    if (first && first.station.geo) {
                        setLastMapCenter([first.station.geo[0], first.station.geo[1]]);

                        addToHistory({
                            uid: first.uid,
                            name: first.station.name,
                            lat: first.station.geo[0],
                            lon: first.station.geo[1],
                            aqi: first.aqi,
                        });
                    }
                }
            } else {
                toast.error('API Error: ' + res.message);
            }
        } catch (e) {
            toast.error('Failed to search');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleGeolocation = async () => {
        setGeoLoading(true);
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
                onResults([result]);
                setLastMapCenter(local.city.geo);
                toast.success(`Found local station: ${local.city.name}`, {
                    description: `Current AQI: ${local.aqi}`,
                });
            } else {
                toast.error('Failed to find local data');
            }
        } catch (error) {
            toast.error('Network error during geolocation fetch');
        } finally {
            setGeoLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        placeholder="Search city..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={loading || geoLoading}
                        className="pr-10"
                    />
                    {loading && (
                        <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                </div>
                <Button size="icon" onClick={handleSearch} disabled={loading || geoLoading}>
                    <Search className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleGeolocation}
                    disabled={loading || geoLoading}
                    title="Find near me">
                    {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
