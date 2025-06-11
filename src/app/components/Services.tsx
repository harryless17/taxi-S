'use client';
import { motion } from 'framer-motion';

const services = [
    {
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                <path d="M5 30L10 18h20l5 12z" fill="#2563eb" />
                <path d="M13 16v-4a7 7 0 0 1 14 0v4" stroke="#2563eb" strokeWidth="2" />
                <path d="M22 23h6M12 23h6" stroke="#2563eb" strokeWidth="2" />
                <circle cx="13" cy="31" r="2" fill="#60a5fa" />
                <circle cx="27" cy="31" r="2" fill="#60a5fa" />
                <path d="M22 11l8 4" stroke="#2563eb" strokeWidth="2" />
            </svg>
        ),
        title: "Transferts aéroport",
    },
    {
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                <circle cx="20" cy="13" r="7" stroke="#2563eb" strokeWidth="2" />
                <rect x="10" y="24" width="20" height="10" rx="5" fill="#2563eb" />
            </svg>
        ),
        title: "Chauffeurs pros",
    },
    {
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                <rect x="9" y="13" width="22" height="14" rx="4" fill="#2563eb" />
                <rect x="17" y="8" width="6" height="5" rx="2" fill="#60a5fa" />
            </svg>
        ),
        title: "Toutes distances",
    },
];

export default function Services() {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.18, duration: 0.7, ease: "easeOut" }
        }),
    };

    return (
        <motion.section
            className="w-full max-w-3xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {services.map((service, i) => (
                <motion.div
                    key={service.title}
                    custom={i}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow p-6 flex flex-col items-center transform hover:scale-105 hover:shadow-xl transition"
                >
                    {service.icon}
                    <div className="font-bold text-blue-700 mt-3">{service.title}</div>
                </motion.div>
            ))}
        </motion.section>
    );
}
