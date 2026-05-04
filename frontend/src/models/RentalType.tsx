export interface RentalType {
    id: string;
    city: string;
    province: string;
    address: string;
    latitude: number;
    longitude: number; 
    type: string;
    price: number;
    beds: number;
    baths: number; 
    squareFeet: number; 
    furnishing: string;
    smoking: boolean;
    cats: boolean;
    dogs: boolean;
    lease_term_months: number;
    availability_days: number;
}
