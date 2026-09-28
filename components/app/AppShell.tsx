import { Brand } from "@/components/public/Brand";
import { UserMenu } from "@/components/app/UserMenu";

// Structure commune des pages connectées : barre fixe + trame de points en fond
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-[560px]"
      />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-iris-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Brand href="/repositories" />
          <UserMenu />
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
        {children}
      </main>
    </div>
  );
}
