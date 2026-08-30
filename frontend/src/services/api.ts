import type { Filters, MapBounds } from "../pages/MainPage";
import type { ListingType } from "../models/ListingType";
import type { InsightsType } from "../models/InsightsType";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export interface UserResponse {
    id: string;
    email: string;
    user_name: string;
}

export async function registerUser(user_name: string, email: string, password: string): Promise<UserResponse> {
    const res = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_name, email, password })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);

        let errorMessage = 'Register Failed';
        
        // FastAPI returns validation errors in data.detail as an array of objects
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

    const res = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: 'include',
        body: formData
    });

    if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Login Failed' }));
        throw new Error(error ?? 'Login Failed');
    }

    return res.json();
}

export async function logout(): Promise<void> {
    const res = await fetch(`${baseURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Logout failed');
    }
}

export async function getCurrentUser(): Promise<UserResponse> {
    const res = await fetch(`${baseURL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
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
    const res = await fetch(
        `${baseURL}/listings/${id}`
    );

    if (!res.ok) {
        throw new Error('Failed to fetch listing');
    }

    return res.json();
}

export async function fetchInsights(id: string): Promise<InsightsType> {
    const res = await fetch(`${baseURL}/ml/insights/?id=${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch rental');
    }

    return res.json();    
}

export async function fetchPredictedPrice(id: string): Promise<number> {
    const res = await fetch(`${baseURL}/ml/predict/?id=${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch rental');
    }

    const data = await res.json();
    return data.predicted_price; 
}
