import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { RentalType } from "../models/RentalType";
import Layout from "../components/layout/Layout";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export default function DetailPage() {
  const { id } = useParams();

  const [rental, setRental] =
    useState<RentalType | null>(null);

  const [predictedPrice, setPredictedPrice] =
    useState<number | null>(null);

  const [isPredicting, setIsPredicting] =
    useState(false);

  useEffect(() => {
    async function fetchRental() {
      try {
        const res = await fetch(
          `${baseURL}/rental?id=${id}`
        );
        const data = await res.json();

        const mapped: RentalType = {
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

        setRental(mapped);
      } catch (err) {
        console.error(
          "Failed to fetch rental:",
          err
        );
      }
    }

    fetchRental();
  }, [id]);

  async function fetchPredictedPrice() {
    setIsPredicting(true);

    try {
      const res = await fetch(
        `${baseURL}/predict?id=${id}`
      );

      const data = await res.json();

      setPredictedPrice(data);
    } catch (err) {
      console.error(
        "Failed to fetch predicted price:",
        err
      );
    } finally {
      setIsPredicting(false);
    }
  }

  if (!rental) {
    return (
      <Layout>
        <div className="p-20 text-center font-bold animate-pulse uppercase tracking-[0.5em]">
          Loading_System_Data...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="DetailPage_container">
        
        <div className="DetailPage_header">
          <div>
            <h1 className="DetailPage_title">
              {rental.address}
            </h1>

            <p className="DetailPage_subtitle">
              {rental.city} {" "}
              {rental.province}
            </p>
          </div>

          <div className="DetailPage_idBox">
            ID_{id}
          </div>
        </div>

        <div className="DetailPage_grid">
          
          <div className="DetailPage_main">
            
            <div className="DetailPage_specsGrid">
              {[
                {
                  label: "Beds",
                  value: rental.beds,
                },
                {
                  label: "Baths",
                  value: rental.baths,
                },
                {
                  label: "Sq Ft",
                  value:
                    rental.squareFeet,
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="DetailPage_specsCard"
                >
                  <p
                    className="DetailPage_specLabel"
                  >
                    {spec.label}
                  </p>

                  <p
                    className="DetailPage_specValue"
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3
                className="DetailPage_sectionTitle"
              >
                Technical Parameters
              </h3>

              <div
                className="DetailPage_technicalGrid"
              >
                <div className="DetailPage_row">
                  <span>
                    Lease Term
                  </span>
                  <span>
                    {
                      rental.lease_term_months
                    }{" "}
                    Months
                  </span>
                </div>

                <div className="DetailPage_row">
                  <span>
                    Availability
                  </span>
                  <span>
                    {
                      rental.availability_days
                    }{" "}
                    Days
                  </span>
                </div>

                <div className="DetailPage_row">
                  <span>Cats</span>
                  <span
                    className={
                      rental.cats
                        ? "DetailPage_allowed"
                        : ""
                    }
                  >
                    {rental.cats
                      ? "ALLOWED"
                      : "NONE"}
                  </span>
                </div>

                <div className="DetailPage_row">
                  <span>Dogs</span>
                  <span
                    className={
                      rental.dogs
                        ? "DetailPage_allowed"
                        : ""
                    }
                  >
                    {rental.dogs
                      ? "ALLOWED"
                      : "NONE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="DetailPage_side">
            
            <div>
              <label className="DetailPage_label">
                Current Rent
              </label>

              <p className="DetailPage_price">
                ${rental.price}
              </p>

              <p className="DetailPage_smallText">
                Per Month / Fixed
              </p>
            </div>

            <div>
              <button
                onClick={
                  fetchPredictedPrice
                }
                disabled={isPredicting}
                className={`DetailPage_button ${isPredicting ? 'DetailPage_button-loading' : 'DetailPage_button-ready'}`}
              >
                {isPredicting
                  ? "Calculating..."
                  : "Predict Market Price"}
              </button>

              {predictedPrice !==
                null && (
                <div
                  className="DetailPage_prediction-box"
                >
                  <label
                    className="DetailPage_prediction-label"
                  >
                    ML_Prediction_Output
                  </label>

                  <p className="text-[36px] font-bold tabular-nums">
                    ${predictedPrice}
                  </p>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}