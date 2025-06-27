'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const testimonials = [
    {
        name: "Thomas D.",
        photo: "/client-1.jpg",
        stars: 5,
        comment: "Chauffeur ponctuel et agréable, voiture impeccable. Service premium qui justifie son prix !",
        location: "Paris 8ème",
        date: "Il y a 2 jours"
    },
    {
        name: "Samir L.",
        photo: "/client-2.png",
        stars: 5,
        comment: "Voiture propre, service rapide et prix très correct. Réponse immédiate sur WhatsApp.",
        location: "CDG → Paris",
        date: "Il y a 1 semaine"
    },
    {
        name: "Frank P.",
        photo: "/client-3.png",
        stars: 5,
        comment: "Excellent pour mes trajets aéroports. Ponctualité parfaite et confort optimal.",
        location: "Orly → Paris",
        date: "Il y a 3 jours"
    },
    {
        name: "Marie C.",
        photo: "/client-1.jpg",
        stars: 5,
        comment: "Service exceptionnel ! Chauffeur professionnel et voiture de luxe. Je recommande vivement.",
        location: "Paris 16ème",
        date: "Il y a 5 jours"
    },
    {
        name: "Pierre M.",
        photo: "/client-2.png",
        stars: 5,
        comment: "Réservation simple et rapide. Trajet confortable et prix transparent. Parfait !",
        location: "Paris → Versailles",
        date: "Il y a 1 semaine"
    },
    {
        name: "Sophie R.",
        photo: "/client-3.png",
        stars: 5,
        comment: "Première fois que j'utilise ce service. Très satisfaite de la ponctualité et du professionnalisme.",
        location: "Beauvais → Paris",
        date: "Il y a 2 semaines"
    }
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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
            {/* Fond avec motif */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 0, 128, 0.1) 0%, transparent 50%)
                    `
                }} />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-6xl font-black mb-6">
                        <span className="text-gradient">AVIS</span>
                        <br />
                        <span className="text-white">CLIENTS</span>
                    </h2>
                    <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-8" />
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Découvrez ce que nos clients disent de notre service premium
                    </p>
                </motion.div>

                {/* Grille des témoignages */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group relative"
                            onHoverStart={() => setActiveIndex(index)}
                        >
                            {/* Carte principale */}
                            <div className="glass-strong p-8 rounded-3xl h-full relative overflow-hidden">
                                {/* Effet de brillance */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                {/* En-tête du témoignage */}
                                <div className="relative z-10 mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <img
                                                src={testimonial.photo}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                                            <p className="text-gray-400 text-sm">{testimonial.location}</p>
                                        </div>
                                    </div>

                                    {/* Étoiles */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(testimonial.stars)].map((_, i) => (
                                            <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-yellow-400">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                {/* Commentaire */}
                                <div className="relative z-10">
                                    <blockquote className="text-gray-300 leading-relaxed mb-4 italic">
                                        "{testimonial.comment}"
                                    </blockquote>

                                    {/* Date */}
                                    <div className="text-gray-500 text-sm">
                                        {testimonial.date}
                                    </div>
                                </div>

                                {/* Indicateur de hover */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Ombre portée */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Statistiques */}
                <motion.div
                    className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {[
                        { number: "500+", label: "Clients satisfaits" },
                        { number: "4.9★", label: "Note moyenne" },
                        { number: "24/7", label: "Disponibilité" },
                        { number: "<2min", label: "Temps de réponse" }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="text-center"
                            whileHover={{ y: -5 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                            <div className="text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call-to-action */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
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
