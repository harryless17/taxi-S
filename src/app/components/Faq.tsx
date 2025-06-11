'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
    {
        question: "Est-ce que Taxi Aghiles est disponible la nuit ?",
        answer: "Oui, notre service fonctionne 24h/24 et 7j/7 sur Paris et région parisienne."
    },
    {
        question: "Puis-je réserver à l’avance ?",
        answer: "Absolument ! Vous pouvez réserver à tout moment via WhatsApp ou le formulaire, en précisant la date et l’heure souhaitées."
    },
    {
        question: "Les paiements par carte sont-ils acceptés ?",
        answer: "Oui, nous acceptons les paiements par carte bancaire, espèces et même via applications mobiles (ex : Apple Pay)."
    },
    {
        question: "Faites-vous les transferts aéroports et gares ?",
        answer: "Oui, nous assurons tous les transferts aéroports, gares, hôtels ou domicile, sur Paris et au-delà."
    }
];

export default function Faq() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <motion.section
            className="w-full max-w-2xl mt-12 mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">FAQ – Questions fréquentes</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <motion.div
                        key={faq.question}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(open === i ? null : i)}
                            className="w-full flex justify-between items-center bg-blue-50 px-6 py-4 rounded-xl shadow hover:bg-blue-100 transition font-semibold text-blue-800 text-left"
                            aria-expanded={open === i}
                            aria-controls={`faq-answer-${i}`}
                        >
                            <span>{faq.question}</span>
                            <svg className={`w-6 h-6 ml-2 transform transition-transform ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <motion.div
                            id={`faq-answer-${i}`}
                            initial={false}
                            animate={open === i ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-white px-6"
                            style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
                        >
                            {open === i && (
                                <div className="py-4 text-blue-700 border-t border-blue-100">
                                    {faq.answer}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
