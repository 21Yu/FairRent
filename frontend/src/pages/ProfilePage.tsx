import Layout from "../components/layout/Layout";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function ProfilePage() {
    const { user, loading, handleLogout, handleUpdateProfile } = useAuth();
    const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
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
                <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
                    <section className="w-full max-w-md">
                        <div className="mb-6 text-center">
                            <p className="text-xs font-semibold uppercase text-gray-500">Your FairRent account</p>
                            <h1 className="mt-2 text-3xl font-semibold text-gray-950">
                                {authMode === "signin" ? "Welcome back" : "Join FairRent"}
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                {authMode === "signin"
                                    ? "Sign in to save listings and compare rents."
                                    : "Create an account to save homes and track rent insights."}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                            <div role="tablist" aria-label="Account access" className="mb-6 grid grid-cols-2 rounded-md bg-gray-100 p-1">
                                <button
                                    id="signin-tab"
                                    type="button"
                                    role="tab"
                                    aria-selected={authMode === "signin"}
                                    aria-controls="auth-panel"
                                    onClick={() => { setAuthMode("signin"); setFeedback(null); }}
                                    className={`rounded px-3 py-2 text-sm font-semibold transition ${authMode === "signin" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                                >
                                    Sign in
                                </button>
                                <button
                                    id="register-tab"
                                    type="button"
                                    role="tab"
                                    aria-selected={authMode === "register"}
                                    aria-controls="auth-panel"
                                    onClick={() => { setAuthMode("register"); setFeedback(null); }}
                                    className={`rounded px-3 py-2 text-sm font-semibold transition ${authMode === "register" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                                >
                                    Create account
                                </button>
                            </div>

                            {feedback && <p role="status" className="mb-5 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{feedback}</p>}
                            <div id="auth-panel" role="tabpanel" aria-labelledby={`${authMode}-tab`}>
                                {authMode === "signin" ? (
                                    <LoginForm onSuccess={() => setFeedback("Signed in successfully.")} />
                                ) : (
                                    <RegisterForm onSuccess={() => {
                                        setAuthMode("signin");
                                        setFeedback("Account created. You can now sign in.");
                                    }} />
                                )}
                            </div>
                        </div>
                    </section>
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
                        type="button"
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