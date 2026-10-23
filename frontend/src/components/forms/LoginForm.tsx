import { useState } from "react";

import type { LoginFormValues } from "../../models/UserTypes";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const { handleLogin } = useAuth();
    const [formData, setFormData] = useState<LoginFormValues>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await handleLogin( formData.email, formData.password);
            onSuccess?.();
            setFormData({
                email: "",
                password: "",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="flex flex-col gap-5"
        >
            <div className="space-y-2">
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Welcome back</p>
                <h2 className="text-2xl font-semibold text-gray-950">Sign in</h2>
            </div>

            <div className="space-y-2">
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input 
                    id="login-email"
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter Email"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                    id="login-password"
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter Password"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <button 
                type="submit"
                className="w-full rounded-md bg-indigo-300 px-4 py-3 font-semibold text-gray-950 transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
            >
                {loading ? "Signing In..." : "Sign In"}
            </button>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}
        </form>
    )
}