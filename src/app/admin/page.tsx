"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    status: "nouveau" | "traitée" | "annulée" | string;
    created_at: string;
};

function StatusBadge({ status }: { status: string }) {
    const style = {
        "nouveau": "bg-blue-100 text-blue-800 border-blue-200",
        "traitée": "bg-green-100 text-green-800 border-green-200",
        "annulée": "bg-red-100 text-red-800 border-red-200",
    }[status] || "bg-gray-100 text-gray-800 border-gray-200";
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
            {label}
        </span>
    );
}

function StatCard({ title, value, icon, color, trend, extra }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: { value: number; positive: boolean };
    extra?: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[148px]"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend ? (
                        <div className="flex items-center mt-3">
                            <span className={`text-sm font-semibold ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.positive ? '↗' : '↘'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-2">vs hier</span>
                        </div>
                    ) : (
                        <div className="mt-3 h-5 invisible select-none">-</div>
                    )}
                    {extra}
                </div>
                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page précédente"
                >
                    Précédent
                </button>
                {pages.map(page => (
                    <button
                        type="button"
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        aria-current={page === currentPage ? "page" : undefined}
                        aria-label={`Page ${page}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Page suivante"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modale de détail
    const [selected, setSelected] = useState<Reservation | null>(null);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Gestion fermeture modale avec Escape
    type EscapeHandler = (e: KeyboardEvent) => void;
    useEffect(() => {
        if (!selected) return;
        const handleEsc: EscapeHandler = (e) => {
            if (e.key === 'Escape') setSelected(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [selected]);

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

    // Filtrage des réservations
    const filteredReservations = reservations.filter(resa => {
        const matchesSearch =
            resa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resa.phone.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, '')) ||
            resa.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resa.arrival.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || resa.status === statusFilter;

        let matchesDate = true;
        if (dateFilter === "today") {
            const today = new Date().toDateString();
            matchesDate = new Date(resa.created_at).toDateString() === today;
        } else if (dateFilter === "today-trip") {
            const today = new Date().toDateString();
            matchesDate = new Date(resa.date).toDateString() === today;
        } else if (dateFilter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = new Date(resa.date) >= weekAgo;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredReservations.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

    // Statistiques
    const nouvelles = reservations.filter(r => r.status === "nouveau");
    const traitees = reservations.filter(r => r.status === "traitée");
    const annulees = reservations.filter(r => r.status === "annulée");

    const totalReservations = reservations.length;
    const todayCreatedReservations = reservations.filter(r =>
        new Date(r.created_at).toDateString() === new Date().toDateString()
    ).length;
    const todayTrips = reservations.filter(r =>
        new Date(r.date).toDateString() === new Date().toDateString()
    ).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                    <p className="mt-6 text-gray-600 font-medium">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    const handleWhatsApp = (phone: string, name: string) => {
        const message = encodeURIComponent(`Bonjour ${name}, concernant votre réservation taxi...`);
        window.open(`https://wa.me/${phone.replace(/\s/g, '')}?text=${message}`, '_blank');
    };

    const handleCall = (phone: string) => {
        window.open(`tel:${phone.replace(/\s/g, '')}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Dashboard Admin</h1>
                                <p className="text-sm sm:text-base text-blue-100 font-medium truncate">Gestion des réservations taxi</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <span className="text-sm sm:text-base text-blue-100 font-medium truncate w-full sm:w-auto text-center sm:text-left">
                                {session?.user?.email}
                            </span>
                            <button
                                type="button"
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    router.replace("/admin/login");
                                }}
                                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistiques */}
                <div className="mb-8">
                    {/* Card Trajets aujourd'hui en avant */}
                    <div className="mb-8 flex justify-center">
                        <div
                            className={`cursor-pointer transition-all duration-200 select-none w-full max-w-xl
                                ${dateFilter === 'today-trip' ? 'bg-gradient-to-r from-red-600 to-orange-500 shadow-2xl scale-105' : 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-red-600 hover:to-orange-500 hover:shadow-2xl shadow-md'}
                                rounded-3xl p-8 flex flex-col items-center text-center`}
                            onClick={() => { setDateFilter('today-trip'); setStatusFilter('all'); }}
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <svg className="w-10 h-10 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-4xl font-extrabold text-white">{todayTrips}</span>
                            </div>
                            <div className="text-lg font-bold text-white mb-1">Trajets aujourd'hui</div>
                            <div className="text-base text-white drop-shadow font-semibold italic mt-1">Courses prévues pour aujourd'hui&nbsp;(<span className="not-italic font-bold">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>)</div>
                        </div>
                    </div>
                    {/* Autres cards en dessous */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div
                            className={`cursor-pointer transition-all duration-200 h-full select-none
                                ${statusFilter === 'all' && dateFilter === 'all' ? 'bg-blue-50 shadow-2xl ring-0' : 'bg-white hover:bg-blue-50/60 hover:shadow-xl shadow-md'}
                                rounded-2xl`}
                            onClick={() => { setStatusFilter('all'); setDateFilter('all'); }}
                        >
                            <StatCard
                                title="Total réservations"
                                value={totalReservations}
                                icon={<svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>}
                                color="bg-gradient-to-br from-blue-500 to-blue-600"
                                trend={{ value: 12, positive: true }}
                            />
                        </div>
                        <div
                            className={`cursor-pointer transition-all duration-200 h-full select-none
                                ${statusFilter === 'nouveau' ? 'bg-orange-50 shadow-2xl ring-0' : 'bg-white hover:bg-orange-50/60 hover:shadow-xl shadow-md'}
                                rounded-2xl`}
                            onClick={() => { setStatusFilter('nouveau'); setDateFilter('all'); }}
                        >
                            <StatCard
                                title="Nouvelles"
                                value={nouvelles.length}
                                icon={<svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>}
                                color="bg-gradient-to-br from-orange-500 to-orange-600"
                            />
                        </div>
                        <div
                            className={`cursor-pointer transition-all duration-200 h-full select-none
                                ${statusFilter === 'traitée' ? 'bg-green-50 shadow-2xl ring-0' : 'bg-white hover:bg-green-50/60 hover:shadow-xl shadow-md'}
                                rounded-2xl`}
                            onClick={() => { setStatusFilter('traitée'); setDateFilter('all'); }}
                        >
                            <StatCard
                                title="Traitées"
                                value={traitees.length}
                                icon={<svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>}
                                color="bg-gradient-to-br from-green-500 to-green-600"
                            />
                        </div>
                        <div
                            className={`cursor-pointer transition-all duration-200 h-full select-none
                                ${dateFilter === 'today' ? 'bg-blue-50 shadow-2xl ring-0' : 'bg-white hover:bg-blue-50/60 hover:shadow-xl shadow-md'}
                                rounded-2xl`}
                            onClick={() => { setDateFilter('today'); setStatusFilter('all'); }}
                        >
                            <StatCard
                                title="Réservations aujourd'hui"
                                value={todayCreatedReservations}
                                icon={<svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>}
                                color="bg-gradient-to-br from-blue-500 to-blue-600"
                                extra={<div className="text-xs text-blue-700 mt-1">Créées aujourd'hui</div>}
                            />
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Rechercher</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nom, téléphone, adresse..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-medium"
                                />
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="lg:w-56">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Statut</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white font-medium"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="nouveau">Nouvelles</option>
                                <option value="traitée">Traitées</option>
                                <option value="annulée">Annulées</option>
                            </select>
                        </div>
                        <div className="lg:w-56">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Période</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white font-medium"
                            >
                                <option value="all">Toutes les dates</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="today-trip">Trajets aujourd'hui</option>
                                <option value="week">7 derniers jours</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des réservations */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">
                            Réservations ({filteredReservations.length})
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Affichage de {filteredReservations.length === 0 ? 0 : startIndex + 1} à {Math.min(endIndex, filteredReservations.length)} sur {filteredReservations.length} résultats
                        </p>
                    </div>

                    {loadingList ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                            <p className="mt-4 text-gray-600 font-medium">Chargement des réservations...</p>
                        </div>
                    ) : filteredReservations.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 font-medium">Aucune réservation trouvée</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trajet</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedReservations.map((resa, index) => (
                                            <motion.tr
                                                key={resa.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                                                onClick={() => setSelected(resa)}
                                            >
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{resa.name}</div>
                                                        <div className="text-sm text-gray-600 font-medium">{resa.phone}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="font-bold text-blue-600">Départ</div>
                                                        <div className="text-gray-700 truncate max-w-xs">{resa.departure}</div>
                                                    </div>
                                                    <div className="text-sm text-gray-900 mt-2">
                                                        <div className="font-bold text-green-600">Arrivée</div>
                                                        <div className="text-gray-700 truncate max-w-xs">{resa.arrival}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {resa.date ? new Date(resa.date).toLocaleDateString("fr-FR") : "-"}
                                                    </div>
                                                    <div className="text-sm text-gray-600 font-medium">
                                                        {resa.date ? new Date(resa.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }) : "-"}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <StatusBadge status={resa.status} />
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleWhatsApp(resa.phone, resa.name);
                                                            }}
                                                            className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-all duration-200"
                                                            title="Contacter par WhatsApp"
                                                        >
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCall(resa.phone);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                                                            title="Appeler"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modale détail/édition */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header avec gradient */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Détail réservation</h3>
                                            <p className="text-blue-100 font-medium">ID: {selected.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelected(null)}
                                        className="text-white/80 hover:text-white p-3 rounded-2xl hover:bg-white/20 transition-all duration-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {/* Actions rapides */}
                                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Actions rapides
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleWhatsApp(selected.phone, selected.name)}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                            </svg>
                                            WhatsApp
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleCall(selected.phone)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Appeler
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(selected.phone)}
                                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Copier tél
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Informations client */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Informations client
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Nom</label>
                                                    <p className="text-base font-bold text-gray-900">{selected.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Téléphone</label>
                                                    <p className="text-base font-bold text-gray-900">{selected.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Passagers</label>
                                                    <p className="text-base font-bold text-gray-900">{selected.passengers || "Non spécifié"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Bagages</label>
                                                    <p className="text-base font-bold text-gray-900">{selected.luggages || "Non spécifié"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Détails trajet */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                                            </svg>
                                            Détails trajet
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide">Départ</label>
                                                    <p className="text-base font-bold text-gray-900">{selected.departure}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide">Arrivée</label>
                                                    <p className="text-base font-bold text-gray-900">{selected.arrival}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Arrêts</label>
                                                    <p className="text-base font-bold text-gray-900">{selected.stops || "Aucun arrêt"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                                                <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <div>
                                                    <label className="block text-xs font-semibold text-purple-600 uppercase tracking-wide">Date & heure</label>
                                                    <p className="text-base font-bold text-gray-900">
                                                        {selected.date ? new Date(selected.date).toLocaleString("fr-FR", {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : "Non spécifié"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gestion du statut */}
                                <div className={`mt-8 p-6 bg-white rounded-2xl border-2 shadow-xl transition-colors duration-300 ${selected.status === 'nouveau' ? 'border-blue-400' : selected.status === 'traitée' ? 'border-green-400' : selected.status === 'annulée' ? 'border-red-400' : 'border-gray-200'}`}>
                                    <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <svg className={`w-5 h-5 ${selected.status === 'nouveau' ? 'text-blue-500' : selected.status === 'traitée' ? 'text-green-500' : selected.status === 'annulée' ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Gestion du statut
                                    </h4>
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Statut actuel</label>
                                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-bold shadow-md transition-colors duration-300 ${selected.status === 'nouveau' ? 'bg-blue-100 text-blue-800' : selected.status === 'traitée' ? 'bg-green-100 text-green-800' : selected.status === 'annulée' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}</span>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Changer le statut</label>
                                                <div className="relative">
                                                    <select
                                                        className={`border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent font-medium shadow-sm w-48 transition-colors duration-300 
                                                            ${selected.status === 'nouveau' ? 'border-blue-400 text-blue-700 focus:ring-blue-200' : ''}
                                                            ${selected.status === 'traitée' ? 'border-green-400 text-green-700 focus:ring-green-200' : ''}
                                                            ${selected.status === 'annulée' ? 'border-red-400 text-red-700 focus:ring-red-200' : ''}
                                                            ${selected.status !== 'nouveau' && selected.status !== 'traitée' && selected.status !== 'annulée' ? 'border-gray-300 text-gray-900 focus:ring-gray-200' : ''}`}
                                                        value={selected.status}
                                                        onChange={e => setSelected(s => s ? { ...s, status: e.target.value } : s)}
                                                        disabled={updating}
                                                    >
                                                        <option value="nouveau">Nouveau</option>
                                                        <option value="traitée">Traité</option>
                                                        <option value="annulée">Annulé</option>
                                                    </select>
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6 lg:mt-0">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setUpdating(true);
                                                    setUpdateError(null);
                                                    const { error } = await supabase
                                                        .from("reservations")
                                                        .update({ status: selected.status })
                                                        .eq("id", selected.id);
                                                    setUpdating(false);
                                                    if (error) {
                                                        setUpdateError("Erreur lors de la mise à jour du statut.");
                                                    } else {
                                                        setReservations(rs => rs.map(r =>
                                                            r.id === selected.id ? { ...r, status: selected.status } : r
                                                        ));
                                                        setShowSuccess(true);
                                                        setTimeout(() => setShowSuccess(false), 2000);
                                                    }
                                                }}
                                                disabled={updating}
                                                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2 text-white ${selected.status === 'nouveau' ? 'bg-blue-600 hover:bg-blue-700' : selected.status === 'traitée' ? 'bg-green-600 hover:bg-green-700' : selected.status === 'annulée' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 hover:bg-gray-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {updating ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Mise à jour...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Enregistrer
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelected(null)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                            >
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}