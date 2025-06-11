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


