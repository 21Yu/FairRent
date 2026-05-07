import { useState } from "react";
import type { RentalType } from "../models/RentalType";
import RentalCard from "./RentalCard";

type SideBarProps = {
  rentals: RentalType[];
};

export default function SideBar({
  rentals,
}: SideBarProps) {
  const [ascending, setAscending] = useState(true);

  const sortedRentals = [...rentals].sort((a, b) =>
    ascending
      ? a.price - b.price
      : b.price - a.price
  );

  return (
    <>
      <button onClick={() => setAscending(!ascending)}>
        Sort by Price:
        {" "}
        {ascending ? "Low → High" : "High → Low"}
      </button>

      <ul>
        {sortedRentals.map((rental) => (
          <RentalCard
            key={rental.id}
            rental={rental}
          />
        ))}
      </ul>
    </>
  );
}