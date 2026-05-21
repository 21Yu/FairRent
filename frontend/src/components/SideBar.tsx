import { useState } from "react";

import type { RentalType } from "../models/RentalType";

import RentalCard from "./RentalCard";

type SideBarProps = {
  rentals: RentalType[];
  loading: boolean;
};

export default function SideBar({
  rentals, loading
}: SideBarProps) {
  const [ascending, setAscending] =
    useState(true);

  const sortedRentals = [...rentals].sort(
    (a, b) =>
      ascending
        ? a.price - b.price
        : b.price - a.price
  );

  return (
    <aside className="w-full h-screen flex flex-col">
      
      <div className="p-4 bg-[#d1d1d1] flex items-center justify-between">
        
        <h2 className="text-[16px] font-bold">
          Results ({rentals.length})
        </h2>

        <button
          onClick={() =>
            setAscending(!ascending)
          }
          className={`flex gap-2 px-2 py-1 border border-black
          ${ascending ? 'bg-[#ff764d]' : 'bg-white'}`}
        >
          <span >
            Price:
          </span>

          <span>
            {ascending
              ? "Low → High"
              : "High → Low"}
          </span>
        </button>
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
              />
            ))}
          </ul>
          
        )}
      </div>

    </aside>
  );
}