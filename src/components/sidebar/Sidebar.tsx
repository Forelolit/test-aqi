import { Card } from '@/components/ui/card';
import { SearchBar } from './SearchBar';
import { SearchHistory } from './SearchHistory';
import type { ISearchResult } from '@/types/aqi';

interface SidebarProps {
    onSearchResults: (results: ISearchResult[]) => void;
}

export function Sidebar({ onSearchResults }: SidebarProps) {
    return (
        <Card className="h-full w-full md:w-80 p-4 rounded-none border-r border-border bg-background flex flex-col z-10 shrink-0 shadow-xl">
            <div className="font-bold text-xl mb-6 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm">Antigravity</span>
                AQI
            </div>

            <SearchBar onResults={onSearchResults} />

            <SearchHistory onSelectStation={(results) => onSearchResults(results)} />

            <div className="mt-auto text-xs text-muted-foreground pt-4 border-t border-border">
                <p>Data provided by WAQI</p>
                <p>v1.0.0</p>
            </div>
        </Card>
    );
}
