'use client';
import { motion } from 'framer-motion';

export default function ChauffeurBio() {
    return (
        <motion.section
            className="max-w-2xl mx-auto my-16 glass-strong rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 items-center border border-primary/10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className="relative flex-shrink-0">
                <img
                    src="/chauffeur.png"
                    alt="Votre chauffeur"
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary shadow-xl animate-glow"
                    style={{ background: '#0a0a0a' }}
                />
                {/* Glow animé */}
                <div className="absolute inset-0 rounded-full pointer-events-none animate-pulse-glow" style={{ boxShadow: '0 0 32px 8px #00d4ff55' }} />
            </div>
            <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-black text-gradient mb-2">Aghiles, votre chauffeur Taxi</h3>
                <p className="text-gray-200 text-lg leading-relaxed">
                    10 ans d’expérience à Paris.<br />
                    Je m’engage à vous offrir un service fiable, discret et ponctuel.<br />
                    <span className="text-primary font-semibold">Véhicule confortable</span>, propreté irréprochable, <span className="text-accent font-semibold">disponibilité 24h/24</span>.
                </p>
            </div>
        </motion.section>
    );
}
