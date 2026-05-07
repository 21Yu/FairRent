import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RentalType } from "../models/RentalType";

import { mapStyles as styles } from "../styles/map.styles";

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

  const markersLayerRef =
    useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView([49.2827, -123.1207], 11);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution: "© CARTO",
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

    const customIcon = L.divIcon({
      className: "ableton-marker",

      html: `<div class="${styles.marker}"></div>`,

      iconSize: [16, 16],
    });

    rentals.forEach((rental) => {
      const popupContent = `
        <div class="${styles.popup.container}">
          
          <h3 class="${styles.popup.title}">
            ${rental.address}
          </h3>

          <p class="${styles.popup.location}">
            ${rental.city}, ${rental.province}
          </p>

          <div class="${styles.popup.footer}">
            
            <div>
              <p class="${styles.popup.price}">
                $${rental.price}
              </p>

              <p class="${styles.popup.perMonth}">
                Per Month
              </p>
            </div>

            <a
              href="/details/${rental.id}"
              target="_blank"
              class="${styles.popup.button}"
            >
              Details
            </a>
          </div>
        </div>
      `;

      L.marker(
        [rental.latitude, rental.longitude],
        {
          icon: customIcon,
        }
      )
        .bindPopup(popupContent, {
          className: "ableton-popup",
          maxWidth: 250,
        })
        .addTo(markersLayer);
    });
  }, [rentals]);

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <p className={styles.overlayText}>
          Map View // {rentals.length} Results
        </p>
      </div>

      <div
        ref={mapRef}
        className={styles.map}
      />
    </div>
  );
}