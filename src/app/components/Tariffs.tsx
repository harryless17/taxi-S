'use client';
import { motion } from 'framer-motion';

const tarifs = [
    {
        icon: "🛫",
        title: "Transfert Aéroport",
        price: "45 €",
        desc: "Paris → Roissy-Charles de Gaulle"
    },
    {
        icon: "🚉",
        title: "Transfert Gare",
        price: "25 €",
        desc: "Paris → Gare de Lyon"
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
            className="glass-strong rounded-3xl shadow-xl p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary"
        >
            <div className="text-5xl mb-3 animate-float drop-shadow-lg">
                {icon}
            </div>
            <div className="font-bold text-gradient text-xl mb-1 text-center">
                {title}
            </div>
            <div className="text-3xl font-black text-gradient mb-2">
                {price}
            </div>
            <div className="text-gray-300 text-base text-center mb-2">
                {desc}
            </div>
        </motion.div>
    );
}

export default function Tariffs() {
    return (
        <motion.section
            className="w-full max-w-3xl mt-16 mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <h2 className="text-4xl md:text-5xl font-black text-gradient mb-8 text-center">
                Tarifs indicatifs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tarifs.map((t, i) => (
                    <TarifCard key={i} {...t} />
                ))}
            </div>
            <div className="text-xs text-gray-400 mt-6 text-center">
                * Tarifs indicatifs, variables selon trafic et horaires.<br />
                <span className="text-gradient font-semibold">Demandez un devis personnalisé sur WhatsApp !</span>
            </div>
        </motion.section>
    );
}
