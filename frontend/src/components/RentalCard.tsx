import { Link } from "react-router-dom";
import type { RentalType } from "../models/RentalType";

type RentalCardProps = {
  rental: RentalType;
};

export default function RentalCard({
  rental,
}: RentalCardProps) {
  return (
    <li>
      <h3>{rental.address}</h3>

      <p>
        {rental.city}, {rental.province}
      </p>

      <p>
        <strong>
          ${rental.price.toLocaleString()}
        </strong>
      </p>

      <p>
        {rental.beds} beds •{" "}
        {rental.baths} baths •{" "}
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

      <Link to={`/details/${rental.id}`}>
        View Details
      </Link>
    </li>
  );
}