"use client";

import { NextStep } from "nextstepjs";
import { Tour, type CardComponentProps } from "nextstepjs";
import { useNextStep } from "nextstepjs";
import { useEffect, useCallback } from "react";
import { useMutationMarkOnboardingAsSeen } from "@/mutation/useMutationMarkOnboardingAsSeen";
import { useQueryClient } from "@tanstack/react-query";
import { useOnboardingStore } from "@/lib/onboardingStore";

// Carte personnalisée avec boutons en français et design par défaut
const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) => {
  const onTourComplete = useOnboardingStore((state) => state.onTourComplete);

  const handleSkipTour = () => {
    // Appeler la mutation avant de fermer le steper.
    if (onTourComplete) {
      onTourComplete();
    }
    if (skipTour) {
      skipTour();
    }
  };

  return (
    <div
      className="nextstep-card max-w-sm rounded-2xl border border-iris-100 bg-white p-5 shadow-[0_30px_60px_-20px_rgba(42,14,87,0.4)]"
      style={{
        maxWidth: "min(calc(100vw - 1rem), 24rem)",
        width: "auto",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
          {step.title}
        </h3>
        <span className="shrink-0 rounded-full bg-iris-50 px-2 py-0.5 text-xs font-medium text-iris-700">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-ink/60">
        {step.content}
      </p>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-iris-100 pt-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:bg-iris-50 hover:text-ink"
            >
              Précédent
            </button>
          )}
          {currentStep < totalSteps - 1 ? (
            <button
              onClick={nextStep}
              className="cursor-pointer whitespace-nowrap rounded-full bg-iris-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-iris-700"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSkipTour}
              className="cursor-pointer whitespace-nowrap rounded-full bg-iris-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-iris-700"
            >
              Terminer
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleSkipTour}
            className="cursor-pointer whitespace-nowrap text-sm text-ink/50 transition-colors hover:text-ink"
          >
            Passer
          </button>
        </div>
      </div>
      {arrow}
    </div>
  );
};

const steps: Tour[] = [
  {
    tour: "repositoriesTour",
    steps: [
      {
        title: "Ajouter un dépôt",
        content:
          "Liez ici un projet GitHub à Reposight pour l'ajouter à vos repositories et accéder à ses détails et statistiques.",
        selector: "#add-repo-button",
        icon: "➕",
        showControls: true,
        showSkip: true,
        side: "bottom-right",
      },
      {
        title: "Recherche de dépôts",
        content:
          "Une fois ajoutés, les dépôts peuvent être recherchés par nom.",
        selector: "#searchbar-input",
        icon: "🔍",
        showControls: true,
        showSkip: true,
        side: "bottom",
      },
      {
        title: "Trier les dépôts",
        content:
          "Filtrez vos dépôts par date d’ajout, dernier push ou push le plus ancien pour retrouver facilement vos projets.",
        selector: "#sort-dropdown",
        icon: "⬆️",
        showControls: true,
        showSkip: true,
        side: "bottom-right",
      },
      {
        title: "Mon profil",
        content:
          "Enfin, au clic sur votre avatar, vous pouvez vous déconnecter ou supprimer votre compte.",
        selector: "#avatar-dropdown",
        icon: "👤",
        showControls: true,
        showSkip: true,
        side: "bottom-left",
      },
    ],
  },
];

export function NextStepWrapper({ children }: { children: React.ReactNode }) {
  const { closeNextStep, isNextStepVisible } = useNextStep();
  const { mutate: markOnboardingAsSeen } = useMutationMarkOnboardingAsSeen();
  const queryClient = useQueryClient();
  const setOnTourComplete = useOnboardingStore(
    (state) => state.setOnTourComplete
  );

  const handleOnboardingComplete = useCallback(() => {
    markOnboardingAsSeen(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      },
    });
  }, [markOnboardingAsSeen, queryClient]);

  useEffect(() => {
    setOnTourComplete(handleOnboardingComplete);
    return () => {
      setOnTourComplete(null);
    };
  }, [setOnTourComplete, handleOnboardingComplete]);

  // Gérer la fermeture du tour avec Echap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isNextStepVisible) {
        handleOnboardingComplete();
        closeNextStep();
      }
    };

    if (isNextStepVisible) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isNextStepVisible, handleOnboardingComplete, closeNextStep]);

  return (
    <NextStep steps={steps} cardComponent={CustomCard} noInViewScroll>
      {children}
    </NextStep>
  );
}
