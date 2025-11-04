import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useNotifyDeletedRepos(
  reposDeletedFromGithub: string[] | undefined
) {
  // useRef garde une valeur qui persiste entre les renders, mais ne cause pas de re-render
  // On stocke ici la liste des repos qu'on a DÉJÀ notifiés
  const notifiedReposRef = useRef<Set<string>>(new Set());

  // useEffect s'exécute APRÈS le render, et seulement quand reposDeletedFromGithub CHANGE
  useEffect(() => {
    // Si pas de repos supprimés, on ne fait rien
    if (!reposDeletedFromGithub?.length) return;

    // On filtre pour garder SEULEMENT les repos qu'on n'a pas encore notifiés
    const newRepos = reposDeletedFromGithub.filter(
      (repo) => !notifiedReposRef.current.has(repo)
    );

    // Si tous les repos ont déjà été notifiés, on ne fait rien
    if (newRepos.length === 0) return;

    // On marque ces nouveaux repos comme "déjà notifiés" pour éviter les doublons
    newRepos.forEach((repo) => notifiedReposRef.current.add(repo));

    // On affiche le toast seulement pour les NOUVEAUX repos
    const message =
      newRepos.length === 1
        ? `Le repo ${newRepos[0]} a été supprimé de github`
        : `Les repos ${newRepos.slice(0, -1).join(", ")} et ${
            newRepos[newRepos.length - 1]
          } ont été supprimés de github`;

    toast.warning(message);
  }, [reposDeletedFromGithub]);
}
