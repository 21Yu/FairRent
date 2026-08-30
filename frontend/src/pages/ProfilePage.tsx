import Layout from "../components/layout/Layout";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function ProfilePage() {
    const { user, loading, handleLogout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center">Loading...</div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="p-8 md:p-4 flex flex-col md:flex-row gap-8">
                    <LoginForm />
                    <RegisterForm />
                </div>
            </Layout>
        );
    }

    const onLogoutClick = async () => {
        setIsLoggingOut(true);
        try {
            await handleLogout();
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Layout>
            <div className="p-8">
                <h1 className="text-2xl font-bold">Welcome, {user.user_name}!</h1>
                <button 
                    className="w-full py-4 border-2 border-black bg-[#fbffa7] hover:bg-[#0000ff] hover:text-white"
                    onClick={onLogoutClick}
                >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                </button>
            </div>
        </Layout>
    );
}