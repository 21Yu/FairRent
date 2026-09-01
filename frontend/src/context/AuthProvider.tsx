import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login, logout, getCurrentUser, saveListing, deleteListing, getToken } from '../services/api';
import type { UserResponse } from '../services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      const token = getToken();
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (isMounted) setUser(currentUser);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const loggedInUser = await login(email, password);
    setUser(loggedInUser);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  const isSaved = useCallback(
    (listingId: string) => {
      return user?.saved_listings?.includes(listingId) ?? false;
    },
    [user]
  );

  const toggleSaveListing = useCallback(
    async (listingId: string) => {
      if (!user) return;

      const currentlySaved = user.saved_listings?.includes(listingId);

      // Optimistic UI Update
      setUser((prevUser) => {
        if (!prevUser) return null;
        const currentSavedListings = prevUser.saved_listings || [];
        const updatedListings = currentlySaved
          ? currentSavedListings.filter((id) => id !== listingId)
          : [...currentSavedListings, listingId];

        return { ...prevUser, saved_listings: updatedListings };
      });

      try {
        if (currentlySaved) {
          await deleteListing(listingId);
        } else {
          await saveListing(listingId);
        }
      } catch (error) {
        // Revert on failure
        setUser((prevUser) => {
          if (!prevUser) return null;
          const currentSavedListings = prevUser.saved_listings || [];
          const revertedListings = currentlySaved
            ? [...currentSavedListings, listingId]
            : currentSavedListings.filter((id) => id !== listingId);

          return { ...prevUser, saved_listings: revertedListings };
        });
        console.error('Failed to update saved listing state:', error);
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      handleLogin,
      handleLogout,
      toggleSaveListing,
      isSaved,
    }),
    [user, loading, handleLogin, handleLogout, toggleSaveListing, isSaved]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}