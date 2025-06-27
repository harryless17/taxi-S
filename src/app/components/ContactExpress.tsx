'use client';
import { motion } from 'framer-motion';

export default function ContactExpress() {
    return (
        <motion.section
            className="w-full max-w-lg mt-16 mb-16 flex flex-col items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <h2 className="text-4xl md:text-5xl font-black text-gradient mb-6 text-center">
                Contact Express
            </h2>
            <div className="glass-strong p-8 rounded-3xl flex flex-col items-center gap-5 shadow-xl w-full">
                <div className="text-lg text-gray-300 text-center mb-2">
                    Scannez ce QR code pour discuter directement sur <span className="text-green-400 font-bold">WhatsApp</span> !
                </div>
                <div className="relative flex items-center justify-center mb-2">
                    <img
                        src="/qr-whatsapp.png"
                        alt="QR code WhatsApp Taxi Aghiles"
                        className="w-40 h-40 rounded-2xl border-4 border-primary shadow-xl animate-glow"
                        style={{ background: '#0a0a0a' }}
                    />
                    {/* Effet de glow animé */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse-glow" style={{ boxShadow: '0 0 32px 8px #00d4ff55' }} />
                </div>
                <motion.a
                    href="https://wa.me/33615392250"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-modern text-lg px-10 py-4 mt-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="currentColor" className="mr-2">
                        <circle cx="16" cy="16" r="16" fill="#25D366" />
                        <path d="M24.46 22.51c-.35-.17-2.08-1.02-2.4-1.14-.32-.12-.56-.17-.8.18s-.92 1.13-1.13 1.36c-.2.23-.42.25-.77.08-.35-.17-1.48-.55-2.83-1.75-1.05-.94-1.77-2.09-1.98-2.43-.2-.35-.02-.53.15-.7.16-.16.35-.42.53-.63.18-.22.23-.38.35-.63.12-.25.06-.47-.03-.65-.1-.18-.8-1.93-1.1-2.64-.29-.68-.59-.58-.8-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.42-.31.34-1.2 1.18-1.2 2.88 0 1.7 1.1 3.34 1.26 3.57.17.23 2.2 3.39 5.38 4.6.75.29 1.33.46 1.78.59.75.24 1.42.21 1.96.13.6-.09 1.85-.76 2.11-1.5.26-.74.26-1.38.18-1.51-.08-.13-.31-.21-.66-.38z" fill="white" />
                    </svg>
                    Ou cliquez ici pour ouvrir WhatsApp
                </motion.a>
            </div>
        </motion.section>
    );
}
