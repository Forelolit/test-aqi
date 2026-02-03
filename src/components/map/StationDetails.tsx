import { useQuery } from '@tanstack/react-query';
import { AQIService } from '@/api/aqi';
import { Skeleton } from '@/components/ui/skeleton';

interface StationDetailsProps {
    uid: number;
}

export function StationDetails({ uid }: StationDetailsProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['station-feed', uid],
        queryFn: () => AQIService.getFeedByUid(uid),
        enabled: !!uid,
    });

    if (isLoading) {
        return (
            <div className="space-y-2 p-2 w-[200px]">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-2">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        );
    }

    if (error || !data || data.status !== 'ok') {
        return <div className="p-2 text-red-500 text-sm">Failed to load details</div>;
    }

    const feed = data.data;
    const pollutants = feed.iaqi || {};

    return (
        <div className="p-2 min-w-[200px] text-foreground">
            <h3 className="font-bold text-base leading-tight">{feed.city.name}</h3>
            <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-white font-bold text-sm ${getAQIColor(feed.aqi)}`}>
                    {feed.aqi}
                </span>
                <span className="text-xs uppercase font-semibold text-muted-foreground">AQI</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                {Object.entries(pollutants).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-border/50 pb-1">
                        <span className="uppercase text-muted-foreground">{key}:</span>
                        <span className="font-mono">{(val as any).v}</span>
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-muted-foreground mt-3 italic">Updated: {feed.time.s}</p>
        </div>
    );
}

function getAQIColor(aqi: number) {
    if (aqi <= 50) return 'bg-emerald-500 text-emerald-950';
    if (aqi <= 100) return 'bg-yellow-400 text-yellow-950';
    if (aqi <= 150) return 'bg-orange-500 text-orange-950 text-white';
    if (aqi <= 200) return 'bg-red-500 text-white';
    if (aqi <= 300) return 'bg-purple-600 text-white';
    return 'bg-rose-900 text-white';
}
