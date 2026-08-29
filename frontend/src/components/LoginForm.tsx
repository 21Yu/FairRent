import { useState } from "react";

type RegisterFormValues = {
    email: string;
    password: string;
};

export default function LoginForm() {
    const [formData, setFormData] = useState<RegisterFormValues>({
        email: "",
        password: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="space-y-8 text-[12px] font-bold"
        >
            <div className="space-y-2">
                <h2>Log In</h2>
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
                    className="appearance-none w-full bg-white border-2 border-black p-4 uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 font-mono"
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
                    className="appearance-none w-full bg-white border-2 border-black p-4 uppercase focus:bg-[#0000ff] focus:text-white focus:outline-none placeholder-gray-400 font-mono"
                />
            </div>

            <button 
                type="submit"
                className="w-full py-4 border-2 border-black bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white"
            >
                Log In
            </button>
        </form>
    )
}