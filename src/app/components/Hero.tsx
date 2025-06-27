'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Hero() {
    const slogans = [
        "Votre chauffeur Taxi à Paris, 24/7",
        "Ponctualité et confort premium",
        "Réponse en moins de 2 minutes",
    ];
    const [index, setIndex] = useState(0);
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        delay: number;
        duration: number;
    }>>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Génération de particules uniquement côté client
        const particlesData = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 3 + Math.random() * 4
        }));
        setParticles(particlesData);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setIndex(i => (i + 1) % slogans.length), 3800);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section
            className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* Fond animé avec gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20" />

                {/* Grille de fond */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                                        radial-gradient(circle at 75% 75%, rgba(255, 0, 128, 0.1) 0%, transparent 50%)`,
                    }} />
                </div>
            </div>

            {/* Particules animées - uniquement côté client */}
            {isClient && (
                <div className="particles">
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="particle"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: particle.duration,
                                delay: particle.delay,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Badge Taxi flottant */}
            <motion.div
                className="absolute top-8 right-8 z-30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <div className="glass-strong p-3 rounded-full animate-pulse-glow">
                    <img
                        src="/badge-taxi.svg"
                        alt="Taxi officiel Paris"
                        className="w-12 h-12"
                    />
                </div>
            </motion.div>

            {/* Contenu principal */}
            <div className="relative z-10 px-6 py-12 max-w-6xl w-full mx-auto text-center">
                {/* Titre principal avec effet glitch */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1 }}
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
                        <span className="text-gradient">TAXI</span>
                        <br />
                        <span className="text-white">PARIS</span>
                        <br />
                        <span className="text-gradient">PREMIUM</span>
                    </h1>

                    {/* Ligne décorative */}
                    <div className="w-32 h-1 gradient-primary mx-auto rounded-full animate-pulse-glow" />
                </motion.div>

                {/* Slogan animé */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={slogans[index]}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl md:text-3xl font-light text-gray-300 min-h-[3rem] flex items-center justify-center"
                        >
                            {slogans[index]}
                        </motion.p>
                    </AnimatePresence>
                </motion.div>

                {/* Badge de disponibilité */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                        </div>
                        <span className="text-green-400 font-semibold text-sm">Disponible maintenant</span>
                    </div>
                </motion.div>

                {/* Boutons d'action */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    {/* Bouton WhatsApp principal */}
                    <motion.a
                        href="https://wa.me/33615392250"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-modern text-lg px-8 py-4 animate-glow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="currentColor">
                            <circle cx="16" cy="16" r="16" fill="#25D366" />
                            <path d="M24.46 22.51c-.35-.17-2.08-1.02-2.4-1.14-.32-.12-.56-.17-.8.18s-.92 1.13-1.13 1.36c-.2.23-.42.25-.77.08-.35-.17-1.48-.55-2.83-1.75-1.05-.94-1.77-2.09-1.98-2.43-.2-.35-.02-.53.15-.7.16-.16.35-.42.53-.63.18-.22.23-.38.35-.63.12-.25.06-.47-.03-.65-.1-.18-.8-1.93-1.1-2.64-.29-.68-.59-.58-.8-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.42-.31.34-1.2 1.18-1.2 2.88 0 1.7 1.1 3.34 1.26 3.57.17.23 2.2 3.39 5.38 4.6.75.29 1.33.46 1.78.59.75.24 1.42.21 1.96.13.6-.09 1.85-.76 2.11-1.5.26-.74.26-1.38.18-1.51-.08-.13-.31-.21-.66-.38z" fill="white" />
                        </svg>
                        Réserver sur WhatsApp
                    </motion.a>

                    {/* Bouton Appel secondaire */}
                    <motion.a
                        href="tel:0615392250"
                        className="glass px-8 py-4 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-primary transition-all duration-300 flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Appeler maintenant
                    </motion.a>
                </motion.div>

                {/* Stats rapides */}
                <motion.div
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                >
                    {[
                        { number: "24/7", label: "Disponibilité" },
                        { number: "<2min", label: "Réponse" },
                        { number: "5★", label: "Satisfaction" }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="glass p-6 rounded-2xl text-center"
                            whileHover={{ y: -5 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
            >
                <motion.div
                    className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
