export interface Repo {
  id: number;
  name: string;
  description: string | null;
  htmlUrl: string;
  private?: boolean;
  language?: string | null;
  pushedAt: string;
  createdAt?: string;
}
