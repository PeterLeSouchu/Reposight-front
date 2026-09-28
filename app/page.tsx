"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { BarChart3, FolderGit2, ListTree } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GithubMark, buttonStyles } from "@/components/public/Brand";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { RepoPanel } from "@/components/public/RepoPanel";
import { ContributionGrid } from "@/components/public/ContributionGrid";

const FEATURES = [
  {
    icon: FolderGit2,
    title: "Tous vos dépôts au même endroit",
    desc: "Ajoutez les dépôts qui comptent, retrouvez-les par leur nom et triez-les par date d'ajout ou par dernier commit.",
    image: { src: "/dashboard.png", width: 2868, height: 1310, alt: "Liste des dépôts suivis dans Reposight" },
  },
  {
    icon: BarChart3,
    title: "L'activité des 30 derniers jours",
    desc: "Commits, pull requests et issues sur un seul graphique, avec la comparaison entre cette semaine et la précédente.",
    image: { src: "/graphic.png", width: 2858, height: 1312, alt: "Graphique d'activité sur 30 jours et comparaison hebdomadaire" },
  },
  {
    icon: ListTree,
    title: "Chaque commit, PR et issue en détail",
    desc: "Filtrez par contributeur ou par branche et parcourez l'historique du projet sans quitter Reposight.",
    image: { src: "/table.png", width: 2848, height: 1278, alt: "Liste des commits filtrée par contributeur et par branche" },
  },
];

const STEPS = [
  {
    title: "Connectez GitHub",
    desc: "Un clic pour autoriser Reposight via OAuth. Reposight n'a jamais accès à votre mot de passe.",
  },
  {
    title: "Choisissez vos dépôts",
    desc: "Sélectionnez les dépôts à suivre parmi ceux de votre compte, publics ou privés. Ajoutez-en ou retirez-en à tout moment.",
  },
  {
    title: "Suivez l'activité",
    desc: "Graphiques, comparaisons hebdomadaires, commits, pull requests et issues : tout est prêt, sans configuration.",
  },
];

const TESTIMONIALS = [
  {
    name: "Thomas D.",
    role: "CTO",
    text: "Simple, fluide et puissant. L'intégration GitHub est transparente et me fait gagner des heures chaque semaine.",
  },
  {
    name: "Inès P.",
    role: "Lead Developer",
    text: "Le design et la précision des graphiques sont exceptionnels. Je peux enfin suivre l'activité de mes équipes.",
  },
  {
    name: "Amina K.",
    role: "Full Stack Developer",
    text: "L'application est devenue indispensable pour suivre l'évolution de mes projets open source.",
  },
  {
    name: "Hugo R.",
    role: "Software Engineer",
    text: "Je vois tout de suite où en est chaque projet. Reposight me fait gagner du temps chaque semaine.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function SectionHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
      <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-lg text-lg leading-relaxed text-ink/60 lg:justify-self-end">
        {desc}
      </p>
    </div>
  );
}

function Initials({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-iris-400 to-iris-700 font-bold text-white",
        large ? "size-11 text-sm" : "size-9 text-xs"
      )}
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .join("")}
    </span>
  );
}

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const feature = FEATURES[activeFeature];
  const [featured, ...others] = TESTIMONIALS;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-paper text-ink">
        <SiteHeader />

        <main>
          {/* Hero */}
          <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40 lg:pb-32">
            <div aria-hidden="true" className="bg-dots absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute -right-24 top-[28rem] h-[300px] w-[300px] rounded-full bg-iris-300/30 blur-[90px] sm:-right-40 sm:top-20 sm:h-[600px] sm:w-[800px] sm:bg-iris-300/45 sm:blur-[140px]"
            />

            <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
              <div>
                <motion.h1
                  {...fadeUp}
                  transition={{ duration: 0.6 }}
                  className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]"
                >
                  L'analyse de vos dépôts GitHub, simplifiée
                </motion.h1>
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-6 max-w-xl text-lg leading-relaxed text-ink/65"
                >
                  Reposight lit l'historique de vos dépôts et le transforme en
                  vues claires : activité quotidienne, comparaison hebdomadaire,
                  commits, pull requests et issues.
                </motion.p>
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <Link href="/login" className={cn(buttonStyles.primary, "h-12")}>
                    <GithubMark className="size-[18px]" />
                    Commencer avec GitHub
                  </Link>
                  <a href="#fonctionnalites" className={cn(buttonStyles.secondary, "h-12")}>
                    Découvrir l'application
                  </a>
                </motion.div>
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-6 text-sm text-ink/50"
                >
                  Gratuit, sans carte bancaire. Dépôts publics et privés.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                className="min-w-0 lg:[perspective:1800px]"
              >
                <RepoPanel className="lg:origin-left lg:[transform:rotateY(-12deg)_rotateX(5deg)]" />
              </motion.div>
            </div>
          </section>

          {/* Fonctionnalités */}
          <section
            id="fonctionnalites"
            className="scroll-mt-16 border-t border-iris-100 px-4 py-24 sm:px-6 sm:py-32"
          >
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                title="Tout ce qu'il faut pour suivre vos projets"
                desc="Trois vues pensées pour être lues en quelques secondes, sans fouiller dans l'interface de GitHub."
              />

              <div className="mt-16 grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-12">
                <div role="tablist" aria-label="Fonctionnalités" className="flex flex-col gap-2">
                  {FEATURES.map((item, i) => {
                    const isActive = i === activeFeature;
                    return (
                      <button
                        key={item.title}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveFeature(i)}
                        className={cn(
                          "relative cursor-pointer overflow-hidden rounded-2xl border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-iris-400",
                          isActive
                            ? "border-iris-200 bg-white shadow-[0_12px_30px_-18px_rgba(83,27,168,0.35)]"
                            : "border-transparent hover:bg-white/60"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="feature-indicator"
                            className="absolute inset-y-4 left-0 w-[3px] rounded-full bg-iris-500"
                          />
                        )}
                        <span className="flex items-center gap-3">
                          <item.icon
                            size={18}
                            className={isActive ? "text-iris-600" : "text-ink/35"}
                          />
                          <span
                            className={cn(
                              "font-display font-semibold",
                              isActive ? "text-ink" : "text-ink/60"
                            )}
                          >
                            {item.title}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-2 block pl-[30px] text-sm leading-relaxed",
                            isActive ? "text-ink/65" : "text-ink/45"
                          )}
                        >
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-10 rounded-full bg-iris-300/40 blur-[100px]"
                  />
                  <div className="relative rounded-2xl border border-iris-100 bg-white p-2 shadow-[0_40px_80px_-40px_rgba(83,27,168,0.35)] sm:p-3">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={feature.image.src}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden rounded-xl border border-iris-100 bg-white"
                      >
                        <Image
                          src={feature.image.src}
                          alt={feature.image.alt}
                          width={feature.image.width}
                          height={feature.image.height}
                          sizes="(min-width: 1024px) 860px, 100vw"
                          className="h-auto w-full"
                          priority={activeFeature === 0}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comment ça marche */}
          <section
            id="comment-ca-marche"
            className="scroll-mt-16 border-t border-iris-100 px-4 py-24 sm:px-6 sm:py-32"
          >
            <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-24">
              <div>
                <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  Trois étapes, aucune configuration
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/60">
                  Pas d'installation, pas de webhook à configurer. Vous vous
                  connectez, Reposight s'occupe du reste.
                </p>
                <Link href="/login" className={cn(buttonStyles.primary, "mt-8 h-12")}>
                  <GithubMark className="size-[18px]" />
                  Commencer avec GitHub
                </Link>
              </div>

              <ol className="relative">
                <span
                  aria-hidden="true"
                  className="absolute bottom-6 left-[15px] top-4 w-0.5 bg-gradient-to-b from-iris-400 via-iris-500/60 to-iris-500/0"
                />
                {STEPS.map((step, i) => (
                  <li key={step.title} className="relative pb-14 pl-16 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0.5 flex size-8 items-center justify-center rounded-full border-2 border-iris-500 bg-white shadow-[0_0_20px_rgba(116,66,227,0.45)]"
                    >
                      <span className="size-2.5 rounded-full bg-iris-500" />
                    </span>
                    <p className="text-sm font-medium text-iris-600">Étape {i + 1}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-md leading-relaxed text-ink/60">
                      {step.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Avis */}
          <section
            id="avis"
            className="scroll-mt-16 border-t border-iris-100 px-4 py-24 sm:px-6 sm:py-32"
          >
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                title="Ils suivent leurs projets avec Reposight"
                desc="Développeurs, leads et CTO utilisent Reposight pour garder un œil sur leurs dépôts."
              />

              <div className="mt-16 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
                <figure className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-iris-500 to-iris-800 p-8 text-white shadow-[0_40px_80px_-40px_rgba(83,27,168,0.6)] sm:p-10">
                  <blockquote className="relative font-display text-2xl font-medium leading-snug sm:text-3xl">
                    « {featured.text} »
                  </blockquote>
                  <figcaption className="relative mt-10 flex items-center gap-4">
                    <Initials name={featured.name} large />
                    <span>
                      <span className="block font-semibold">{featured.name}</span>
                      <span className="text-sm text-iris-100">{featured.role}</span>
                    </span>
                  </figcaption>
                </figure>

                <div className="flex flex-col gap-5">
                  {others.map((testimonial) => (
                    <figure
                      key={testimonial.name}
                      className="flex gap-4 rounded-2xl border border-iris-100 bg-white p-6"
                    >
                      <Initials name={testimonial.name} />
                      <div>
                        <blockquote className="leading-relaxed text-ink/80">
                          {testimonial.text}
                        </blockquote>
                        <figcaption className="mt-3 text-sm">
                          <span className="font-semibold">{testimonial.name}</span>
                          <span className="text-ink/50"> · {testimonial.role}</span>
                        </figcaption>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Appel à l'action */}
          <section className="relative overflow-hidden border-y border-iris-200 bg-iris-100/70 px-4 py-28 sm:px-6 sm:py-36">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-[55%] items-center [mask-image:linear-gradient(to_right,transparent,black_50%)] lg:flex"
            >
              <ContributionGrid weeks={34} seed={3} animated={false} className="w-full" />
            </div>
            <div
              aria-hidden="true"
              className="absolute -left-24 bottom-0 h-[260px] w-[300px] rounded-full bg-iris-300/30 blur-[90px] sm:-left-40 sm:h-[400px] sm:w-[600px] sm:bg-iris-300/40 sm:blur-[130px]"
            />
            <div className="relative mx-auto max-w-7xl">
              <div className="max-w-lg">
                <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                  Vos projets, semaine après semaine
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-ink/60">
                  Connectez GitHub et retrouvez commits, pull requests et issues
                  dans un seul tableau de bord.
                </p>
                <Link href="/login" className={cn(buttonStyles.primary, "mt-10 h-12")}>
                  <GithubMark className="size-[18px]" />
                  Commencer avec GitHub
                </Link>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
