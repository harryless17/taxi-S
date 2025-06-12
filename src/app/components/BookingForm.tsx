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

const defaultForm: BookingFormData = {
    nom: "",
    tel: "",
    depart: "",
    arrivee: "",
    arrets: "",
    date: getDefaultDateTime(),
    passagers: "",
    bagages: "",
};

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
    const [form, setForm] = useState<BookingFormData>(defaultForm);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

        setForm(defaultForm);
        setLoading(false);
        setSent(true); // Affiche l’animation de redirection WhatsApp

        // Ouvre WhatsApp dans un nouvel onglet
        window.open(`https://wa.me/33615392250?text=${msg}`, '_blank');

        // Masque l’animation “Redirection…” après 2 secondes
        setTimeout(() => setSent(false), 2000);

        // (optionnel) Affiche le message de succès plus longtemps
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleQuickFill = () => {
        setForm(f => ({
            ...f,
            date: getDefaultDateTime(),
            depart: "Paris, France",
            passagers: ""
        }));
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
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <input name="nom" required className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nom" value={form.nom} onChange={handleChange} />
                <input name="tel" required type="tel" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Téléphone" value={form.tel} onChange={handleChange} />
                <input name="depart" required className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="Départ" value={form.depart} onChange={handleChange} />
                <input name="arrivee" required className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="Arrivée" value={form.arrivee} onChange={handleChange} />
                <input name="arrets" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="Arrêts (optionnel) – ex : 12 rue Victor Hugo" value={form.arrets} onChange={handleChange} />
                <input
                    name="date"
                    required
                    type="datetime-local"
                    className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
                    placeholder="Date et heure"
                    value={form.date}
                    min={getDefaultDateTime()}
                    onChange={handleChange}
                />
                <input
                    name="passagers"
                    type="number"
                    min="1"
                    max="7"
                    className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Passagers"
                    value={form.passagers}
                    onChange={handleChange}
                />
                <input
                    name="bagages"
                    className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Bagages (optionnel)"
                    value={form.bagages}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="md:col-span-2 mt-4 w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 shadow hover:scale-105 transition disabled:bg-blue-400"
                    disabled={loading}
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
                Vos données ne sont jamais stockées : la réservation se fait uniquement via WhatsApp. <span className="inline-block ml-1">🔒</span>
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
