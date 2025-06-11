'use client';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Thomas D.",
        photo: "/client-1.jpg",
        stars: 5,
        comment: "Chauffeur ponctuel et agréable, je recommande !"
    },
    {
        name: "Samir L.",
        photo: "/client-2.png",
        stars: 5,
        comment: "Voiture propre, service rapide et prix très correct."
    },
    {
        name: "Frank P.",
        photo: "/client-3.png",
        stars: 5,
        comment: "Excellent pour mes trajets aéroports, merci !"
    }
];

export default function Testimonials() {
    return (
        <motion.section
            className="w-full max-w-2xl mt-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Ils nous font confiance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((avis, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12, duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center"
                    >
                        <img src={avis.photo} alt={avis.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 mb-3" />
                        <div className="flex items-center gap-1 text-yellow-400 mb-1">
                            {'★'.repeat(Math.floor(avis.stars))}
                        </div>
                        <div className="text-blue-900 font-semibold text-center mb-2">{avis.comment}</div>
                        <div className="text-gray-500 text-xs">{avis.name}</div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
