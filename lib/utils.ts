import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    if (error instanceof AxiosError && error.response?.data) {
      const data = error.response.data;
      if (typeof data === "object" && "message" in data) {
        return String(data.message);
      }
      if (typeof data === "string") {
        return data;
      }
    }
  }
  return "Une erreur est survenue. Veuillez réessayer plus tard.";
}
