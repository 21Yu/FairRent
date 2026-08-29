import type { Filters, MapBounds } from "../pages/MainPage";
import type { RentalType } from "../models/RentalType";
import type { InsightsType } from "../models/InsightsType";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export interface UserResponse {
    id: string;
    email: string;
    user_name: string;
}

export async function register(user_name: string, email: string, password: string): Promise<UserResponse> {
    const res = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_name, email, password })
    });

    if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Register Failed' }));
        throw new Error(error ?? 'Register Failed');
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

export async function fetchRentals(filters: Filters, bounds: MapBounds): Promise<RentalType[]> {
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

    const res = await fetch(`${baseURL}/rentals?${query}`);

    if (!res.ok) {
        throw new Error('Failed to fetch rentals');
    }

    return res.json();
}

export async function fetchRental(id: string): Promise<RentalType> {
    const res = await fetch(
        `${baseURL}/rental?id=${id}`
    );

    if (!res.ok) {
        throw new Error('Failed to fetch rental');
    }

    return res.json();
}

export async function fetchInsights(id: string): Promise<InsightsType> {
    const res = await fetch(`${baseURL}/ml/insights?id=${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch rental');
    }

    return res.json();    
}

export async function fetchPredictedPrice(id: string): Promise<number> {
    const res = await fetch(`${baseURL}/ml/predict?id=${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch rental');
    }

    return res.json();    
}
