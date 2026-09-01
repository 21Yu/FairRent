import { useState, useEffect } from "react";

import Map from "../components/Map";
import FilterForm from "../components/forms/FilterForm";
import SideBar from "../components/SideBar";
import Layout from "../components/layout/Layout";
import { fetchListings } from "../services/api";

import type { ListingType } from "../models/ListingType";

export interface Filters {
  price: string;
  type: string;
  beds: string;
  baths: string;
  squareFeet: string; 
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

function MainPage() {
  const [filters, setFilters] = useState<Filters>({
    price: "",
    type: "",
    beds: "",
    baths: "",
    squareFeet: "",
  });

  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const [listings, setListings] = useState<ListingType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedListingId, setSelectedListingId] = useState<string>("");

  useEffect(() => {
    if (!bounds) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      const data = await fetchListings(filters, bounds);
      setListings(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);


  }, [filters, bounds]);

  return (
    <Layout>
      <div className="p-8 md:p-4">
        
        <section>
          <FilterForm
            onFormSubmit={setFilters}
          />
        </section>

        <main className="flex flex-col md:flex-row">
          
          <section className="flex-1">
            <SideBar 
              listings={listings} 
              loading={loading}
              selectedListingId={selectedListingId}
            />
          </section>

          <section className="flex-3">
            <Map
              listings={listings}
              onBoundsChange={setBounds}
              onMarkerClick={setSelectedListingId}
            />

          </section>
        </main>
      </div>
    </Layout>
  );
}

export default MainPage;