import { useState } from 'react';
import Map from './components/Map';
import FilterForm from './components/FilterForm';
import SideBar from './components/SideBar';
import type { RentalType } from './models/RentalType';

function App() {

  const [filter, setFilter] = useState({
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

  const rentals: RentalType[] = [
    {
      id: "1",
      city: "Vancouver",
      province: "BC",
      address: "123 Main St",
      latitude: 49.2827,
      longitude: -123.1207,
      lease_term: 12,
      type: "Apartment",
      price: 2500,
      beds: 2,
      baths: 2,
      sq_feet: 850,
      link: "https://example.com/listing/1",
      furnishing: true,
      availability_date: "2026-06-01",
      smoking: false,
      cats: true,
      dogs: false
    },
    {
      id: "2",
      city: "Burnaby",
      province: "BC",
      address: "456 Kingsway",
      latitude: 49.2488,
      longitude: -122.9805,
      lease_term: 6,
      type: "Condo",
      price: 2200,
      beds: 1,
      baths: 1,
      sq_feet: 600,
      link: "https://example.com/listing/2",
      furnishing: false,
      availability_date: "2026-05-15",
      smoking: false,
      cats: false,
      dogs: true
    },
    {
      id: "3",
      city: "Richmond",
      province: "BC",
      address: "789 No. 3 Rd",
      latitude: 49.1666,
      longitude: -123.1336,
      lease_term: 12,
      type: "Townhouse",
      price: 3200,
      beds: 3,
      baths: 2,
      sq_feet: 1200,
      link: "https://example.com/listing/3",
      furnishing: true,
      availability_date: "2026-07-01",
      smoking: false,
      cats: true,
      dogs: true
    },
    {
      id: "4",
      city: "Surrey",
      province: "BC",
      address: "321 King George Blvd",
      latitude: 49.1913,
      longitude: -122.8490,
      lease_term: 12,
      type: "Apartment",
      price: 2000,
      beds: 2,
      baths: 1,
      sq_feet: 780,
      link: "https://example.com/listing/4",
      furnishing: false,
      availability_date: "2026-06-15",
      smoking: true,
      cats: true,
      dogs: false
    },
    {
      id: "5",
      city: "Vancouver",
      province: "BC",
      address: "555 West Broadway",
      latitude: 49.2635,
      longitude: -123.1386,
      lease_term: 8,
      type: "Studio",
      price: 1800,
      beds: 0,
      baths: 1,
      sq_feet: 450,
      link: "https://example.com/listing/5",
      furnishing: true,
      availability_date: "2026-05-20",
      smoking: false,
      cats: false,
      dogs: false
    }
  ]

  return (
    <>
      <FilterForm onFormSubmit={setFilter}/>
      <Map rentals={rentals} />
      <SideBar rentals={rentals} />
    </>
  )
}

export default App

// ui + mock data