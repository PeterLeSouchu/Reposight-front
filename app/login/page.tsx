"use client";

import { motion } from "motion/react";
import { Github, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  const handleBack = () => {
    router.back();
  };

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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={handleBack}
            className="flex items-center cursor-pointer gap-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </motion.div>
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
          <h1 className="text-2xl -ml-2.5  font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            eposight
          </h1>
        </motion.div>
        <div className="w-20"></div> {/* Spacer pour centrer le titre */}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto px-6"
        >
          <div className="bg-[#1a002d]/90 backdrop-blur-md rounded-3xl p-8 border border-violet-700/30 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Connexion à RepoSight
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Pour utiliser l'application, vous devez connecter votre compte
                GitHub. Cela nous permet d'analyser vos dépôts et de générer des
                rapports personnalisés.
              </p>
            </div>

            <motion.button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="relative w-full bg-slate-800/50 cursor-pointer hover:bg-slate-800/70 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-4 font-semibold flex items-center justify-center gap-3 shadow-lg border border-slate-700/50 hover:border-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 overflow-hidden group"
              aria-label="Se connecter avec votre compte GitHub"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isLoading ? (
                  <>
                    Se connecter avec GitHub{" "}
                    <Loader2 size={18} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <Github size={20} className="text-violet-300" />
                    Se connecter avec GitHub
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                En vous connectant, vous acceptez nos{" "}
                <Link
                  href="/cgu"
                  className="text-violet-400 hover:text-violet-300 underline transition-colors"
                >
                  conditions d'utilisation
                </Link>{" "}
                et notre politique de confidentialité.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 text-sm text-slate-400">
        RepoSight © 2025
      </footer>
    </div>
  );
}
