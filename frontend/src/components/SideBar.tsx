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
    <aside className="SideBar_container">
      
      <div className="SideBar_header">
        
        <h2 className="bigText">
          Results ({rentals.length})
        </h2>

        <button
          onClick={() =>
            setAscending(!ascending)
          }
          className={`SideBar_sortButton ${ascending ? 'SideBar_sortButton_ascending' : 'SideBar_sortButton_descending'}`}
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

      <div className="SideBar_content">
        {loading ? (

          <p className="greyText">
            loading...
          </p>

        ) : rentals.length === 0 ? (

          <p className="greyText">
            No data matching criteria
          </p>

        ) : (

          <ul>
            {sortedRentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
              />
            ))}
          </ul>
          
        )}
      </div>

    </aside>
  );
}