import type { Filters, MapBounds } from "../pages/MainPage";
import type { ListingType } from "../models/ListingType";
import type { InsightsType } from "../models/InsightsType";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export interface UserResponse {
    id: string;
    email: string;
    user_name: string;
    saved_listings: string[];
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

// Token Helper Functions
export const getToken = (): string | null => localStorage.getItem('token');
export const setToken = (token: string): void => localStorage.setItem('token', token);
export const removeToken = (): void => localStorage.removeItem('token');

function getAuthHeaders(): Record<string, string> {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser(user_name: string, email: string, password: string): Promise<UserResponse> {
    const res = await fetch(`${baseURL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name, email, password })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);

        let errorMessage = 'Register Failed';
        
        if (Array.isArray(data?.detail)) {
            errorMessage = data.detail
                .map((err: { loc: string[]; msg: string }) => `${err.loc[err.loc.length - 1]}: ${err.msg}`)
                .join(', ');
        } else if (typeof data?.detail === 'string') {
            errorMessage = data.detail;
        }

        throw new Error(errorMessage);
    }

    return res.json();
}

export async function login(email: string, password: string): Promise<UserResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${baseURL}/users/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login Failed');
    }

    const tokenData: LoginResponse = await res.json();
    setToken(tokenData.access_token);

    // Retrieve full user payload following successful authentication
    return await getCurrentUser();
}

export async function logout(): Promise<void> {
    try {
        await fetch(`${baseURL}/users/logout`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders()
            }
        });
    } finally {
        removeToken();
    }
}

export async function getCurrentUser(): Promise<UserResponse> {
    const res = await fetch(`${baseURL}/users/me`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch current user');
    }

    return res.json();
}

export async function fetchListings(filters: Filters, bounds: MapBounds): Promise<ListingType[]> {
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter((entry) => entry[1] !== "")
    );

    const query = new URLSearchParams(
        Object.fromEntries(
            Object.entries({
                ...cleanFilters,
                ...bounds,
            }).map(([key, value]) => [key, String(value)])
        )
    ).toString();

    const res = await fetch(`${baseURL}/listings/?${query}`);

    if (!res.ok) {
        throw new Error('Failed to fetch listings');
    }

    return res.json();
}

export async function fetchListing(id: string): Promise<ListingType> {
    const res = await fetch(`${baseURL}/listings/${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch listing');
    }

    return res.json();
}

export async function fetchInsights(id: string): Promise<InsightsType> {
    const res = await fetch(`${baseURL}/ml/insights?id=${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch insights');
    }

    return res.json();    
}

export async function fetchPredictedPrice(id: string): Promise<number> {
    const res = await fetch(`${baseURL}/ml/predict?id=${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch predicted Price');
    }

    const data = await res.json();
    return data.predicted_price; 
}

export async function saveListing(listing_id: string): Promise<void> {
    const res = await fetch(`${baseURL}/users/saved-listings`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ listing_id })
    });

    if (!res.ok) {
        throw new Error('Failed to save listing');
    }
}

export async function deleteListing(listing_id: string): Promise<void> {
    const res = await fetch(`${baseURL}/users/saved-listings/${listing_id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!res.ok) {
        throw new Error('Failed to delete listing');
    }
}

export async function getsavedListings(): Promise<ListingType[]> {
    const res = await fetch(`${baseURL}/users/saved-listings`, {
        method: 'GET',
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!res.ok) {
        throw new Error('Failed to get saved listing');
    }

    const data: ListingType[] = await res.json();
    return data;
}