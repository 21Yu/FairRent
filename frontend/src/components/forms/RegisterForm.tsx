import { useState } from "react";
import type { RegisterFormValues } from "../../models/UserTypes";
import { registerUser } from "../../services/api";

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
    const [formData, setFormData] = useState<RegisterFormValues>({
        userName: "",
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
            await registerUser(formData.userName, formData.email, formData.password);
            onSuccess?.();
            setFormData({
                userName: "",
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
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">New to FairRent</p>
                <h2 className="text-2xl font-semibold text-gray-950">Create account</h2>
            </div>

            <div className="space-y-2">
                <label htmlFor="register-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                    id="register-name"
                    type="text" 
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder="Enter User Name"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input 
                    id="register-email"
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
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                    id="register-password"
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
                {loading ? "Registering..." : "Register"}
            </button>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}
        </form>
    )
}