import { useState, useEffect } from 'react';
import Map from './components/Map';
import FilterForm from './components/FilterForm';
import SideBar from './components/SideBar';
import type { RentalType } from './models/RentalType';

function App() {

  const [filters, setFilters] = useState({
    price: 0,
    type: "",
    beds: 0,
    baths: 0,
    squareFeet: 0,
    furnishing: false,
    smoking: false,
    cats: false,
    dogs: false
  })

  const [rentals, setRentals] = useState<RentalType[]>([]);
  const [numRentals, setNumRentals] = useState<number>(0);

  useEffect(() => {
    async function fetchRentals() {
      try {
        const res = await fetch("http://127.0.0.1:8000/rentals");
        const data = await res.json();

        const mapped: RentalType[] = data.data.map((item) => ({
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
          lease_term_months: item.lease_term_months,
          type_apartment: item.type_apartment,
          type_basement: item.type_basement,
          type_duplex: item.type_duplex,
          type_house: item.type_house,
          type_other: item.type_other,
          type_townhouse: item.type_townhouse,
          furnishing_furnished: item.furnishing_furnished,
          furnishing_negotiable: item.furnishing_negotiable,
          furnishing_unfurnished: item.furnishing_unfurnished,
          availability_days: item.availability_days,
        }))

        setRentals(mapped);
        setNumRentals(data.count);
        console.log(mapped);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }
    
    fetchRentals();
  }, [])

  // const filteredRentals = rentals.filter((rental) => {
  //   return (
  //     (isNaN(filters.baths) || rental.baths === filters.baths) &&
  //     (isNaN(filters.beds) || rental.beds === filters.baths) &&
  //     (rental.cats === filters.cats) &&
  //     (rental.dogs === filters.dogs) &&
  //     (rental.furnishing === filters.furnishing) &&
  //     (rental.price <= filters.price) &&
  //     (rental.smoking === filters.smoking) &&
  //     (rental.squareFeet <= filters.squareFeet) &&
  //     (filters.type === "" || rental.type === filters.type)
  //   )
  // })

  return (
    <>
      {/* <FilterForm onFormSubmit={setFilters}/> */}
      <Map rentals={rentals} />
      <SideBar rentals={rentals} />
    </>
  )
}

export default App

// ui + mock data