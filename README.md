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

## Authentification et rôles

Trois rôles, stockés dans `users.role` (`player` / `organizer` / `admin`) : un compte joueur et un
compte organisateur sont deux comptes distincts (même email possible sur les deux, jamais le même
compte). Mots de passe hashés en PBKDF2/SHA-256 via Web Crypto (`src/lib/password.ts`,
100 000 itérations, sel aléatoire par compte) — pas bcrypt, qui a besoin d'un binding natif
indisponible sur les Workers Cloudflare (`workerd` n'a pas de filesystem ni d'addons natifs).

- **`/connexion`** (joueur) et **`/organisateurs/connexion`** — pages de connexion/inscription,
  chacune restreinte à son rôle (`components/auth/auth-form.tsx`). La modale rapide sur la fiche
  stage (`components/auth/signup-modal.tsx`, déclenchée par « Voir l'offre ») crée aussi un compte
  joueur avec mot de passe — c'est le même `/api/auth/signup`, juste une UI plus courte pour ne pas
  casser le tunnel de conversion lead.
- **`src/middleware.ts`** intercepte `/compte/*`, `/organisateurs/tableau-de-bord` et
  `/organisateurs/nouveau-stage` : redirige vers la page de connexion adaptée (avec `?next=`) si
  aucun cookie de session n'est présent. C'est une garde rapide côté edge (pas d'accès D1 en
  middleware) — chaque page fait ensuite sa propre vérification complète (session + rôle) côté
  serveur, comme `/admin` le faisait déjà avec `isAdmin()`. Les 4 routes API organisateur
  (`/api/organizer/leads*`, `/api/organizer/upload`) vérifient aussi la session server-side
  maintenant — avant, elles étaient appelables directement sans aucune authentification.
- **`/admin` reste protégé par le code partagé `ADMIN_ACCESS_CODE`**, pas par le système de rôles —
  décision volontaire : il n'existe aucun moyen de créer un compte `role = "admin"` via l'UI (le
  signup public n'accepte que `player`/`organizer`), donc coupler `/admin` au rôle aurait demandé de
  construire une vraie gestion de comptes admin, hors périmètre de cette tâche. Un compte
  organisateur ne peut de toute façon pas atteindre `/admin` : le cookie admin est totalement
  indépendant de la session joueur/organisateur. À revoir si plusieurs personnes doivent un jour
  avoir un accès admin distinct.
- Après la migration `0001`, appliquer aussi **`migrations/0002_auth.sql`** (ajoute
  `password_hash` et `role` à `users`) — `npm run cf:d1:migrate:local` en dev,
  `npm run cf:d1:migrate:remote` avant tout déploiement.

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
   suite »**. La commission (5%, `COMMISSION_RATE` dans `src/lib/db.ts`) est calculée
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

Cinq tables D1 (dialecte SQLite), une migration par étape du développement — toujours les
appliquer dans l'ordre (`npm run cf:d1:migrate:local` les applique toutes d'un coup, seules les
migrations pas encore appliquées sont rejouées) :

- `migrations/0001_init.sql` — `users` (`id, name, email, created_at`), `sessions`
  (`token, user_id, created_at`), `leads` (`id, token, user_id, stage_id, organizer_id, created_at,
  redirect_url, status [pending/confirmed/declined], booking_amount, commission_amount`)
- `migrations/0002_auth.sql` — ajoute `password_hash`, `role` (`player`/`organizer`/`admin`) sur
  `users` (voir **Authentification et rôles**)
- `migrations/0003_stages.sql` — table `stages` (voir section **Stages** plus bas)
- `migrations/0004_seed_demo_stages.sql` — insère les 14 stages de démo dans `stages`
- `migrations/0005_boosts.sql` — table `boosts` (voir section **Mise en avant (boosts)** plus bas)

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
    organisateurs/                  landing, tableau de bord (onglet Leads), formulaire de stage (écrit en base)
    stages/[slug]                   fiche stage + OfferCTA (mur d'inscription)
    recherche/                      résultats + filtres
    compte/                         espace joueur (démo, données mock)
  components/
    auth/                          AuthProvider (contexte), SignupModal
    admin/                          formulaire de code d'accès
    organizer/                      dashboard, LeadsPanel, formulaire de publication
    stage/                          galerie, OfferCTA, avis, cross-sell, calendrier
    ui/, layout/, search/, booking/(StepIndicator réutilisé par le formulaire organisateur)
  data/                            coachs mock (profils des 14 stages de démo) + seed stages
  lib/
    db.ts                          couche D1 (users/sessions/leads/stages)
    stages.ts                      enrichissement des stages pour l'affichage (voir section Stages)
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

## Stages : table D1 réelle (`migrations/0003_stages.sql`)

Historique du bug corrigé : le formulaire `/organisateurs/nouveau-stage`
(`components/organizer/stage-form-wizard.tsx`) ne faisait **aucun appel réseau** à l'étape
« Publier le stage » — l'écran de confirmation était un faux positif purement visuel. Même en
corrigeant ça, il n'existait aucune table `stages` en base, et les pages de lecture (accueil,
`/recherche`, `/stages/[slug]`) lisaient toutes `src/data/stages.ts`, un tableau statique — les
trois causes cumulées expliquaient qu'un stage créé n'apparaissait jamais nulle part.

- **`src/lib/db.ts`** expose le CRUD (`createStage`, `listStages`, `getStageBySlugDb`,
  `getStageByIdDb`, `stageSlugExists`) sur une table volontairement lean : seuls les champs
  réellement saisis dans le formulaire sont stockés (titre, ville, niveau, dates, places, prix,
  hébergement, lien de contact, photos en JSON). `POST /api/organizer/stages` (nouvelle route,
  protégée comme les autres routes organisateur) écrit désormais pour de vrai à la publication.
- **`src/lib/stages.ts`** fait l'enrichissement pour reconstituer le type `Stage` complet attendu
  par les composants existants (`StageCard`, `Gallery`, `ReviewsSection`…) : programme, amenities
  et avis restent **dérivés à la lecture** par des formules déterministes basées sur `id` (même
  logique que l'ancien mock, juste appliquée à la volée plutôt que pré-calculée) — pas besoin de
  les stocker. Le profil "coach" affiché est soit un des 6 coachs mock (`src/data/coaches.ts`, pour
  les 14 stages de démo, voir plus bas) soit un profil minimal dérivé du vrai compte organisateur
  (`users.name`, sans club/bio/certification puisque ces champs n'existent pas encore côté compte
  organisateur réel).
- **Les 14 stages qui existaient dans `src/data/stages.ts`** sont désormais des lignes en base
  (`migrations/0004_seed_demo_stages.sql`, générée depuis ce fichier pour garantir la fidélité),
  pas du code en dur — `src/data/stages.ts` n'est plus lu par aucune page à l'exécution, il ne sert
  plus que de source pour ce seed et reste consultable pour référence.
- **`/stages/[slug]` était statique (`generateStaticParams`, SSG au build)** — un piège similaire à
  celui déjà documenté pour les Route Handlers : un stage créé après le build aurait renvoyé 404
  indéfiniment. Passé en `dynamic = "force-dynamic"`, rendu à la demande à chaque requête.
- **Effet de bord corrigé en même temps** : `/api/organizer/leads*` utilisait un
  `DEMO_ORGANIZER_ID` (`"c1"`) en dur pour filtrer les leads, plutôt que l'id du compte organisateur
  connecté. Sans ce correctif, un organisateur qui crée un stage aurait généré de vrais leads
  jamais visibles dans son propre tableau de bord (deuxième bug caché juste derrière le premier).
  Ces routes utilisent maintenant `user.id` (la session réelle) ; `src/lib/leads.ts` et
  `src/lib/admin-stats.ts` résolvent le titre du stage et le nom de l'organisateur depuis la vraie
  base plutôt que depuis les tableaux mock.
- **Testé de bout en bout** via `cf:preview` : création d'un stage par un compte organisateur réel →
  visible immédiatement sur `/stages/[slug]`, `/recherche` et l'accueil (sans rebuild) → clic
  « Voir l'offre » par un joueur → lead créé avec le bon `redirectUrl` (le lien du formulaire, pas
  un coach mock) → visible dans le tableau de bord *de cet organisateur* → visible dans `/admin`.
- **Photos réelles affichées** (corrigé après coup, voir commit dédié) : `CoverArt`
  (`components/ui/cover-art.tsx`) accepte maintenant un `photoUrl` optionnel — s'il est fourni, un
  vrai `<Image>` (`unoptimized`, les URLs d'upload `/api/uploads/stages/...` sont same-origin) prend
  la place du dégradé généré. `StageCard` passe `stage.photos[0]`, et `Gallery`
  (`components/stage/gallery.tsx`, prop renommée `images: {seed, url?}[]`) construit ses vignettes à
  partir des vraies photos quand elles existent, sinon retombe sur `gallerySeeds` comme avant.
  `Stage.photos` (JSON parsé depuis `stages.photos`) a été ajouté au type et à `enrichStage()` pour
  ça. Les stages de démo (sans photo uploadée) continuent d'utiliser le dégradé généré comme avant —
  rien n'a changé pour eux. Les dropdowns de villes (`components/search/filters.tsx`,
  `search-bar.tsx`) listent encore uniquement les villes des 14 stages de démo (`@/data/stages`'s
  `cities`), pas les nouvelles villes ajoutées par des organisateurs — cosmétique, n'affecte pas les
  résultats de recherche eux-mêmes.

## Mise en avant (boosts) — `migrations/0005_boosts.sql`

Remplace l'ancienne carte "Mise en avant (boost) — +29€/stage/semaine" de `/organisateurs/tarifs`,
qui affichait un prix sans qu'aucune fonctionnalité réelle n'existe derrière (reliquat du prototype
initial). Le système réel :

- **`src/lib/config.ts`** centralise `BOOST_CONFIG` (`PRICE_EUR: 29.99`, `DURATION_DAYS: 7`,
  `MAX_ACTIVE_SLOTS: 8`) — toute la logique et tout l'affichage (page tarifs, page d'achat) lisent
  cette constante, jamais une valeur en dur.
- **`src/lib/db.ts`** (section boosts) + **`src/lib/boosts.ts`** : comptage des slots actifs,
  vérification qu'un stage n'a pas déjà un boost actif, historique par organisateur, jointure
  `stages`/`boosts` pour la page d'accueil. **Piège évité** : SQLite `datetime('now')` et nos
  colonnes ISO (`toISOString()`) ont des séparateurs différents (`" "` vs `"T"`) — les comparer
  comme chaînes aurait classé un boost déjà expiré comme "encore actif" tant qu'on reste dans la
  même journée calendaire. Toutes les comparaisons de date utilisent
  `strftime('%Y-%m-%dT%H:%M:%fZ','now')` pour rester dans le même format que les colonnes stockées.
- **Paiement Stripe (mode paiement direct, pas Stripe Connect)** :
  `POST /api/organizer/boost/checkout` crée une ligne `boosts` en statut `pending` (places/`stage`
  déjà validés) puis une Stripe Checkout Session ; `POST /api/webhooks/stripe` vérifie la signature
  et passe le boost en `paid` (avec `started_at`/`expires_at` calculés à la confirmation, pas à la
  création — un paiement qui traîne quelques heures ne doit pas amputer la durée du boost) **une
  fois seulement le paiement confirmé, jamais avant**. `src/lib/stripe.ts` utilise le client HTTP
  basé sur `fetch` de Stripe (`Stripe.createFetchHttpClient()`) et `constructEventAsync` pour la
  vérification de signature côté webhook — le client par défaut de `stripe-node` et sa vérification
  de signature synchrone dépendent de `node:http`/crypto Node, indisponibles sur le runtime Workers
  même avec `nodejs_compat`.
- **Aucune clé Stripe n'a été configurée dans cette session** (pas de compte Stripe côté client au
  moment du développement) — `getStripeClient()` retourne `null` si `STRIPE_SECRET_KEY` est absent,
  et la route de paiement répond alors un 503 propre ("paiement non configuré") plutôt que de
  planter ou de laisser passer un faux paiement. **À faire avant d'utiliser le système pour de
  vrai** : créer un compte Stripe, `wrangler secret put STRIPE_SECRET_KEY` et
  `wrangler secret put STRIPE_WEBHOOK_SECRET` en prod (ajouter les mêmes clés en test dans
  `.dev.vars`, gitignored, pour le dev local), déclarer un endpoint webhook dans le dashboard
  Stripe pointant vers `https://<domaine>/api/webhooks/stripe` pour l'événement
  `checkout.session.completed`, et copier son "Signing secret" dans `STRIPE_WEBHOOK_SECRET`.
- **Toute la logique métier (slots, historique, badge "À la une", isolation par organisateur) a été
  testée de bout en bout sans Stripe**, en insérant directement des lignes `payment_status='paid'`
  en base D1 locale (comme suggéré) : comptage des slots restants en temps réel sur
  `/organisateurs/tarifs` et la page d'achat, blocage propre au 9ᵉ boost avec message clair, badge
  "Boosté" + historique dans le tableau de bord (vérifié dans un vrai navigateur — ces onglets sont
  pilotés par un state client, invisibles dans le HTML statique), boost expiré correctement exclu du
  comptage et de l'affichage sans aucune action manuelle.
- **Section "À la une" de l'accueil** (`src/app/page.tsx`) : priorité aux vrais boosts actifs
  (`getBoostedStages()`) ; si aucun boost actif n'existe, repli sur les stages au flag éditorial
  `featured` (choix explicite du client) pour ne jamais avoir une section vide sur un déploiement
  neuf. Un stage réellement boosté a son `featured` forcé à `true` en mémoire au moment de
  l'enrichissement (`getBoostedStages()`), pour que le badge "À la une" existant sur `StageCard` et
  la fiche stage s'affiche sans avoir dû modifier ces composants.
- **Tableau de bord organisateur** : bouton "Booster" visible uniquement sur un stage sans boost
  actif (`Mes stages` + `Statistiques`), badge "Boosté" sinon, historique des mises en avant (date,
  montant, statut) sous le tableau "Mes stages".

## État du prototype — à savoir avant production

1. **Les stages sont réels (D1)**, mais les organisateurs n'ont toujours pas de vrai profil
   (club, bio, certification, avis) au-delà de `users.name` — voir section **Stages** ci-dessus.
   Migrer ça vers un vrai profil organisateur en base serait la suite naturelle.
2. **Multi-tenant partiel** : chaque compte `role = "organizer"` a désormais ses propres stages et
   ses propres leads (corrigé, voir section **Stages**) — ce qui manque encore est un vrai profil
   public (page "à propos de l'organisateur", avis agrégés, etc.).
3. **`/admin` est protégé par un simple code partagé**, pas un vrai compte utilisateur — suffisant
   pour un usage interne solo (voir justification dans **Authentification et rôles**), à remplacer
   par une vraie gestion de comptes admin avant de donner l'accès à une équipe.
4. **Photos** : l'upload est réel et rattaché au bon stage en base, mais pas encore affiché comme
   vraie image nulle part sur le site (voir dernier point de la section **Stages**).
5. **La base et le stockage sont maintenant Cloudflare D1/R2** (migration effectuée, voir section
   suivante) — plus de fichier SQLite local ni d'écriture disque, l'app est prête pour un
   déploiement multi-instances sur Workers.
6. Next.js pinné en **14.2.35** (et `@opennextjs/cloudflare` pinné en **1.15.1**, dernière version
   qui supporte encore Next 14 — la 1.16+ exige Next ≥15). Une future montée de version de Next
   devra re-vérifier la compatibilité de l'adaptateur avant de bouger l'un sans l'autre.
