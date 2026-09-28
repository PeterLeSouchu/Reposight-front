import { SiteHeader } from '@/components/public/SiteHeader';
import { SiteFooter } from '@/components/public/SiteFooter';
import { TableOfContents } from '@/components/public/TableOfContents';

const SECTIONS = [
  {
    id: 'acceptation',
    title: 'Acceptation des conditions',
    content: (
      <p>
        En utilisant Reposight, vous acceptez d'être lié par ces Conditions
        Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez
        ne pas utiliser notre service.
      </p>
    ),
  },
  {
    id: 'service',
    title: 'Description du service',
    content: (
      <>
        <p>
          Reposight est un projet expérimental proposant une interface
          améliorée pour explorer des dépôts GitHub. Le service permet
          essentiellement de consulter :
        </p>
        <ul>
          <li>Des statistiques détaillées sur vos dépôts</li>
          <li>Des graphiques interactifs pour visualiser l'activité</li>
          <li>Des comparaisons simples entre périodes ou branches</li>
        </ul>
        <p className="text-sm text-ink/50">
          Aucune fonctionnalité d'intelligence artificielle, d'export PDF ou de
          recommandation automatisée n'est proposée dans cette version
          expérimentale.
        </p>
      </>
    ),
  },
  {
    id: 'usage',
    title: 'Usage autorisé',
    content: (
      <>
        <p>
          Vous vous engagez à utiliser Reposight uniquement à des fins
          légitimes et en respectant les lois applicables. Il est notamment
          interdit de :
        </p>
        <ul>
          <li>Procéder à une utilisation abusive ou malveillante du service</li>
          <li>Tenter de contourner les mécanismes de sécurité en place</li>
          <li>Partager des accès sans autorisation</li>
          <li>Collecter ou exploiter des données de manière illicite</li>
        </ul>
      </>
    ),
  },
  {
    id: 'donnees',
    title: 'Données et confidentialité',
    content: (
      <p>
        Reposight s'appuie uniquement sur les informations nécessaires à
        l'affichage des statistiques. Les données restent la propriété de leurs
        détenteurs et ne sont ni revendues, ni partagées avec des tiers.
        L'utilisateur conserve la responsabilité de la protection de ses
        identifiants GitHub.
      </p>
    ),
  },
  {
    id: 'garantie',
    title: 'Limitations et absence de garantie',
    content: (
      <p>
        Reposight est fourni à titre expérimental « en l'état ». Aucune garantie
        de disponibilité, d'exactitude ou de continuité de service n'est
        offerte. L'auteur du projet ne peut être tenu responsable des
        conséquences directes ou indirectes liées à l'utilisation ou à
        l'indisponibilité du service.
      </p>
    ),
  },
  {
    id: 'evolutions',
    title: 'Évolutions du projet',
    content: (
      <p>
        Le service étant en constante expérimentation, son périmètre peut
        évoluer sans préavis. Toute modification substantielle sera signalée
        sur cette page. En cas de désaccord, vous pouvez cesser d'utiliser
        Reposight à tout moment.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <p>
        Pour toute question liée à ces conditions ou au statut du projet, vous
        pouvez écrire à{' '}
        <a
          href="mailto:contact@reposight.com"
          className="text-iris-700 underline underline-offset-2 hover:text-iris-600"
        >
          contact@reposight.com
        </a>
        .
      </p>
    ),
  },
];

export default function CGUPage() {
  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-iris-100 px-4 pb-16 pt-36 sm:px-6 sm:pt-44">
        <div aria-hidden="true" className="bg-dots absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-10 h-[240px] w-[280px] rounded-full bg-iris-300/30 blur-[90px] sm:-right-40 sm:-top-20 sm:h-[420px] sm:w-[700px] sm:bg-iris-300/40 sm:blur-[130px]"
        />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Conditions générales d'utilisation
          </h1>
          <p className="mt-5 text-lg text-ink/60">
            Mises à jour en janvier 2025. Reposight est un projet expérimental
            non commercial.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[15rem_1fr] lg:gap-20 lg:py-20">
        <aside className="hidden lg:block">
          <TableOfContents
            items={SECTIONS.map(({ id, title }) => ({ id, title }))}
          />
        </aside>

        <main className="min-w-0 max-w-[68ch] divide-y divide-iris-100">
          {SECTIONS.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 space-y-4 py-10 text-ink/70 first:pt-0 [&_li]:pl-1 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-iris-400"
            >
              <h2 className="flex items-baseline gap-4 font-display text-2xl font-semibold tracking-tight text-ink">
                <span className="text-iris-600">{String(i + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
