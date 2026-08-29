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

    const data: UserResponse = await res.json();
    return data;
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

    const data: UserResponse = await res.json();
    return data;
}

export async function logout(): Promise<void> {
    const res = await fetch(`${baseURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    const data = await res.json();
    return data;
}

export async function getCurrentUser(): Promise<UserResponse> {
    const res = await fetch(`${baseURL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
    });

    const data:UserResponse = await res.json();
    return data;    
}