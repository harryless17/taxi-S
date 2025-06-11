'use client';
import { motion } from 'framer-motion';

export default function ChauffeurBio() {
    return (
        <motion.section
            className="max-w-2xl mx-auto my-10 bg-blue-50 rounded-xl shadow-lg p-6 flex gap-4 items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <img
                src="/chauffeur.png"
                alt="Votre chauffeur"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-300 shadow"
                style={{ background: "#e0f2fe" }}
            />
            <div>
                <h3 className="text-lg font-bold text-blue-900">Aghiles, votre chauffeur Taxi</h3>
                <p className="text-gray-700 mt-1 text-sm">
                    10 ans d’expérience à Paris. Je m’engage à vous offrir un service fiable, discret et ponctuel.<br />
                    Véhicule confortable, propreté irréprochable, disponibilité 24h/24.
                </p>
            </div>
        </motion.section>
    );
}
