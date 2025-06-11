'use client';
import { useState } from "react";
import { motion } from 'framer-motion';


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

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 flex flex-col items-center px-2 md:px-0">

      {/* HERO */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.8 } }
        }}
        className="w-full relative flex flex-col items-center justify-center"
        style={{ minHeight: 320 }}
      >
        <img
          src="/taxi-paris.jpg"
          alt="Taxi à Paris"
          className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
          style={{ zIndex: 1, minHeight: 320, maxHeight: 400 }}
        />
        <div className="relative z-10 flex flex-col items-center py-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-md"
          >
            Taxi Aghiles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-blue-100 mt-2 text-xl md:text-2xl text-center drop-shadow"
          >
            Votre taxi 24h/24 à Paris
          </motion.p>
          <motion.a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg text-lg hover:bg-blue-100 hover:scale-105 transition animate-pulse"
            initial={{ scale: 0.85, opacity: 0.8 }}
            animate={{ scale: [0.98, 1, 0.98], opacity: 1 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
            aria-label="Réserver via WhatsApp"
          >
            Réserver via WhatsApp
          </motion.a>
        </div>
      </motion.section>

      {/* SERVICES */}
      <motion.section
        className="w-full max-w-3xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {[
          {
            icon: (
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                <path d="M5 30L10 18h20l5 12z" fill="#2563eb" />
                <path d="M13 16v-4a7 7 0 0 1 14 0v4" stroke="#2563eb" strokeWidth="2" />
                <path d="M22 23h6M12 23h6" stroke="#2563eb" strokeWidth="2" />
                <circle cx="13" cy="31" r="2" fill="#60a5fa" />
                <circle cx="27" cy="31" r="2" fill="#60a5fa" />
                <path d="M22 11l8 4" stroke="#2563eb" strokeWidth="2" />
              </svg>
            ),
            title: "Transferts aéroport",
          },
          {
            icon: (
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                <circle cx="20" cy="13" r="7" stroke="#2563eb" strokeWidth="2" />
                <rect x="10" y="24" width="20" height="10" rx="5" fill="#2563eb" />
              </svg>
            ),
            title: "Chauffeurs pros",
          },
          {
            icon: (
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                <rect x="9" y="13" width="22" height="14" rx="4" fill="#2563eb" />
                <rect x="17" y="8" width="6" height="5" rx="2" fill="#60a5fa" />
              </svg>
            ),
            title: "Toutes distances",
          },
        ].map((service, i) => (
          <motion.div
            key={service.title}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center transform hover:scale-105 hover:shadow-xl transition"
          >
            {service.icon}
            <div className="font-bold text-blue-700 mt-3">{service.title}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* AVIS CLIENT */}
      <motion.section
        className="w-full max-w-xl mt-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <img src="/client.jpg" alt="Avis client" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-400 text-lg">★★★★★</span>
            </div>
            <div className="text-blue-900 font-semibold">Chauffeur ponctuel et agréable</div>
            <div className="text-gray-500 text-sm">Marie D.</div>
          </div>
        </div>
      </motion.section>

      {/* FORMULAIRE DE RÉSERVATION */}
      <motion.section
        className="w-full max-w-2xl mt-10 bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Demande de réservation</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const nom = (target.elements.namedItem('nom') as HTMLInputElement).value;
            const tel = (target.elements.namedItem('tel') as HTMLInputElement).value;
            const dep = (target.elements.namedItem('depart') as HTMLInputElement).value;
            const arr = (target.elements.namedItem('arrivee') as HTMLInputElement).value;
            const date = (target.elements.namedItem('date') as HTMLInputElement).value;
            const msg = encodeURIComponent(
              `Bonjour, je souhaite réserver un taxi.\nNom : ${nom}\nTéléphone : ${tel}\nDépart : ${dep}\nArrivée : ${arr}\nDate/Heure : ${date}`
            );
            window.open(`https://wa.me/33600000000?text=${msg}`, '_blank');
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="nom" required className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nom" />
          <input name="tel" required type="tel" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Téléphone" />
          <input name="depart" required className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="Départ" />
          <input name="arrivee" required className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="Arrivée" />
          <input name="date" required type="datetime-local" className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="Date et heure" />
          <button
            type="submit"
            className="md:col-span-2 mt-4 w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 shadow hover:scale-105 transition"
          >
            Réserver via WhatsApp
          </button>
        </form>
      </motion.section>

      <motion.section
        className="w-full max-w-2xl mt-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Tarifs indicatifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TarifCard
            icon="🛫"
            title="Transfert Aéroport"
            price="45 €"
            desc="Paris ➔ Roissy-Charles de Gaulle"
          />
          <TarifCard
            icon="🚉"
            title="Transfert Gare"
            price="25 €"
            desc="Paris ➔ Gare de Lyon"
          />
          <TarifCard
            icon="🌃"
            title="Course Paris"
            price="Dès 15 €"
            desc="Trajet intra-muros, 24h/24"
          />
        </div>
        <div className="text-xs text-gray-500 mt-4 text-center">
          * Tarifs indicatifs, variables selon trafic et horaires. Demandez un devis personnalisé sur WhatsApp.
        </div>
      </motion.section>


      <motion.section
        className="w-full max-w-2xl mt-12 mb-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">FAQ – Questions fréquentes</h2>
        <FAQ />
      </motion.section>

      <motion.section
        className="w-full max-w-lg mt-12 mb-8 flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Contact express</h2>
        <div className="flex flex-col items-center gap-3 bg-white shadow rounded-2xl p-6">
          <div className="text-sm text-gray-500 text-center mb-2">Scannez pour discuter sur WhatsApp :</div>
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


      {/* FOOTER */}
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
    </main>
  );
}
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      question: "Est-ce que Taxi Aghiles est disponible la nuit ?",
      answer: "Oui, notre service fonctionne 24h/24 et 7j/7 sur Paris et région parisienne."
    },
    {
      question: "Puis-je réserver à l’avance ?",
      answer: "Absolument ! Vous pouvez réserver à tout moment via WhatsApp ou le formulaire, en précisant la date et l’heure souhaitées."
    },
    {
      question: "Les paiements par carte sont-ils acceptés ?",
      answer: "Oui, nous acceptons les paiements par carte bancaire, espèces et même via applications mobiles (ex : Apple Pay)."
    },
    {
      question: "Faites-vous les transferts aéroports et gares ?",
      answer: "Oui, nous assurons tous les transferts aéroports, gares, hôtels ou domicile, sur Paris et au-delà."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <motion.div
          key={faq.question}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center bg-blue-50 px-6 py-4 rounded-xl shadow hover:bg-blue-100 transition font-semibold text-blue-800 text-left"
            aria-expanded={open === i}
            aria-controls={`faq-answer-${i}`}
          >
            <span>{faq.question}</span>
            <svg className={`w-6 h-6 ml-2 transform transition-transform ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <motion.div
            id={`faq-answer-${i}`}
            initial={false}
            animate={open === i ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white px-6"
            style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
          >
            {open === i && (
              <div className="py-4 text-blue-700 border-t border-blue-100">
                {faq.answer}
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
function TarifCard({ icon, title, price, desc }: { icon: string, title: string, price: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow p-6 flex flex-col items-center hover:scale-105 hover:shadow-xl transition"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="font-bold text-blue-700 text-lg">{title}</div>
      <div className="text-blue-500 text-2xl my-1">{price}</div>
      <div className="text-gray-500 text-sm text-center">{desc}</div>
    </motion.div>
  );
}

