// import React, { useEffect, useState } from 'react';
// import api from '../services/api';

// export const SavedListingsPage: React.FC = () => {
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSavedListings = async () => {
//       try {
//         const response = await api.get('/users/saved-listings');
//         setListings(response.data);
//       } catch (error) {
//         console.error("Failed to load saved listings", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSavedListings();
//   }, []);

//   if (loading) return <div className="p-8">Loading saved listings...</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Your Saved Listings</h1>
//       {listings.length === 0 ? (
//         <p className="text-gray-500">You haven't saved any listings yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {listings.map((item) => (
//             <div key={item.id} className="border p-4 rounded shadow bg-white">
//               <h3 className="font-semibold text-lg">{item.title || item.property_type}</h3>
//               <p className="text-blue-600 font-bold">${item.price}/mo</p>
//               <p className="text-sm text-gray-500">{item.bedrooms} Bed • {item.bathrooms} Bath • {item.sqft} sqft</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };