import { useEffect, useState } from 'react';
import { getsavedListings } from '../services/api';
import type { ListingType } from '../models/ListingTypes';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/cards/ListingCard';
import Layout from '../components/layout/Layout';

export default function SavedListingsPage () {
  const [listings, setListings] = useState<ListingType[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchSavedListings = async () => {
      try {
        const data = await getsavedListings();
        setListings(data);
      } catch (err) {
        setError(err instanceof TypeError
          ? "We couldn't load saved listings. Check your connection and try again."
          : err instanceof Error ? err.message : "Unable to load saved listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedListings();
  }, [user]);

  return (
    <Layout>
      {!user ? (
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 text-center text-lg text-gray-600">Sign in to see your saved listings.</div>
      ) : loading ? (
        <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-gray-500">Loading saved listings...</div>
      ) : (
        <div className="mx-auto max-w-[1800px] px-4 py-8 md:px-6">
          <div className="mb-7 border-b border-gray-200 pb-5">
            <p className="text-xs font-semibold uppercase text-gray-500">Your collection</p>
            <h1 className="mt-1 text-3xl font-semibold text-gray-950">Saved listings</h1>
          </div>
          {error ? (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</p>
          ) : listings.length === 0 ? (
            <p className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500">You haven't saved any listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((item) => (
                <ListingCard key={item._id} listing={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}