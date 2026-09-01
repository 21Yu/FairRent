import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import type { ListingType } from "../../models/ListingType";
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

      if (container) {
        container.scrollTo({
          top: cardRef.current.offsetTop - container.offsetTop,
          behavior: "smooth",
        });
      }
    }}, [isSelected]);
  
  return (
    <li className="mb-6 list-none">
      <div ref={cardRef} className={`border-1 ${isSelected ? "border-indigo-300" : ""}`}>
        
        <div className="p-3 flex justify-between items-center">
          <h3 className="text-[16px] font-bold">
            {listing.address}
          </h3>

          <span className="text-[12px] px-2 py-1">
            Unit {listing._id}
          </span>
          <BookmarkButton listingId={listing._id}/>
        </div>

        <div className="p-4 flex">
          
          <div className="space-y-4">
            
            <div>
              <p className="text-[12px] text-gray-400">
                Location
              </p>

              <p>
                {listing.city}, {listing.province}
              </p>
            </div>

            <div className="flex gap-8">
              
              <div>
                <p className="text-[12px] text-gray-400">
                  Pricing
                </p>

                <p className="font-bold">
                  ${listing.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[12px] text-gray-400">
                  Specs
                </p>

                <p>
                  {listing.beds} bd {" "}
                  {listing.baths} ba {" "}
                  {listing.sq_feet} sq ft
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            

            <div className="mt-auto pt-4">
              <p className="text-[12px] text-gray-400">
                Availability
              </p>

              <p>
                In{" "}
                {listing.availability_days} days
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/details/${listing._id}`}
          className="flex p-3 font-bold justify-center hover:text-indigo-300"
        >
          <h3>
            Open Listing Details
          </h3>
        </Link>
      </div>
    </li>
  );
}