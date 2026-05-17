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
          <h3 className="bigText">
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
              <p className="greyText">
                Location
              </p>

              <p>
                {rental.city}, {rental.province}
              </p>
            </div>

            <div className="RentalCard_specsWrapper">
              
              <div>
                <p className="greyText">
                  Pricing
                </p>

                <p>
                  $
                  {rental.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="greyText">
                  Specs
                </p>

                <p>
                  {rental.beds} BD {" "}
                  {rental.baths} BA {" "}
                  {rental.squareFeet} SQFT
                </p>
              </div>
            </div>
          </div>

          <div className="RentalCard_statusPanel">
            
            <div className={`RentalCard_statusBadge ${rental.cats ? 'RentalCard_allowed' : 'RentalCard_notAllowed'}`}>
              Cats 
            </div>

            <div className={`RentalCard_statusBadge ${rental.dogs ? 'RentalCard_allowed' : 'RentalCard_notAllowed'}`}>
              Dogs 
            </div>

            <div className={`RentalCard_statusBadge ${rental.smoking ? 'RentalCard_allowed' : 'RentalCard_notAllowed'}`}>
              Smoke
            </div>

            <div className="RentalCard_availabilityWrapper">
              <p className="greyText">
                Availability
              </p>

              <p>
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
          <h3 className="bigText">
            Open Listing Details
          </h3>
        </Link>
      </div>
    </li>
  );
}