import type { Metadata } from "next";
import StickyWhatsAppButton from "./components/StickyWhatsAppButton";
import './globals.css';
import StickyPhoneButton from "@/app/components/StickyPhoneButton";
import StickyDock from "@/app/components/StickyDock";

export const metadata: Metadata = {
  title: "Taxi Aghiles Paris | Réservation Taxi rapide WhatsApp",
  description: "Votre chauffeur taxi à Paris. Réservez en 1 clic via WhatsApp, service professionnel, tarifs clairs, clients satisfaits.",
  icons: [
    { rel: "icon", url: "/favicon.ico" }
  ],
  openGraph: {
    title: "Taxi Aghiles Paris | Réservation Taxi rapide WhatsApp",
    description: "Taxi premium à Paris, réservation express WhatsApp, service 5 étoiles.",
    images: [
      {
        url: "/paris-taxi-hero.png",
        width: 1200,
        height: 630,
        alt: "Taxi Paris, premium",
      },
    ],
    type: "website",
    locale: "fr_FR",
    url: "https://tonsite.vercel.app", // Mets ton vrai domaine prod ici !
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
        <StickyDock />
      </body>
    </html>
  );
}
