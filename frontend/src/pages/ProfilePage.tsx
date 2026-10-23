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
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                            <LoginForm onSuccess={() => setFeedback("Signed in successfully.")} />
                        </div>
                        
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
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
            <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
                {feedback && <p role="status" className="mb-6 text-green-700">{feedback}</p>}
                <p className="text-xs font-semibold uppercase text-gray-500">Account</p>
                <h1 className="mt-1 text-3xl font-semibold text-gray-950">Welcome, {user.user_name}</h1>
                <form onSubmit={onProfileSubmit} className="my-7 flex max-w-xl flex-col gap-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                    <h2 className="text-xl font-semibold text-gray-950">Edit profile</h2>
                    <label className="flex flex-col gap-2">
                        <span>Name</span>
                        <input
                            type="text"
                            name="user_name"
                            defaultValue={user.user_name}
                            required
                            minLength={1}
                            autoComplete="name"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
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
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
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
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full rounded-md bg-indigo-300 px-4 py-3 font-semibold text-gray-950 transition hover:bg-indigo-400 disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    {error && <p role="alert" className="text-red-700">{error}</p>}
                    {success && <p role="status" className="text-green-700">{success}</p>}
                    <button 
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={onLogoutClick}
                    >
                        {isLoggingOut ? "Logging out..." : "Log Out"}
                    </button>
                </form>
            </div>
        </Layout>
    );
}