import { Phone, MessageCircle } from "lucide-react";

export default function StickyDock() {
    return (
        <div
            className="
        fixed z-50 bottom-6 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-6
        flex gap-3
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
        rounded-full shadow-2xl
        px-4 py-2
        border border-slate-200 dark:border-slate-800
        items-center
      "
            style={{
                minWidth: "min-content",
            }}
            role="group"
            aria-label="Contact rapide"
        >
            <a
                href="tel:0612345678"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 !text-white !no-underline w-12 h-12 rounded-full shadow-lg transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Appeler le taxi"
            >
                <Phone className="w-6 h-6" />
            </a>

            <a
                href="https://wa.me/33612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-[#25D366] hover:bg-green-500 !text-white !no-underline w-12 h-12 rounded-full shadow-lg transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
            </a>
        </div>
    );
}
