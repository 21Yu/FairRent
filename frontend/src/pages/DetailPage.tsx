import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ListingType } from "../models/ListingTypes";
import type { InsightsType } from "../models/ListingTypes";
import Layout from "../components/layout/Layout";
import Map from "../components/Map";
import { BookmarkButton } from "../components/cards/BookmarkButton";
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
        <div className="p-20 text-center text-sm font-medium text-gray-500">
          Loading System Data...
        </div>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <div className="m-8 rounded-lg border border-red-200 bg-red-50 p-10 text-center font-medium text-red-700">
          {error || "Listing not found"}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-[1500px] space-y-7 px-4 py-7 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Rental listing</p>
            <h1 className="text-3xl font-semibold text-gray-950 md:text-4xl">
              {listing.address}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {listing.city} {listing.province}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-500 ring-1 ring-gray-200">Listing {id}</span>
            <BookmarkButton listingId={listing._id} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">

          <div className="flex min-w-0 flex-col gap-5">

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"><Map listings={listing}/></div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="border-b border-gray-200 px-5 py-4 text-lg font-semibold text-gray-950">
                Details
              </h3>
              <table className="w-full divide-y divide-gray-100 text-sm">
                <tbody className="divide-y divide-gray-100">
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

          </div>

          <div className="flex flex-col gap-4">

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Monthly rent
                </label>
                <p className="mt-1 text-4xl font-bold text-gray-950">
                  ${listing.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">per month</p>
              </div>

              <button
                onClick={handlePredictPrice}
                disabled={isPredicting}
                className={`w-full rounded-md px-4 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300
                ${isPredicting ? 'cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-indigo-300 text-gray-950 hover:bg-indigo-400'}`}
              >
                {isPredicting
                  ? "Calculating..."
                  : "Predict Market Price"}
              </button>

              {predictedPrice !== null && (
                <div className="rounded-lg border border-gray-800 bg-gray-950 p-5 text-white shadow-sm">
                  <div className="mb-4">
                    <label className="text-xs font-semibold uppercase text-indigo-300">
                      Estimated Market Value
                    </label>
                    <p className="mt-1 text-3xl font-bold">
                      ${predictedPrice.toLocaleString()}
                    </p>
                    {(listing.price >= predictedPrice - 100) && 
                    (listing.price <= predictedPrice + 100) &&
                    (<p className="text-[12px] text-gray-300">Fair price</p>)}

                    {(listing.price < predictedPrice - 100) &&
                    (<p className="text-[12px] text-green-300">Good deal</p>)}

                    {(listing.price > predictedPrice + 100) &&
                    (<p className="text-[12px] text-red-300">Overpriced</p>)}
                  </div>    

                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-indigo-300">
                      Local Market Comparison
                    </h3>
                    {insights ? (
                      <div>
                        <p> This home is{" "}
                          <strong>
                            {insights.difference_percentage > 0 
                              ? `${insights.difference_percentage}% higher`
                              : `${Math.abs(insights.difference_percentage)}% lower`
                            }
                          </strong>
                          {" "} than nearby similar listings
                        </p> 
                        <p>
                          Average rent nearby is{" "}
                          <strong>${insights.average_price.toLocaleString()}</strong> (based on {insights.total_properties_in_cluster} recent homes).
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> 
    </Layout>
  );
}