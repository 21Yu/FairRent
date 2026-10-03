import { useEffect, useState, type FormEvent } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { deleteAdminUser, fetchAdminUsers, updateAdminUser } from "../services/api";
import type { UserResponse } from "../models/UserTypes";

export default function AdminPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [busyUserId, setBusyUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetchAdminUsers()
            .then((loadedUsers) => {
                if (isMounted) setUsers(loadedUsers);
            })
            .catch((fetchError: unknown) => {
                if (isMounted) setError(fetchError instanceof Error ? fetchError.message : "Failed to load users.");
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const onUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingUser) return;

        const formData = new FormData(event.currentTarget);
        const updates: { user_name: string; email: string; password?: string } = {
            user_name: String(formData.get("user_name") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
        };
        const password = String(formData.get("password") ?? "");
        if (password) updates.password = password;

        setError(null);
        setNotice(null);
        setIsSaving(true);
        try {
            const updatedUser = await updateAdminUser(editingUser.id, updates);
            setUsers((currentUsers) => currentUsers.map((item) => item.id === updatedUser.id ? updatedUser : item));
            setEditingUser(null);
            setNotice(`Updated ${updatedUser.email}.`);
        } catch (updateError) {
            setError(updateError instanceof Error ? updateError.message : "Failed to update user.");
        } finally {
            setIsSaving(false);
        }
    };

    const onDeleteUser = async (target: UserResponse) => {
        if (!window.confirm(`Delete the account for ${target.email}? This cannot be undone.`)) return;

        setError(null);
        setNotice(null);
        setBusyUserId(target.id);
        try {
            await deleteAdminUser(target.id);
            setUsers((currentUsers) => currentUsers.filter((item) => item.id !== target.id));
            if (editingUser?.id === target.id) setEditingUser(null);
            setNotice(`Deleted ${target.email}.`);
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Failed to delete user.");
        } finally {
            setBusyUserId(null);
        }
    };

    return (
        <Layout>
            <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-gray-300 pb-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Administration</p>
                        <h1 className="mt-1 text-2xl font-bold">Users</h1>
                    </div>
                    {!isLoading && <p className="text-sm text-gray-600">{users.length} accounts</p>}
                </div>

                {notice && <p role="status" className="mb-4 border-l-4 border-green-700 bg-green-50 px-4 py-3 text-green-900">{notice}</p>}
                {error && <p role="alert" className="mb-4 border-l-4 border-red-700 bg-red-50 px-4 py-3 text-red-900">{error}</p>}
                {isLoading ? (
                    <p className="py-8 text-gray-600">Loading users...</p>
                ) : error && users.length === 0 ? null : users.length === 0 ? (
                    <p className="py-8 text-gray-600">No user accounts found.</p>
                ) : (
                    <div className="overflow-x-auto border border-gray-300">
                        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Name</th>
                                    <th scope="col" className="px-4 py-3">Email</th>
                                    <th scope="col" className="px-4 py-3">Saved listings</th>
                                    <th scope="col" className="px-4 py-3">Access</th>
                                    <th scope="col" className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((account) => (
                                    <tr key={account.id} className="border-t border-gray-200 align-middle">
                                        <td className="px-4 py-3 font-medium">{account.user_name}</td>
                                        <td className="px-4 py-3">{account.email}</td>
                                        <td className="px-4 py-3">{account.saved_listings?.length ?? 0}</td>
                                        <td className="px-4 py-3">{account.is_admin ? "Admin" : "User"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => { setError(null); setEditingUser(account); }}
                                                    className="font-semibold underline decoration-gray-400 underline-offset-4 hover:text-indigo-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => void onDeleteUser(account)}
                                                    disabled={account.id === user?.id || busyUserId === account.id}
                                                    className="font-semibold text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-40"
                                                    title={account.id === user?.id ? "You cannot delete your own account" : "Delete user"}
                                                >
                                                    {busyUserId === account.id ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {editingUser && (
                    <section aria-labelledby="edit-user-title" className="mt-8 max-w-2xl border-t border-gray-300 pt-6">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h2 id="edit-user-title" className="text-lg font-bold">Edit user</h2>
                            <button type="button" onClick={() => setEditingUser(null)} className="px-2 py-1 text-sm underline underline-offset-4">Cancel</button>
                        </div>
                        <form key={editingUser.id} onSubmit={(event) => void onUpdateUser(event)} className="grid gap-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Name
                                <input name="user_name" required minLength={1} defaultValue={editingUser.user_name} className="border border-gray-400 px-3 py-2 font-normal" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium">
                                Email
                                <input name="email" type="email" required defaultValue={editingUser.email} className="border border-gray-400 px-3 py-2 font-normal" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
                                Set new password
                                <input name="password" type="password" minLength={1} autoComplete="new-password" placeholder="Leave blank to keep current password" className="border border-gray-400 px-3 py-2 font-normal" />
                            </label>
                            <div className="flex gap-3 sm:col-span-2">
                                <button type="submit" disabled={isSaving} className="bg-black px-5 py-2 font-semibold text-white hover:bg-gray-700 disabled:opacity-60">
                                    {isSaving ? "Saving..." : "Save user"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </main>
        </Layout>
    );
}