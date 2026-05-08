// RentalCard.tsx

import { Link } from "react-router-dom";
import type { RentalType } from "../models/RentalType";

import {
  rentalCardStyles as styles,
  statusBadge,
} from "../styles/rentalCard.styles";

type RentalCardProps = {
  rental: RentalType;
};

export default function RentalCard({
  rental,
}: RentalCardProps) {
  return (
    <li className={styles.listItem}>
      <div className={styles.card}>
        
        <div className={styles.header}>
          <h3 className={styles.title}>
            {rental.address}
          </h3>

          <span className={styles.unitId}>
            UNIT_
            {rental.id
              .toString()
              .padStart(3, "0")}
          </span>
        </div>

        <div className={styles.content}>
          
          {/* MAIN INFO SECTION */}
          <div className={styles.infoSection}>
            
            <div>
              <p className={styles.label}>
                Location
              </p>

              <p className={styles.location}>
                {rental.city}, {rental.province}
              </p>
            </div>

            <div className={styles.specsWrapper}>
              
              <div>
                <p className={styles.label}>
                  Pricing
                </p>

                <p className={styles.price}>
                  $
                  {rental.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className={styles.label}>
                  Specs
                </p>

                <p className={styles.specs}>
                  {rental.beds} BD {" "}
                  {rental.baths} BA {" "}
                  {rental.squareFeet} SQFT
                </p>
              </div>
            </div>
          </div>

          {/* STATUS PANEL */}
          <div className={styles.statusPanel}>
            
            <div className={statusBadge(rental.cats)}>
              Cats {rental.cats ? "✓" : "×"}
            </div>

            <div className={statusBadge(rental.dogs)}>
              Dogs {rental.dogs ? "✓" : "×"}
            </div>

            <div className={statusBadge(rental.smoking)}>
              Smoke{" "}
              {rental.smoking ? "✓" : "×"}
            </div>

            <div className={styles.availabilityWrapper}>
              <p className={styles.availabilityText}>
                Availability
              </p>

              <p className={styles.availabilityDays}>
                IN{" "}
                {rental.availability_days} DAYS
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <Link
          to={`/details/${rental.id}`}
          className={styles.footerLink}
        >
          Open Listing Details
        </Link>
      </div>
    </li>
  );
}