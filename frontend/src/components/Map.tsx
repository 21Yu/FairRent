import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RentalType } from "../models/RentalType";

type MapProps = {
    rentals: RentalType[];
};

export default function Map({ rentals } : MapProps) {
    const mapRef = useRef(null);

    useEffect(() => {
        const map = L.map(mapRef.current, {
            zoomControl: false,
            scrollWheelZoom: true,
            fadeAnimation: true,
            zoomAnimation: true,
        }).setView([49.2827, -123.1207], 11);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            attribution: "© OpenStreetMap © CARTO",
        }).addTo(map);

        rentals.forEach((r:RentalType) => {
            L.marker([r.latitude, r.longitude])
            .addTo(map)
            .bindPopup(`
                <b>${r.address}</b><br/>
                Price: $${r.price.toLocaleString()}
            `);
        });

        return () => map.remove();
    }, []);

    return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
}
