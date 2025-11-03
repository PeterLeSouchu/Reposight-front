export interface Repo {
  // Identifiant du repo (number pour GitHub, string pour repos sélectionnés)
  id: number;
  repoId?: string;
  name: string;
  description: string | null;
  html_url: string;
  private?: boolean;
  language?: string | null;
  updated_at?: string;
  selectedAt?: string;
  updatedAt?: string;
}
