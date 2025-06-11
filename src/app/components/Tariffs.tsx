'use client';
import { motion } from 'framer-motion';

const tarifs = [
    {
        icon: "🛫",
        title: "Transfert Aéroport",
        price: "45 €",
        desc: "Paris ➔ Roissy-Charles de Gaulle"
    },
    {
        icon: "🚉",
        title: "Transfert Gare",
        price: "25 €",
        desc: "Paris ➔ Gare de Lyon"
    },
    {
        icon: "🌃",
        title: "Course Paris",
        price: "Dès 15 €",
        desc: "Trajet intra-muros, 24h/24"
    }
];

function TarifCard({ icon, title, price, desc }: { icon: string, title: string, price: string, desc: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center hover:scale-105 hover:shadow-xl transition"
        >
            <div className="text-4xl mb-2">{icon}</div>
            <div className="font-bold text-blue-700 text-lg">{title}</div>
            <div className="text-blue-500 text-2xl my-1">{price}</div>
            <div className="text-gray-500 text-sm text-center">{desc}</div>
        </motion.div>
    );
}

export default function Tariffs() {
    return (
        <motion.section
            className="w-full max-w-2xl mt-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Tarifs indicatifs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tarifs.map((t, i) => (
                    <TarifCard key={i} {...t} />
                ))}
            </div>
            <div className="text-xs text-gray-500 mt-4 text-center">
                * Tarifs indicatifs, variables selon trafic et horaires. Demandez un devis personnalisé sur WhatsApp.
            </div>
        </motion.section>
    );
}
