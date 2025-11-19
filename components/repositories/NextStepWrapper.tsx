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
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 max-w-sm">
      <div className="flex items-center gap-3 mb-3">
        {step.icon && <span className="text-2xl">{step.icon}</span>}
        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
      </div>
      <p className="text-slate-600 mb-4 text-sm leading-relaxed">
        {step.content}
      </p>
      <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer text-sm font-medium whitespace-nowrap"
            >
              Précédent
            </button>
          )}
          {currentStep < totalSteps - 1 ? (
            <button
              onClick={nextStep}
              className="px-3 py-1.5 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors text-sm font-medium whitespace-nowrap"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSkipTour}
              className="px-3 py-1.5 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors text-sm font-medium whitespace-nowrap"
            >
              Terminer
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {currentStep + 1} / {totalSteps}
          </span>
          <button
            onClick={handleSkipTour}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 hover:text-slate-700 cursor-pointer rounded-md transition-colors text-sm font-medium whitespace-nowrap"
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
        side: "bottom",
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
        side: "bottom",
      },
      {
        title: "Mon profil",
        content:
          "Enfin, au clic sur votre avatar, vous pouvez vous déconnecter ou supprimer votre compte.",
        selector: "#avatar-dropdown",
        icon: "👤",
        showControls: true,
        showSkip: true,
        side: "bottom",
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
