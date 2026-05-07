import { useState } from "react";
import type { RentalType } from "../models/RentalType";

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
          <li key={rental.id}>
            <h3>{rental.address}</h3>

            <p>
              {rental.city}, {rental.province}
            </p>

            <p>
              <strong>
                ${rental.price.toLocaleString()}
              </strong>
              {" • "}
              {rental.beds} beds
              {" • "}
              {rental.baths} baths
              {" • "}
              {rental.squareFeet} sq ft
            </p>

            <p>
              {rental.cats ? "Cats Allowed" : "No Cats"}
              {" | "}
              {rental.dogs ? "Dogs Allowed" : "No Dogs"}
              {" | "}
              {rental.smoking
                ? "Smoking Allowed"
                : "No Smoking"}
            </p>

            <p>
              Available in {rental.availability_days} days
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}