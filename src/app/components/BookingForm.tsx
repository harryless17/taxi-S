'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Génère la date/heure par défaut (now +1h, minutes à 00)
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

export default function BookingForm() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({
        nom: "",
        tel: "",
        depart: "",
        arrivee: "",
        date: getDefaultDateTime(),
        passagers: "",
        bagages: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (window.navigator.vibrate) window.navigator.vibrate(80);
        setSent(true);
        setTimeout(() => {
            const msg = encodeURIComponent(
                `Bonjour, je souhaite réserver un taxi.\nNom : ${form.nom}\nTéléphone : ${form.tel}\nDépart : ${form.depart}\nArrivée : ${form.arrivee}\nDate/Heure : ${form.date}\nPassagers : ${form.passagers}\nBagages : ${form.bagages}`
            );
            window.open(`https://wa.me/33615392250?text=${msg}`, '_blank');
            setSent(false);
        }, 800);
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
            <p className="text-xs text-gray-400 mt-2 text-center">
                Vos données ne sont jamais stockées : la réservation se fait uniquement via WhatsApp. <span className="inline-block ml-1">🔒</span>
            </p>


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
