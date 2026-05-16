import { Link } from "react-router-dom";
import type { RentalType } from "../models/RentalType";

type RentalCardProps = {
  rental: RentalType;
};

export default function RentalCard({
  rental,
}: RentalCardProps) {
  return (
    <li className="RentalCard_listItem">
      <div className="RentalCard_card">
        
        <div className="RentalCard_header">
          <h3 className="RentalCard_title">
            {rental.address}
          </h3>

          <span className="RentalCard_unitId">
            UNIT_
            {rental.id
              .toString()
              .padStart(3, "0")}
          </span>
        </div>

        <div className="RentalCard_content">
          
          <div className="RentalCard_infoSection">
            
            <div>
              <p className="RentalCard_label">
                Location
              </p>

              <p className="RentalCard_location">
                {rental.city}, {rental.province}
              </p>
            </div>

            <div className="RentalCard_specsWrapper">
              
              <div>
                <p className="RentalCard_label">
                  Pricing
                </p>

                <p className="RentalCard_price">
                  $
                  {rental.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="RentalCard_label">
                  Specs
                </p>

                <p className="RentalCard_specs">
                  {rental.beds} BD {" "}
                  {rental.baths} BA {" "}
                  {rental.squareFeet} SQFT
                </p>
              </div>
            </div>
          </div>

          <div className="RentalCard_statusPanel">
            
            <div className={`RentalCard_statusBadge ${rental.cats ? 'RentalCard_allowed' : 'RentalCard_notAllowed'}`}>
              Cats {rental.cats ? "✓" : "×"}
            </div>

            <div className={`RentalCard_statusBadge ${rental.dogs ? 'RentalCard_allowed' : 'RentalCard_notAllowed'}`}>
              Dogs {rental.dogs ? "✓" : "×"}
            </div>

            <div className={`RentalCard_statusBadge ${rental.smoking ? 'RentalCard_allowed' : 'RentalCard_notAllowed'}`}>
              Smoke{" "}
              {rental.smoking ? "✓" : "×"}
            </div>

            <div className="RentalCard_availabilityWrapper">
              <p className="RentalCard_availabilityText">
                Availability
              </p>

              <p className="RentalCard_availabilityDays">
                IN{" "}
                {rental.availability_days} DAYS
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/details/${rental.id}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="RentalCard_footerLink"
        >
          Open Listing Details
        </Link>
      </div>
    </li>
  );
}