import { useState, useMemo } from "react";

import type { ListingType } from "../models/ListingType";

import ListingCard from "./cards/ListingCard";

type SideBarProps = {
  listings: ListingType[];
  loading: boolean;
  selectedListingId: string;
};

type SortOption = "price_asc" | "price_desc" | "sqft_asc" | "sqft_desc";

export default function SideBar({
  listings, loading, selectedListingId
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
    <aside className="w-full h-screen flex flex-col">
      
      <div className="p-4 flex items-center justify-between">
        
        <h2 className="text-[16px] font-bold">
          Results ({listings.length})
        </h2>

        <select 
          className="p-1 text-sm bg-white border"
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="sqft_asc">Price/Sq Ft: Low to High</option>
          <option value="sqft_desc">Price/Sq Ft: High to Low</option>
        </select>
      </div>

      <div id="sidebar-scroll-container" className="p-4 overflow-y-auto">
        {loading ? (

          <p className="text-[12px] text-gray-400">
            loading...
          </p>

        ) : listings.length === 0 ? (

          <p className="text-[12px] text-gray-400">
            No data matching criteria
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