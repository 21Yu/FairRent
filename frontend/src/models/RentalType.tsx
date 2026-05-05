export interface RentalType {
    id: number;
    city: string;
    province: string;
    address: string;
    latitude: number;
    longitude: number; 
    price: number;
    beds: number;
    baths: number; 
    squareFeet: number; 
    smoking: number;
    cats: number;
    dogs: number;
    location_freq: number;
    lease_term_months: number;
    type_apartment: number;
    type_basement: number; 
    type_duplex: number; 
    type_house: number; 
    type_other: number; 
    type_townhouse: number; 
    furnishing_furnished: number;
    furnishing_negotiable: number; 
    furnishing_unfurnished: number; 
    availability_days: number;
}
