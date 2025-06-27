'use client';
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
  return (
    <main className="min-h-screen bg-black flex flex-col items-center">
      {/* HERO */}
      <Hero />
      {/* SERVICES */}
      <Services />
      {/* AVIS CLIENT */}
      <Testimonials />
      {/* BIO CHAUFFEUR */}
      <ChauffeurBio />
      {/* FORMULAIRE DE RÉSERVATION */}
      <BookingForm />
      {/* TARIFS */}
      <Tariffs />
      {/* FAQ */}
      <Faq />
      {/* CONTACT EXPRESS */}
      <ContactExpress />
      {/* FOOTER */}
      <Footer />
    </main>
  );
}
