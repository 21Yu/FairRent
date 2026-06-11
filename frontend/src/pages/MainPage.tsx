import { useState, useEffect } from "react";

import Map from "../components/Map";
import FilterForm from "../components/FilterForm";
import SideBar from "../components/SideBar";
import Layout from "../components/layout/Layout";

import type { RentalType } from "../models/RentalType";
import type { ApiDataType } from "../models/ApiDataType";

const baseURL = import.meta.env.VITE_API_BASE_URL;

function MainPage() {
  const [filters, setFilters] = useState({
    price: "",
    type: "",
    beds: "",
    baths: "",
    squareFeet: "",
  });

  const [bounds, setBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  const [rentals, setRentals] = useState<RentalType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedRentalId, setSelectedRentalId] = useState<string>("");

  useEffect(() => {
    if (!bounds) return;

    const timeout = setTimeout(() => {
      fetchRentals();
    }, 300);

    return () => clearTimeout(timeout);

    async function fetchRentals() {
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(
            (entry) => entry[1] !== ""
          )
        );

        const query = new URLSearchParams(
          Object.fromEntries(
            Object.entries({
              ...cleanFilters,
              ...bounds,
            }).map(([key, value]) => [
              key,
              String(value),
            ])
          )
        ).toString();

        setLoading(true);

        const res = await fetch(
          `${baseURL}/rentals?${query}`
        );

        const data = await res.json();

        const mapped: RentalType[] = data.map((item: ApiDataType) => ({
          ...item,
          rentfaster_id: String(item.rentfaster_id)
        }));

        setRentals(mapped);

        setLoading(false);
      } catch (err) {
        console.error(
          "Failed to fetch rentals:",
          err
        );
      }
    }
  }, [filters, bounds]);

  return (
    <Layout>
      <div>
        
        <section>
          <FilterForm
            onFormSubmit={setFilters}
          />
        </section>

        <main className="flex flex-col lg:flex-row">
          
          <section className="w-full lg:w-[400px] h-[50vh] lg:h-screen">
            <SideBar 
              rentals={rentals} 
              loading={loading}
              selectedRentalId={selectedRentalId}
            />
          </section>

          <section className="flex-1 h-[50vh] lg:h-screen">
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