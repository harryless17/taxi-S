'use client';
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsappLoader({ open }: { open: boolean }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-[100] bg-black/10"
                >
                    <motion.div
                        className="bg-white rounded-xl p-8 flex flex-col items-center shadow-2xl"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                    >
                        <span className="text-5xl mb-4">✅</span>
                        <p className="text-xl font-bold text-green-600">Redirection vers WhatsApp…</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
