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
            <div className="mx-auto max-w-[1800px] px-4 pt-5 md:px-6">
                <section>
                    <FilterForm
                    onFormSubmit={setFilters}
                    isListView={true}
                    />
                </section>
            </div>
            <div className="mx-auto max-w-[1800px] px-4 py-6 md:px-6">
                <label className="mb-6 block max-w-2xl">
                    <span className="sr-only">Search listings</span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by address, city, province, or property type"
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    />
                </label>
                {loading ? (
        
                    <p className="rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    Loading listings...
                    </p>
        
                ) : filteredListings.length === 0 ? (
        
                    <p className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500">
                    No listings match your search and filters.
                    </p>
        
                ) : (    
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredListings.map((item) => (
                        <ListingCard key={item._id} listing={item} />
                    ))}
                    </div>
                )}
            </div>
        </Layout>
    )
} 