"use client";

import { motion } from "motion/react";
import Marquee from "react-fast-marquee";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Zap,
  Star,
  Check,
  Github,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col text-slate-900 overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 w-[1400px] h-[1400px] bg-indigo-600/20 rounded-full blur-[350px] -translate-x-1/2 will-change-[opacity,transform]"
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.12, 1] }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
            type: "tween",
          }}
          style={{ transformOrigin: "center center" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[900px] h-[900px] bg-purple-500/15 rounded-full blur-[280px] will-change-[opacity,transform]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: 2,
            type: "tween",
          }}
          style={{ transformOrigin: "center center" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-indigo-400/12 rounded-full blur-[220px] will-change-[opacity,transform]"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 4,
            type: "tween",
          }}
          style={{ transformOrigin: "center center" }}
        />
      </div>

      <header className="sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 ">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-xs rounded-full border border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between"
          >
            <div
              className="flex items-center gap-3 "
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src="/logo-reposight.png"
                alt="Reposight Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Reposight
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-2 rounded-full px-4 py-2">
              <a
                href="#fonctionnalites"
                className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-[color,background-color] cursor-pointer px-4 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100"
              >
                Fonctionnalités
              </a>
              <a
                href="#comment-ca-marche"
                className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-[color,background-color] cursor-pointer px-4 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100"
              >
                Comment ça marche
              </a>
              <a
                href="#avis"
                className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-[color,background-color] cursor-pointer px-4 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100"
              >
                Avis
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="relative px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-full transition-all shadow-md hover:shadow-lg overflow-hidden group"
              >
                <span className="relative z-10">Se connecter</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-slate-700" />
              ) : (
                <Menu size={24} className="text-slate-700" />
              )}
            </button>
          </motion.div>

          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm  md:hidden"
              />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 left-4 right-4 z-[60] md:hidden bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="flex flex-col gap-4">
                  <a
                    href="#fonctionnalites"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-violet-600 hover:text-violet-800 transition-[color,background-color] cursor-pointer px-4 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100"
                  >
                    Fonctionnalités
                  </a>
                  <a
                    href="#comment-ca-marche"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-violet-600 hover:text-violet-800 transition-[color,background-color] cursor-pointer px-4 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100"
                  >
                    Comment ça marche
                  </a>
                  <a
                    href="#avis"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-violet-600 hover:text-violet-800 transition-[color,background-color] cursor-pointer px-4 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100"
                  >
                    Avis
                  </a>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative mt-2 px-6 py-3 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-md hover:shadow-lg overflow-hidden group text-center"
                  >
                    <span className="relative z-10">Se connecter</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  </Link>
                </nav>
              </motion.div>
            </>
          )}
        </div>
      </header>

      <section className="relative z-10 pt-16 pb-36 px-6">
        {/* Brume violette légère centrée sur la section hero */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className="w-[900px] h-[900px] rounded-full blur-[250px]"
            style={{ backgroundColor: "rgba(139, 92, 246, 0.35)" }}
          ></div>
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border-2 border-indigo-200/60 shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Connexion avec GitHub
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.05]"
          >
            L'analyse de vos dépôts GitHub,
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              simplifiée
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connectez-vous avec votre compte GitHub et transformez vos dépôts en
            visualisations claires, rapports détaillés et recommandations IA
            personnalisées.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <Link
              href="/login"
              className="relative px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full transition-all shadow-xl flex items-center gap-3 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Github size={20} />
                Commencez maintenant
                <ArrowRight size={20} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Link>
            <p className="text-sm text-slate-500">
              Gratuit • Aucune carte bancaire requise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/30 to-transparent rounded-2xl blur-3xl" />
              <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-indigo-50/50 to-purple-50/50 flex items-center justify-center">
                  <img
                    src="/logo-reposight.png"
                    alt="Dashboard preview"
                    className="w-32 h-32 opacity-20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 border-t border-gradient-to-r from-transparent via-slate-200 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-200/30 to-transparent h-px"></div>
      </div>

      <section
        id="fonctionnalites"
        className="relative z-10 py-24 px-6 scroll-mt-24 bg-gradient-to-b from-transparent via-violet-50/5 to-transparent"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 text-sm font-semibold text-violet-600 bg-violet-100 rounded-full mb-4">
              Fonctionnalités
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 bg-clip-text text-transparent mb-4 leading-tight">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des fonctionnalités puissantes pour analyser et optimiser vos
              dépôts GitHub
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-10 h-10 text-violet-600" />,
                title: "Visualisations avancées",
                desc: "Graphiques interactifs et tableaux de bord personnalisables pour une analyse approfondie de vos projets.",
                gradient: "from-violet-500/10 to-fuchsia-500/10",
              },
              {
                icon: <Brain className="w-10 h-10 text-violet-600" />,
                title: "IA intégrée",
                desc: "Recommandations intelligentes basées sur l'analyse de vos patterns de code et vos tendances de développement.",
                gradient: "from-fuchsia-500/10 to-violet-500/10",
              },
              {
                icon: <Zap className="w-10 h-10 text-violet-600" />,
                title: "Performance optimale",
                desc: "Architecture cloud scalable avec AWS et NoSQL pour une expérience rapide et fiable, même avec des milliers de dépôts.",
                gradient: "from-violet-500/10 to-purple-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative p-8 bg-white rounded-2xl border-2 border-violet-100"
              >
                <div className="relative mb-6 p-4 bg-violet-50 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 relative">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed relative">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-gradient-to-r from-transparent via-slate-200 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-200/40 to-transparent h-px"></div>
      </div>

      <section
        id="comment-ca-marche"
        className="relative z-10 py-24 px-6 scroll-mt-24 bg-gradient-to-b from-transparent via-violet-50/5 to-transparent"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 text-sm font-semibold text-violet-600 bg-violet-100 rounded-full mb-4">
              Processus
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 bg-clip-text text-transparent mb-4 leading-tight">
              Simple et rapide
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Connectez-vous avec GitHub en quelques secondes, tout le reste est
              automatique
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Connectez-vous avec GitHub",
                desc: "Un seul clic pour autoriser Reposight via OAuth sécurisé. Vos données restent privées et sous votre contrôle total.",
                color: "violet",
              },
              {
                step: "02",
                title: "Analyse automatique",
                desc: "Nos algorithmes analysent vos commits, pull requests, issues et identifient les tendances clés de vos projets.",
                color: "violet",
              },
              {
                step: "03",
                title: "Obtenez des insights",
                desc: "Consultez vos rapports détaillés, exportez en PDF, et recevez des recommandations IA pour optimiser votre workflow.",
                color: "violet",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-violet-200 to-violet-300 bg-clip-text text-transparent">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-gradient-to-r from-transparent via-slate-200 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-200/40 to-transparent h-px"></div>
      </div>

      <section
        id="avis"
        className="relative z-10 py-24 pb-32  scroll-mt-24 bg-gradient-to-b from-transparent via-violet-50/5 to-transparent"
      >
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 pb-2"
          >
            <span className="inline-block px-4 py-1 text-sm font-semibold text-violet-600 bg-violet-100 rounded-full mb-4">
              Témoignages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 bg-clip-text text-transparent mb-4 leading-tight">
              Rejoignez des centaines de développeurs
            </h2>
            <p className="text-xl text-slate-600">
              Découvrez ce qu'ils pensent de Reposight
            </p>
          </motion.div>

          <Marquee pauseOnHover gradient={false} speed={35}>
            {[
              {
                name: "Inès P.",
                role: "Lead Developer",
                text: "Le design et la précision des graphiques sont exceptionnels. Je peux maintenant analyser facilement la performance de mes équipes.",
              },
              {
                name: "Thomas D.",
                role: "CTO",
                text: "Simple, fluide et puissant. L'intégration GitHub est transparente et les analyses automatiques me font gagner des heures chaque semaine.",
              },
              {
                name: "Amina K.",
                role: "Full Stack Developer",
                text: "Interface superbe avec une UX premium. L'application est devenue indispensable pour suivre l'évolution de mes projets open source.",
              },
              {
                name: "Hugo R.",
                role: "Software Engineer",
                text: "Reposight me fait gagner du temps chaque semaine. Les insights sur les langages utilisés sont très utiles pour optimiser mon workflow.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="mx-4 w-[420px] bg-white rounded-2xl p-8 border-2 border-violet-100  hover:border-violet-300 transition-all"
              >
                <div className="mb-5 flex items-center gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        size={18}
                        className="text-violet-500 fill-violet-500"
                      />
                    ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed text-base">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-slate-900 text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-violet-600 font-medium">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <footer className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-between gap-4">
            <div className="flex items-center justify-center flex-col gap-3">
              <img
                src="/logo-reposight.png"
                alt="Reposight Logo"
                className="w-6 h-6"
              />
            </div>
            <div className="flex items-center flex-col gap-6 text-sm text-slate-600">
              <Link
                href="/cgu"
                className="hover:text-violet-600 transition-colors duration-150"
              >
                Conditions d'utilisation
              </Link>
              <span>© 2025 Reposight</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
