# PLAN SOCIAL : conception

## Pitch
17h45, vendredi. À 18h, une réunion annonce un plan social. Quatre collègues sont sur la liste. Dans le coffre du DG (étage 2), de quoi faire levier : il faut récupérer la clé et sortir tous ensemble par l'ascenseur de service du rez-de-chaussée avant 18h (limite : 360 s de jeu). Ton : humour acerbe, esprit bureau.

## Personnages (ids internes entre parenthèses)

| Perso | Rôle | Pouvoir 1 | Pouvoir 2 | Faiblesse |
|---|---|---|---|---|
| Kévin (`kevin`) | Stagiaire, âge inconnu (7 à 77) | Gaine d'aération (étage 2) | Lancer d'objets : 5 gobelets, portée 9,5, bruit 7 | Repéré = éliminé tout de suite (détection x2,2) |
| Nadia (`nadege`) | Technicienne SI, geek lubrique | Pirater : portes bleues (4 s, ouvertes 30 s), serveur (code 10 s, caméras 6 s pour 70 s), PC du support (5 s, à 8 cases) | Pause clope : les vigiles du RDC vont au fumoir 60 s, vue réduite à 2,3 cases, recharge 90 s | Lente (1,8), piratage ralenti x0,35 sous le regard d'un beau gosse |
| Djibril (`marc`) | Commercial | Déguisement : prend la tenue d'un corps assommé (manager ou vigile) | Baratin : déguisé, appelle un PNJ en vue (11 cases) et le retient aussi longtemps qu'on veut | Ne court jamais (déguisement perdu), DRH et DG pas dupes |
| Max (`jordan`) | Agent d'entretien, jeune et perdu | Assommer un garde (0,7 s) | Planquer le corps dans le chariot | Invisible aux étages 0 et 1 seulement ; s'arrête devant machine à café et canapé |

Ordre de découverte : Kévin et Nadia au RDC (dialogue d'intro, choix d'âge), Djibril pleure en salle de réunion (étage 1, est), Max aux toilettes (étage 1, ouest).

## Règles clés
- Détection : un PNJ remplit une jauge quand il voit un perso dans son cône (plus vite en courant, de près). Jauge pleine = poursuite. Capturé = ce perso est éliminé, la partie continue avec les autres.
- Kévin repéré avant d'avoir la clé : défaite (lui seul passe par la gaine).
- Un corps assommé découvert : défaite. Il faut le planquer (Max).
- Déguisé, un perso n'est pas détecté au-delà de 2 cases (sauf DRH, DG).
- Victoire : clé obtenue, tous les survivants autour de l'ascenseur (RDC, 21,5 / 12,5).
- Défaite : 480 s de jeu écoulées, corps trouvé, équipe décimée.
- Aucun brouillard : tous les PNJ sont visibles.

## Étages et énigmes

**RDC** : hall avec Roger (scan lent) et Dédé (patrouille est). Portillon bleu en (17,5). Solution : bord sud hors portée de Roger, Nadia envoie les vigiles au fumoir (coin nord-ouest du hall), pirate le portillon depuis (16,5 / 8,5), tous montent par l'escalier en (19,1).

**Étage 1** : arrivée à l'est. Salle de réunion (Djibril) au sud-est. Open space central avec Manon et Patrick (managers mobiles) et Gaëtan au support (PC en (12,5), cône large sur l'allée). Toilettes au sud-ouest (Max), gardées par Dylan en circuit court. Serveur au nord-ouest (code du coffre, caméras). Solutions :
- Gaëtan : Nadia déclenche un bug sur son PC (aveugle 35 s).
- Dylan : Kévin lance un gobelet près de la plante (11,11), Dylan va regarder 16 s, la porte des toilettes est libre.
- Managers : Djibril déguisé en appelle un et le retient ; Max assomme l'autre pour fournir le costume. Pause café des managers à 17h50 (120 s) au nord-est.
- Porte rouge niveau 2 en (21,7), escalier montant en (22,7) : Djibril déguisé ouvre, les autres collent derrière.

**Étage 2** : couloir, DRH en ronde, Brigitte à l'accueil, deux caméras, bureau du DG (porte niveau 3). Le DG quitte son bureau à 17h55 (240 s). Kévin prend la gaine (16,8) vers le bureau (16,2), ouvre le coffre (22,1) avec le code, revient par la gaine.

## Événements chronométrés
320 s : le DG quitte son bureau. 440 s : dernière minute (la durée totale `TL` vaut 480 s).

## État de validation
- Chaîne complète de mécaniques jusqu'à la victoire : testée automatiquement (gardes aveugles).
- Solvabilité en furtivité totale sans debug : non démontrée, à confirmer en jeu. Risque principal : le temps (480 s) pour un premier essai.

## Backlog (à prioriser)
1. Valider la furtivité de bout en bout et régler la difficulté (temps, portées, durées).
2. Tutoriel intégré (premières minutes guidées).
3. Étage 2 : plus de gags et de situations (DRH, Brigitte, DG).
4. Sons et musique, son de la vidéo à tester.
5. Polish : lumière, animations, sprites.
6. Modes de difficulté, score, rejeu.
7. Éditeur de niveaux (Angular possible). Fait : modules TypeScript, Vite, hébergement GitHub Pages.

## Mise à jour 0.6
- RDC : gobelet de Kévin sur Roger (nettoie 10 s), clope de Nadia sur Dédé (fumoir 60 s), puis portillon bleu
- Étage 1 : gobelet sur Dylan (nettoie, puis café), ordinateur de l'open space piraté par Nadia = managers à la cafétéria
- Un état 'clean' puis 'coffee' dans game/enemiesAi.ts, fonctions goCoffee/smokeBreak/managersCoffee dans game/noise.ts
