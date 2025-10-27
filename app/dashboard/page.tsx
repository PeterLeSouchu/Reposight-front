"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // Invalider le cache de l'auth
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      // Effacer le localStorage
      localStorage.clear();

      // Rediriger vers la page d'accueil
      router.push("/");
    },
    onError: (error) => {
      console.error("Erreur lors de la déconnexion:", error);

      // Effacer quand même localStorage et cookies même en cas d'erreur
      localStorage.clear();

      // Rediriger vers la page d'accueil
      router.push("/");
    },
  });

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
    <div className="min-h-screen p-8 bg-[#060010] text-white">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-300">Bienvenue sur votre tableau de bord !</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <LogOut size={18} />
          {logoutMutation.isPending ? "Déconnexion..." : "Déconnexion"}
        </button>
      </div>

      {data && (
        <div className="bg-[#1a002d]/90 backdrop-blur-md rounded-3xl p-8 border border-violet-800/30 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Vos informations</h2>
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
