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
    <div className="relative min-h-screen flex flex-col text-slate-900 overflow-hidden bg-[#fafafa]">
      {/* BACKGROUND - Gradient violet dynamique */}
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

      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={handleBack}
            className="flex items-center cursor-pointer gap-2 text-violet-600 hover:text-violet-700 transition-colors"
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
            alt="Reposight Logo"
            className="w-8 h-8"
          />
          <h1 className="text-2xl -ml-2.5  font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
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
          <div className="bg-slate-50 backdrop-blur-md rounded-3xl p-8 border border-violet-200/50 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Connexion à Reposight
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pour utiliser l'application, vous devez connecter votre compte
                GitHub. Cela nous permet d'analyser vos dépôts et de générer des
                rapports personnalisés.
              </p>
            </div>

            <motion.button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="relative w-full bg-violet-600 cursor-pointer hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-4 font-semibold flex items-center justify-center gap-3 shadow-md border border-violet-500/30 hover:border-violet-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 overflow-hidden group"
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
                    <Github size={20} className="text-white" />
                    Se connecter avec GitHub
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-600">
                En vous connectant, vous acceptez nos{" "}
                <Link
                  href="/cgu"
                  className="text-violet-600 hover:text-violet-700 underline transition-colors"
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
      <footer className="text-center py-8 text-sm text-slate-600">
        Reposight © 2025
      </footer>
    </div>
  );
}
