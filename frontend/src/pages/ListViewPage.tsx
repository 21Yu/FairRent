import { useState, useEffect } from "react";

import FilterForm from "../components/forms/FilterForm";
import { fetchListings } from "../services/api";
import Layout from "../components/layout/Layout";
import type { ListingType } from "../models/ListingTypes";
import ListingCard from "../components/cards/ListingCard";
import type { Filters } from "../models/FormTypes";

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
    const [searchQuery, setSearchQuery] = useState("");

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const filteredListings = listings.filter((listing) =>
        [listing.address, listing.city, listing.province, listing.type]
            .some((value) => value.toLowerCase().includes(normalizedSearchQuery))
    );

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
                <label className="mb-6 block">
                    <span className="sr-only">Search listings</span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by address, city, province, or property type"
                        className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                    />
                </label>
                {loading ? (
        
                    <p className="text-[12px] text-gray-400">
                    loading...
                    </p>
        
                ) : filteredListings.length === 0 ? (
        
                    <p className="text-[12px] text-gray-400">
                    No data matching criteria
                    </p>
        
                ) : (    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((item) => (
                        <ListingCard key={item._id} listing={item} />
                    ))}
                    </div>
                )}
            </div>
        </Layout>
    )
} 