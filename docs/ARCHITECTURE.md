# Architecture

## Principe
Le jeu est écrit en TypeScript, en vrais modules ES (`src/game/*.ts`), construits par Vite. `src/main.ts` charge le style puis `game/boot.ts`, qui lance la boucle.
- **Types du modèle** : `game/types.ts` (Character, Enemy, GameState, Store). Les champs ajoutés par les mécaniques passent par un index souple, à resserrer au fil du temps.
- **Variables partagées** (vue courante, pause, zoom, état `S`...) : objet `ST` du module `store.ts`, par exemple `ST.view`, `ST.S`.
- **Vérifications** : `npm run typecheck`, puis `npm run build` et `npm test`.

## Carte des fichiers

| Fichier | Contenu |
|---|---|
| utils | helpers (clamp, iso, angles), dimensions de grille |
| mapHelpers | outils de dessin de carte (room, hline, vline, put) |
| floorRdc, floor1, floor2 | une fonction par étage : la carte en code (`#` mur, `.` sol, `1 2 3` portes niveaux 1 à 3, `U N` escaliers, `V` gaine, `X` ascenseur, `S` coffre, `T` terminal, `c r d p m b x` mobilier) |
| levelData | zones de sol, escaliers, gaines, fumoirs (`SMK`) |
| pathing | A*, ligne de vue, cônes de vision |
| castData | personnages (pouvoirs `ACT`, apparences `APP`, départs `makeChars`) et PNJ (`makeEnemies`) |
| texts | tous les textes drôles : dialogues d'intro et de recrutement, bavardages, baratin, pauses clope |
| video | trajets du faux trailer |
| state | état de la partie `S` (100 % JSON, sérialisable), terminaux |
| sound | synthèse sonore |
| dialogues | moteur de dialogues avec choix |
| messages, noise | bulles, toasts, bruit (`hear`), pause clope (`breakSmoke`) |
| movement | déplacement, portes, escaliers |
| powers | actions des pouvoirs (`doAction`), arrivée à destination (`arrive`), tâches (`updateBusy`) |
| updateChars | mise à jour des personnages, baratin, élimination |
| enemiesAi | IA des PNJ : patrouille, regarder, poursuite, pause, appel, bug |
| events | événements chronométrés (17h50, 17h55...) |
| logicLoop | boucle logique, victoire, défaite |
| 50 à 54 | rendu : sols pré-rendus, formes, personnages, visibilité, boucle de rendu |
| ui, input | HUD (cartes, boutons, objectifs), souris, tactile, clavier |
| video | vidéo d'introduction |
| boot | démarrage |

## Recettes

**Ajouter un texte drôle** : `game/texts.ts` (listes `BAR`, `CHAT`, `BRK_SAY`, `RECRUIT`, `introSteps`).

**Ajouter un PNJ** : une ligne dans `makeEnemies` (castData.ts) : `E(id, nom, type, étage, x, y, {fov, range, sp, route:[{x,y,wait,face}], scan:{base,amp,period}})`. Types connus : vigile, manager, beaugosse, drh, assistante, dg, employe, camera. Un nouveau type demande une apparence dans `APP`, un rôle dans `ROLE` et des répliques dans `CHAT`.

**Ajouter un pouvoir** : 1) une entrée dans `ACT` (castData.ts) avec `mode` (`auto`, `tile`, `enemy`, `hack`) ; 2) un `else if(k==='...')` dans `doAction` (36) ; 3) l'effet de fin de tâche dans `updateBusy` si le pouvoir dure ; 4) un scénario de test.

**Ajouter un étage** : une fonction `buildFloorN` (fichier 1x), l'ajouter à `buildMaps` (14), zones `ZN`, escaliers `STAIRS`, `MAP`/`FLOORC` (boucles `for f<3` à passer à N+1 : chercher `f<3`).

**Modifier un réglage** : portées, durées et vitesses sont dans les données de PNJ et dans `doAction`. Le tableau des valeurs est dans `docs/GAME_DESIGN.md`.

## Tests
`tests/lib.py` lance Chrome, sert `dist/` en local et charge la page avec `#novid` et fait avancer le temps par pas de 0,05 s (`g.run(secs)`). Les crochets `window.__G` (fin de `99_main`) donnent accès à l'état et aux actions. Chaque fichier de `tests/scenarios/` expose `main()` et doit lever une assertion en cas d'échec. Un scénario par énigme, plus la chaîne complète (gardes rendus aveugles : elle teste les règles, pas la furtivité).
