import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { useAppStore } from '@/store/useAppStore';
import type { ISearchResult } from '@/types/aqi';
import { StationDetails } from './StationDetails';

interface AQIMapProps {
    stations: ISearchResult[];
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 10);
    }, [center, map]);
    return null;
}

function getAQIClass(aqiStr: string) {
    const aqi = parseInt(aqiStr);
    if (isNaN(aqi)) return 'aqi-unknown';
    if (aqi <= 50) return 'aqi-vgood';
    if (aqi <= 100) return 'aqi-good';
    if (aqi <= 150) return 'aqi-moderate';
    if (aqi <= 200) return 'aqi-unhealthy';
    if (aqi <= 300) return 'aqi-vunhealthy';
    return 'aqi-hazardous';
}

export function AQIMap({ stations }: AQIMapProps) {
    const { lastMapCenter } = useAppStore();

    return (
        <MapContainer
            center={lastMapCenter}
            zoom={3}
            style={{ height: '100%', width: '100%' }}
            className="z-0 bg-zinc-950">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapController center={lastMapCenter} />

            {stations.map((st) => {
                const aqiClass = getAQIClass(st.aqi);
                const customIcon = divIcon({
                    className: 'custom-aqi-marker',
                    html: `<div class="aqi-marker-inner ${aqiClass}"><span>${st.aqi}</span></div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                });

                return (
                    <Marker key={st.uid} position={[st.station.geo[0], st.station.geo[1]]} icon={customIcon}>
                        <Popup className="aqi-popup">
                            <StationDetails uid={st.uid} />
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
