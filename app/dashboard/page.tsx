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
        console.log(
          "Backend logout failed, continuing with client-side logout"
        );
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

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
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[900px] h-[900px] bg-violet-600/20 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* DOT PATTERN */}
      <div className="absolute inset-0 z-0 dot-pattern" />

      <div className="relative z-10 flex justify-between items-center mb-8">
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
                <DropdownMenuItem>
                  <Link
                    className="flex items-center gap-2 cursor-pointer"
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
    </div>
  );
}
