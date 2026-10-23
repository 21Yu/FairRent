import { useState, useMemo } from "react";

import type { ListingType } from "../models/ListingTypes";

import ListingCard from "./cards/ListingCard";

type SideBarProps = {
  listings: ListingType[];
  loading: boolean;
  selectedListingId: string;
  error?: string | null;
};

type SortOption = "price_asc" | "price_desc" | "sqft_asc" | "sqft_desc";

export default function SideBar({
  listings, loading, selectedListingId, error
}: SideBarProps) {

  const [sortBy, setSortBy] = useState<SortOption>("price_asc");

  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "sqft_asc":
          return (a.price_sq_ft || 0) - (b.price_sq_ft || 0);
        case "sqft_desc":
          return (b.price_sq_ft || 0) - (a.price_sq_ft || 0);
        default:
          return 0;
      }
    });
  }, [listings, sortBy]);

  return (
    <aside className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">Available rentals</p>
          <h2 className="mt-1 text-lg font-semibold text-gray-950">Results ({listings.length})</h2>
        </div>

        <select 
          aria-label="Sort listings"
          className="max-w-[52%] rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="sqft_asc">Price/Sq Ft: Low to High</option>
          <option value="sqft_desc">Price/Sq Ft: High to Low</option>
        </select>
      </div>

      <div id="sidebar-scroll-container" className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50/70 p-3">
        {error && (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </p>
        )}
        {loading ? (

          <p className="rounded-md border border-gray-200 bg-white p-5 text-sm text-gray-500">
            Loading listings...
          </p>

        ) : error && listings.length === 0 ? null : listings.length === 0 ? (

          <p className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
            No listings match these filters.
          </p>

        ) : (

          <ul>
            {sortedListings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                isSelected={listing._id === selectedListingId}
              />
            ))}
          </ul>
          
        )}
      </div>

    </aside>
  );
}