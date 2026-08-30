export interface ListingType {
	rentfaster_id: string;
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
	furnishing: boolean;
	smoking: boolean;
	cats: boolean;
	dogs: boolean;
	location_freq: number;
	price_sq_ft: number;
	availability_days: number;
}
