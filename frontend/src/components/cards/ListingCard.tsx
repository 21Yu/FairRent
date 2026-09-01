import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import type { ListingType } from "../../models/ListingType";
import { BookmarkButton } from "./BookmarkButton";

type ListingCardProps = {
  listing: ListingType;
  isSelected: boolean;
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
    <li className="mb-6">
      <div ref={cardRef} className={`border-2  ${isSelected ? "border-4" : "border-black bg-white"}`}>
        
        <div className="bg-black text-white p-3 flex justify-between items-center">
          <h3 className="text-[16px] font-bold">
            {listing.address}
          </h3>

          <span className="text-[12px] font-mono bg-[#0000ff] px-2 py-1">
            Unit
            {listing._id}
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

                <p className="text-[12px] text-gray-500 mt-0.5">
                    ${listing.price_sq_ft}/sq ft
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
            
            <div className={`text-[10px] px-2 py-0.5 border border-black
              ${listing.cats ? 'bg-[#b3ffad]' : 'bg-[#ffadad] opacity-50'}`}>
              Cats 
            </div>

            <div className={`text-[10px] px-2 py-0.5 border border-black 
              ${listing.dogs ? 'bg-[#b3ffad]' : 'bg-[#ffadad] opacity-50'}`}>
              Dogs 
            </div>

            <div className={`text-[10px] px-2 py-0.5 border border-black
              ${listing.smoking ? 'bg-[#b3ffad]' : 'bg-[#ffadad] opacity-50'}`}>
              Smoke
            </div>

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
          className="flex border-t-2 border-black p-3 items-center bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white"
        >
          <h3 className="text-[16px] font-bold">
            Open Listing Details
          </h3>
        </Link>
      </div>
    </li>
  );
}