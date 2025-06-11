'use client';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            className="w-full bg-white py-4 flex flex-col items-center text-blue-400 text-xs border-t mt-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <div>
                © 2025 Taxi Aghiles – Paris.
                <a href="/mentions-legales" className="ml-2 underline hover:text-blue-700">Mentions légales</a>
            </div>
        </motion.footer>
    );
}
