export default function MentionsLegales() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 flex flex-col items-center px-2 py-8">
            <section className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 mt-8">
                <h1 className="text-2xl font-bold text-blue-700 mb-6">Mentions légales</h1>
                <div className="space-y-6 text-gray-700 text-sm">
                    <div>
                        <strong>Propriétaire du site</strong><br />
                        Taxi Aghiles<br />
                        Paris<br />
                        Téléphone : 06 15 39 22 50<br />
                        Responsable de la publication : Aghiles MANSEUR
                    </div>
                    <div>
                        <strong>Hébergement</strong><br />
                        Ce site est hébergé par Vercel Inc.<br />
                        440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
                        <a href="https://vercel.com/" className="underline text-blue-700" target="_blank" rel="noopener noreferrer">
                            https://vercel.com/
                        </a>
                    </div>
                    <div>
                        <strong>Protection des données</strong><br />
                        Les informations saisies dans le formulaire de réservation ne sont ni stockées ni conservées sur ce site.<br />
                        Les échanges se font directement via WhatsApp.
                    </div>
                    <div>
                        <strong>Droit d’accès, de modification et de suppression</strong><br />
                        Conformément à la loi française, vous pouvez demander la modification ou la suppression de vos données en contactant le propriétaire du site.
                    </div>
                </div>
            </section>
        </main>
    );
}
