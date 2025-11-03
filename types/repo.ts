export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  private?: boolean;
  language?: string | null;
  pushed_at: string;
  selectedAt?: string;
}
