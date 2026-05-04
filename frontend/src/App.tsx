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

        setRentals(data.data);
        setNumRentals(data.count);
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

  // return (
  //   <>
  //     <FilterForm onFormSubmit={setFilters}/>
  //     <Map rentals={filteredRentals} />
  //     <SideBar rentals={filteredRentals} />
  //   </>
  // )
}

export default App

// ui + mock data