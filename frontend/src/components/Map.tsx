import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RentalType } from "../models/RentalType";

type MapProps = {
  rentals: RentalType[] | RentalType;
  onBoundsChange?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  onMarkerClick?: (id: string) => void;
};

export default function Map({
  rentals,
  onBoundsChange,
  onMarkerClick
}: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  
  const onBoundsChangeRef = useRef(onBoundsChange);
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);
  const initialRentalsRef = useRef(rentals);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialRentals = Array.isArray(initialRentalsRef.current) 
      ? initialRentalsRef.current : [initialRentalsRef.current];
    const defaultCenter: [number, number] = initialRentals.length === 1 
      ? [initialRentals[0].latitude, initialRentals[0].longitude]
      : [49.2827, -123.1207];
    
    const defaultZoom = initialRentals.length === 1 ? 14 : 11;
    
    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView(defaultCenter, defaultZoom);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      { attribution: "© CARTO" }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    leafletMapRef.current = map;
    markersLayerRef.current = markersLayer;

    function updateBounds() {
      const bounds = map.getBounds();
      if (onBoundsChangeRef.current) {
        onBoundsChangeRef.current({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    }

    updateBounds();
    map.on("moveend", updateBounds);

    return () => {
      map.off("moveend", updateBounds);
      map.remove();
      leafletMapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []); 

  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    const customIcon = L.divIcon({
      className: "a-marker",
      html: `<div class="w-4 h-4 bg-[#0000ff] border-2 border-black"></div>`,
      iconSize: [16, 16],
    });

    const rentalsArray = Array.isArray(rentals) ? rentals : [rentals];

    rentalsArray.forEach((rental) => {
      const popupContent = `
        <div>
          <h3 class="text-[12px] font-bold border-b border-black pb-1">
            ${rental.address}
          </h3>
          <p>${rental.city}, ${rental.province}</p>          
          <p>$${rental.price} Per Month</p>
        </div>
      `;

      const marker = L.marker([rental.latitude, rental.longitude], { icon: customIcon })
        .bindPopup(popupContent, { autoPan: false })
        .addTo(markersLayer);

      marker.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(rental.rentfaster_id); 
        }
      });
    });
  }, [rentals, onMarkerClick]);

  return (
    <div className="border-2 border-black">
      <div ref={mapRef} className="w-full h-screen"/>
    </div>
  );
}