import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RentalType } from "../models/RentalType";

export default function DetailPage() {
  const { id } = useParams();

  const [rental, setRental] = useState<RentalType | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRental() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/rental?id=${id}`);
        const data = await res.json();

        const rentalData: RentalType = {
          id: data.rentfaster_id,
          city: data.city,
          province: data.province,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          price: data.price,
          beds: data.beds,
          baths: data.baths,
          squareFeet: data.sq_feet,
          smoking: data.smoking,
          cats: data.cats,
          dogs: data.dogs,
          location_freq: data.location_freq,
          lease_term_months: data.lease_term_months,
          type_apartment: data.type_apartment,
          type_basement: data.type_basement,
          type_duplex: data.type_duplex,
          type_house: data.type_house,
          type_other: data.type_other,
          type_townhouse: data.type_townhouse,
          furnishing_furnished: data.furnishing_furnished,
          furnishing_negotiable: data.furnishing_negotiable,
          furnishing_unfurnished: data.furnishing_unfurnished,
          availability_days: data.availability_days,
        };

        setRental(rentalData);
      } catch (err) {
        console.error("Failed to fetch rental:", err);
      }
    }

    fetchRental();
  }, [id]);

  async function fetchPredictedPrice() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/predict?id=${id}`);
      const data = await res.json();

      setPredictedPrice(data);
    } catch (err) {
      console.error("Failed to fetch predicted price:", err);
    }
  }

  if (!rental) {
    return <div>Loading rental details...</div>;
  }

  return (
    <>
      <div>
        <h1>{rental.address}</h1>

        <p>
          {rental.city}, {rental.province}
        </p>

        <p>
          Monthly Rent: <strong>${rental.price}</strong>
        </p>

        <p>
          {rental.beds} Beds • {rental.baths} Baths •{" "}
          {rental.squareFeet} sq ft
        </p>

        <p>
          Lease Term: {rental.lease_term_months} months
        </p>

        <p>
          Available In: {rental.availability_days} days
        </p>

        <p>
          Pets:
          {" "}
          {rental.cats ? "Cats Allowed" : "No Cats"}
          {" | "}
          {rental.dogs ? "Dogs Allowed" : "No Dogs"}
        </p>

        <p>
          Smoking: {rental.smoking ? "Allowed" : "Not Allowed"}
        </p>
      </div>

      <button onClick={fetchPredictedPrice}>
        Predict Rental Price
      </button>

      {predictedPrice !== null && (
        <p>
          Predicted Price: <strong>${predictedPrice}</strong>
        </p>
      )}
    </>
  );
}