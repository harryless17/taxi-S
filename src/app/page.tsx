'use client';
import { useState } from "react";
import { motion } from 'framer-motion';
import Hero from "./components/Hero";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import BookingForm from "./components/BookingForm";
import Tariffs from "./components/Tariffs";
import Faq from "./components/Faq";
import ContactExpress from "./components/ContactExpress";
import Footer from "./components/Footer";
import ChauffeurBio from "./components/ChauffeurBio";







export default function Home() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.18, duration: 0.7, ease: "easeOut" }
    }),
  };


  // Génère la date et l'heure par défaut (now + 1h, minutes à 00)
  function getDefaultDateTime() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0, 0, 0); // Met à 00 les minutes et secondes
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }
  const [defaultDateTime] = useState(getDefaultDateTime());

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 flex flex-col items-center px-2 md:px-0">

      {/* HERO */}
      <Hero />
      {/* SERVICES */}
      <Services />
      {/* AVIS CLIENT */}
      <Testimonials />
      {/* FORMULAIRE DE RÉSERVATION */}
      <ChauffeurBio />
      <BookingForm />
      <Tariffs />
      <Faq />
      <ContactExpress />

      {/* FOOTER */}
      <Footer />

    </main>
  );
}


