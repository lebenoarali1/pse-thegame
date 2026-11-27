# PLAN SOCIAL : backlog produit

Dernière mise à jour : version 1.6. Ce document remplace la liste courte de GAME_DESIGN.md.

## Comment lire ce backlog

- **Granularité** : une story est un livrable jouable ou vérifiable en une session de travail (une à trois heures avec Claude), avec un critère d'acceptation testable. Au-dessus, on regroupe en **épopées** par thème ; en dessous, on ne détaille pas (les tâches techniques restent dans les commits)
- **Statut** : `DONE` livré (version indiquée), `TODO` à faire, `IDEE` à instruire avant de s'engager
- **Priorité** (MoSCoW) : `Must` bloque la qualité d'une première partie, `Should` améliore nettement, `Could` confort, `Won't` écarté pour l'instant
- **Taille** : S (moins d'une heure), M (une session), L (plusieurs sessions, à découper avant de commencer)

## Synthèse de l'analyse 360

| Axe | Constat | Conséquence |
|---|---|---|
| Valeur joueur | La chaîne complète de mécaniques existe et est testée, mais la solvabilité en furtivité totale n'a pas été démontrée en jeu | Valider la partie de bout en bout est le premier risque produit |
| Onboarding | Aucun tutoriel : les pouvoirs, les clics droits et les raccourcis sont à découvrir seul | Un nouveau joueur décroche avant d'avoir vu les bonnes idées |
| Difficulté | Un seul niveau de réglage (480 s), pas de score, pas de rejeu structuré | Peu de raisons de rejouer, difficulté non calibrée |
| Contenu | Étages 0 et 1 riches, étage 2 mince (DRH, Brigitte, DG) | Le final est moins drôle que le milieu |
| Mobile | Le jeu s'utilise au toucher, mais la lisibilité (petits sprites, menus) et l'ergonomie n'ont pas été éprouvées sur plusieurs écrans | Public principal probable : le téléphone |
| Accessibilité | Aucun attribut ARIA, information portée par la couleur (cônes), texte de dialogue sans taille réglable, son sans alternative visuelle | Exclut une partie des joueurs, facile à améliorer tôt |
| Persistance | Sauvegarde rapide persistante (stockage du navigateur) avec bouton Reprendre ; réglages non conservés (E5-4), pas d'autosauvegarde (E5-3) | Reprise possible, confort à compléter |
| Qualité | 15 scénarios de bout en bout, typage strict sans `any`, lint, le tout dans la CI avant déploiement ; les tests dépendent encore de Python | Une régression est bloquée avant publication (portage TypeScript : E8-5) |
| Livraison | Déploiement Pages automatique après typecheck, lint et tests ; licence MIT ; version affichée sur l'écran d'accueil | Reste : étiquettes de version (E8-10), PWA (E9-2) |
| Performance | Rendu canvas sur 1 500 lignes de logique, aucune mesure | À surveiller sur mobile d'entrée de gamme, pas de problème connu |
| Données et vie privée | Aucune donnée collectée, aucun service tiers | Point fort à conserver (pas de télémétrie sans décision explicite) |
| Observabilité | Pas de retour joueur structuré | On ne sait pas où les gens échouent |
| Maintenabilité | MCO documentée, modules ES, types complets | Bonne base ; la dette est dans l'outillage de test |

**Les cinq priorités recommandées** : valider la solvabilité (E1), un tutoriel intégré (E2), un premier passage accessibilité (E6), l'étage 2 (E7-3), la lisibilité mobile (E6-4, E6-5). Le lot 1 (CI, lint, version affichée, licence, sauvegarde persistante) est livré en 1.4.

## E1. Équilibrage et solvabilité

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E1-1 | En tant que concepteur, je veux un mode « démonstration » qui rejoue automatiquement une solution complète en furtivité totale, afin de prouver que la partie est gagnable | TODO | Must | L |
| E1-2 | En tant que joueur, je veux que la partie se gagne en moins de 8 minutes de jeu sans debug au premier essai raisonnable, afin de ne pas être bloqué par le chrono | TODO | Must | M |
| E1-3 | En tant que concepteur, je veux consigner les paramètres de difficulté (temps, portées, durées de KO) dans un seul tableau de réglages, afin de les ajuster sans fouiller le code | TODO | Should | M |
| E1-4 | En tant que joueur, je veux trois niveaux de difficulté (Stagiaire, Cadre, Directeur) qui modifient le temps et la vigilance, afin d'adapter le défi | TODO | Should | M |
| E1-5 | En tant que joueur, je veux un score de fin (temps restant, discrétion, collègues sortis) et un classement local, afin d'avoir une raison de rejouer | TODO | Could | M |

## E2. Découverte et tutoriel

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E2-1 | En tant que nouveau joueur, je veux des bulles d'aide contextuelles lors de la première utilisation de chaque pouvoir, afin de comprendre sans lire un manuel | DONE 1.6 | Must | M |
| E2-2 | En tant que nouveau joueur, je veux un écran de commandes (tactile et clavier) accessible depuis le menu et en pause, afin de retrouver les raccourcis | DONE 1.5 | Must | S |
| E2-3 | En tant que nouveau joueur, je veux une première minute guidée au RDC (déplacer, se cacher, voir un cône), afin de ne pas échouer sur une règle ignorée | TODO | Should | M |
| E2-4 | En tant que joueur, je veux que le jeu explique pourquoi j'ai perdu (qui m'a vu, où, quel corps trouvé) et propose de reprendre à la dernière sauvegarde, afin d'apprendre de l'échec | TODO | Should | M |
| E2-5 | En tant que joueur, je veux un objectif courant affiché en haut (« Trouver le code du coffre ») qui évolue, afin de ne jamais me demander quoi faire | DONE 1.2 (objectif évolutif en haut à gauche) | Should | S |

## E3. Mécaniques et personnages

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E3-1 | En tant que joueur, je veux quatre personnages aux pouvoirs distincts (gaine, pirater, déguisement, assommer et planquer) | DONE 0.1 à 0.9 | Must | L |
| E3-2 | En tant que joueur, je veux que le déguisement se prenne sur un corps assommé, même planqué, et se retire à volonté | DONE 0.9.2, 1.0 | Must | M |
| E3-3 | En tant que joueur, je veux que Max pose des flaques qui assomment (W), y compris en se déplaçant vers la case visée | DONE 1.0, 1.2 | Should | M |
| E3-4 | En tant que joueur, je veux vider le chariot de Max (X) et ne pas y planquer le DG | DONE 1.2 | Should | S |
| E3-5 | En tant que joueur, je veux que le KO dure 50 s, ne se termine pas pendant qu'on prend la tenue, et fige le garde pendant le coup | DONE 1.2 | Must | M |
| E3-6 | En tant que joueur, je veux un son de pas et de bruit visualisé (cercle) pour chaque action bruyante, afin d'anticiper la réaction des gardes | TODO | Should | M |
| E3-7 | En tant que joueur, je veux un pouvoir de diversion pour Djibril hors déguisement (fausse annonce, téléphone), afin qu'il serve aussi à découvert | IDEE | Could | M |
| E3-8 | En tant que joueur, je veux pouvoir donner un ordre de groupe (tous suivent le personnage actif), afin de limiter les micro-déplacements | TODO | Should | M |
| E3-9 | En tant que joueur, je veux une file d'ordres (Maj + clic) pour enchaîner un déplacement et une action, afin de planifier une manœuvre à la Desperados | IDEE | Could | L |
| E3-10 | En tant que joueur, je veux annuler le dernier ordre ou revenir à l'état avant une action ratée, afin de réduire la frustration | IDEE | Could | L |

## E4. Intelligence des PNJ et monde

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E4-1 | En tant que joueur, je veux que la vision (cônes, jauge de détection, vue réduite sous baratin) soit lisible, avec des cônes verts pour les non-menaçants et rouges pour les gardes | DONE 0.3 à 1.2 | Must | M |
| E4-2 | En tant que joueur, je veux que le support cafte au manager qui chasse, tandis que les employés calmes ne détectent pas | DONE 1.2 | Must | M |
| E4-3 | En tant que joueur, je veux que les imprimantes (RDC et R+1) attirent tout le personnel disponible 20 s | DONE 1.2 | Should | M |
| E4-4 | En tant que joueur, je veux que les gardes en poursuite perdent la trace après un délai et reviennent à leur ronde, afin qu'un échec ne soit pas toujours définitif | TODO | Should | M |
| E4-5 | En tant que joueur, je veux que les gardes appellent des renforts lors d'une alerte, avec une conséquence visible sur les étages voisins, afin que l'erreur coûte sans terminer la partie | IDEE | Could | L |
| E4-6 | En tant que concepteur, je veux des tests de non-régression de l'IA (un scénario par état : patrouille, enquête, poursuite, pause) | TODO | Should | M |
| E4-7 | En tant que joueur, je veux des employés qui réagissent aux bruits (cris, objet qui tombe) par une réplique, afin de renforcer l'humour d'ambiance | TODO | Could | S |

## E5. Persistance et reprise

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E5-1 | En tant que joueur, je veux une sauvegarde rapide et un import/export d'état en JSON | DONE 0.8 | Should | S |
| E5-2 | En tant que joueur, je veux que la sauvegarde rapide survive au rechargement de la page (stockage du navigateur), afin de reprendre plus tard, surtout sur mobile | DONE 1.4 | Must | S |
| E5-3 | En tant que joueur, je veux une sauvegarde automatique à chaque étage franchi, afin de ne pas tout perdre | TODO | Should | S |
| E5-4 | En tant que joueur, je veux retrouver mes réglages (son, cônes visibles, vitesse) au prochain lancement | TODO | Should | S |
| E5-5 | En tant que concepteur, je veux versionner le format de sauvegarde, afin qu'une ancienne sauvegarde ne casse pas une nouvelle version | DONE 1.4 | Should | S |

## E6. Interface, mobile et accessibilité

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E6-1 | En tant que joueur, je veux une horloge plus lente (8 min de jeu pour 15 affichées) | DONE 1.2 | Must | S |
| E6-2 | En tant que joueur, je veux un menu de piratage filtré par étage, qui met le temps en pause | DONE 1.0, 1.1, 1.2 | Must | M |
| E6-3 | En tant que joueur, je veux le clic droit pour afficher ou masquer les cônes (et un bouton équivalent au toucher) | DONE 1.2 (clic droit) | Should | S |
| E6-4 | En tant que joueur sur téléphone, je veux un bouton pour afficher ou masquer les cônes et un appui long pour le clic droit, afin de ne rien perdre en tactile | DONE 1.5 | Must | S |
| E6-5 | En tant que joueur sur téléphone, je veux une mise en page testée en portrait et paysage (petits écrans, encoche), avec des cibles tactiles d'au moins 44 px | TODO | Must | M |
| E6-6 | En tant que joueur, je veux régler la taille du texte des dialogues et un contraste élevé, afin de lire confortablement | TODO | Should | S |
| E6-7 | En tant que joueur daltonien, je veux que la menace se lise sans la couleur (forme ou motif des cônes, icône de statut) | TODO | Should | M |
| E6-8 | En tant que joueur au clavier ou avec un lecteur d'écran, je veux des libellés ARIA sur les boutons et une navigation complète au clavier | TODO | Should | M |
| E6-9 | En tant que joueur, je veux des sous-titres visuels pour les sons importants (alarme, bruit), afin de jouer sans son | TODO | Could | S |
| E6-10 | En tant que joueur, je veux réduire les animations et les flashs, afin d'éviter l'inconfort | TODO | Could | S |

## E7. Contenu, humour et mise en scène

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E7-1 | En tant que joueur, je veux une vidéo d'intro en vue à la première personne avec option de la sauter | DONE 0.9, 0.9.1 | Should | L |
| E7-2 | En tant que joueur, je veux des dialogues de recrutement propres à chaque personnage, avec le choix d'âge de Kévin | DONE 0.x | Must | M |
| E7-3 | En tant que joueur, je veux un étage 2 plus riche : situations et gags autour de la DRH, de Brigitte et du DG (au moins trois interactions nouvelles) | TODO | Must | L |
| E7-4 | En tant que joueur, je veux une fin de partie mise en scène (victoire et chaque défaite) avec une réplique et une courte séquence, afin de conclure sur un rire | TODO | Should | M |
| E7-5 | En tant que joueur, je veux des répliques d'ambiance variées pour les employés selon l'heure et les événements (réunion, plan social qui approche) | TODO | Could | S |
| E7-6 | En tant que joueur, je veux une musique d'ambiance adaptative (calme, tension, poursuite) et un mixage des effets, avec un réglage du volume | TODO | Should | L |
| E7-7 | En tant que joueur, je veux des sprites et animations plus soignés (marche, KO, déguisement) et un éclairage par étage | TODO | Could | L |
| E7-8 | En tant que joueur, je veux un deuxième niveau (autre bâtiment ou scénario) pour prolonger l'aventure | IDEE | Could | L |

## E8. Qualité, tests et livraison

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E8-1 | En tant que développeur, je veux 14 scénarios de bout en bout (Playwright) couvrant la chaîne complète | DONE 0.x à 1.2 | Must | L |
| E8-2 | En tant que développeur, je veux un modèle de données entièrement typé, strict et sans `any` | DONE 1.3 | Should | L |
| E8-3 | En tant que développeur, je veux un déploiement automatique sur GitHub Pages à chaque push | DONE 1.3 | Must | M |
| E8-4 | En tant que développeur, je veux que la CI exécute `typecheck` et les 14 scénarios avant le déploiement, afin de bloquer une régression | DONE 1.4 | Must | M |
| E8-5 | En tant que développeur, je veux porter les tests en TypeScript (Playwright Test) pour un simple `npm test` sans Python | TODO | Should | L |
| E8-6 | En tant que développeur, je veux un linter et un formateur (ESLint, Prettier) interdisant `any`, afin de garder le niveau de typage | DONE 1.4 | Should | S |
| E8-7 | En tant que développeur, je veux des tests unitaires sur la logique pure (pathing, visibilité, détection), plus rapides que les scénarios | TODO | Should | M |
| E8-8 | En tant que développeur, je veux mettre à jour automatiquement les dépendances (Dependabot) avec alerte de sécurité | TODO | Could | S |
| E8-9 | En tant que joueur, je veux voir le numéro de version et la date de build dans le jeu, afin de savoir quelle version j'ai | DONE 1.4 | Should | S |
| E8-10 | En tant que mainteneur, je veux publier des versions étiquetées (tags, notes de version générées depuis le changelog) | TODO | Could | S |
| E8-11 | En tant que développeur, je veux une documentation publiée automatiquement (architecture, MCO, conception, historique) | DONE 1.3 | Should | M |

## E9. Distribution, légal et mesure

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E9-1 | En tant que mainteneur, je veux une licence explicite (code et contenus) dans le dépôt, afin de clarifier la réutilisation | DONE 1.4 | Must | S |
| E9-2 | En tant que joueur, je veux installer le jeu comme une application (PWA) et jouer hors connexion | TODO | Should | M |
| E9-3 | En tant que joueur, je veux une carte de partage (aperçu réseaux sociaux) et un titre de page soignés, afin de diffuser le jeu | TODO | Could | S |
| E9-4 | En tant que concepteur, je veux un bouton « envoyer un retour » (formulaire ou export de l'état de la partie), afin de comprendre où les joueurs échouent | TODO | Should | M |
| E9-5 | En tant que concepteur, je veux des statistiques anonymes sur les échecs par étage, uniquement avec consentement explicite | IDEE | Won't | M |
| E9-6 | En tant que joueur, je veux une version en anglais, afin d'élargir le public | IDEE | Could | L |
| E9-7 | En tant que joueur, je veux une page d'accueil ou un site du jeu (captures, trailer, lien jouer), séparée de la documentation technique | IDEE | Could | M |

## E10. Outillage créatif

| ID | Story | Statut | Prio | Taille |
|---|---|---|---|---|
| E10-1 | En tant que concepteur, je veux sortir les données de niveau (cartes, ronde des PNJ, événements) dans des fichiers de données validés, afin de modifier un niveau sans toucher la logique | TODO | Should | L |
| E10-2 | En tant que concepteur, je veux un éditeur de niveaux visuel (placer murs, portes, PNJ, rondes) avec export du niveau | IDEE | Could | L |
| E10-3 | En tant que concepteur, je veux un mode de relecture (replay) pour revoir une partie et comprendre un échec | IDEE | Could | L |

## Ordre de travail proposé

| Lot | Contenu | Pourquoi dans cet ordre |
|---|---|---|
| 1. Fiabilité (livré en 1.4) | E8-4, E8-6, E8-9, E9-1, E5-2, E5-5 | Petits, rapides, et ils sécurisent tout le reste |
| 2. Première partie réussie (E2-1, E2-2, E2-5, E6-4 livrés en 1.5 et 1.6) | E1-1, E1-2, E2-1, E2-2, E2-5, E6-4 | Rend le jeu jouable et gagnable par un inconnu |
| 3. Confort et accessibilité | E5-3, E5-4, E6-5, E6-6, E6-7, E6-8 | Élargit le public, surtout sur mobile |
| 4. Contenu final | E7-3, E7-4, E3-8, E4-4 | Donne un vrai final et adoucit l'échec |
| 5. Ambiance | E7-6, E3-6, E9-2 | Polish et installation en application |
| 6. Extensions | E1-4, E1-5, E10-1, E8-5, E9-6 | À décider après les premiers retours joueurs |

## Risques et hypothèses

- **Hypothèse** : le public principal joue sur téléphone ; à vérifier avec les premiers retours (E9-4)
- **Risque** : l'équilibrage change avec chaque nouvelle mécanique ; sans E1-1 (démonstration automatique), chaque ajout peut rendre le jeu injouable sans que personne ne s'en rende compte
- **Risque** : les tests de bout en bout dépendent du temps réel et deviennent lents ; à surveiller en croissant le nombre de scénarios
- **Décision à prendre** : mesure d'audience (E9-5) classée `Won't` tant qu'aucun consentement explicite n'est prévu
