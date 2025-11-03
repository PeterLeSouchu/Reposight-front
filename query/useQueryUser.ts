import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useQueryUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await api.get("/user/me");
      return response.data;
    },
  });
}
