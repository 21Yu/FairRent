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
        
        <div className="flex justify-between items-baseline">
          <div>
            <h1 className="text-[42px] font-bold">
              {rental.address}
            </h1>

            <p className="text-[18px] text-gray-500">
              {rental.city} {" "}
              {rental.province}
            </p>
          </div>

          <div className="bg-black text-white px-2 py-2 font-mono text-[24px]">
            ID {id}
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1"><Map rentals={rental}/></div>

          <div className="flex-1 flex flex-col md:flex-row">
            <div className="flex-1 p-4">
              <h3 className="text-[16px] font-bold">
                Details
              </h3>
              <table className="divide-y divide-gray-200 border text-sm w-full">
                <tbody className="divide-y divide-gray-400">
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Beds</th>
                    <td className="px-4 py-2 text-gray-700">{rental.beds}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Baths</th>
                    <td className="px-4 py-2 text-gray-700">{rental.baths}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Square Feet</th>
                    <td className="px-4 py-2 text-gray-700">{rental.sq_feet} sq ft</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Lease Term</th>
                    <td className="px-4 py-2 text-gray-700">{rental.lease_term} Months</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Price / Sq Ft</th>
                    <td className="px-4 py-2 text-gray-700">${rental.price_sq_ft}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Availability</th>
                    <td className="px-4 py-2 text-gray-700">{rental.availability_days} Days</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Furnishing</th>
                    <td className="px-4 py-2 text-gray-700">{rental.furnishing ? "Furnished" : "Unfurnished"}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Smoking</th>
                    <td className="px-4 py-2 text-gray-700">{rental.smoking ? "Allowed" : "No Smoking"}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Cats</th>
                    <td className="px-4 py-2 text-gray-700">{rental.cats ? "Allowed" : "None"}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Dogs</th>
                    <td className="px-4 py-2 text-gray-700">{rental.dogs ? "Allowed" : "None"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-1 flex-col">
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-[16px] font-bold">
                  Current Rent:
                </label>
                <p className="text-[48px] font-bold">
                  ${rental.price}
                </p>
                <p className="text-[12px] text-gray-400">Per Month</p>
              </div>

              <button
                onClick={fetchPredictedPrice}
                disabled={isPredicting}
                className={`w-full py-4 font-bold border-2 border-black mb-4
                ${isPredicting ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white'}`}
              >
                {isPredicting
                  ? "Calculating..."
                  : "Predict Market Price"}
              </button>

              {predictedPrice !==
                null && (
                <div className="bg-black text-white p-6">
                  <div className="mb-4">
                    <label className="font-bold text-[#fbffa7]">
                      Prediction:
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
                    <h3 className="text-[16px] font-bold text-[#fbffa7]">
                      Market Insights
                    </h3>
                    {insights ? (
                      <div>
                        <p className="text-[12px] text-gray-400">Micro-Neighborhood Comps</p>
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
      </div>
    </Layout>
  );
}