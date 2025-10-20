"use client";

import { motion } from "motion/react";
import Marquee from "react-fast-marquee";
import { ArrowRight, BarChart3, Brain, Zap, Star } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden bg-[#060010]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-violet-600/30 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
      </div>

      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3"
        >
          <img
            src="/logo-reposight.png"
            alt="RepoSight Logo"
            className="w-8 h-8"
          />
          <h1 className="text-2xl -ml-2.5 font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            eposight
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link
            href="/login"
            className="relative bg-violet-600 rounded-full px-6 py-2 font-semibold shadow-lg shadow-violet-900/30 cursor-pointer transition-all duration-300 border border-violet-500/20 hover:border-violet-300/60 hover:bg-violet-500/90 hover:shadow-violet-300/30 hover:shadow-lg overflow-hidden group block"
          >
            <span className="relative z-10">Se connecter</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          </Link>
        </motion.div>
      </header>

      {/* HERO */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 relative z-10 py-24">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-3xl -z-10"
          animate={{ y: [0, -25, 0], scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 9 }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white"
        >
          Analysez vos dépôts GitHub
          <br />
          <span className="text-violet-400">comme jamais auparavant</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-300 max-w-2xl mb-8"
        >
          RepoSight centralise vos données GitHub et les transforme en
          visualisations claires et exploitables.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/login"
            className="relative bg-violet-600 rounded-full px-8 py-4 text-lg font-semibold flex items-center gap-3 shadow-lg shadow-violet-800/40 transition-all duration-300 border border-violet-500/20 hover:border-violet-300/60 hover:bg-violet-500/90 hover:shadow-violet-300/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-3">
              Découvrir l'application <ArrowRight size={18} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          </Link>
        </motion.div>

        <motion.img
          src="/dashboard-preview.png"
          alt="aperçu dashboard"
          className="mt-12 max-w-4xl rounded-2xl border border-violet-700/30 shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        />
      </main>

      {/* WHY */}
      <section className="py-24 px-6 bg-[#0b0017]/70 border-t border-violet-900/20 backdrop-blur-md relative overflow-hidden">
        <h3 className="text-3xl font-bold text-center mb-16">
          Pourquoi choisir <span className="text-violet-400">RepoSight</span> ?
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          {[
            {
              icon: (
                <BarChart3 className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              ),
              title: "Clarté des données",
              desc: "Des graphiques limpides et des statistiques précises sur vos projets GitHub.",
            },
            {
              icon: (
                <Brain className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              ),
              title: "IA intégrée",
              desc: "Analyse intelligente des tendances et recommandations basées sur votre activité.",
            },
            {
              icon: <Zap className="w-10 h-10 text-violet-400 mx-auto mb-4" />,
              title: "Performance",
              desc: "Une architecture optimisée AWS & NoSQL pour une expérience fluide et rapide.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="p-8 rounded-[32px] bg-gradient-to-b from-[#120028]/70 to-[#080016]/70 border border-violet-800/30 shadow-lg hover:shadow-violet-800/50 hover:scale-[1.05] transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              {f.icon}
              <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
              <p className="text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-[#0c0018]/80 border-t border-violet-900/20 text-center relative z-10">
        <h3 className="text-3xl font-bold mb-12">Comment ça marche ?</h3>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Connectez votre compte GitHub",
              desc: "Autorisez RepoSight à accéder à vos dépôts publics et privés. Grâce à OAuth sécurisé, vos données sont protégées et accessibles uniquement par vous.",
            },
            {
              step: "2",
              title: "Analyse automatique",
              desc: "Visualisez commits, pull requests, issues et langages utilisés. RepoSight calcule des statistiques avancées et met en avant les tendances clés de vos projets.",
            },
            {
              step: "3",
              title: "Générez des rapports détaillés",
              desc: "Exportez vos rapports en PDF, stockez vos snapshots sur S3, et recevez des recommandations IA personnalisées pour améliorer votre workflow et votre productivité.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-[#1a002d]/90 rounded-[32px] p-8 border border-violet-700/30 shadow-md hover:shadow-violet-700/50 hover:scale-[1.04] transition-all"
            >
              {/* Cercle chiffre repositionné et centré */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                {s.step}
              </div>

              <h4 className="mt-10 text-xl font-semibold text-violet-300 mb-3">
                {s.title}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 bg-gradient-to-b from-[#0a0016] to-[#120024] border-t border-violet-900/30">
        <h3 className="text-2xl font-semibold text-center mb-6">
          Ce qu'en pensent les développeurs
        </h3>

        <div className=" mx-auto">
          <Marquee pauseOnHover gradient={false} speed={40}>
            {[
              {
                name: "Inès P.",
                text: "Le design et la précision des graphiques sont exceptionnels. Je peux maintenant analyser facilement la performance de mes équipes et identifier les tendances de productivité. L'export PDF est un plus énorme pour mes rapports mensuels.",
              },
              {
                name: "Thomas D.",
                text: "Simple, fluide et puissant - exactement ce que je cherchais ! L'intégration GitHub est transparente et les analyses automatiques me font gagner des heures chaque semaine. Les recommandations IA sont vraiment pertinentes.",
              },
              {
                name: "Amina K.",
                text: "Interface superbe avec une UX premium. Les visualisations sont magnifiques et les données sont présentées de manière très claire. L'application est devenue indispensable pour suivre l'évolution de mes projets open source.",
              },
              {
                name: "Hugo R.",
                text: "RepoSight me fait gagner du temps chaque semaine en automatisant l'analyse de mes dépôts. Les insights sur les langages utilisés et les patterns de commits sont très utiles pour optimiser mon workflow de développement.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="mx-4 w-[320px] bg-[#1c002f]/90 border border-violet-800/40 rounded-[32px] p-6 text-center shadow-md hover:shadow-violet-700/50 transition-all"
              >
                <div className="mb-3 text-violet-400 flex justify-center">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <Star key={j} size={14} fill="currentColor" />
                    ))}
                </div>
                <p className="text-slate-300 text-sm mb-2">“{t.text}”</p>
                <h4 className="text-violet-300 font-semibold">{t.name}</h4>
              </div>
            ))}
          </Marquee>
        </div>

        {/* FOOTER */}
        <footer className="text-center pt-36 pb-8 text-sm text-slate-400">
          <Link
            href="/cgu"
            className="text-violet-400 hover:text-violet-300 underline transition-colors mb-2 block mx-auto"
          >
            Conditions Générales d'Utilisation
          </Link>
          <p>RepoSight © 2025</p>
        </footer>
      </section>
    </div>
  );
}
