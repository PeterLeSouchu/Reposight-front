"use client";

import { LogOut, Plus, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useQueryUser } from "@/query/useQueryUser";
import { useMutationLogout } from "@/mutation/useMutationLogout";
import { useAuthStore } from "@/lib/authStore";

export default function Dashboard() {
  const { data, isLoading, error } = useQueryUser();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutationLogout();

  const handleClientSideLogout = () => {
    // Nettoyer le token d'accès du store
    useAuthStore.getState().clearAccessToken();
    // Effacer le localStorage
    localStorage.clear();
    // Rediriger vers la page d'accueil
    window.location.href = "/";
  };

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        handleClientSideLogout();
      },
      onError: (error) => {
        console.error("Erreur lors de la déconnexion:", error);
        handleClientSideLogout();
      },
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-900">
        <div className="text-xl text-red-600">
          Erreur lors du chargement des données
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-8 text-slate-900 overflow-hidden bg-[#fafafa]">
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

      <div className="absolute inset-0 z-0 dot-pattern" />

      <div className="relative z-10 flex justify-between items-center mb-8">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-32 rounded-md bg-slate-200" />
              <Skeleton className="h-5 w-48 rounded-md bg-slate-200" />
            </div>
          </motion.div>
        )}
        {data && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer border-none outline-none hover:opacity-90 transition-opacity">
                <img
                  src={data.avatar}
                  alt={`Avatar de ${data.username}`}
                  className="w-12 h-12 rounded-full border-2 border-violet-600/50 hover:border-violet-700/70 transition-all"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="font-semibold text-sm">{data.username}</span>
                  <span className="text-xs text-slate-600">{data.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    className="flex items-center gap-2 "
                    href={`https://github.com/${data.username}`}
                    target="_blank"
                  >
                    <ExternalLink size={14} /> Profil Github
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 cursor-pointer text-red-600  focus:text-red-500"
                >
                  <LogOut className="text-red-600" size={16} />
                  {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {data.username}
              </h2>
              <p className="text-sm text-violet-600">{data.email}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <button className="px-6 py-2 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all font-medium shadow-md shadow-violet-900/20 border border-violet-500/30 flex justify-center items-center gap-2">
            <Plus size={18} /> Nouveau repo
          </button>
        </motion.div>
      </div>

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 bg-slate-50 backdrop-blur-md rounded-3xl p-8 border border-violet-200/50 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-violet-700">
            Vos informations
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-600">ID</span>
              <span className="text-slate-900">{data.id}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-600">GitHub ID</span>
              <span className="text-slate-900">{data.githubId}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-600">Username</span>
              <span className="text-slate-900">{data.username}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-600">Email</span>
              <span className="text-slate-900">{data.email}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-600">Avatar</span>
              <span className="text-slate-900 break-all">{data.avatar}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-violet-200/50">
            <h3 className="text-lg font-semibold mb-4 text-violet-700">
              Données brutes (JSON)
            </h3>
            <pre className="text-sm text-slate-700 overflow-auto bg-slate-100 p-4 rounded-lg border border-violet-200/50">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
