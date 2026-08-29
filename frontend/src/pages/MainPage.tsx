import { useState, useEffect } from "react";

import Map from "../components/Map";
import FilterForm from "../components/FilterForm";
import SideBar from "../components/SideBar";
import Layout from "../components/layout/Layout";
import { fetchRentals } from "../services/api";

import type { RentalType } from "../models/RentalType";

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

  const [rentals, setRentals] = useState<RentalType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedRentalId, setSelectedRentalId] = useState<string>("");

  useEffect(() => {
    if (!bounds) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      const data = await fetchRentals(filters, bounds);
      setRentals(data);
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
              rentals={rentals} 
              loading={loading}
              selectedRentalId={selectedRentalId}
            />
          </section>

          <section className="flex-3">
            <Map
              rentals={rentals}
              onBoundsChange={setBounds}
              onMarkerClick={setSelectedRentalId}
            />

          </section>
        </main>
      </div>
    </Layout>
  );
}

export default MainPage;