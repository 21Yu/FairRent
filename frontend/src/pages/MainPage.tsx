import { useState, useEffect } from "react";

import Map from "../components/Map";
import FilterForm from "../components/FilterForm";
import SideBar from "../components/SideBar";
import Layout from "../components/layout/Layout";
import type { RentalApiResponse } from "../models/RentalApiResponse";

import type { RentalType } from "../models/RentalType";

import { mainPageStyles as styles } from "../styles/mainPage.styles";

function MainPage() {
  const [filters, setFilters] = useState({
    price: "",
    type: "",
    beds: "",
    baths: "",
    squareFeet: "",
  });

  const [bounds, setBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  const [rentals, setRentals] =
    useState<RentalType[]>([]);

  useEffect(() => {
    if (!bounds) return;

    const timeout = setTimeout(() => {
      fetchRentals();
    }, 300);

    return () => clearTimeout(timeout);

    async function fetchRentals() {
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(
            (entry) => entry[1] !== ""
          )
        );

        const query = new URLSearchParams(
          Object.fromEntries(
            Object.entries({
              ...cleanFilters,
              ...bounds,
            }).map(([key, value]) => [
              key,
              String(value),
            ])
          )
        ).toString();

        const res = await fetch(
          `https://fairrent-api.onrender.com/rentals?${query}`
        );

        const data = await res.json();

        const mapped: RentalType[] = data.map(
          (item: RentalApiResponse) => ({
            id: item.rentfaster_id,
            city: item.city,
            province: item.province,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            price: item.price,
            beds: item.beds,
            baths: item.baths,
            squareFeet: item.sq_feet,
            smoking: item.smoking,
            cats: item.cats,
            dogs: item.dogs,
            location_freq: item.location_freq,
            lease_term_months:
              item.lease_term_months,
            type_apartment:
              item.type_apartment,
            type_basement:
              item.type_basement,
            type_duplex: item.type_duplex,
            type_house: item.type_house,
            type_other: item.type_other,
            type_townhouse:
              item.type_townhouse,
            furnishing_furnished:
              item.furnishing_furnished,
            furnishing_negotiable:
              item.furnishing_negotiable,
            furnishing_unfurnished:
              item.furnishing_unfurnished,
            availability_days:
              item.availability_days,
          })
        );

        setRentals(mapped);
      } catch (err) {
        console.error(
          "Failed to fetch rentals:",
          err
        );
      }
    }
  }, [filters, bounds]);

  return (
    <Layout>
      <div className={styles.wrapper}>
        
        <section>
          <FilterForm
            onFormSubmit={setFilters}
          />
        </section>

        <main className={styles.main}>
          
          <section className={styles.sidebar}>
            <SideBar rentals={rentals} />
          </section>

          <section className={styles.mapSection}>
            <Map
              rentals={rentals}
              onBoundsChange={setBounds}
            />

          </section>
        </main>
      </div>
    </Layout>
  );
}

export default MainPage;