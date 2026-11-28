# PLAN SOCIAL : maintien en condition opérationnelle et mode opératoire des sources

Ce document explique comment faire vivre l'outil : où sont les sources, comment modifier, tester et publier, comment paramétrer le jeu, et comment travailler avec l'assistance de Claude. Il se lit avec `ARCHITECTURE.md` (carte du code) et `GAME_DESIGN.md` (règles et backlog).

## 1. Vue d'ensemble

| Élément | Valeur |
|---|---|
| Dépôt | https://github.com/lebenoarali1/pse-thegame (branche unique `main`) |
| Site en ligne | https://lebenoarali1.github.io/pse-thegame/ |
| Technologie | TypeScript strict, modules ES, Vite, canvas 2D, aucune dépendance d'exécution |
| Déploiement | GitHub Actions (`.github/workflows/pages.yml`) à chaque push sur `main` |
| Tests | 25 scénarios Python et Playwright pilotant Chrome, temps simulé |
| Documentation en ligne | https://lebenoarali1.github.io/pse-thegame/docs/ (générée depuis les fichiers Markdown à chaque build) |
| Page de partage | page Claude publiée en parallèle (lien direct pour les testeurs) |

Ce qui est versionné : `src/`, `tests/`, `docs/`, `public/`, `index.html`, config Vite et TypeScript, workflow. Ce qui ne l'est pas : `dist/` (généré), `node_modules/`, `tests/out/`.

## 2. Poste de travail

Prérequis à installer une fois :
- Node.js LTS et Git
- VS Code
- Python 3 (case « Add python.exe to PATH ») puis `python -m pip install playwright`
- Google Chrome (les tests le pilotent)

Sous Windows PowerShell, si `npm` est bloqué : `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. La commande Python s'appelle `python` (pas `python3`).

Cloner : VS Code, **Git: Clone**, adresse du dépôt. Puis `npm install`.

## 3. Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | jeu sur localhost, rechargement automatique |
| `npm run typecheck` | vérifie les types (mode strict) |
| `npm run lint` | ESLint : `any` interdit, erreurs de style bloquantes |
| `npm run build` | construit `dist/` |
| `python tests/run_all.py` | lance les 25 scénarios (après un build) |
| `python tests/run_all.py chaine` | un seul scénario (filtre sur le nom) |

Adresse de debug : ajouter `#novid` pour sauter la vidéo d'intro. En jeu : bouton 🐞 ou touche D (timers), bouton ∞ (temps illimité), bouton 📋 (export ou import de l'état exact de la partie).

## 4. Cycle de modification

1. `git pull` pour récupérer la dernière version.
2. Modifier dans `src/game/`.
3. `npm run typecheck`, `npm run lint`, `npm run build`, puis les tests.
4. Mettre à jour `CHANGELOG.md` (nouvelle ligne de version) et, si une règle change, `docs/GAME_DESIGN.md`.
5. Commit puis push (`git add -A`, `git commit -m "..."`, `git push`). Messages courts, au présent.
6. Vérifier dans l'onglet **Actions** de GitHub : coche verte en 30 secondes environ, puis `Ctrl+F5` sur le site.

Règles :
- Pas de commit direct de `dist/`. Pas de secret dans le dépôt.
- Une modification de règle de jeu s'accompagne d'un scénario de test (nouveau ou adapté).
- Tous les tests doivent passer avant le push. Un test qui échoue après une modification est la première chose à lire, pas à désactiver.

## 5. Paramétrage : où régler quoi

| Réglage | Emplacement | Valeur actuelle |
|---|---|---|
| Durée de la partie (secondes de jeu) | `game/state.ts`, constante `TL` | 600 (affichée comme 15 minutes) |
| Événements chronométrés | `game/events.ts` | DG quitte son bureau à `TL*2/3`, dernière minute à `TL*11/12` |
| Départ, pouvoirs, apparence des personnages | `game/castData.ts` (`ACT`, `APP`, `makeChars`) | |
| PNJ : position, ronde, vision | `game/castData.ts` (`makeEnemies`) : `fov` (degrés), `range` (cases), `sp` (vitesse), `route` | |
| Personnel calme (salariés, support) | `castData.ts`, drapeaux `calm`, `tech` | support (`tech`) cafte, salariés non |
| Durée de KO | `game/state.ts` (`koDur`) et `game/powers.ts` | 50 s |
| Recharges et durées des pouvoirs | `game/powers.ts` (`c.cd.*`, durées `startBusy`) | clope 40 s, flux 26 s, flaque 20 s |
| Pause café, gobelet, SMS | `game/noise.ts` | clope 60 s, nettoyage 10 s, SMS 45 s |
| Menu de piratage (actions, durées) | `game/pcMenu.ts` (`PCACT`, `PCACT.t`) | 4 à 10 s, recharge 45 s par action |
| Cartes des étages | `game/floorRdc.ts`, `floor1.ts`, `floor2.ts` | grille 24 x 14, légende dans `ARCHITECTURE.md` |
| Textes drôles et dialogues | `game/texts.ts` | |
| Zones de sol, escaliers, fumoirs, café | `game/levelData.ts` | |

Après toute modification de paramètre : build, tests, et une partie à la main. Les scénarios testent les règles avec des gardes aveugles, pas la furtivité réelle.

## 6. Mode opératoire du codage assisté par Claude

Principe : Claude écrit, teste et pousse ; la personne qui maintient décide, relit et valide en jeu.

**Prérequis**
- Le connecteur GitHub est relié dans claude.ai et l'application Claude est installée sur le dépôt (droit d'écriture).
- La conversation a accès au dépôt (Claude le clone dans son espace de travail).

**Déroulé d'une demande**
1. **Décrire le besoin** en une ou deux phrases, avec le comportement attendu en jeu et, si possible, le personnage ou l'étage concerné. Exemple : « Les imprimantes attirent le personnel de l'étage pendant 20 s ».
2. **Claude analyse** le code concerné, propose si besoin des choix (une question à la fois), puis modifie `src/game/`.
3. **Claude vérifie** : `npm run typecheck`, `npm run build`, les 25 scénarios, plus un scénario ajouté pour la nouveauté.
4. **Claude livre** : met à jour `CHANGELOG.md`, commit, push sur `main`, publie la page Claude si demandé, et résume en quelques lignes ce qui change et les choix d'interprétation.
5. **La personne valide** : onglet Actions vert, essai du jeu en ligne, puis retour (« ça ne marche pas, voici ce que je vois »).

**Bonnes pratiques de demande**
- Un lot cohérent par message plutôt qu'un fil d'idées sans lien.
- Donner le symptôme observé et l'heure de jeu ou l'étage, ou joindre l'export d'état (bouton 📋) pour rejouer la situation exacte.
- Demander explicitement « avec un test » pour une règle nouvelle.
- Pour un réglage pur (durée, portée), indiquer l'ancienne et la nouvelle valeur souhaitée.

**Garde-fous**
- Claude ne commite pas `dist/` ni de secret, et ne pousse qu'après des tests verts.
- Quand la personne modifie le code de son côté : push, puis dire « j'ai poussé ». Claude fait un `git pull` avant de continuer, pour ne pas écraser le travail.
- Les décisions de conception restent humaines : le backlog de `GAME_DESIGN.md` est la référence.

## 7. Procédures courantes

**Ajouter un PNJ, un pouvoir, un étage, un texte** : voir les recettes de `ARCHITECTURE.md`.

**Revenir en arrière** : repérer le bon commit dans l'historique GitHub, puis `git revert <commit>` et push. Le site se redéploie tout seul.

**Un déploiement est rouge** : Actions, clic sur la ligne rouge, lire l'étape en erreur (le plus souvent `npm run build` : erreur de type ou de syntaxe). Corriger en local, retester, pousser.

**Le site en ligne plante alors que localhost marche** : vérifier **Settings > Pages > Source : GitHub Actions**, puis relancer le workflow (Run workflow) et faire `Ctrl+F5`.

**Un test échoue après un changement de règle** : si le comportement a volontairement changé, adapter le scénario (durées, états attendus) ; sinon, c'est une régression à corriger dans le code.

**Conflit Git** : ne pas écraser. `git pull`, résoudre les marqueurs dans VS Code, commit, push.

## 8. Checklist de livraison

- [ ] `npm run typecheck` et `npm run lint` sans erreur
- [ ] `npm run build` réussi
- [ ] 14 scénarios et plus au vert
- [ ] `CHANGELOG.md` mis à jour (et `GAME_DESIGN.md` si une règle change)
- [ ] Push sur `main`, déploiement vert dans Actions
- [ ] Essai rapide sur le site (vidéo, menu, première minute de jeu)

## 9. Dette et évolutions connues

- Typage : mode strict actif et zéro `any` explicite dans src ; tout nouveau champ dynamique doit être déclaré dans `types.ts` (pas d'index signature). Un `any` ajouté est une régression à refuser en revue
- Tests : ils dépendent de Python et Playwright ; un portage en TypeScript permettrait un simple `npm test`.
- Furtivité de bout en bout non démontrée sans debug : à valider en jeu (voir le backlog).

## 10. Intégration continue et sauvegarde

- Le workflow `.github/workflows/pages.yml` exécute typecheck, lint, build puis les 25 scénarios (Chrome présent sur l'image GitHub) ; le déploiement n'a lieu que si tout passe
- En cas d'échec, ouvrir l'onglet Actions du dépôt, lire l'étape en rouge ; un échec de scénario affiche le message d'assertion
- Format de sauvegarde : `SAVE_FORMAT` dans `src/game/persist.ts` ; l'incrémenter à chaque changement incompatible de `GameState` (les anciennes sauvegardes sont alors ignorées sans erreur)
- La version affichée vient de `package.json` (champ `version`) ; la mettre à jour avec le changelog
- Astuces de premier usage : textes dans `HINTS` (`src/game/texts.ts`), clé = id de pouvoir ; l'état « vu » est dans le stockage du navigateur (`persist.ts`)
