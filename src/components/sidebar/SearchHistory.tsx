import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { AQIService } from '@/api/aqi';
import { toast } from 'sonner';
import type { ISearchResult } from '@/types/aqi';

interface SearchHistoryProps {
    onSelectStation: (results: ISearchResult[]) => void;
}

export function SearchHistory({ onSelectStation }: SearchHistoryProps) {
    const { searchHistory, setLastMapCenter, clearHistory } = useAppStore();

    const handleHistoryClick = async (item: { uid: number; name: string; lat: number; lon: number; aqi: string }) => {
        setLastMapCenter([item.lat, item.lon]);

        try {
            const data = await AQIService.searchStations(item.name);
            if (data.status === 'ok') {
                onSelectStation(data.data);
                if (data.data.length > 0) {
                    toast.success(`Found ${data.data.length} stations in ${item.name}`);
                } else {
                    toast.error('No monitoring stations found for this location.');
                }
            } else {
                toast.error(data.message || 'Search failed');
            }
        } catch (error) {
            toast.error('Failed to fetch stations. Please check your network.');
        }
    };

    if (searchHistory.length === 0) return null;

    return (
        <div className="mt-6 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 text-muted-foreground p-1 shrink-0">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Recent
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2 hover:bg-destructive/10 hover:text-destructive"
                    onClick={clearHistory}>
                    Clear
                </Button>
            </div>
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                {searchHistory.map((item) => (
                    <Button
                        key={item.uid}
                        variant="ghost"
                        className="w-full justify-start h-auto py-2 px-2 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all"
                        onClick={() => handleHistoryClick(item)}>
                        <MapPin className="h-4 w-4 mr-2 opacity-70 shrink-0 text-primary" />
                        <div className="flex flex-col items-start overflow-hidden text-left">
                            <span className="truncate w-full font-medium text-xs">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                                AQI: {item.aqi}
                            </span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}
