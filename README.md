# BookMyPadel

Comparateur/mise en relation pour stages de padel — **modèle affiliation pur** : BookMyPadel ne
prend aucun paiement en ligne, ne stocke aucune donnée bancaire, et ne s'interpose jamais entre
le joueur et l'organisateur. La plateforme génère des leads qualifiés vers les offres des
organisateurs et facture une commission déclarative sur les réservations qu'ils confirment
eux-mêmes.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — design system en tokens (`tailwind.config.ts`, voir aussi
  `design-system/bookmypadel/MASTER.md` pour le rationale complet : palette, typographie, motion)
- **Framer Motion** — animations (reveal au scroll, hover cartes, wizards animés, sticky search,
  skeleton loaders, micro-feedback favoris)
- **Cloudflare D1** (SQLite managé) — persistance réelle des comptes joueurs, sessions et leads
  (`src/lib/db.ts`). En local, émulé par Miniflare via `wrangler`/`@opennextjs/cloudflare` — aucun
  service externe requis pour développer.
- **Cloudflare R2** — stockage des photos uploadées par les organisateurs (`env.PHOTOS`).
- **`@opennextjs/cloudflare`** — adapte l'app Next.js (App Router, Route Handlers compris) pour
  tourner sur Cloudflare Workers. Voir la section **Déploiement Cloudflare** plus bas.
- **Zustand** (+ `persist`) — favoris/wishlist côté client
- **Recharts** — graphiques (revenus organisateur)
- **lucide-react** — icônes SVG

## Démarrer

```bash
npm install
npm run dev
```

`npm run dev` fonctionne comme avant — `next.config.mjs` appelle `initOpenNextCloudflareForDev()`,
qui proxy D1/R2 localement (via Miniflare) même sans passer par `wrangler`. Les variables d'env
locales vivent dans `.dev.vars` (gitignored, déjà créé avec `ADMIN_ACCESS_CODE=changeme`) plutôt
que `.env.local` — c'est le fichier que Wrangler/OpenNext lisent en dev.

## Le modèle : comment un clic devient un lead

1. Un visiteur consulte librement une fiche stage (`/stages/[slug]`) — photos, description, prix,
   dates, tout est visible sans compte.
2. Il clique sur **« Voir l'offre »**. S'il n'est pas connecté, une modale de création de compte
   (nom + email, aucun mot de passe) s'affiche — `components/auth/signup-modal.tsx`. Une fois
   créé, le compte est mémorisé via un cookie de session httpOnly (`src/lib/session.ts`).
3. Le clic déclenche `POST /api/leads` (`src/app/api/leads/route.ts`) : un lead est **créé et
   loggé en base à cet instant précis** (`user_id`, `stage_id`, `organizer_id`, `created_at`,
   `redirect_url`, token unique) via `src/lib/db.ts`.
4. Le visiteur est redirigé directement vers le lien renseigné par l'organisateur (site, formulaire
   ou WhatsApp — champ `externalUrl` sur `Coach`, voir `src/data/coaches.ts`). Le lien canonique et
   loggable de ce lead, au format demandé `/go/{stage_id}/{user_id}/{token}`, reste résolvable en
   direct via `src/app/go/[stageId]/[userId]/[token]/route.ts` (utile pour retrouver/rejouer un
   lead depuis un dashboard).
5. Dans son espace (`/organisateurs/tableau-de-bord` → onglet **Leads**), l'organisateur voit
   chaque lead reçu et le marque **« Réservation confirmée »** (avec le montant) ou **« Sans
   suite »**. La commission (12%, `COMMISSION_RATE` dans `src/lib/db.ts`) est calculée
   automatiquement sur les montants déclarés confirmés — jamais prélevée automatiquement.
   L'historique est exportable en CSV (`/api/organizer/leads/export`).
6. `/admin` (protégé par `ADMIN_ACCESS_CODE`) donne la vue globale : clics par offre, clics par
   organisateur, taux de déclaration (pour repérer les organisateurs qui ne jouent pas le jeu), et
   le total des commissions à réclamer.

## Upload de photos (formulaire de publication de stage)

`components/organizer/photo-uploader.tsx` — glisser-déposer ou sélection de fichiers (JPG/PNG/
WebP/GIF, 8 Mo max, 8 photos max), aperçu instantané, réorganisation, suppression.

**Compression côté client avant envoi** (`src/lib/image-compress.ts`) : chaque photo (sauf GIF,
pour ne pas casser l'animation) est redimensionnée à 1600px de long côté max et réencodée en WebP
qualité 0.82 via `<canvas>`, dans le navigateur, avant l'upload — mesuré sur une photo de test :
**1009 Ko → 29 Ko (-97%)**, sans perte visible. C'est fait côté client et pas côté serveur car les
Workers Cloudflare n'ont pas de filesystem ni de lib native (`sharp` ne tourne pas dans ce
runtime) ; le navigateur, lui, sait déjà réencoder une image sans dépendance.

Le fichier (compressé) est envoyé à `POST /api/organizer/upload` dès l'ajout, stocké dans le bucket
R2 `env.PHOTOS` sous la clé `stages/<uuid>.<ext>`, et servi via une Route Handler dynamique —
`GET /api/uploads/stages/[filename]` — qui stream l'objet R2 à la demande.

**Piège Next.js découvert en cours de route, qui a motivé ce choix** : au tout début, les photos
étaient écrites sur disque dans `public/uploads/`. En testant `next start` (build de prod), les
fichiers ajoutés *après* `next build` renvoyaient un 404 — le serveur de production sert `public/`
depuis un instantané pris au build, pas depuis le disque en direct (confirmé : même un fichier posé
à la main dans `public/` après coup échouait). Ça aurait de toute façon été incompatible avec
Cloudflare Workers, qui n'ont pas de disque persistant du tout — d'où le passage direct à R2 plutôt
qu'à une solution de contournement locale. **Ne jamais écrire de contenu généré par un utilisateur
dans `public/`** dans ce projet ; toujours passer par une route API (R2 en prod, ou tout autre
stockage) qui sert le contenu à la demande.

## Base de données (`src/lib/db.ts`)

Trois tables D1 (dialecte SQLite), définies dans `migrations/0001_init.sql` :

- `users` — `id, name, email, created_at` (pas de mot de passe : l'auth est un simple
  nom + email, mémorisé par cookie de session)
- `sessions` — `token, user_id, created_at`
- `leads` — `id, token, user_id, stage_id, organizer_id, created_at, redirect_url, status
  (pending/confirmed/declined), booking_amount, commission_amount`

Toutes les fonctions de `db.ts` sont **async** (API D1 : `.prepare(sql).bind(...).first()/.all()/
.run()`, accessible via `getCloudflareContext({ async: true })`) — contrairement à l'ancienne
version basée sur `node:sqlite`, qui était synchrone. `src/lib/leads.ts` enrichit les leads bruts
avec les infos joueur/stage/organisateur pour l'affichage (jointure applicative, pas de FK SQL —
les stages/organisateurs restent des données mock, voir plus bas).

**Point d'attention avant prod** : les Route Handlers Next.js sont statiquement mises en cache par
défaut si rien ne les marque comme dynamiques — un premier bug de ce type (`/api/organizer/leads`
servait indéfiniment une réponse vide capturée au build) a été corrigé en ajoutant
`export const dynamic = "force-dynamic"` sur toutes les routes GET qui lisent la base. À garder en
tête pour toute nouvelle route API lisant `db.ts`.

## Structure

```
wrangler.jsonc                    bindings Cloudflare (D1, R2, assets) — voir Déploiement Cloudflare
open-next.config.ts                config de l'adaptateur OpenNext
cloudflare-env.d.ts                 typage des bindings pour getCloudflareContext().env
migrations/0001_init.sql            schéma D1 (users/sessions/leads)
src/
  app/
    api/auth/{signup,logout}       inscription (nom+email) / déconnexion
    api/leads                      POST — crée un lead au clic sur "Voir l'offre"
    api/organizer/leads[...]        GET/PATCH/export — back-office organisateur
    api/admin/{login,logout}        code d'accès admin
    go/[stageId]/[userId]/[token]   redirection loggable vers l'offre externe
    admin/                          dashboard admin (clics, déclaration, commissions)
    organisateurs/                  landing, tableau de bord (onglet Leads), formulaire de stage
    stages/[slug]                   fiche stage + OfferCTA (mur d'inscription)
    recherche/                      résultats + filtres
    compte/                         espace joueur (démo, données mock)
  components/
    auth/                          AuthProvider (contexte), SignupModal
    admin/                          formulaire de code d'accès
    organizer/                      dashboard, LeadsPanel, formulaire de publication
    stage/                          galerie, OfferCTA, avis, cross-sell, calendrier
    ui/, layout/, search/, booking/(StepIndicator réutilisé par le formulaire organisateur)
  data/                            stages, coachs/organisateurs (mock — voir plus bas)
  lib/
    db.ts                          couche D1 (users/sessions/leads)
    session.ts                     lecture des cookies de session (joueur + admin)
    leads.ts                       enrichissement des leads pour l'affichage
    admin-stats.ts                 agrégats pour /admin
  store/                           favoris (client, zustand+persist)
```

## Déploiement Cloudflare

L'app tourne sur **Cloudflare Workers** via **OpenNext** (`@opennextjs/cloudflare`) — pas
Cloudflare Pages au sens statique : Next.js 14 avec ses Route Handlers, cookies de session et
rendu dynamique par page a besoin d'un vrai runtime serveur, que Workers fournit (contrairement à
un export statique). `@cloudflare/next-on-pages`, l'ancien adaptateur "Pages", est déprécié côté
Cloudflare depuis fin 2025 — c'est pour ça qu'OpenNext a été choisi directement.

### Pourquoi ça ne pouvait pas être une simple config

L'implémentation initiale (avant cette tâche) utilisait `node:sqlite` et des écritures disque
(`fs.writeFile`) pour les comptes, sessions, leads et photos. Les Workers Cloudflare tournent sur
`workerd`, pas Node.js : **pas de filesystem du tout**, et `node:sqlite` n'existe pas même avec le
flag `nodejs_compat`. Comme `src/app/layout.tsx` lit la session sur *chaque* page, tout le site en
dépendait — pas seulement les routes API. Il a donc fallu migrer la persistance vers des services
Cloudflare natifs (D1 pour la base, R2 pour les photos) plutôt que de juste ajouter un fichier de
config : `src/lib/db.ts`, `src/lib/session.ts`, `src/lib/leads.ts`, `src/lib/admin-stats.ts` et les
routes d'upload sont devenus async et utilisent `getCloudflareContext().env`. Aucune route, aucun
composant, aucun comportement visible n'a changé — uniquement l'implémentation du stockage.

### Développer et tester en local (sans compte Cloudflare)

- `npm run dev` : Next.js normal, bindings D1/R2 proxiés localement par Miniflare (aucune action
  requise, ça marche tel quel).
- `npm run cf:preview` : build le Worker (OpenNext) puis le lance en local avec Wrangler/Miniflare
  — c'est la façon la plus fidèle de tester *exactement* ce qui tournera sur Cloudflare, D1 et R2
  compris, sans toucher à un vrai compte. C'est ce qui a été utilisé pour vérifier que le site
  fonctionne à l'identique après la migration (voir plus bas).
- Avant un premier `cf:preview`/`cf:deploy`, appliquer le schéma à la base locale :
  `npm run cf:d1:migrate:local`.

### Déployer pour de vrai (nécessite un compte Cloudflare)

```bash
npx wrangler login                                    # authentification

npx wrangler d1 create bookmypadel-db                 # note le "database_id" affiché…
# … et colle-le dans wrangler.jsonc à la place du placeholder 00000000-0000-0000-0000-000000000000
npm run cf:d1:migrate:remote                          # applique migrations/0001_init.sql en prod

npx wrangler r2 bucket create bookmypadel-photos       # bucket photos

npm run cf:deploy                                      # build + déploie sur Workers
```

`ADMIN_ACCESS_CODE` doit être défini comme secret en prod (il n'est lu depuis `.dev.vars` qu'en
local) : `npx wrangler secret put ADMIN_ACCESS_CODE`.

### Build de production : vérifications faites

- `npm run build` (Next.js seul) : minification JS/CSS et tree-shaking sont le comportement par
  défaut de `next build` en mode production — rien à activer, confirmé propre (compile sans
  erreur, pages statiques/dynamiques correctement séparées).
- `npm run cf:build` (bundle Worker via OpenNext) : build réussi. Un avertissement de l'outil lui
  même signale qu'OpenNext n'est *pas totalement* garanti sur Windows ("could encounter
  unpredictable failures during runtime") — le build et les tests en local ont fonctionné sans
  accroc sur cette machine, mais si un déploiement échoue de façon inattendue depuis Windows,
  tenter depuis WSL est la recommandation officielle d'OpenNext avant de creuser plus loin.
- Taille réelle du bundle déployé, mesurée via `wrangler deploy --dry-run` (le chiffre qui compte
  vraiment pour Cloudflare, pas la taille brute des fichiers sur disque) :
  **4.88 Mo / 1.00 Mo gzippé**. Depuis le 4 septembre 2026, Cloudflare a remplacé l'ancienne limite
  compressée (3 Mo gratuit / 10 Mo payant) par une limite unique de **64 Mio non compressé** sur
  tous les plans — largement sous la limite quel que soit le plan.
- Assets statiques (`.open-next/assets/`, ce que Wrangler appelle "Workers Static Assets", mêmes
  limites que Cloudflare Pages) : **76 fichiers, 1.7 Mo au total**, le plus gros fichier individuel
  fait 394 Ko (un chunk JS). Très loin des limites Cloudflare (20 000 fichiers, 25 Mo par fichier).
  Il n'y a aujourd'hui aucune image bitmap dans le dépôt — `CoverArt` (couvertures de stage) est
  généré en CSS/SVG, pas des fichiers image — donc rien à compresser côté build statique ; le
  vrai poids variable, ce sont les photos uploadées par les organisateurs (voir ci-dessous).
- Rien à nettoyer manuellement dans le bundle déployé : pas de sourcemaps (désactivées par défaut
  en prod par Next), pas de fichiers de test, `.git`/`node_modules`/`.env*` ne sont jamais inclus
  (OpenNext ne bundle que le code applicatif nécessaire à l'exécution).

### Photos uploadées : ce sera à surveiller, pas un problème aujourd'hui

Les photos ne sont plus dans le repo ni dans un dossier servi statiquement (voir section Upload
plus haut) — elles vivent dans le bucket R2 `bookmypadel-photos`, complètement hors des limites de
fichiers/poids du déploiement Workers. R2 n'a pas de limite pratique de nombre d'objets pour ce
cas d'usage. Rien à faire ici ; c'était surtout un risque si les photos avaient été laissées dans
`data/uploads/stages/` ou `public/` comme au tout début — ce n'est plus le cas.

### Vérifié fonctionnellement identique après migration

Parcours complet rejoué sur `npm run cf:preview` (Worker réel + D1/R2 émulés localement) :
inscription (mur d'inscription) → clic « Voir l'offre » → lead écrit en D1 → redirection vers le
lien externe de l'organisateur (site et WhatsApp testés) → lead visible et correctement filtré
dans le tableau de bord organisateur → changement de statut + montant → commission recalculée →
export CSV → dashboard admin (clics, taux de déclaration, commissions) → upload de photo réel
(compressée, stockée dans R2, réaffichée). Rien n'a été modifié en surface : mêmes routes, mêmes
composants, même UI, même comportement — uniquement l'implémentation du stockage a changé.

## État du prototype — à savoir avant production

1. **Stages et organisateurs restent des données mock** (`src/data/stages.ts`,
   `src/data/coaches.ts`) — seuls les comptes joueurs et les leads sont dans une vraie base
   (SQLite locale). Migrer stages/organisateurs vers une vraie base (Postgres/Supabase) reste à
   faire pour un vrai back-office de création de compte organisateur.
2. **Un seul organisateur "démo"** représente le back-office (`DEMO_ORGANIZER_ID = "c1"` dans
   `src/lib/leads.ts`) — il n'y a pas encore d'authentification organisateur distincte de
   l'authentification joueur. À construire avant d'onboarder de vrais organisateurs.
3. **`/admin` est protégé par un simple code partagé**, pas un vrai compte utilisateur — suffisant
   pour un usage interne solo, à remplacer avant de donner l'accès à une équipe.
4. **Photos** : l'upload est réel (voir section dédiée plus haut), mais comme les stages restent
   des données mock (point 1), les photos uploadées via le formulaire de publication ne sont pas
   rattachées à un vrai stage affiché sur le site — seul l'écran de confirmation du formulaire les
   affiche. Les fiches stage existantes (`/stages/[slug]`) utilisent toujours `CoverArt`, un
   système de couvertures génératives (dégradés + motif terrain + icône) déterministe par seed,
   en attendant que les stages soient persistés en base.
5. **La base et le stockage sont maintenant Cloudflare D1/R2** (migration effectuée, voir section
   suivante) — plus de fichier SQLite local ni d'écriture disque, l'app est prête pour un
   déploiement multi-instances sur Workers.
6. Next.js pinné en **14.2.35** (et `@opennextjs/cloudflare` pinné en **1.15.1**, dernière version
   qui supporte encore Next 14 — la 1.16+ exige Next ≥15). Une future montée de version de Next
   devra re-vérifier la compatibilité de l'adaptateur avant de bouger l'un sans l'autre.
