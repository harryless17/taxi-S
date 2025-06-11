'use client';
import { motion } from 'framer-motion';

export default function ContactExpress() {
    return (
        <motion.section
            className="w-full max-w-lg mt-12 mb-8 flex flex-col items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Contact express</h2>
            <div className="flex flex-col items-center gap-3 bg-white shadow rounded-2xl p-6">
                <div className="text-sm text-gray-500 text-center mb-2">Scannez pour discuter sur WhatsApp&nbsp;:</div>
                <img
                    src="/qr-whatsapp.png"
                    alt="QR code WhatsApp Taxi Aghiles"
                    className="w-32 h-32 border-4 border-blue-200 rounded-xl mb-2"
                />
                <a
                    href="https://wa.me/33615392250"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-white bg-blue-700 px-6 py-2 rounded-xl font-bold shadow hover:bg-blue-800 hover:scale-105 transition"
                >
                    Ou cliquez ici
                </a>
            </div>
        </motion.section>
    );
}
