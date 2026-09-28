import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "../components/ReactQueryProvider";
import { NextStepProvider } from "nextstepjs";
import { NextStepWrapper } from "@/components/repositories/NextStepWrapper";
import { ConfirmDialogProvider } from "@/contexts/ConfirmDialogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reposight",
  description:
    "Suivez l'activité de vos dépôts GitHub : commits, pull requests et issues en un coup d'œil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ReactQueryProvider>
          <NextStepProvider>
            <ConfirmDialogProvider>
              <NextStepWrapper>{children}</NextStepWrapper>
            </ConfirmDialogProvider>
          </NextStepProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
