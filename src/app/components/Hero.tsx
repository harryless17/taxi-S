'use client';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState, useEffect } from 'react';

export default function Hero() {
    // Slogans animés (option, tu peux enrichir le tableau)
    const slogans = [
        "Votre chauffeur Taxi à Paris, dispo 24/7",
        "Ponctualité et confort premium",
        "Réponse en moins de 2 minutes",
    ];
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setIndex(i => (i + 1) % slogans.length), 3800);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section
            className="relative w-full min-h-[380px] flex flex-col items-center justify-center overflow-hidden md:rounded-b-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ margin: 0, padding: 0 }}
        >
            {/* Fond photo flouté + overlay dégradé */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/paris-taxi-hero.png"
                    alt=""
                    className="w-full h-full object-cover blur-md opacity-80 scale-105"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-cyan-500/30 to-white/0" />
                {/* Motif décoratif SVG bas droite */}
                <svg className="absolute right-[-30px] bottom-[-30px] w-[120px] h-[120px] opacity-15" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" stroke="#0891b2" strokeWidth="4" fill="none" />
                </svg>
            </div>

            {/* BADGE TAXI INTERACTIF */}
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <img
                            src="/badge-taxi.svg"
                            alt="Taxi officiel Paris"
                            className="absolute top-6 right-6 w-14 h-14 drop-shadow-xl animate-bounce z-30 cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '50%' }}
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                            sideOffset={8}
                            className="bg-blue-800 text-white px-3 py-2 rounded-xl shadow-lg text-sm font-medium animate-fadeIn"
                            style={{ zIndex: 1000 }}
                        >
                            Chauffeur <b>Taxi officiel</b> – Paris & IDF 🚖
                            <Tooltip.Arrow className="fill-blue-800" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>

            {/* Bloc central glassmorphism */}
            <div className="relative z-10 px-7 py-9 rounded-3xl bg-white/30 backdrop-blur-lg shadow-2xl flex flex-col items-center gap-3 max-w-2xl w-full mx-auto
                "
                style={{ marginTop: 0, marginBottom: 0 }}
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-black text-blue-950 drop-shadow-lg tracking-tight text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <span className="text-cyan-500">Taxi</span> Paris Premium
                </motion.h1>

                {/* Slogan animé */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={slogans[index]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.7 }}
                        className="text-blue-900/90 text-lg md:text-2xl font-medium min-h-[2.5em] mt-2 text-center"
                    >
                        {slogans[index]}
                    </motion.p>
                </AnimatePresence>

                {/* Badge “Disponible” animé */}
                <div className="flex gap-2 items-center mt-1">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                    </span>
                    <span className="text-green-700 font-semibold text-xs md:text-sm">Disponible maintenant</span>
                </div>

                {/* Bouton WhatsApp circulaire “flottant” */}
                <motion.a
                    href="https://wa.me/33615392250"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-4 rounded-full text-lg md:text-xl shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Réserver via WhatsApp"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 32 32" fill="none" className="mr-1">
                        <circle cx="16" cy="16" r="16" fill="#fff" />
                        <path d="M24.46 22.51c-.35-.17-2.08-1.02-2.4-1.14-.32-.12-.56-.17-.8.18s-.92 1.13-1.13 1.36c-.2.23-.42.25-.77.08-.35-.17-1.48-.55-2.83-1.75-1.05-.94-1.77-2.09-1.98-2.43-.2-.35-.02-.53.15-.7.16-.16.35-.42.53-.63.18-.22.23-.38.35-.63.12-.25.06-.47-.03-.65-.1-.18-.8-1.93-1.1-2.64-.29-.68-.59-.58-.8-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.42-.31.34-1.2 1.18-1.2 2.88 0 1.7 1.1 3.34 1.26 3.57.17.23 2.2 3.39 5.38 4.6.75.29 1.33.46 1.78.59.75.24 1.42.21 1.96.13.6-.09 1.85-.76 2.11-1.5.26-.74.26-1.38.18-1.51-.08-.13-.31-.21-.66-.38z" fill="#25D366" />
                    </svg>
                    Réserver sur WhatsApp
                </motion.a>
            </div>
        </motion.section>
    );
}
