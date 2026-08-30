import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login, logout, getCurrentUser } from '../services/api';
import type { UserResponse } from '../services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
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

  const value = useMemo(
    () => ({ user, loading, handleLogin, handleLogout }),
    [user, loading, handleLogin, handleLogout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}