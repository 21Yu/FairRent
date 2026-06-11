import { useState, useMemo } from "react";

import type { RentalType } from "../models/RentalType";

import RentalCard from "./RentalCard";

type SideBarProps = {
  rentals: RentalType[];
  loading: boolean;
  selectedRentalId: string;
};

type SortOption = "price_asc" | "price_desc" | "sqft_asc" | "sqft_desc";

export default function SideBar({
  rentals, loading, selectedRentalId
}: SideBarProps) {

  const [sortBy, setSortBy] = useState<SortOption>("price_asc");

  const sortedRentals = useMemo(() => {
    return [...rentals].sort((a, b) => {
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
  }, [rentals, sortBy]);

  return (
    <aside className="w-full h-screen flex flex-col">
      
      <div className="p-4 bg-[#d1d1d1] flex items-center justify-between">
        
        <h2 className="text-[16px] font-bold">
          Results ({rentals.length})
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

      <div className="p-4 overflow-y-auto">
        {loading ? (

          <p className="text-[12px] text-gray-400">
            loading...
          </p>

        ) : rentals.length === 0 ? (

          <p className="text-[12px] text-gray-400">
            No data matching criteria
          </p>

        ) : (

          <ul>
            {sortedRentals.map((rental) => (
              <RentalCard
                key={rental.rentfaster_id}
                rental={rental}
                isSelected={rental.rentfaster_id === selectedRentalId}
              />
            ))}
          </ul>
          
        )}
      </div>

    </aside>
  );
}