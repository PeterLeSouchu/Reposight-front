import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes qui nécessitent une authentification
  const protectedRoutes = ["/dashboard", "/repository"];

  // Routes interdites si l'utilisateur est déjà connecté
  const authRoutes = ["/", "/login"];

  // Récupérer le cookie refresh_token
  const refreshToken = request.cookies.get("refresh_token");

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Vérifier si la route est interdite aux utilisateurs connectés
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute) {
    // Si pas de refresh_token, rediriger vers la page de login
    if (!refreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si l'utilisateur est connecté et essaie d'accéder à / ou /login, rediriger vers dashboard
  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
