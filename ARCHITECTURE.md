# Architecture

## Principe
`src/js/*.js` sont des fichiers de code assemblés par `build.mjs` dans l'ordre alphabétique en un seul script (portée commune, pas de modules). Les numéros de fichiers donnent l'ordre d'exécution : les données d'abord, la logique ensuite, le rendu et l'interface à la fin. Phase suivante prévue : vrais modules TypeScript.

## Carte des fichiers

| Fichier | Contenu |
|---|---|
| 00_utils | helpers (clamp, iso, angles), dimensions de grille |
| 10_map_helpers | outils de dessin de carte (room, hline, vline, put) |
| 11, 12, 13_floor* | une fonction par étage : la carte en code (`#` mur, `.` sol, `1 2 3` portes niveaux 1 à 3, `U N` escaliers, `V` gaine, `X` ascenseur, `S` coffre, `T` terminal, `c r d p m b x` mobilier) |
| 14_level_data | zones de sol, escaliers, gaines, fumoirs (`SMK`) |
| 15_pathing_vision | A*, ligne de vue, cônes de vision |
| 20_cast_data | personnages (pouvoirs `ACT`, apparences `APP`, départs `makeChars`) et PNJ (`makeEnemies`) |
| 21_texts | tous les textes drôles : dialogues d'intro et de recrutement, bavardages, baratin, pauses clope |
| 22_video_data | trajets du faux trailer |
| 30_state | état de la partie `S` (100 % JSON, sérialisable), terminaux |
| 31_sound | synthèse sonore |
| 32_dialogues | moteur de dialogues avec choix |
| 33_messages, 34_noise | bulles, toasts, bruit (`hear`), pause clope (`breakSmoke`) |
| 35_movement | déplacement, portes, escaliers |
| 36_powers_orders | actions des pouvoirs (`doAction`), arrivée à destination (`arrive`), tâches (`updateBusy`) |
| 37_update_chars | mise à jour des personnages, baratin, élimination |
| 38_enemies_ai | IA des PNJ : patrouille, regarder, poursuite, pause, appel, bug |
| 39_events | événements chronométrés (17h50, 17h55...) |
| 40_logic_loop | boucle logique, victoire, défaite |
| 50 à 54 | rendu : sols pré-rendus, formes, personnages, visibilité, boucle de rendu |
| 60_ui, 61_input | HUD (cartes, boutons, objectifs), souris, tactile, clavier |
| 70_video | vidéo d'introduction |
| 99_main | démarrage |

## Recettes

**Ajouter un texte drôle** : `21_texts.js` (listes `BAR`, `CHAT`, `BRK_SAY`, `RECRUIT`, `introSteps`).

**Ajouter un PNJ** : une ligne dans `makeEnemies` (20_cast_data) : `E(id, nom, type, étage, x, y, {fov, range, sp, route:[{x,y,wait,face}], scan:{base,amp,period}})`. Types connus : vigile, manager, beaugosse, drh, assistante, dg, employe, camera. Un nouveau type demande une apparence dans `APP`, un rôle dans `ROLE` et des répliques dans `CHAT`.

**Ajouter un pouvoir** : 1) une entrée dans `ACT` (20_cast_data) avec `mode` (`auto`, `tile`, `enemy`, `hack`) ; 2) un `else if(k==='...')` dans `doAction` (36) ; 3) l'effet de fin de tâche dans `updateBusy` si le pouvoir dure ; 4) un scénario de test.

**Ajouter un étage** : une fonction `buildFloorN` (fichier 1x), l'ajouter à `buildMaps` (14), zones `ZN`, escaliers `STAIRS`, `MAP`/`FLOORC` (boucles `for f<3` à passer à N+1 : chercher `f<3`).

**Modifier un réglage** : portées, durées et vitesses sont dans les données de PNJ et dans `doAction`. Le tableau des valeurs est dans `docs/GAME_DESIGN.md`.

## Tests
`tests/lib.py` lance Chrome, charge `dist/index.html#novid` et fait avancer le temps par pas de 0,05 s (`g.run(secs)`). Les crochets `window.__G` (fin de `99_main`) donnent accès à l'état et aux actions. Chaque fichier de `tests/scenarios/` expose `main()` et doit lever une assertion en cas d'échec. Un scénario par énigme, plus la chaîne complète (gardes rendus aveugles : elle teste les règles, pas la furtivité).
