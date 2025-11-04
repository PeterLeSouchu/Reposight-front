import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export function useMutationMarkOnboardingAsSeen() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.patch("/user/steps");
      return response.data;
    },
  });
}
