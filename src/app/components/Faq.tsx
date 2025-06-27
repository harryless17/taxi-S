'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Est-ce que Taxi Aghiles est disponible la nuit ?",
        answer: "Oui, notre service fonctionne 24h/24 et 7j/7 sur Paris et région parisienne."
    },
    {
        question: "Puis-je réserver à l'avance ?",
        answer: "Absolument ! Vous pouvez réserver à tout moment via WhatsApp ou le formulaire, en précisant la date et l'heure souhaitées."
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
            className="w-full max-w-2xl mt-16 mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <h2 className="text-4xl md:text-5xl font-black text-gradient mb-8 text-center">
                FAQ – Questions fréquentes
            </h2>
            <div className="space-y-6">
                {faqs.map((faq, i) => {
                    const isOpen = open === i;
                    return (
                        <motion.div
                            key={faq.question}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                        >
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? null : i)}
                                className={`w-full flex justify-between items-center glass-strong px-6 py-5 rounded-2xl shadow-xl font-semibold text-lg text-left transition-all duration-300 border border-transparent hover:border-primary focus:border-primary ${isOpen ? 'border-primary' : ''}`}
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${i}`}
                            >
                                <span className="text-gradient drop-shadow">{faq.question}</span>
                                <span className={`ml-4 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary/20 rotate-180' : 'bg-white/10'}`}>
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        id={`faq-answer-${i}`}
                                        initial={{ opacity: 0, y: -10, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
                                        animate={{ opacity: 1, y: 0, maxHeight: 300, paddingTop: 20, paddingBottom: 20 }}
                                        exit={{ opacity: 0, y: -10, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
                                        transition={{ duration: 0.32, ease: 'easeInOut' }}
                                        className="overflow-hidden px-6"
                                        style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
                                    >
                                        <div className="text-gray-200 text-base border-t border-primary/20 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}
