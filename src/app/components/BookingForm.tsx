import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";


function getDefaultDateTime() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

type BookingFormData = {
    nom: string;
    tel: string;
    depart: string;
    arrivee: string;
    arrets?: string;
    date: string;
    passagers: string;
    bagages: string;
};

type ValidationErrors = {
    nom?: string;
    tel?: string;
    depart?: string;
    arrivee?: string;
    date?: string;
    passagers?: string;
};

type AddressSuggestion = {
    display_name: string;
    lat: string;
    lon: string;
    type: string;
};

function getDefaultForm(): BookingFormData {
    return {
        nom: "",
        tel: "",
        depart: "",
        arrivee: "",
        arrets: "",
        date: getDefaultDateTime(),
        passagers: "",
        bagages: "",
    };
}

// Fonction réutilisable pour insérer dans Supabase
async function saveReservation(form: BookingFormData) {
    const { nom, tel, depart, arrivee, arrets, date, passagers, bagages } = form;
    const { error } = await supabase.from('reservations').insert([
        {
            name: nom,
            phone: tel,
            departure: depart,
            arrival: arrivee,
            stops: arrets || null,
            date: date,
            passengers: passagers ? Number(passagers) : null,
            luggages: bagages ? Number(bagages) : null,
            status: "nouveau",
        }
    ]);
    return error;
}

export default function BookingForm() {
    const [form, setForm] = useState<BookingFormData>(() => getDefaultForm());
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showSuggestions, setShowSuggestions] = useState<'depart' | 'arrivee' | null>(null);
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Query params
        const params = new URLSearchParams(window.location.search);
        const fromUrl: Partial<BookingFormData> = {
            nom: params.get("nom") || undefined,
            tel: params.get("tel") || undefined,
            depart: params.get("depart") || undefined,
            arrivee: params.get("arrivee") || undefined,
            date: params.get("date") || undefined,
            passagers: params.get("passagers") || undefined,
            arrets: params.get("arrets") || undefined,
            bagages: params.get("bagages") || undefined,
        };

        // localStorage
        let fromStorage: Partial<BookingFormData> = {};
        try {
            const last = window.localStorage.getItem('taxi-last-booking');
            if (last) fromStorage = JSON.parse(last);
        } catch { }

        setForm({
            nom: fromUrl.nom ?? fromStorage.nom ?? "",
            tel: fromUrl.tel ?? fromStorage.tel ?? "",
            depart: fromUrl.depart ?? fromStorage.depart ?? "",
            arrivee: fromUrl.arrivee ?? fromStorage.arrivee ?? "",
            date: fromUrl.date ?? fromStorage.date ?? getDefaultDateTime(),
            passagers: fromUrl.passagers ?? fromStorage.passagers ?? "",
            arrets: fromUrl.arrets ?? fromStorage.arrets ?? "",
            bagages: fromUrl.bagages ?? fromStorage.bagages ?? "",
        });
    }, []);

    // Validation en temps réel
    useEffect(() => {
        const validationErrors = validateForm(form);
        setErrors(validationErrors);
    }, [form]);

    // Fonction pour récupérer les suggestions avec debounce
    const fetchSuggestions = async (query: string, field: 'depart' | 'arrivee') => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoadingSuggestions(true);

        try {
            // Récupération des suggestions via API
            const apiSuggestions = await fetchAddressSuggestions(query);

            // Combinaison avec les adresses populaires
            const popularMatches = filterPopularAddresses(query);
            const combinedSuggestions = [
                ...popularMatches.map(addr => ({
                    display_name: addr,
                    lat: '',
                    lon: '',
                    type: 'popular'
                })),
                ...apiSuggestions
            ];

            setSuggestions(combinedSuggestions.slice(0, 8));
        } catch (error) {
            console.warn('Erreur lors de la récupération des suggestions:', error);
            // Fallback vers les adresses populaires
            const popularMatches = filterPopularAddresses(query);
            setSuggestions(popularMatches.map(addr => ({
                display_name: addr,
                lat: '',
                lon: '',
                type: 'popular'
            })));
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (window.navigator.vibrate) window.navigator.vibrate(80);
        setLoading(true);
        setSent(false);
        setSuccess(false);

        // 1. Enregistrement Supabase
        const error = await saveReservation(form);

        if (error) {
            setLoading(false);
            alert("Erreur lors de l'enregistrement en base ! Merci de réessayer ou contactez-nous par WhatsApp.");
            return;
        }

        // 2. Stockage local
        window.localStorage.setItem('taxi-last-booking', JSON.stringify(form));

        // 3. Redirection WhatsApp
        const msg = encodeURIComponent(
            `Bonjour, je souhaite réserver un taxi.\nNom : ${form.nom}\nTéléphone : ${form.tel}\nDépart : ${form.depart}\nArrivée : ${form.arrivee}\nArrêts : ${form.arrets}\nDate/Heure : ${form.date}\nPassagers : ${form.passagers}\nBagages : ${form.bagages}`
        );

        setForm(getDefaultForm());
        setLoading(false);
        setSent(true); // Affiche l'animation de redirection WhatsApp

        // Ouvre WhatsApp dans un nouvel onglet
        window.open(`https://wa.me/33615392250?text=${msg}`, '_blank');

        // Masque l'animation "Redirection…" après 2 secondes
        setTimeout(() => setSent(false), 2000);

        // (optionnel) Affiche le message de succès plus longtemps
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));

        // Efface l'erreur quand l'utilisateur commence à taper
        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        // Gestion des suggestions pour les champs d'adresse
        if ((name === 'depart' || name === 'arrivee') && showSuggestions === name) {
            // Debounce pour éviter trop d'appels API
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            const timer = setTimeout(() => {
                fetchSuggestions(value, name as 'depart' | 'arrivee');
            }, 300);

            setDebounceTimer(timer);
        }
    };

    const handleQuickFill = () => {
        setForm(f => ({
            ...f,
            date: getDefaultDateTime(),
            depart: "Paris, France",
            passagers: ""
        }));
    };

    const handleAddressSuggestion = (suggestion: AddressSuggestion, field: 'depart' | 'arrivee') => {
        setForm(f => ({ ...f, [field]: suggestion.display_name }));
        setShowSuggestions(null);
        setSuggestions([]);
    };

    const handleFocus = (field: 'depart' | 'arrivee') => {
        setShowSuggestions(field);
        if (form[field].length >= 2) {
            fetchSuggestions(form[field], field);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(null);
            setSuggestions([]);
        }, 200);
    };

    return (
        <motion.section
            className="w-full max-w-2xl mt-10 bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Demande de réservation</h2>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Nom */}
                <div className="flex flex-col gap-2 md:col-span-1">
                    <div className="relative">
                        <input
                            name="nom"
                            required
                            className={`w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.nom ? 'border-red-400 focus:ring-red-400' : 'border-blue-200 focus:ring-blue-400'}`}
                            placeholder="Nom"
                            value={form.nom}
                            onChange={handleChange}
                        />
                        {errors.nom && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            </span>
                        )}
                    </div>
                    {errors.nom && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded px-3 py-2 mt-1"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            <span>{errors.nom}</span>
                        </motion.div>
                    )}
                </div>

                {/* Téléphone */}
                <div className="flex flex-col gap-2 md:col-span-1">
                    <div className="relative">
                        <input
                            name="tel"
                            required
                            type="tel"
                            className={`w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.tel ? 'border-red-400 focus:ring-red-400' : 'border-blue-200 focus:ring-blue-400'}`}
                            placeholder="Téléphone"
                            value={form.tel}
                            onChange={handleChange}
                        />
                        {errors.tel && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            </span>
                        )}
                    </div>
                    {errors.tel && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded px-3 py-2 mt-1"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            <span>{errors.tel}</span>
                        </motion.div>
                    )}
                </div>

                {/* Départ */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="relative">
                        <input
                            name="depart"
                            required
                            className={`w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.depart ? 'border-red-400 focus:ring-red-400' : 'border-blue-200 focus:ring-blue-400'}`}
                            placeholder="Départ"
                            value={form.depart}
                            onChange={handleChange}
                            onFocus={() => handleFocus('depart')}
                            onBlur={handleBlur}
                        />
                        {errors.depart && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            </span>
                        )}
                        {showSuggestions === 'depart' && (suggestions.length > 0 || loadingSuggestions) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full left-0 right-0 bg-white border-2 border-blue-200 rounded-xl shadow-xl z-20 mt-2 max-h-48 overflow-y-auto"
                            >
                                {loadingSuggestions ? (
                                    <div className="flex items-center justify-center py-4 text-gray-500">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Recherche en cours...
                                    </div>
                                ) : (
                                    suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 font-medium border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                            onClick={() => handleAddressSuggestion(suggestion, 'depart')}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div className="flex-1">
                                                    <span className="text-sm">{suggestion.display_name}</span>
                                                    {suggestion.type === 'popular' && (
                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Populaire</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </div>
                    {errors.depart && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded px-3 py-2 mt-1"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            <span>{errors.depart}</span>
                        </motion.div>
                    )}
                </div>

                {/* Arrivée */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="relative">
                        <input
                            name="arrivee"
                            required
                            className={`w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.arrivee ? 'border-red-400 focus:ring-red-400' : 'border-blue-200 focus:ring-blue-400'}`}
                            placeholder="Arrivée"
                            value={form.arrivee}
                            onChange={handleChange}
                            onFocus={() => handleFocus('arrivee')}
                            onBlur={handleBlur}
                        />
                        {errors.arrivee && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            </span>
                        )}
                        {showSuggestions === 'arrivee' && (suggestions.length > 0 || loadingSuggestions) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full left-0 right-0 bg-white border-2 border-blue-200 rounded-xl shadow-xl z-20 mt-2 max-h-48 overflow-y-auto"
                            >
                                {loadingSuggestions ? (
                                    <div className="flex items-center justify-center py-4 text-gray-500">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Recherche en cours...
                                    </div>
                                ) : (
                                    suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 font-medium border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                            onClick={() => handleAddressSuggestion(suggestion, 'arrivee')}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div className="flex-1">
                                                    <span className="text-sm">{suggestion.display_name}</span>
                                                    {suggestion.type === 'popular' && (
                                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Populaire</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </div>
                    {errors.arrivee && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded px-3 py-2 mt-1"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            <span>{errors.arrivee}</span>
                        </motion.div>
                    )}
                </div>

                <input name="arrets" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="Arrêts (optionnel) – ex : 12 rue Victor Hugo" value={form.arrets} onChange={handleChange} />

                {/* Date et heure */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="relative">
                        <input
                            name="date"
                            required
                            type="datetime-local"
                            className={`w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.date ? 'border-red-400 focus:ring-red-400' : 'border-blue-200 focus:ring-blue-400'}`}
                            placeholder="Date et heure"
                            value={form.date}
                            min={getDefaultDateTime()}
                            onChange={handleChange}
                        />
                        {errors.date && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            </span>
                        )}
                    </div>
                    {errors.date && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded px-3 py-2 mt-1"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            <span>{errors.date}</span>
                        </motion.div>
                    )}
                </div>

                {/* Passagers */}
                <div className="flex flex-col gap-2 md:col-span-1">
                    <div className="relative">
                        <input
                            name="passagers"
                            type="number"
                            min="1"
                            max="7"
                            className={`w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.passagers ? 'border-red-400 focus:ring-red-400' : 'border-blue-200 focus:ring-blue-400'}`}
                            placeholder="Passagers"
                            value={form.passagers}
                            onChange={handleChange}
                        />
                        {errors.passagers && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            </span>
                        )}
                    </div>
                    {errors.passagers && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded px-3 py-2 mt-1"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 19a2 2 0 01-1.73 1H4.73A2 2 0 013 19l7.29-12.29a2 2 0 013.42 0L21 19z" /></svg>
                            <span>{errors.passagers}</span>
                        </motion.div>
                    )}
                </div>

                <input
                    name="bagages"
                    className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Bagages (optionnel)"
                    value={form.bagages}
                    onChange={handleChange}
                />

                {/* Indicateur de progression */}
                <div className="md:col-span-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <motion.div
                                className="bg-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.min(100, Object.keys(form).filter(key => form[key as keyof BookingFormData]).length * 12.5)}%`
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className="text-xs">
                            {Object.keys(form).filter(key => form[key as keyof BookingFormData]).length}/8
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`md:col-span-2 mt-6 w-full font-bold py-3 rounded-xl shadow transition-all duration-200 ${Object.keys(errors).length > 0 || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-700 hover:bg-blue-800 hover:scale-105 text-white'
                        }`}
                    disabled={loading || Object.keys(errors).length > 0}
                >
                    {loading ? "Envoi en cours…" : "Réserver via WhatsApp"}
                </button>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="md:col-span-2 mt-4 w-full flex flex-col items-center gap-2 bg-green-50 border border-green-200 text-green-700 py-3 rounded-xl shadow"
                    >
                        <span className="text-2xl">✅</span>
                        <span>Votre demande a bien été prise en compte.<br />Vous serez contacté rapidement.</span>
                    </motion.div>
                )}
            </form>

            {/* Assurance */}
            <div className="flex items-center gap-2 mt-4 text-green-700 text-sm font-semibold justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24">
                    <path d="M12 22C7.03 22 3 17.97 3 13C3 9.13 5.94 5.68 10.44 3.27C11.13 2.89 12.08 2.89 12.77 3.27C17.27 5.68 20.21 9.13 20.21 13C20.21 17.97 16.18 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 13.5L11 15.5L15 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Assurance professionnelle – RC Pro incluse
            </div>

            {/* Quick-fill */}
            <button
                type="button"
                className="mt-3 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mx-auto block hover:bg-blue-200 transition"
                onClick={handleQuickFill}
            >
                Pré-remplir pour un départ immédiat à Paris
            </button>

            {/* RGPD & carte de visite */}
            <p className="text-xs text-gray-400 mt-2 text-center">
                Vos données ne sont jamais stockées : la réservation se fait uniquement via WhatsApp. <span className="inline-block ml-1">🔒</span>
            </p>
            <a
                href="https://wa.me/33615392250?text=Merci%20de%20m'envoyer%20votre%20carte%20de%20visite%20taxi."
                className="block text-blue-600 underline mt-4 text-center font-semibold hover:text-blue-800 transition"
                target="_blank"
                rel="noopener noreferrer"
            >
                Recevoir la carte de visite taxi
            </a>

            {/* Animation feedback */}
            <AnimatePresence>
                {sent && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/10"
                    >
                        <motion.div
                            className="bg-white rounded-xl p-8 flex flex-col items-center shadow-2xl"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                        >
                            <span className="text-5xl mb-4">✅</span>
                            <p className="text-xl font-bold text-green-600">Redirection vers WhatsApp…</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
