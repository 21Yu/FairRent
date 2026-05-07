import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RentalType } from "../models/RentalType";

type MapProps = {
  rentals: RentalType[];
  onBoundsChange: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
};

export default function Map({
  rentals,
  onBoundsChange,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView([49.2827, -123.1207], 11);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "© OpenStreetMap © CARTO",
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    leafletMapRef.current = map;
    markersLayerRef.current = markersLayer;

    function updateBounds() {
      const bounds = map.getBounds();

      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    }

    updateBounds();

    map.on("moveend", updateBounds);

    return () => {
      map.off("moveend", updateBounds);
      map.remove();
    };
  }, [onBoundsChange]);

  useEffect(() => {
    const markersLayer = markersLayerRef.current;

    if (!markersLayer) return;

    markersLayer.clearLayers();

    rentals.forEach((rental) => {
      const popupContent = `
        <div>
          <h3>${rental.address}</h3>

          <p>
            ${rental.city}, ${rental.province}
          </p>

          <p>
            <strong>$${rental.price.toLocaleString()}</strong> / month
          </p>

          <p>
            ${rental.beds} beds •
            ${rental.baths} baths •
            ${rental.squareFeet} sq ft
          </p>

          <a
            href="/details/${rental.id}"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Details
          </a>
        </div>
      `;

      L.marker([rental.latitude, rental.longitude])
        .bindPopup(popupContent)
        .addTo(markersLayer);
    });
  }, [rentals]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "50vh",
        width: "50%",
      }}
    />
  );
}