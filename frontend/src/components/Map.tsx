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

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16,
    }).addTo(map);

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
      className: "custom-marker-wrapper",
      html: `
        <div class="group relative w-6 h-6 rounded-full bg-indigo-300 border-2 border-white shadow-md transition-transform duration-200 hover:scale-125 hover:bg-indigo-300 flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-indigo-300"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
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
          onMarkerClick(listing._id); 
        }
      });
    });
  }, [listings, onMarkerClick]);

  
  return (
    <div className="border-1">
      <div ref={mapRef} className={`w-full ${isSingleListing ? "h-[50vh]" : "h-screen"}`}/>
    </div>
  );
}