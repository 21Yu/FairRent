// SideBar.tsx

import { useState } from "react";

import type { RentalType } from "../models/RentalType";

import RentalCard from "./RentalCard";

import { sideBarStyles as styles } from "../styles/sideBar.styles";

type SideBarProps = {
  rentals: RentalType[];
};

export default function SideBar({
  rentals,
}: SideBarProps) {
  const [ascending, setAscending] =
    useState(true);

  const sortedRentals = [...rentals].sort(
    (a, b) =>
      ascending
        ? a.price - b.price
        : b.price - a.price
  );

  return (
    <aside className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        
        <h2 className={styles.title}>
          Results ({rentals.length})
        </h2>

        <button
          onClick={() =>
            setAscending(!ascending)
          }
          className={styles.sortButton(
            ascending
          )}
        >
          <span className={styles.sortLabel}>
            Price:
          </span>

          <span>
            {ascending
              ? "Low → High"
              : "High → Low"}
          </span>
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {rentals.length === 0 ? (
          
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No data matching criteria
            </p>
          </div>

        ) : (
          
          <ul className={styles.list}>
            {sortedRentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
              />
            ))}
          </ul>
        )}
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <span>Ready.</span>

        <span className={styles.cpu}>
          CPU 2%
        </span>
      </div>
    </aside>
  );
}