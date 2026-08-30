import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ListingType } from "../models/ListingType";
import type { InsightsType } from "../models/InsightsType";
import Layout from "../components/layout/Layout";
import Map from "../components/Map";
import { fetchListing, fetchPredictedPrice, fetchInsights } from "../services/api";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const [listing, setListing] = useState<ListingType | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [insights, setInsights] = useState<InsightsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadListingData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchListing(id);
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing details");
      } finally {
        setIsLoading(false);
      }
    };

    loadListingData();
  }, [id]);

  const handlePredictPrice = async () => {
    if (!id) return;

    try {
      setIsPredicting(true);
      const [priceData, insightsData] = await Promise.all([
        fetchPredictedPrice(id),
        fetchInsights(id)
      ]);

      setPredictedPrice(priceData);
      setInsights(insightsData);
    } catch (err) {
      console.error("Failed to calculate predictions:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-20 text-center font-bold">
          Loading System Data...
        </div>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <div className="p-20 text-center font-bold text-red-500">
          {error || "Listing not found"}
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
              {listing.address}
            </h1>
            <p className="text-[18px] text-gray-500">
              {listing.city} {listing.province}
            </p>
          </div>

          <div className="bg-black text-white px-2 py-2 font-mono text-[24px]">
            ID {id}
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1"><Map listings={listing}/></div>

          <div className="flex-1 flex flex-col md:flex-row">
            <div className="flex-1 p-4">
              <h3 className="text-[16px] font-bold">
                Details
              </h3>
              <table className="divide-y divide-gray-200 border text-sm w-full">
                <tbody className="divide-y divide-gray-400">
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Beds</th>
                    <td className="px-4 py-2 text-gray-700">{listing.beds}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Baths</th>
                    <td className="px-4 py-2 text-gray-700">{listing.baths}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Square Feet</th>
                    <td className="px-4 py-2 text-gray-700">{listing.sq_feet} sq ft</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Lease Term</th>
                    <td className="px-4 py-2 text-gray-700">{listing.lease_term} Months</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Price / Sq Ft</th>
                    <td className="px-4 py-2 text-gray-700">${listing.price_sq_ft}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Availability</th>
                    <td className="px-4 py-2 text-gray-700">{listing.availability_days} Days</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Furnishing</th>
                    <td className="px-4 py-2 text-gray-700">{listing.furnishing ? "Furnished" : "Unfurnished"}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Smoking</th>
                    <td className="px-4 py-2 text-gray-700">{listing.smoking ? "Allowed" : "No Smoking"}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Cats</th>
                    <td className="px-4 py-2 text-gray-700">{listing.cats ? "Allowed" : "None"}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-left">Dogs</th>
                    <td className="px-4 py-2 text-gray-700">{listing.dogs ? "Allowed" : "None"}</td>
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
                  ${listing.price}
                </p>
                <p className="text-[12px] text-gray-400">Per Month</p>
              </div>

              <button
                onClick={handlePredictPrice}
                disabled={isPredicting}
                className={`w-full py-4 font-bold border-2 border-black mb-4
                ${isPredicting ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white'}`}
              >
                {isPredicting
                  ? "Calculating..."
                  : "Predict Market Price"}
              </button>

              {predictedPrice !== null && (
                <div className="bg-black text-white p-6">
                  <div className="mb-4">
                    <label className="font-bold text-[#fbffa7]">
                      Prediction:
                    </label>
                    <p className="text-[36px] font-bold">
                      ${predictedPrice}
                    </p>
                    {(listing.price >= predictedPrice - 100) && 
                    (listing.price <= predictedPrice + 100) &&
                    (<p className="text-[12px] text-gray-400">Fair price</p>)}

                    {(listing.price < predictedPrice - 100) &&
                    (<p className="text-[12px] text-gray-400">Good deal</p>)}

                    {(listing.price > predictedPrice + 100) &&
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
                    ) : null}
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