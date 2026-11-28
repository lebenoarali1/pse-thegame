# Changelog

## 1.10
- Correctif : un appui tactile qui ouvre le menu du PC ne valide plus le premier bouton (l'imprimante se déclenchait seule) ; les boutons du menu ignorent les clics des 0,5 premières secondes
- Mobile : cibles tactiles d'au moins 44 px en portrait et en paysage, boutons rares (assistance, debug, état, sauvegarde, chargement) derrière « ⋯ » ; test 22
- Étage 2 : trois nouvelles actions de PC pour Nadia : entretien d'évaluation (la DRH quitte le couloir 25 s), « 12 copies » (Brigitte quitte son poste 25 s), avancer la réunion du comité (le DG part tout de suite, ce qui supprime l'attente) ; test 23

## 1.9
- Défaites expliquées : qui a vu et où (étage, côté, nord ou sud), y compris pour un corps découvert ; test 21
- Aperçu de partage (description, Open Graph) et couleur de thème
- Dependabot (npm hebdomadaire, actions mensuelles)
- Versions étiquetées : pousser un tag `vX.Y.Z` publie une release GitHub avec les notes du changelog

## 1.8
- Nadia : nouvelle action « Éteindre la lumière » (60 s, étage dans le noir, on n'est vu que de très près, les caméras sont aveugles) ; un employé va rallumer
- Le menu du PC ne propose plus les caméras aux étages qui n'en ont pas (RDC, étage 1)
- Difficulté : Stagiaire (12 min de jeu), Cadre (10 min, référence), Directeur (8 min, gardes plus vigilants), choisie sur l'écran d'accueil
- Durée de la partie portée à 10 min de jeu (marge de 2 min sur la solution automatique) ; le départ du DG reste à 320 s
- Réglages mémorisés : difficulté, cônes, son ; tableau unique dans `settings.ts`
- Sauvegarde automatique au premier passage à chaque étage
- Tests 19 (lumière) et 20 (difficulté, réglages, sauvegarde auto)

## 1.7
- Test 18 : une solution complète rejouée sans téléportation (RDC, code, Max, porte rouge, caméras, coffre du DG, ascenseur) gagne en moins de 8 minutes de jeu ; validé 3 fois sur 3
- Constats pour l'équilibrage (E1-2) : la fenêtre du DG (attente d'environ 60 s à l'étage 2) est longue, et la descente finale à découvert coûte deux personnages

## 1.6
- Astuces au premier usage : une bulle explique chaque pouvoir (Max, Djibril, Nadia, Kévin) et le déplacement ; chacune n'apparaît qu'une fois, mémorisée dans le navigateur
- Bouton « Revoir les astuces » dans l'écran des commandes
- Test 17 (astuces)

## 1.5
- Écran des commandes (bouton ❓ ou touche H) : tableau tactile et clavier, met le jeu en pause
- Bouton ◔ pour afficher ou masquer les cônes, et appui long sur la carte au toucher (équivalent du clic droit)
- Test 16 (aide et cônes)

## 1.4
- Sauvegarde rapide persistante (localStorage, format versionné) et bouton « Reprendre la sauvegarde » sur l'écran d'accueil
- Version et date de build affichées sur l'écran d'accueil
- CI : typecheck, lint et 15 scénarios de bout en bout avant tout déploiement
- ESLint (typescript-eslint) : `any` interdit
- Licence MIT
- Test 15 (sauvegarde persistante)

## 1.3
- Nouvelle page Backlog (docs/BACKLOG.md) : analyse 360, 10 épopées, user stories avec statut et priorité, ordre de travail proposé
- Documentation publiée sur GitHub Pages (/docs/), générée depuis les fichiers Markdown par `npm run build`
- Typage strict (strict et noImplicitAny) sur tous les modules ; zéro `any` explicite (de 200 à 0) : ordres, actions, dialogues, menu de piratage, particules et état de jeu typés dans types.ts
- Nouveau document docs/MCO.md : maintien en condition opérationnelle, paramétrage et mode opératoire du codage assisté
- Passage à Vite et TypeScript : 30 modules ES dans src/game, types du modèle (types.ts), variables partagées dans store.ts, vérification `npm run typecheck`
- Déploiement GitHub Pages automatique par GitHub Actions

## 1.2
- Horloge plus lente (8 min de jeu pour 15 min affichées)
- Menu de Nadia filtré par étage (portes, notification, café, réunion, imprimante selon ce qui existe)
- KO de Max fiable (le garde se fige), réveil après 50 s et jamais pendant qu'on prend sa tenue
- Clic droit : affiche ou masque les cônes de vision
- Cônes verts pour le support et les salariés ; le support cafte au manager, qui chasse ; les salariés ne cafent pas
- R+1 : 1 support (Hugo) et 2 salariés (Lucie, Karim)
- Le DG ne tient pas dans le seau ; Max peut vider son chariot (X)
- Imprimantes : l'impression à distance attire tout le personnel de l'étage
- Max se déplace pour poser une flaque

## 1.1
- Le menu de piratage s'affiche à chaque PC (y compris serveur : code du coffre, caméras R+2 ; accueil : portillon) et met le temps en pause
- Un PNJ planqué dans le chariot de Max ne se réveille plus ; le chariot contient 2 corps au maximum
- Djibril déguisé ne peut pas être repéré ni viré (en attendant les événements)

## 1.0
- Icône de chargement 📂 ; les portraits en bas fonctionnent toujours (liés à l'état courant) et amènent à l'étage du personnage
- Employés du support assis sur une chaise
- Menu de piratage d'un PC : ouvrir la porte, notification (salle serveur), pause café, réunion, éteindre les caméras, imprimer à distance
- Djibril peut retirer son déguisement (même bouton)
- Un PNJ baratiné a un cône de vision réduit
- Un assommé perd ses étoiles puis se réveille (30 s, plus long planqué)
- Max : 3e pouvoir Flaque (W), qui assomme 20 s le PNJ qui glisse
- Une porte ouverte reste ouverte
- Test 13 (13/13 OK)

## 0.9.2
- Déguisement : Djibril peut prendre la tenue d'un vigile, d'un agent de sécurité (Dylan) ou d'un manager assommé, même planqué (test 12)

## 0.9.1
- Vidéo d'intro deux fois plus lente (constante VSLOW dans 70_video.js)

## 0.9
- Vidéo d'intro refaite en vue à la première personne (bureau, mail de convocation, panorama des quatre collègues, SMS anonyme, course vers la porte du DG), jouée avant le menu Commencer
- #novid dans l'URL saute la vidéo

## 0.8.1
- Nadia peut pirater n'importe quel PC (T ou bureau avec écran), toujours de près ; sur R+1 le premier envoie le SMS, les autres donnent une réplique
- Employés placés devant un écran, face à lui
- Toucher le portrait d'un perso pas encore recruté ou licencié explique pourquoi et montre où il est
- Recrutement possible jusqu'à 2,6 cases

## 0.8
- Porte rouge de l'escalier R+2 : Nadia peut la pirater de près (8 s), en plus du costume de manager
- Un seul manager (Manon) à R+1 ; trois employés calmes devant leur PC (Lucie, Hugo, Karim), sans vision, avec qui on parle en les touchant
- Piratage d'un PC uniquement de près (plus à distance)
- Pirater le PC de l'open space envoie un SMS : manager et techniciens (Hugo, Karim) filent en salle serveur 45 s
- Tests 07 et 11 (11/11 OK)

## 0.7
- Clavier : les flèches déplacent le personnage sélectionné (haut = haut de l'écran, diagonales possibles), l'escalier se prend en marchant dessus. Le déplacement de la caméra passe au glisser ou au clic sur le personnage
- Boutons d'étage renommés RDC, R+1, R+2
- Test 10 ajouté (10/10 OK)

## 0.6
- Clope ciblée : Nadia la lance sur un vigile précis (Dédé au RDC), 60 s au fumoir, vue réduite
- Gobelet : le PNJ nettoie 10 s, puis va prendre un café si l'étage a une cafétéria (étage 1, nord-est)
- Nadia pirate l'ordinateur de l'open space : pause café des managers (45 s). Fini Gaëtan, le support est au téléphone
- Roger et Dylan font les cent pas, Kévin peut jeter son gobelet hors de leur vue
- Tests 02, 05, 07 réécrits (9/9 OK)

## 0.5 (refonte)
- Projet découpé en 30 fichiers sources, build en un seul HTML, 8 scénarios de test automatiques dont une chaîne complète jusqu'à la victoire.
- Export et import de l'état de la partie, mode debug avec timers et temps illimité.

## 0.4
- Baratin soutenu de Djibril (attire un PNJ, fil des bêtises), plus de brouillard.
- Étage 1 refait : Dylan devant les toilettes (gobelet vers la plante), Gaëtan au support (bug du PC par Nadia), Patrick et Manon mobiles.

## 0.3
- Pause clope : fumoir au RDC, 60 s, vue réduite. Éliminations individuelles. Vidéo d'intro (faux trailer en briques, quatre bandeaux de présentation).

## 0.2
- Départ avec Kévin et Nadia, recrutement progressif de Djibril et Max, dialogues avec choix.

## 0.1
- Première démo : quatre personnages, trois étages, détection, déguisements, piratage.
