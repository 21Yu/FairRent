export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface Filters {
    price: string;
    type: string;
    beds: string;
    baths: string;
    squareFeet: string; 
    province?: string;
}

export function createDefaultFilters(): Filters {
    return {
        price: "2500",
        type: "",
        beds: "",
        baths: "",
        squareFeet: "1000",
        province: "",
    };
}
