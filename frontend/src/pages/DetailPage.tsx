import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RentalType } from "../models/RentalType";
import type { InsightsType } from "../models/InsightsType";
import Layout from "../components/layout/Layout";
import Map from "../components/Map";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export default function DetailPage() {
  const { id } = useParams();
  const [rental, setRental] = useState<RentalType | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [insights, setInsights] = useState<InsightsType | null>(null);

  useEffect(() => {
    async function fetchRental() {
      try {
        const res = await fetch(
          `${baseURL}/rental?id=${id}`
        );
        const data = await res.json();

        setRental({ ...data, rentfaster_id: String(data.rentfaster_id) });
        const insightsRes = await fetch(`${baseURL}/insights?id=${id}`);
        const insightsData = await insightsRes.json();
        console.log(insightsData);
        setInsights(insightsData);
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
        <div className="p-20 text-center font-bold">
          Loading System Data...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-12">
        
        <div className="pb-6 mb-6 flex justify-between items-baseline">
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

        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-[16px] font-bold">
                Details
              </h3>

              <div className="gap-y-2">
                <div>
                  <span> Beds: </span>
                  <span> {" "}{rental.beds} </span>
                </div>

                <div>
                  <span> Baths: </span> 
                  <span> {" "}{rental.baths} </span>
                </div>

                <div>
                  <span> Square Feet: </span>
                  <span> {" "}{rental.sq_feet} </span>
                </div>

                <div>
                  <span> Lease Term: </span>
                  <span> {" "}{rental.lease_term}{" "}Months </span>
                </div>

                <div>
                  <span> Price Per Square Foot: </span>
                  <span> {" "}{rental.price_sq_ft}{"$"} </span>
                </div>

                <div>
                  <span> Availability: </span>
                  <span> {" "}{rental.availability_days}{" "}Days </span>
                </div>
                
                <div>
                  <span> Furnishing: </span>
                  <span> {" "}{rental.furnishing ? "Furnished" : "Unfurnished"} </span>
                </div>

                <div>
                  <span> Smoking: </span>
                  <span> {" "}{rental.smoking ? "Allowed" : "No Smoking"} </span>
                </div>

                <div>
                  <span> Cats: </span>
                  <span> {" "}{rental.cats ? "Allowed" : "None"} </span>
                </div>

                <div>
                  <span> Dogs: </span>
                  <span> {" "}{rental.dogs ? "Allowed" : "None"} </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <label>
                    Current Rent
                  </label>
                  <p className="text-[48px] font-bold">
                    ${rental.price}
                  </p>
                  <p className="text-[12px] text-gray-400">Per Month</p>
                </div>
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
                  <div className="mt-6 bg-black text-white p-6">
                    <div>
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

                    <div className="mb-4">
                      <h3 className="text-[16px] font-bold">
                        Market Insights
                      </h3>
                      {insights ? (
                        <div>
                          <span>Micro-Neighborhood Comps</span>
                          <p>
                          {insights.difference_percentage > 0 
                          ? `+${insights.difference_percentage}% Over Comps`
                          : `${insights.difference_percentage}% Below Comps`
                          }
                          </p>
                          <p>
                          The average rent in this geo-cluster profile is{" "}
                          <strong>${insights.average_price}</strong> (evaluated across {insights.total_properties_in_cluster} active comps).
                          </p>
                        </div>
                      ) : (<></>)}
                    </div>
                                  
                  </div>
                )}
              </div>
            </div>
          </div> 

          <div className="flex-1"><Map rentals={rental}/></div>
        </div>

      </div>
    </Layout>
  );
}