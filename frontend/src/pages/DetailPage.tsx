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
          ...data,
          rentfaster_id: String(data.rentfaster_id)
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
        <div className="p-20 text-center font-bold animate-pulse tracking-[0.5em]">
          Loading System Data...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-12">
        
        <div className="border-b-4 border-black pb-6 mb-12 flex justify-between items-baseline">
          <div>
            <h1 className="text-[42px] font-bold">
              {rental.address}
            </h1>

            <p className="text-[18px] text-gray-500">
              {rental.city} {" "}
              {rental.province}
            </p>
          </div>

          <div className="bg-black text-white px-6 py-2 font-mono text-[24px]">
            ID {id}
          </div>
        </div>

          <div className="space-y-12">
            
            <div className="grid grid-cols-3 gap-1">
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
                    rental.sq_feet,
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-white p-6 text-center"
                >
                  <p
                    className="text-[12px] text-gray-400"
                  >
                    {spec.label}
                  </p>

                  <p
                    className="text-[16px] font-bold"
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3
                className="text-[16px] font-bold"
              >
                Technical Parameters
              </h3>

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-mono text-[13px] pt-2"
              >
                <div className="flex justify-between border-b border-gray-300 py-1">
                  <span>
                    Lease Term
                  </span>
                  <span>
                    {
                      rental.lease_term
                    }{" "}
                    Months
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-300 py-1">
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

                <div className="flex justify-between border-b border-gray-300 py-1">
                  <span>Cats</span>
                  <span
                    className={
                      rental.cats
                        ? "text-[#00ff00] font-bold"
                        : ""
                    }
                  >
                    {rental.cats
                      ? "Allowed"
                      : "None"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-300 py-1">
                  <span>Dogs</span>
                  <span
                    className={
                      rental.dogs
                        ? "text-[#00ff00] font-bold"
                        : ""
                    }
                  >
                    {rental.dogs
                      ? "Allowed"
                      : "None"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-8 space-y-8">
              
              <div>
                <label>
                  Current Rent
                </label>

                <p className="text-[48px] font-bold">
                  ${rental.price}
                </p>

                <p className="text-[12px] text-gray-400">
                  Per Month / Fixed
                </p>
              </div>

              <div>
                <button
                  onClick={
                    fetchPredictedPrice
                  }
                  disabled={isPredicting}
                  className={`w-full py-4 font-bold border-2 border-black
                  ${isPredicting ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white'}`}
                >
                  {isPredicting
                    ? "Calculating..."
                    : "Predict Market Price"}
                </button>

                {predictedPrice !==
                  null && (
                  <div
                    className="mt-6 bg-black text-white p-6"
                  >
                    <label
                      className="text-[10px] font-bold text-[#fbffa7]"
                    >
                      ML Prediction Output
                    </label>

                    <p className="text-[36px] font-bold">
                      ${predictedPrice}
                    </p>

                    {(rental.price >= predictedPrice - 100) && 
                    (rental.price <= predictedPrice + 100) &&
                    (<p className="text-[12px] text-gray-400">Fair price</p>)}

                    {(rental.price < predictedPrice - 100) &&
                    (<p className="text-[12px] text-gray-400">Good deal</p>)}

                    {(rental.price > predictedPrice + 100) &&
                    (<p className="text-[12px] text-gray-400">Overpriced</p>)}                    
                  </div>
                )}


              </div>
            </div>

          </div>
        </div>
    </Layout>
  );
}