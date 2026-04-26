import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
    const mapRef = useRef(null);

    useEffect(() => {
        const map = L.map(mapRef.current).setView([49.2827, -123.1207], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const properties = [
            { lat: 49.28, lng: -123.12, price: 1200000, address: "123 Main St" },
        ];

        properties.forEach((p) => {
            L.marker([p.lat, p.lng])
            .addTo(map)
            .bindPopup(`
                <b>${p.address}</b><br/>
                Price: $${p.price.toLocaleString()}
            `);
        });

        return () => map.remove();
    }, []);

    return <div ref={mapRef} style={{ height: "100vh" }} />;
}
