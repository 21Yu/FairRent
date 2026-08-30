import { useState } from "react";
import type { RegisterFormValues } from "../models/AuthType";
import { registerUser } from "../services/api";

export default function RegisterForm() {
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
            className="space-y-8 text-[12px] font-bold"
        >
            <div className="space-y-2">
                <h2>Register</h2>
            </div>

            <div className="space-y-2">
                <label className="block">Name</label>
                <input 
                    type="text" 
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder="Enter User Name"
                    className="appearance-none w-full bg-white border-2 border-black p-4 focus:outline-none placeholder-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label className="block tracking-wider">Email Address</label>
                <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter Email"
                    className="appearance-none w-full bg-white border-2 border-black p-4 focus:outline-none placeholder-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label className="block tracking-wider">Password</label>
                <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter Password"
                    className="appearance-none w-full bg-white border-2 border-black p-4 focus:outline-none placeholder-gray-400"
                />
            </div>

            <button 
                type="submit"
                className="bg-black text-white w-full p-4 font-bold hover:bg-indigo-300"
            >
                {loading ? "Registering..." : "Register"}
            </button>

            {error && (
                <div className="p-3 border-2 border-red-600 bg-red-100 text-red-600 font-mono">
                    {error}
                </div>
            )}
        </form>
    )
}