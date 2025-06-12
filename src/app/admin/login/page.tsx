"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError("Email ou mot de passe incorrect.");
            return;
        }
        router.push("/admin");
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-white">
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-200 text-gray-900 p-8 rounded-xl shadow max-w-xs w-full flex flex-col gap-4"
            >
                <h1 className="text-xl font-bold text-center">Connexion admin</h1>
                <input
                    type="email"
                    required
                    placeholder="Email"
                    className="border border-gray-200 rounded px-4 py-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    required
                    placeholder="Mot de passe"
                    className="border border-gray-200 rounded px-4 py-2"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-700 text-white rounded px-4 py-2 font-semibold hover:bg-blue-800 transition disabled:bg-blue-400"
                    disabled={loading}
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            </form>
        </main>
    );
}
