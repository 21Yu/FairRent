import Layout from "../components/layout/Layout";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function ProfilePage() {
    const { user, loading, handleLogout, handleUpdateProfile } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

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
                <div className="p-8">
                    {feedback && <p role="status" className="mb-6 text-green-700">{feedback}</p>}
                    <div className="flex flex-col md:flex-row gap-16 md:p-4">
                        <div className="flex flex-col md:flex-1">
                            <LoginForm onSuccess={() => setFeedback("Signed in successfully.")} />
                        </div>
                        
                        <div className="flex flex-col md:flex-1">
                            <RegisterForm onSuccess={() => setFeedback("Account created. You can now sign in.")} />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const onLogoutClick = async () => {
        setIsLoggingOut(true);
        try {
            await handleLogout();
            setFeedback("Logged out successfully.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const onProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(event.currentTarget);
        const userName = String(formData.get("user_name") ?? "").trim();
        const passwordValue = String(formData.get("password") ?? "");
        const confirmPasswordValue = String(formData.get("confirm_password") ?? "");

        if (passwordValue && passwordValue !== confirmPasswordValue) {
            setError("Passwords do not match.");
            return;
        }

        const updates: { user_name?: string; password?: string } = {};
        if (userName.trim() !== user.user_name) updates.user_name = userName.trim();
        if (passwordValue) updates.password = passwordValue;
        if (Object.keys(updates).length === 0) {
            setError("Make a change before saving.");
            return;
        }

        setIsSaving(true);
        try {
            await handleUpdateProfile(updates);
            setPassword("");
            setConfirmPassword("");
            setSuccess("Profile updated.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="p-8">
                {feedback && <p role="status" className="mb-6 text-green-700">{feedback}</p>}
                <h1 className="text-2xl font-bold">Welcome, {user.user_name}!</h1>
                <form onSubmit={onProfileSubmit} className="my-8 flex max-w-xl flex-col gap-5">
                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                    <label className="flex flex-col gap-2">
                        <span>Name</span>
                        <input
                            type="text"
                            name="user_name"
                            defaultValue={user.user_name}
                            required
                            minLength={1}
                            autoComplete="name"
                            className="w-full border border-gray-400 bg-white p-3 focus:outline-none"
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span>New password</span>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            placeholder="Leave blank to keep current password"
                            className="w-full border border-gray-400 bg-white p-3 focus:outline-none"
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span>Confirm new password</span>
                        <input
                            type="password"
                            name="confirm_password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            autoComplete="new-password"
                            className="w-full border border-gray-400 bg-white p-3 focus:outline-none"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-black p-4 font-bold text-white hover:bg-indigo-300 disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    {error && <p role="alert" className="text-red-700">{error}</p>}
                    {success && <p role="status" className="text-green-700">{success}</p>}
                    <button 
                        className="w-full py-4 font-bold bg-black text-white hover:bg-indigo-300"
                        onClick={onLogoutClick}
                    >
                        {isLoggingOut ? "Logging out..." : "Log Out"}
                    </button>
                </form>
            </div>
        </Layout>
    );
}