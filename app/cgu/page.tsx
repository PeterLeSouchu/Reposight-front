"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CGUPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col text-slate-900 overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 w-[1400px] h-[1400px] bg-indigo-600/20 rounded-full blur-[350px] -translate-x-1/2"
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[900px] h-[900px] bg-purple-500/15 rounded-full blur-[280px]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-indigo-400/12 rounded-full blur-[220px]"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Brume violette légère centrée sur la section */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="w-[900px] h-[900px] rounded-full blur-[250px]"
          style={{ backgroundColor: "rgba(139, 92, 246, 0.35)" }}
        ></div>
      </div>

      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full relative z-10">
        <motion.button
          onClick={handleBack}
          className="flex items-center cursor-pointer gap-2 text-violet-600 hover:text-violet-700 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft size={18} />
          Retour
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3"
        >
          <img
            src="/logo-reposight.png"
            alt="Reposight Logo"
            className="w-8 h-8"
          />
          <h1 className="text-2xl -ml-2.5  font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            eposight
          </h1>
        </motion.div>
        <div className="w-20"></div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-50 backdrop-blur-md rounded-3xl p-8 border border-violet-200/50 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-violet-700">
            Conditions Générales d'Utilisation
          </h2>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-violet-600 mb-4">
                1. Acceptation des conditions
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                En utilisant Reposight, vous acceptez d'être lié par ces
                Conditions Générales d'Utilisation. Si vous n'acceptez pas ces
                conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-violet-600 mb-4">
                2. Description du service
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Reposight est une plateforme d'analyse de dépôts GitHub qui
                permet aux utilisateurs de :
              </p>
              <ul className="text-slate-600 list-disc list-inside space-y-2 ml-4">
                <li>Connecter leur compte GitHub via OAuth sécurisé</li>
                <li>Analyser leurs dépôts publics et privés</li>
                <li>Générer des rapports et visualisations</li>
                <li>Exporter des données en format PDF</li>
                <li>Recevoir des recommandations basées sur l'IA</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-violet-600 mb-4">
                3. Utilisation autorisée
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Vous vous engagez à utiliser Reposight uniquement à des fins
                légales et conformément à ces conditions. Il est interdit de :
              </p>
              <ul className="text-slate-600 list-disc list-inside space-y-2 ml-4">
                <li>Utiliser le service pour des activités illégales</li>
                <li>Tenter de contourner les mesures de sécurité</li>
                <li>Partager vos identifiants de connexion</li>
                <li>Surcharger intentionnellement nos serveurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-violet-600 mb-4">
                4. Données et confidentialité
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nous nous engageons à protéger vos données personnelles et vos
                informations GitHub. Nous collectons uniquement les données
                nécessaires au fonctionnement du service et nous ne les
                partageons pas avec des tiers sans votre consentement explicite.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-violet-600 mb-4">
                5. Limitation de responsabilité
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Reposight est fourni "en l'état". Nous ne garantissons pas que
                le service sera exempt d'erreurs ou disponible en permanence.
                Nous ne saurions être tenus responsables des dommages indirects
                résultant de l'utilisation du service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-violet-600 mb-4">
                6. Modification des conditions
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout
                moment. Les modifications prendront effet dès leur publication
                sur cette page. Votre utilisation continue du service constitue
                votre acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-violet-600 mb-4">
                7. Contact
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Pour toute question concernant ces conditions d'utilisation,
                veuillez nous contacter à l'adresse : contact@reposight.com
              </p>
            </section>

            <div className="border-t border-violet-200/50 pt-6 mt-8">
              <p className="text-sm text-slate-600 text-center">
                Dernière mise à jour : Janvier 2025
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="text-center py-8 text-sm text-slate-600">
        Reposight © 2025
      </footer>
    </div>
  );
}
