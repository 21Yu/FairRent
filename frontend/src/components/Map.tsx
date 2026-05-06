import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RentalType } from "../models/RentalType";

type MapProps = {
    rentals: RentalType[];
    onBoundsChange: (bounds: {
        north: number,
        south: number,
        east: number,   
        west: number
    }) => void
};

export default function Map({ rentals, onBoundsChange } : MapProps) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const leafletMapRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        const map = L.map(mapRef.current, {
            zoomControl: false,
            scrollWheelZoom: true,
        }).setView([49.2827, -123.1207], 11);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            attribution: "© OpenStreetMap © CARTO",
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);

        leafletMapRef.current = map;
        markersLayerRef.current = markersLayer;

        const b = map.getBounds();
        onBoundsChange({
            north: b.getNorth(),
            south: b.getSouth(),
            east: b.getEast(),
            west: b.getWest(),
        });

        map.on("moveend", () => {
            const b = map.getBounds();

            onBoundsChange({
                north: b.getNorth(),
                south: b.getSouth(),
                east: b.getEast(),
                west: b.getWest(),
            });
        });

        return () => map.remove();
    }, []);

    useEffect(() => {
        const markersLayer = markersLayerRef.current;
        if (!markersLayer) return;

        markersLayer.clearLayers();

        rentals.forEach((r) => {
            L.marker([r.latitude, r.longitude])
            .bindPopup(`
                <b>${r.address}</b><br/>
                Price: $${r.price.toLocaleString()}
            `)
            .addTo(markersLayer);
        });
    }, [rentals]);


    return <div ref={mapRef} style={{ height: "50vh", width: "50%" }} />;
}
