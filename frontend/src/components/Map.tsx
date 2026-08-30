import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ListingType } from "../models/ListingType";

type MapProps = {
  listings: ListingType[] | ListingType;
  onBoundsChange?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  onMarkerClick?: (id: string) => void;
};

export default function Map({
  listings,
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
  const initialListingsRef = useRef(listings);
  
  const isSingleListing = !Array.isArray(listings);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialListings = Array.isArray(initialListingsRef.current) 
      ? initialListingsRef.current : [initialListingsRef.current];
    const defaultCenter: [number, number] = initialListings.length === 1 
      ? [initialListings[0].latitude, initialListings[0].longitude]
      : [49.2827, -123.1207];
    
    const defaultZoom = initialListings.length === 1 ? 14 : 11;
    
    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView(defaultCenter, defaultZoom);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' }
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

    const listingsArray = Array.isArray(listings) ? listings : [listings];

    listingsArray.forEach((listing) => {
      const popupContent = `
        <div>
          <h3 class="text-[12px] font-bold border-b border-black pb-1">
            ${listing.address}
          </h3>
          <p>${listing.city}, ${listing.province}</p>          
          <p>$${listing.price} Per Month</p>
        </div>
      `;

      const marker = L.marker([listing.latitude, listing.longitude], { icon: customIcon })
        .bindPopup(popupContent, { autoPan: false })
        .addTo(markersLayer);

      marker.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(listing.rentfaster_id); 
        }
      });
    });
  }, [listings, onMarkerClick]);

  
  return (
    <div className="border-2 border-black">
      <div ref={mapRef} className={`w-full ${isSingleListing ? "h-[50vh]" : "h-screen"}`}/>
    </div>
  );
}