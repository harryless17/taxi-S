'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-2 md:px-0">

      {/* Header */}
      <header className="w-full max-w-md px-4 py-6 bg-white shadow-md flex flex-col items-center rounded-b-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600 tracking-tight">Taxi Aghiles</h1>
        <p className="text-gray-700 mt-1 text-base md:text-lg text-center">
          Votre taxi 24h/24 à Lyon
        </p>
      </header>

      {/* Présentation */}
      <section className="w-full max-w-md mt-8 bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2">
        <img
          src="/taxi.png"
          alt="Votre chauffeur"
          className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg object-cover border-4 border-green-100"
        />
        <h2 className="text-xl md:text-2xl font-semibold text-green-700 mb-2">Présentation</h2>
        <ul className="text-gray-700 space-y-1 list-none text-base md:text-lg pl-0">
          <li>🚕 Service familial, disponible 24h/24 et 7j/7</li>
          <li>⏱️ Ponctualité et sécurité assurées</li>
          <li>🧳 Toutes distances : aéroports, gares, événements, tourisme</li>
        </ul>
        <div className="flex gap-4 mt-4 justify-center">
          {/* Taxi */}
          <div className="flex flex-col items-center text-green-700">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <rect x="7" y="13" width="18" height="9" rx="3" fill="#22c55e" />
              <circle cx="11" cy="24" r="2" fill="#a3e635" />
              <circle cx="21" cy="24" r="2" fill="#a3e635" />
            </svg>
            <span className="text-xs mt-1">Taxi</span>
          </div>
          {/* Aéroport */}
          <div className="flex flex-col items-center text-green-700">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <path d="M16 6v20M10 22l6-4 6 4" stroke="#22c55e" strokeWidth="2" />
              <circle cx="16" cy="8" r="2" fill="#a3e635" />
            </svg>
            <span className="text-xs mt-1">Aéroport</span>
          </div>
          {/* Valise */}
          <div className="flex flex-col items-center text-green-700">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <rect x="10" y="13" width="12" height="9" rx="2" fill="#22c55e" />
              <rect x="13" y="10" width="6" height="3" rx="1" fill="#a3e635" />
            </svg>
            <span className="text-xs mt-1">Bagages</span>
          </div>
        </div>

      </section>

      {/* Réservation */}
      <section className="w-full max-w-md mt-8 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-semibold text-green-700 mb-4">Réservez votre trajet</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const dep = (target.elements.namedItem('depart') as HTMLInputElement).value;
            const arr = (target.elements.namedItem('arrivee') as HTMLInputElement).value;
            const date = (target.elements.namedItem('date') as HTMLInputElement).value;
            const tel = (target.elements.namedItem('tel') as HTMLInputElement).value;
            const msg = encodeURIComponent(
              `Bonjour, je souhaite réserver un taxi.\nDépart : ${dep}\nArrivée : ${arr}\nDate/Heure : ${date}\nTéléphone : ${tel}`
            );
            // Remplace 33600000000 par ton numéro WhatsApp pro !
            window.open(`https://wa.me/33615392250?text=${msg}`, '_blank');
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="depart" className="sr-only">Départ</label>
          <input
            id="depart"
            name="depart"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 hover:shadow-md transition"
            placeholder="Départ"
          />
          <label htmlFor="arrivee" className="sr-only">Arrivée</label>
          <input
            id="arrivee"
            name="arrivee"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 hover:shadow-md transition"
            placeholder="Arrivée"
          />
          <label htmlFor="date" className="sr-only">Date et heure</label>
          <input
            id="date"
            name="date"
            required
            type="datetime-local"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 hover:shadow-md transition"
            placeholder="Date et heure"
          />
          <label htmlFor="tel" className="sr-only">Votre téléphone</label>
          <input
            id="tel"
            name="tel"
            required
            type="tel"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 hover:shadow-md transition"
            placeholder="Votre téléphone"
          />
          <button
            type="submit"
            className="mt-3 w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 hover:shadow-md transition"
          >
            Réserver via WhatsApp
          </button>
        </form>
      </section>

      {/* Contact rapide */}
      <section className="w-full max-w-md mt-8 mb-4 flex flex-col items-center">
        <a
          href="tel:0600000000"
          className="text-lg text-green-700 underline font-bold"
        >
          📞 06 00 00 00 00
        </a>
        <a
          href="https://wa.me/33600000000"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-white bg-green-600 px-6 py-2 rounded-xl font-bold shadow hover:bg-green-700 hover:shadow-md transition"
        >
          WhatsApp Direct
        </a>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white py-4 flex justify-center text-gray-400 text-sm border-t mt-8">
        © 2025 Taxi Aghiles. Mentions légales.
      </footer>

      {/* Bouton WhatsApp flottant */}
      <a
        href="https://wa.me/33600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-green-600 p-4 rounded-full shadow-lg hover:bg-green-700 transition"
        aria-label="Réserver sur WhatsApp"
      >
        <svg width="28" height="28" fill="white" viewBox="0 0 32 32">
          <path d="M16 2.9A13.1 13.1 0 1 0 28.9 16 13.12 13.12 0 0 0 16 2.9zm7.47 18.47-1 3.36a2.08 2.08 0 0 1-2 1.5A13.37 13.37 0 0 1 9.9 13.6a2.08 2.08 0 0 1 1.5-2l3.36-1a1 1 0 0 1 1.1.29l1.68 2.05a1 1 0 0 1-.14 1.38l-.6.6a8.36 8.36 0 0 0 3.87 3.87l.6-.6a1 1 0 0 1 1.38-.14l2.05 1.68a1 1 0 0 1 .29 1.1z" />
        </svg>
      </a>
    </main>
  );
}
