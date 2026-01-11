// tests/home-to-login.spec.ts
import { test, expect } from "@playwright/test";

test.setTimeout(180000);

test("Navigation de la page d’accueil vers la page de login", async ({
  page,
}) => {
  console.log("➡️ Navigation vers la page d’accueil");
  await page.goto("http://localhost:3000");
  console.log("✅ Page d’accueil chargée");

  console.log("➡️ Vérification du titre principal");
  await expect(page.getByText("L'analyse de vos dépôts GitHub")).toBeVisible();
  console.log("✅ Titre affiché");

  console.log('➡️ Recherche du bouton (Link) "Se connecter"');
  await page.getByRole("link", { name: "Se connecter" }).click();
  console.log('✅ Bouton "Se connecter" trouvé et cliqué');

  // 4. Attendre la navigation vers /login
  await expect(page).toHaveURL(/\/login$/);
});
