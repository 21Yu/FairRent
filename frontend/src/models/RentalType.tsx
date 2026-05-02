export interface RentalType {
    id: string;
    city: string;
    province: string;
    address: string;
    latitude: number;
    longitude: number; 
    lease_term: number;
    type: string;
    price: number;
    beds: number;
    baths: number; 
    sq_feet: number; 
    link: string;
    furnishing: boolean;
    availability_date: string;
    smoking: boolean;
    cats: boolean;
    dogs: boolean;
}
