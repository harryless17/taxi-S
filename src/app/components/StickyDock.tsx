'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";

export default function StickyDock() {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    // Ne pas afficher le dock sur les pages admin
    if (isAdminPage) {
        return null;
    }

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Tableau dynamique des boutons à afficher
    const buttons = [
        {
            key: 'whatsapp',
            element: (
                <motion.a
                    href="https://wa.me/33615392250"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative glass-strong w-14 h-14 rounded-full flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="currentColor" className="text-primary">
                            <circle cx="16" cy="16" r="16" fill="#25D366" />
                            <path d="M24.46 22.51c-.35-.17-2.08-1.02-2.4-1.14-.32-.12-.56-.17-.8.18s-.92 1.13-1.13 1.36c-.2.23-.42.25-.77.08-.35-.17-1.48-.55-2.83-1.75-1.05-.94-1.77-2.09-1.98-2.43-.2-.35-.02-.53.15-.7.16-.16.35-.42.53-.63.18-.22.23-.38.35-.63.12-.25.06-.47-.03-.65-.1-.18-.8-1.93-1.1-2.64-.29-.68-.59-.58-.8-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.42-.31.34-1.2 1.18-1.2 2.88 0 1.7 1.1 3.34 1.26 3.57.17.23 2.2 3.39 5.38 4.6.75.29 1.33.46 1.78.59.75.24 1.42.21 1.96.13.6-.09 1.85-.76 2.11-1.5.26-.74.26-1.38.18-1.51-.08-.13-.31-.21-.66-.38z" fill="white" />
                        </svg>
                        {/* Indicateur de disponibilité */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black">
                            <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
                        </div>
                    </div>
                    {/* Tooltip */}
                    <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 glass rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                    >
                        Réserver sur WhatsApp
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                    </motion.div>
                </motion.a>
            ),
        },
        {
            key: 'call',
            element: (
                <motion.a
                    href="tel:0615392250"
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative glass-strong w-14 h-14 rounded-full flex items-center justify-center border border-secondary/30 group-hover:border-secondary transition-colors duration-300">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-secondary">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                    </div>
                    <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 glass rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                    >
                        Appeler maintenant
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                    </motion.div>
                </motion.a>
            ),
        },
    ];

    if (isVisible) {
        buttons.push({
            key: 'top',
            element: (
                <motion.button
                    key="back-to-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative glass-strong w-14 h-14 rounded-full flex items-center justify-center border border-accent/30 group-hover:border-accent transition-colors duration-300">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-accent">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                        </svg>
                    </div>
                    <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 glass rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                    >
                        Retour en haut
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                    </motion.div>
                </motion.button>
            ),
        });
    }

    return (
        <>
            <div className="fixed z-50 bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                {buttons.map(btn => (
                    <span key={btn.key}>{btn.element}</span>
                ))}
            </div>
            {/* Indicateur de disponibilité compact - seulement sur desktop */}
            <motion.div
                className="hidden md:block fixed z-50 bottom-6 right-6"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
            >
                <motion.div
                    className="glass px-4 py-2 rounded-full text-sm text-green-400 font-medium flex items-center gap-2"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Disponible
                </motion.div>
            </motion.div>
        </>
    );
}
