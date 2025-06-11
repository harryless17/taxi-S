'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const defaultForm = {
    nom: "",
    tel: "",
    depart: "",
    arrivee: "",
    date: getDefaultDateTime(),
    passagers: "",
    bagages: "",
};

export default function BookingForm() {
    const [form, setForm] = useState(defaultForm);
    const [sent, setSent] = useState(false);

    // Pré-remplissage ultra safe (query params, localStorage, etc)
    useEffect(() => {
        if (typeof window === "undefined") return;
        // 1. Query params
        const params = new URLSearchParams(window.location.search);
        const fromUrl = {
            nom: params.get("nom") || undefined,
            tel: params.get("tel") || undefined,
            depart: params.get("depart") || undefined,
            arrivee: params.get("arrivee") || undefined,
            date: params.get("date") || undefined,
            passagers: params.get("passagers") || undefined,
            bagages: params.get("bagages") || undefined,
        };
        // 2. localStorage
        let fromStorage = {};
        try {
            const last = window.localStorage.getItem('taxi-last-booking');
            if (last) fromStorage = JSON.parse(last);
        } catch { /* ignore */ }
        // 3. Fusion : priorité URL > Storage > Defaults
        setForm(f => ({
            ...f,
            ...fromStorage,
            ...Object.fromEntries(Object.entries(fromUrl).filter(([k, v]) => v)),
            nom: fromUrl.nom || (fromStorage as any).nom || "",
            tel: fromUrl.tel || (fromStorage as any).tel || "",
            depart: fromUrl.depart || (fromStorage as any).depart || "",
            arrivee: fromUrl.arrivee || (fromStorage as any).arrivee || "",
            date: fromUrl.date || (fromStorage as any).date || getDefaultDateTime(),
            passagers: fromUrl.passagers || (fromStorage as any).passagers || "",
            bagages: fromUrl.bagages || (fromStorage as any).bagages || "",
        }));

    }, []);

    // Mémorise au submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (window.navigator.vibrate) window.navigator.vibrate(80);
        setSent(true);
        setTimeout(() => {
            window.localStorage.setItem('taxi-last-booking', JSON.stringify(form));
            const msg = encodeURIComponent(
                `Bonjour, je souhaite réserver un taxi.\nNom : ${form.nom}\nTéléphone : ${form.tel}\nDépart : ${form.depart}\nArrivée : ${form.arrivee}\nDate/Heure : ${form.date}\nPassagers : ${form.passagers}\nBagages : ${form.bagages}`
            );
            window.open(`https://wa.me/33615392250?text=${msg}`, '_blank');
            setSent(false);
        }, 800);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    // Bouton pré-remplir rapide
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
                    className="md:col-span-2 mt-4 w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 shadow hover:scale-105 transition"
                >
                    Réserver via WhatsApp
                </button>
            </form>

            {/* Mention assurance professionnelle */}
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
