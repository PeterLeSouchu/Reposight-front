import Link from "next/link";
import { Brand } from "@/components/public/Brand";

const LINKS = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/login", label: "Connexion" },
  { href: "/cgu", label: "Conditions d'utilisation" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-iris-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Brand />
        <nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/60 transition-colors hover:text-iris-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-ink/45">
          © {new Date().getFullYear()} Reposight
        </p>
      </div>
    </footer>
  );
}
