// src/app/components/StickyPhoneButton.tsx
import { Phone } from "lucide-react";

export default function StickyPhoneButton() {
    return (
        <a
            href="tel:0615392250" // Remplace par ton numéro !
            className="btn-call fixed z-50 bottom-6 right-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            aria-label="Appeler le taxi"
        >
            <Phone className="w-5 h-5" />
            <span className="font-semibold text-base hidden sm:block">
        Appeler
      </span>
        </a>
    );
}
