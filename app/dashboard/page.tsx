"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Essayer d'appeler le backend, mais on ne bloque pas en cas d'erreur
      try {
        const response = await api.post("/auth/logout");
        return response.data;
      } catch (error) {
        // On ignore l'erreur car on va faire le logout côté client de toute façon
        return null;
      }
    },
    onSuccess: () => {
      handleClientSideLogout();
    },
    onError: (error) => {
      console.error("Erreur lors de la déconnexion:", error);
      handleClientSideLogout();
    },
  });

  const handleClientSideLogout = () => {
    // Effacer le localStorage
    localStorage.clear();

    // Supprimer tous les cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Utiliser window.location.href pour forcer une navigation complète
    // Cela permet de recharger complètement l'application et de supprimer le cookie JWT
    window.location.href = "/";
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl text-red-400">
          Erreur lors du chargement des données
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-8 text-white overflow-hidden bg-[#060010]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[900px] h-[900px] bg-violet-600/20 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
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
            <Skeleton className="h-12 w-12 rounded-full bg-slate-800/50" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-32 rounded-md bg-slate-800/50" />
              <Skeleton className="h-5 w-48 rounded-md bg-slate-800/50" />
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
                  className="w-12 h-12 rounded-full border-2 border-violet-500/50 hover:border-violet-400/70 transition-all"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="font-semibold text-sm">{data.username}</span>
                  <span className="text-xs text-slate-400">{data.email}</span>
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
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 cursor-pointer text-red-600  focus:text-red-500"
                >
                  <LogOut className="text-red-600" size={16} />
                  {logoutMutation.isPending ? "Déconnexion..." : "Déconnexion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <h2 className="text-2xl font-bold text-white">{data.username}</h2>
              <p className="text-sm text-violet-300/70">{data.email}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <button className="px-6 py-2 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-violet-900/30 border border-violet-500/20 flex justify-center items-center gap-2">
            <Plus size={18} /> Nouveau repo
          </button>
        </motion.div>
      </div>

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 bg-[#1a002d]/90 backdrop-blur-md rounded-3xl p-8 border border-violet-700/30 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-violet-200">
            Vos informations
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-400">ID</span>
              <span className="text-white">{data.id}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-400">GitHub ID</span>
              <span className="text-white">{data.githubId}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-400">Username</span>
              <span className="text-white">{data.username}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-400">Email</span>
              <span className="text-white">{data.email}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-slate-400">Avatar</span>
              <span className="text-white break-all">{data.avatar}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-violet-700/30">
            <h3 className="text-lg font-semibold mb-4 text-violet-200">
              Données brutes (JSON)
            </h3>
            <pre className="text-sm text-slate-300 overflow-auto bg-slate-900/30 p-4 rounded-lg border border-violet-800/20">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
