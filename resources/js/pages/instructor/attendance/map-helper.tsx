import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';

/* ---------------- MAP HELPERS ---------------- */
export function LocationMarker({
    position,
    setPosition,
}: {
    position: [number, number];
    setPosition: (p: [number, number]) => void;
}) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return position ? <Marker position={position} /> : null;
}

export function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 });
    }, [center, map]);
    return null;
}
