'use client';
import { useEffect, useState } from "react";
import WhatsappLoader from "./WhatsappLoader";

export default function StickyWhatsAppButton() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.navigator.vibrate) window.navigator.vibrate(80);
        setLoading(true);
        setTimeout(() => {
            window.open("https://wa.me/33615392250", "_blank");
            setLoading(false);
        }, 800);
    };

    return (
        <>
            <a
                href="https://wa.me/33615392250"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={`
    fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-xs
    bg-green-600 text-white !text-white hover:!text-white
    flex items-center justify-center font-bold px-4 py-3 rounded-2xl
    shadow-2xl transition-all duration-200 btn-whatsapp
    ${show ? "opacity-100" : "opacity-0 pointer-events-none"} md:hidden
  `}
                aria-label="Réserver via WhatsApp"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 32 32" fill="none" className="mr-2">
                    <circle cx="16" cy="16" r="16" fill="#fff" />
                    <path d="M24.46 22.51c-.35-.17-2.08-1.02-2.4-1.14-.32-.12-.56-.17-.8.18s-.92 1.13-1.13 1.36c-.2.23-.42.25-.77.08-.35-.17-1.48-.55-2.83-1.75-1.05-.94-1.77-2.09-1.98-2.43-.2-.35-.02-.53.15-.7.16-.16.35-.42.53-.63.18-.22.23-.38.35-.63.12-.25.06-.47-.03-.65-.1-.18-.8-1.93-1.1-2.64-.29-.68-.59-.58-.8-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.92.42-.31.34-1.2 1.18-1.2 2.88 0 1.7 1.1 3.34 1.26 3.57.17.23 2.2 3.39 5.38 4.6.75.29 1.33.46 1.78.59.75.24 1.42.21 1.96.13.6-.09 1.85-.76 2.11-1.5.26-.74.26-1.38.18-1.51-.08-.13-.31-.21-.66-.38z" fill="#25D366" />
                </svg>
                Réserver sur WhatsApp
            </a>
            <WhatsappLoader open={loading} />
        </>
    );
}
