import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import type { ListingType } from "../../models/ListingTypes";
import { BookmarkButton } from "./BookmarkButton";

type ListingCardProps = {
  listing: ListingType;
  isSelected?: boolean;
};

export default function ListingCard({
  listing, isSelected
}: ListingCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      const container = document.getElementById("sidebar-scroll-container");

      if (container && typeof container.scrollTo === "function") {
        container.scrollTo({
          top: cardRef.current.offsetTop - container.offsetTop,
          behavior: "smooth",
        });
      }
    }}, [isSelected]);
  
  return (
    <li className="list-none">
      <div
        ref={cardRef}
        className={`flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md ${
          isSelected ? "border-indigo-300 shadow-sm" : "border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between gap-3 p-4 pb-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium uppercase text-gray-500">
              {listing.city}, {listing.province}
            </p>
            <h3 className="truncate text-base font-semibold text-gray-900">
              {listing.address}
            </h3>
            <p className="mt-1 text-xs text-gray-400">Listing {listing._id}</p>
          </div>
          <BookmarkButton listingId={listing._id} />
        </div>

        <div className="mx-4 flex items-end justify-between gap-3 rounded-md bg-indigo-50 px-3 py-2.5">
          <div>
            <p className="text-xs font-medium text-gray-500">Monthly rent</p>
            <p className="mt-0.5 text-xl font-bold text-gray-900">
              ${listing.price.toLocaleString()}
            </p>
          </div>
          <span className="mb-1 text-xs font-medium text-gray-500">per month</span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-200 px-4 py-4">
          <div className="pr-2">
            <p className="text-lg font-semibold text-gray-900">{listing.beds}</p>
            <p className="text-xs text-gray-500">Beds</p>
          </div>
          <div className="px-3">
            <p className="text-lg font-semibold text-gray-900">{listing.baths}</p>
            <p className="text-xs text-gray-500">Baths</p>
          </div>
          <div className="pl-3">
            <p className="text-lg font-semibold text-gray-900">{listing.sq_feet.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Sq ft</p>
          </div>
        </div>

        <Link
          to={`/details/${listing._id}`}
          className="mt-auto flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-indigo-300"
        >
          <span>View listing details</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </li>
  );
}