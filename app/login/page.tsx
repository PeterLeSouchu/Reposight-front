"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Brand, GithubMark, LogoMark, buttonStyles } from "@/components/public/Brand";
import { RepoPanel } from "@/components/public/RepoPanel";

const NEXT_STEPS = [
  {
    title: "GitHub vous demande d'autoriser Reposight",
    desc: "Vous restez sur github.com, votre mot de passe n'est jamais partagé.",
  },
  {
    title: "Vous choisissez les dépôts à suivre",
    desc: "Publics ou privés, modifiables à tout moment.",
  },
  {
    title: "Votre tableau de bord est prêt",
    desc: "Activité, comparaisons, commits, pull requests et issues.",
  },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-paper text-ink lg:grid-cols-[1fr_1.15fr]">
      <div aria-hidden="true" className="bg-dots absolute inset-0" />

      <div className="relative flex flex-col px-4 py-5 sm:px-10">
        <div className="flex h-11 items-center justify-between">
          <Brand />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-iris-700"
          >
            <ArrowLeft size={16} />
            Accueil
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center py-16">
          <div className="w-full max-w-sm">
            <div aria-hidden="true" className="mb-10 flex items-center gap-3">
              <LogoMark className="size-12 drop-shadow-[0_8px_16px_rgba(101,35,204,0.35)]" />
              <span className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span key={dot} className="size-1.5 rounded-full bg-iris-300" />
                ))}
              </span>
              <span className="flex size-12 items-center justify-center rounded-[14px] bg-ink text-white shadow-[0_8px_16px_rgba(27,20,51,0.25)]">
                <GithubMark className="size-6" />
              </span>
            </div>

            <h1 className="font-display text-4xl font-semibold tracking-tight">
              Connexion à Reposight
            </h1>
            <p className="mt-4 leading-relaxed text-ink/60">
              Connectez votre compte GitHub pour retrouver vos dépôts et leurs
              statistiques.
            </p>

            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className={cn(
                buttonStyles.primary,
                "mt-10 h-12 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
              )}
              aria-label="Se connecter avec votre compte GitHub"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <GithubMark className="size-[18px]" />
              )}
              {isLoading ? "Redirection vers GitHub…" : "Se connecter avec GitHub"}
            </button>

            <div className="mt-10">
              <p className="text-sm font-semibold text-ink">
                Ce qui se passe ensuite
              </p>
              <ol className="relative mt-5 space-y-5">
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 left-[7px] top-3 w-0.5 bg-gradient-to-b from-iris-400 to-iris-100"
                />
                {NEXT_STEPS.map((step) => (
                  <li key={step.title} className="relative pl-8 text-sm">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0.5 size-4 rounded-full border-2 border-iris-500 bg-white"
                    />
                    <span className="block font-medium text-ink">{step.title}</span>
                    <span className="mt-0.5 block text-ink/55">{step.desc}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-10 border-t border-iris-100 pt-6 text-xs leading-relaxed text-ink/50">
              En vous connectant, vous acceptez nos{" "}
              <Link
                href="/cgu"
                className="text-iris-700 underline underline-offset-2 hover:text-iris-600"
              >
                conditions d'utilisation
              </Link>{" "}
              et notre politique de confidentialité.
            </p>
          </div>
        </main>
      </div>

      <aside className="relative hidden items-center border-l border-iris-100 bg-iris-100/50 px-16 lg:flex">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[520px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris-300/50 blur-[130px]"
        />
        <div className="relative w-full [perspective:1800px]">
          <RepoPanel className="mx-auto max-w-xl [transform:rotateY(-10deg)_rotateX(4deg)]" />
        </div>
      </aside>
    </div>
  );
}
