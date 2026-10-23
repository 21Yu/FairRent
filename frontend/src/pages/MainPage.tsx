import { useState, useEffect } from "react";

import Map from "../components/Map";
import FilterForm from "../components/forms/FilterForm";
import SideBar from "../components/SideBar";
import Layout from "../components/layout/Layout";
import { fetchListings } from "../services/api";

import type { ListingType } from "../models/ListingTypes";
import type { MapBounds, Filters } from "../models/FormTypes";

function MainPage() {
  const [filters, setFilters] = useState<Filters>({
    price: "2500",
    type: "",
    beds: "",
    baths: "",
    squareFeet: "1000",
  });

  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const [listings, setListings] = useState<ListingType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedListingId, setSelectedListingId] = useState<string>("");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  useEffect(() => {
    if (!bounds) return;

    let isCancelled = false;
    const timeout = window.setTimeout(() => {
      const loadListings = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchListings(filters, bounds);
          if (!isCancelled) setListings(data);
        } catch (err) {
          if (!isCancelled) {
            setError(err instanceof TypeError
              ? "We couldn't load listings. Check your connection and try again."
              : err instanceof Error ? err.message : "Unable to load listings. Please try again.");
          }
        } finally {
          if (!isCancelled) setLoading(false);
        }
      };
      void loadListings();
    }, 300);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeout);
    };

  }, [filters, bounds]);

  return (
    <Layout>
      <div className="mx-auto max-w-[1800px] space-y-5 px-4 py-5 md:px-6">
        <section>
          <FilterForm
            onFormSubmit={setFilters}
            isListView={false}
          />
        </section>

        <div className="mx-auto grid w-full max-w-sm grid-cols-2 rounded-md border border-gray-200 bg-white p-1 shadow-sm md:hidden">
          <button
            type="button"
            aria-pressed={mobileView === "list"}
            onClick={() => setMobileView("list")}
            className={`rounded px-3 py-2 text-sm font-semibold ${mobileView === "list" ? "bg-indigo-300 text-gray-950" : "text-gray-600"}`}
          >List</button>
          <button
            type="button"
            aria-pressed={mobileView === "map"}
            onClick={() => setMobileView("map")}
            className={`rounded px-3 py-2 text-sm font-semibold ${mobileView === "map" ? "bg-indigo-300 text-gray-950" : "text-gray-600"}`}
          >Map</button>
        </div>

        <div className="grid min-h-[620px] grid-cols-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:h-[calc(100vh-15rem)] md:min-h-[560px] md:grid-cols-[minmax(330px,0.85fr)_minmax(0,1.6fr)]">
          <section className={`${mobileView === "list" ? "" : "hidden md:block"} min-h-[440px] overflow-hidden border-b border-gray-200 md:border-b-0 md:border-r`}>
            <SideBar 
              listings={listings} 
              loading={loading}
              selectedListingId={selectedListingId}
              error={error}
            />
          </section>

          <section className={`${mobileView === "map" ? "" : "hidden md:block"} min-h-[420px] overflow-hidden`}>
            <Map
              listings={listings}
              onBoundsChange={setBounds}
              onMarkerClick={setSelectedListingId}
            />

          </section>
        </div>
      </div>
    </Layout>
  );
}

export default MainPage;