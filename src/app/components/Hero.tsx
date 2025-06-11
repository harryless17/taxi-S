'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const slogans = [
    "Ponctualité garantie",
    "Disponible 24h/24",
    "Réponse en 1 minute",
    "Service premium, convivial et rapide"
];

export default function Hero() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setIndex((i) => (i + 1) % slogans.length), 3400);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section
            className="w-full relative flex flex-col items-center justify-center overflow-hidden"
            style={{
                minHeight: 340,
                maxHeight: 540,
                backgroundImage: "url('/paris-taxi-hero.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/50 to-transparent z-10" />
            <img
                src="/badge-check.svg"
                alt="Chauffeur VTC officiel"
                className="absolute top-6 right-6 w-14 h-14 drop-shadow-xl animate-bounce z-30"
                style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '50%' }}
            />
            <div className="relative z-20 flex flex-col items-center py-14 w-full">
                <div className="bg-white/70 px-6 py-4 rounded-2xl shadow-xl mb-5 backdrop-blur-sm">
                    <h1 className="text-2xl md:text-5xl font-extrabold text-blue-900 mb-2 text-center drop-shadow-2xl">
                        Taxi Aghiles
                    </h1>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={slogans[index]}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.7 }}
                            className="text-blue-700 text-base md:text-2xl font-semibold text-center"
                        >
                            {slogans[index]}
                        </motion.p>
                    </AnimatePresence>
                </div>
                <motion.a
                    href="https://wa.me/33615392250"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full text-lg md:text-xl shadow-lg transition hover:scale-105"
                    initial={{ scale: 0.85, opacity: 0.9 }}
                    animate={{ scale: [1, 0.98, 1], opacity: 1 }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                    aria-label="Réserver via WhatsApp"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="16" fill="#fff" />
                        <path d="M24.46 22.51c-.35-.17-2.08-1.02-2.4-1.14-.32-.12-.56-.17-.8.18s-.92 1.13-1.13 1.36c-.2.23-.42.25-.77.08-.35-.17-1.48-.55-2.83-1.75-1.05-.94-1.77-2.09-1.98-2.43-.2-.35-.02-.53.15-.7.16-.16.35-.42.53-.63.18-.22.23-.38.35-.63.12-.25.06-.47-.03-.65-.1-.18-.8-1.93-1.1-2.64-.29-.68-.59-.58-.8-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.42-.31.34-1.2 1.18-1.2 2.88 0 1.7 1.1 3.34 1.26 3.57.17.23 2.2 3.39 5.38 4.6.75.29 1.33.46 1.78.59.75.24 1.42.21 1.96.13.6-.09 1.85-.76 2.11-1.5.26-.74.26-1.38.18-1.51-.08-.13-.31-.21-.66-.38z" fill="#25D366" />
                    </svg>
                    Réserver via WhatsApp
                </motion.a>
                <span className="text-white text-sm md:text-base mt-6 font-medium drop-shadow opacity-90 text-center">
                    Service professionnel, ponctuel et convivial – Paris et Île-de-France
                </span>
            </div>
        </motion.section>
    );
}
