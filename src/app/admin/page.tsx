"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

type Reservation = {
    id: string;
    name: string;
    phone: string;
    departure: string;
    arrival: string;
    stops?: string;
    date: string;
    passengers?: number;
    luggages?: number;
    status: string;
    created_at: string;
};

function StatusBadge({ status }: { status: string }) {
    const style = {
        "nouveau": "bg-blue-100 text-blue-800",
        "traitée": "bg-green-100 text-green-800",
        "annulée": "bg-red-100 text-red-800",
    }[status] || "bg-gray-100 text-gray-800";
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${style} border`}>
            {label}
        </span>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loadingList, setLoadingList] = useState(true);

    // Modale de détail
    const [selected, setSelected] = useState<Reservation | null>(null);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // Auth/session
    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.replace("/admin/login");
            } else {
                setSession(data.session);
            }
            setLoading(false);
        };
        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                router.replace("/admin/login");
            }
        });
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, [router]);

    // Récupération des réservations
    useEffect(() => {
        if (!session) return;
        const fetchReservations = async () => {
            setLoadingList(true);
            const { data, error } = await supabase
                .from("reservations")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && data) setReservations(data as Reservation[]);
            setLoadingList(false);
        };
        fetchReservations();
    }, [session]);

    // Sépare les nouvelles des traitées/annulées
    const nouvelles = reservations.filter(r => r.status === "nouveau");
    const traitees = reservations.filter(r => r.status !== "nouveau");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">
                Chargement...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white text-gray-900 p-2 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold">Dashboard admin</h1>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.replace("/admin/login");
                        }}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* SECTION NOUVELLES RÉSERVATIONS */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span role="img" aria-label="new">🆕</span>
                        À traiter ({nouvelles.length})
                    </h2>

                    {/* Mobile : cards */}
                    <div className="flex flex-col gap-4 sm:hidden">
                        {loadingList ? (
                            <div className="text-center text-gray-400">Chargement…</div>
                        ) : nouvelles.length === 0 ? (
                            <div className="text-center text-gray-400">Aucune nouvelle réservation.</div>
                        ) : (
                            nouvelles.map(resa => (
                                <div
                                    key={resa.id}
                                    className="bg-blue-50 border border-blue-200 shadow rounded-xl p-4"
                                    onClick={() => setSelected(resa)}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-base">{resa.name}</span>
                                        <StatusBadge status={resa.status} />
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">{resa.date ? new Date(resa.date).toLocaleString("fr-FR") : "-"}</div>
                                    <div className="text-sm"><span className="font-semibold">Départ :</span> {resa.departure}</div>
                                    <div className="text-sm"><span className="font-semibold">Arrivée :</span> {resa.arrival}</div>
                                    <div className="text-sm"><span className="font-semibold">Téléphone :</span> {resa.phone}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop : tableau */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full bg-white border border-blue-200 shadow rounded-xl">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="p-2 text-left">Date</th>
                                    <th className="p-2 text-left">Nom</th>
                                    <th className="p-2 text-left">Téléphone</th>
                                    <th className="p-2 text-left">Départ</th>
                                    <th className="p-2 text-left">Arrivée</th>
                                    <th className="p-2 text-left">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingList ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400">Chargement…</td>
                                    </tr>
                                ) : nouvelles.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400">Aucune nouvelle réservation.</td>
                                    </tr>
                                ) : (
                                    nouvelles.map(resa => (
                                        <tr
                                            key={resa.id}
                                            className="border-b cursor-pointer hover:bg-blue-50 transition"
                                            onClick={() => setSelected(resa)}
                                        >
                                            <td className="p-2 text-xs">{resa.date ? new Date(resa.date).toLocaleString("fr-FR") : "-"}</td>
                                            <td className="p-2">{resa.name}</td>
                                            <td className="p-2">{resa.phone}</td>
                                            <td className="p-2">{resa.departure}</td>
                                            <td className="p-2">{resa.arrival}</td>
                                            <td className="p-2"><StatusBadge status={resa.status} /></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SECTION RÉSERVATIONS TRAITÉES/ANNULÉES */}
                <section>
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span role="img" aria-label="history">📦</span>
                        Historique ({traitees.length})
                    </h2>

                    {/* Mobile : cards */}
                    <div className="flex flex-col gap-4 sm:hidden">
                        {loadingList ? (
                            <div className="text-center text-gray-400">Chargement…</div>
                        ) : traitees.length === 0 ? (
                            <div className="text-center text-gray-400">Aucun historique.</div>
                        ) : (
                            traitees.map(resa => (
                                <div
                                    key={resa.id}
                                    className="bg-gray-50 border border-gray-200 shadow rounded-xl p-4"
                                    onClick={() => setSelected(resa)}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-base">{resa.name}</span>
                                        <StatusBadge status={resa.status} />
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">{resa.date ? new Date(resa.date).toLocaleString("fr-FR") : "-"}</div>
                                    <div className="text-sm"><span className="font-semibold">Départ :</span> {resa.departure}</div>
                                    <div className="text-sm"><span className="font-semibold">Arrivée :</span> {resa.arrival}</div>
                                    <div className="text-sm"><span className="font-semibold">Téléphone :</span> {resa.phone}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop : tableau */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow rounded-xl">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">Date</th>
                                    <th className="p-2 text-left">Nom</th>
                                    <th className="p-2 text-left">Téléphone</th>
                                    <th className="p-2 text-left">Départ</th>
                                    <th className="p-2 text-left">Arrivée</th>
                                    <th className="p-2 text-left">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingList ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400">Chargement…</td>
                                    </tr>
                                ) : traitees.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400">Aucun historique.</td>
                                    </tr>
                                ) : (
                                    traitees.map(resa => (
                                        <tr
                                            key={resa.id}
                                            className="border-b cursor-pointer hover:bg-gray-50 transition"
                                            onClick={() => setSelected(resa)}
                                        >
                                            <td className="p-2 text-xs">{resa.date ? new Date(resa.date).toLocaleString("fr-FR") : "-"}</td>
                                            <td className="p-2">{resa.name}</td>
                                            <td className="p-2">{resa.phone}</td>
                                            <td className="p-2">{resa.departure}</td>
                                            <td className="p-2">{resa.arrival}</td>
                                            <td className="p-2"><StatusBadge status={resa.status} /></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Modale détail/édition */}
                {selected && (
                    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 w-full max-w-md relative text-gray-900">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSelected(null)}
                            >
                                ✕
                            </button>
                            <h3 className="text-xl font-bold mb-4">Détail réservation</h3>
                            <div className="space-y-1 text-sm">
                                <div><span className="font-semibold">Nom :</span> {selected.name}</div>
                                <div><span className="font-semibold">Téléphone :</span> {selected.phone}</div>
                                <div><span className="font-semibold">Départ :</span> {selected.departure}</div>
                                <div><span className="font-semibold">Arrivée :</span> {selected.arrival}</div>
                                <div><span className="font-semibold">Arrêts :</span> {selected.stops || "-"}</div>
                                <div><span className="font-semibold">Date :</span> {selected.date ? new Date(selected.date).toLocaleString("fr-FR") : "-"}</div>
                                <div><span className="font-semibold">Passagers :</span> {selected.passengers || "-"}</div>
                                <div><span className="font-semibold">Bagages :</span> {selected.luggages || "-"}</div>
                                <div>
                                    <span className="font-semibold">Statut :</span>
                                    <select
                                        className="ml-2 border rounded px-2 py-1"
                                        value={selected.status}
                                        onChange={e => setSelected(s => s ? { ...s, status: e.target.value } : s)}
                                        disabled={updating}
                                    >
                                        <option value="nouveau">nouveau</option>
                                        <option value="traitée">traitée</option>
                                        <option value="annulée">annulée</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-2 flex-wrap">
                                <button
                                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
                                    onClick={async () => {
                                        setUpdating(true); setUpdateError(null);
                                        const { error } = await supabase
                                            .from("reservations")
                                            .update({ status: selected.status })
                                            .eq("id", selected.id);
                                        setUpdating(false);
                                        if (error) {
                                            setUpdateError("Erreur lors de la mise à jour.");
                                        } else {
                                            setReservations(rs => rs.map(r =>
                                                r.id === selected.id ? { ...r, status: selected.status } : r
                                            ));
                                            setSelected(null);
                                        }
                                    }}
                                    disabled={updating}
                                >
                                    {updating ? "Mise à jour..." : "Enregistrer"}
                                </button>
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    onClick={() => setSelected(null)}
                                >
                                    Annuler
                                </button>
                                {updateError && <div className="text-red-600 mt-2">{updateError}</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
