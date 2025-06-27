'use client';
import { motion } from 'framer-motion';

const services = [
    {
        icon: (
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#ff0080', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <path d="M8 36L14 22h24l6 14z" fill="url(#grad1)" />
                <path d="M16 20v-5a8 8 0 0 1 16 0v5" stroke="url(#grad1)" strokeWidth="2" />
                <path d="M26 27h7M14 27h7" stroke="url(#grad1)" strokeWidth="2" />
                <circle cx="16" cy="37" r="2.5" fill="#00ff88" />
                <circle cx="32" cy="37" r="2.5" fill="#00ff88" />
                <path d="M26 13l10 5" stroke="url(#grad1)" strokeWidth="2" />
            </svg>
        ),
        title: "Transferts Aéroport",
        description: "CDG, Orly, Beauvais - Service premium 24/7",
        features: ["Voiture haut de gamme", "Chauffeur professionnel", "Suivi en temps réel"]
    },
    {
        icon: (
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ff0080', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#00ff88', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <circle cx="24" cy="16" r="8" stroke="url(#grad2)" strokeWidth="2" />
                <rect x="12" cy="28" width="24" height="12" rx="6" fill="url(#grad2)" />
                <circle cx="20" cy="34" r="1.5" fill="#00d4ff" />
                <circle cx="28" cy="34" r="1.5" fill="#00d4ff" />
            </svg>
        ),
        title: "Chauffeurs Experts",
        description: "Professionnels certifiés et expérimentés",
        features: ["Licence taxi officielle", "Connaissance parfaite de Paris", "Service client premium"]
    },
    {
        icon: (
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                <defs>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#00ff88', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <rect x="11" cy="16" width="26" height="16" rx="4" fill="url(#grad3)" />
                <rect x="20" cy="10" width="8" height="6" rx="2" fill="#ff0080" />
                <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.8" />
                <circle cx="24" cy="24" r="1" fill="#000000" />
            </svg>
        ),
        title: "Toutes Distances",
        description: "Paris, IDF et destinations nationales",
        features: ["Course urbaine", "Trajet longue distance", "Service sur mesure"]
    },
];

export default function Services() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="w-full py-20 px-6 relative">
            {/* Fond avec effet de grille */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* En-tête de section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="text-gradient">NOS</span>
                        <br />
                        <span className="text-white">SERVICES</span>
                    </h2>
                    <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-8" />
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Découvrez notre gamme de services premium pour tous vos déplacements
                    </p>
                </motion.div>

                {/* Grille des services */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            variants={cardVariants}
                            className="group relative"
                        >
                            {/* Carte principale */}
                            <div className="glass-strong p-8 rounded-3xl h-full relative overflow-hidden">
                                {/* Effet de brillance au hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                {/* Icône */}
                                <motion.div
                                    className="mb-6 flex justify-center"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {service.icon}
                                </motion.div>

                                {/* Contenu */}
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Liste des fonctionnalités */}
                                    <ul className="space-y-3">
                                        {service.features.map((feature, i) => (
                                            <motion.li
                                                key={feature}
                                                className="flex items-center gap-3 text-sm text-gray-300"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full flex-shrink-0" />
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Indicateur de hover */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Ombre portée animée */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call-to-action */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <motion.a
                        href="https://wa.me/33615392250"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-modern text-lg px-10 py-4 inline-flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                            <circle cx="16" cy="16" r="16" fill="#25D366" />
                            <path d="M24.46 22.51c-.35-.17-2.08-1.02-2.4-1.14-.32-.12-.56-.17-.8.18s-.92 1.13-1.13 1.36c-.2.23-.42.25-.77.08-.35-.17-1.48-.55-2.83-1.75-1.05-.94-1.77-2.09-1.98-2.43-.2-.35-.02-.53.15-.7.16-.16.35-.42.53-.63.18-.22.23-.38.35-.63.12-.25.06-.47-.03-.65-.1-.18-.8-1.93-1.1-2.64-.29-.68-.59-.58-.8-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.42-.31.34-1.2 1.18-1.2 2.88 0 1.7 1.1 3.34 1.26 3.57.17.23 2.2 3.39 5.38 4.6.75.29 1.33.46 1.78.59.75.24 1.42.21 1.96.13.6-.09 1.85-.76 2.11-1.5.26-.74.26-1.38.18-1.51-.08-.13-.31-.21-.66-.38z" fill="white" />
                        </svg>
                        Réserver maintenant
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
