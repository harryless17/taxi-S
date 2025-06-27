'use client';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full relative overflow-hidden">
            {/* Fond avec gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-black" />

            {/* Motif de fond */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(45deg, rgba(0, 212, 255, 0.1) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255, 0, 128, 0.1) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(0, 212, 255, 0.1) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255, 0, 128, 0.1) 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }} />
            </div>

            <div className="relative z-10">
                {/* Section principale */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Logo et description */}
                        <div className="col-span-1 md:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h3 className="text-3xl font-black mb-6">
                                    <span className="text-gradient">TAXI</span>
                                    <span className="text-white"> AGHILES</span>
                                </h3>
                                <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                                    Votre chauffeur taxi premium à Paris. Service professionnel, ponctualité garantie,
                                    confort optimal pour tous vos déplacements.
                                </p>

                                {/* Réseaux sociaux */}
                                <div className="flex gap-4">
                                    {[
                                        { icon: "📱", label: "WhatsApp", href: "https://wa.me/33615392250" },
                                        { icon: "📞", label: "Téléphone", href: "tel:0615392250" },
                                        { icon: "📧", label: "Email", href: "mailto:contact@taxi-aghiles.fr" }
                                    ].map((social, i) => (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass p-3 rounded-full hover:scale-110 transition-transform duration-300"
                                            whileHover={{ y: -2 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <span className="text-2xl">{social.icon}</span>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Services rapides */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h4 className="text-white font-semibold text-lg mb-6">Services</h4>
                            <ul className="space-y-3">
                                {[
                                    "Transferts aéroport",
                                    "Course urbaine",
                                    "Trajet longue distance",
                                    "Service événementiel",
                                    "Transport VIP"
                                ].map((service, i) => (
                                    <motion.li
                                        key={service}
                                        className="text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        {service}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact rapide */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <h4 className="text-white font-semibold text-lg mb-6">Contact</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span>Paris & IDF</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-2 h-2 bg-secondary rounded-full" />
                                    <span>24/7 Disponible</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-2 h-2 bg-accent rounded-full" />
                                    <span>Réponse &lt; 2min</span>
                                </div>
                            </div>

                            {/* Bouton de réservation rapide */}
                            <motion.a
                                href="https://wa.me/33615392250"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-modern mt-6 w-full text-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Réserver maintenant
                            </motion.a>
                        </motion.div>
                    </div>
                </div>

                {/* Barre de séparation */}
                <div className="border-t border-gray-800 mx-6" />

                {/* Section inférieure */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <motion.div
                            className="text-gray-500 text-sm"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            © {currentYear} Taxi Aghiles – Paris. Tous droits réservés.
                        </motion.div>

                        {/* Liens légaux */}
                        <motion.div
                            className="flex gap-6 text-sm"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <a
                                href="/mentions-legales"
                                className="text-gray-500 hover:text-primary transition-colors duration-300"
                            >
                                Mentions légales
                            </a>
                            <a
                                href="/politique-confidentialite"
                                className="text-gray-500 hover:text-primary transition-colors duration-300"
                            >
                                Politique de confidentialité
                            </a>
                            <a
                                href="/cgv"
                                className="text-gray-500 hover:text-primary transition-colors duration-300"
                            >
                                CGV
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Effet de particules en bas */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        </footer>
    );
}
