import { useState, useEffect } from "react";

import FilterForm from "../components/forms/FilterForm";
import { fetchListings } from "../services/api";
import Layout from "../components/layout/Layout";
import type { ListingType } from "../models/ListingType";
import ListingCard from "../components/cards/ListingCard";

export interface Filters {
    price: string;
    type: string;
    beds: string;
    baths: string;
    squareFeet: string; 
    province?: string;
}

export default function ListViewPage() {
    const [filters, setFilters] = useState<Filters>({
        price: "",
        type: "",
        beds: "",
        baths: "",
        squareFeet: "",
        province: ""
    });


    const [listings, setListings] = useState<ListingType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const timeout = setTimeout(async () => {
        setLoading(true);
        const data = await fetchListings(filters);
        setListings(data);
        setLoading(false);
        }, 300);

        return () => clearTimeout(timeout);


    }, [filters]);

    return (
        <Layout>
            <div className="p-8 md:p-4">
                <section>
                    <FilterForm
                    onFormSubmit={setFilters}
                    isListView={true}
                    />
                </section>
            </div>
            <div className="p-6 max-w-7xl mx-auto">
                {loading ? (
        
                    <p className="text-[12px] text-gray-400">
                    loading...
                    </p>
        
                ) : listings.length === 0 ? (
        
                    <p className="text-[12px] text-gray-400">
                    No data matching criteria
                    </p>
        
                ) : (    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((item) => (
                        <ListingCard key={item._id} listing={item} />
                    ))}
                    </div>
                )}
            </div>
        </Layout>
    )
} 