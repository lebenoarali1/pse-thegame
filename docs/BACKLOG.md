# Backlog

Deux parties : le bilan de ce qui est en place, puis la liste des fonctionnalités attendues. La version courante est la 1.18.

## 1. Bilan : ce qui est en place

### Le jeu
- 4 personnages aux pouvoirs distincts : Kévin (gobelet, gaine d'aération, course), Nadia (PC, clope, SMS), Djibril (tenue, baratin), Max (KO, chariot, flaque)
- 3 étages : rez-de-chaussée, étage 1 (open space, salle serveur), étage 2 (direction, coffre du DG)
- Objectif : récupérer la clé du coffre du DG et sortir par l'ascenseur de service avant 18h
- Durée de partie selon la difficulté : Stagiaire 12 min, Cadre 10 min, Directeur 8 min
- Une solution complète est rejouée automatiquement par le test 18 : le jeu est gagnable (victoire vers 425 s)

### Les gardes et les employés
- Vue en cône, jauge de repérage, enquête sur un bruit, poursuite puis recherche
- Bruits visualisés par un cercle orange
- Corps découverts, caméras (étage 2 seulement), lumière coupée
- Réactions variées : café, imprimante, SMS, clope, gobelet
- Répliques d'ambiance selon l'heure de la soirée

### Les actions de Nadia sur un PC
- Portillon bleu (RDC), imprimante, lumière coupée 60 s (partout)
- Étage 1 : café, réunion, notification, salle serveur (code du coffre, caméras de l'étage 2)
- Étage 2 : entretien d'évaluation de la DRH, « 12 copies » pour Brigitte, avancer la réunion du DG
- Le menu n'affiche que les actions utiles à l'étage
- Hiérarchie des ordres : serveur, puis réunion, lumière, imprimante, gobelet, café ; un ordre moins prioritaire n'écrase pas un ordre en cours
- Interrupteur de chaque étage visible sur la carte
- Étapes indispensables : liste lisible en touchant l'objectif (fait, en cours, qui doit agir)
- Deux voies pour le code du coffre : Djibril fait parler la manageuse en chef puis Nadia pirate le serveur (plus vite), ou Max assomme le DG à sa sortie et lui prend le code
- Double appui : le personnage court jusqu'à sa destination, puis reprend la marche (sauf Djibril déguisé)
- Dialogues : retour à la réplique précédente par clic droit, flèche gauche ou bouton ◀ Retour sur mobile

### Interface
- Écran d'accueil avec choix de la difficulté
- Vidéo d'introduction avec musique de suspense puis d'action, et un temps d'arrêt avant chaque changement de scène pour lire
- Aide (❓), bulles d'astuces au premier usage, première minute guidée
- Fin de partie mise en scène, défaites expliquées (qui a vu, où)
- Mobile : portrait et paysage, boutons de 44 px, options rares derrière « ⋯ »
- Musique d'ambiance adaptative (calme, tension, poursuite), volumes musique et effets

### Sauvegarde et réglages
- Sauvegarde manuelle et automatique à chaque nouvel étage, conservée au rechargement
- Réglages mémorisés : difficulté, cônes, son, volumes
- Installation comme application et mode hors connexion

### Qualité et livraison
- TypeScript strict sans `any`, lint, 8 tests unitaires, 29 scénarios de bout en bout
- Publication automatique sur GitHub Pages après vérifications
- Documentation en ligne : MCO, architecture, conception, changelog
- Releases GitHub à chaque tag de version, mises à jour automatiques des dépendances

## 2. Fonctionnalités attendues

### Prochaine étape
- Déboguer chaque niveau l'un après l'autre : RDC, puis étage 1, puis étage 2

### Pouvoirs inutiles (un par personnage)
- Nadia : lancer une musique disco, tout le monde danse dans les 10 secondes
- Djibril : envoyer un message misérable à tout le monde, les conversations tournent un moment autour de l'événement
- Max : nettoie un rayon d'une case autour de lui quand il ne fait rien (en place)
- Kévin (proposition) : photo de groupe, tous les PNJ proches se figent 3 secondes pour poser

### À faire ensuite
- Donner un ordre de groupe : tous les personnages suivent celui qui est actif
- Régler la taille du texte et un contraste élevé
- Rendre le danger lisible sans la couleur (motif ou icône)
- Navigation complète au clavier et libellés pour lecteur d'écran
- Sous-titres visuels pour les sons importants
- Réduire les animations et les flashs
- Bouton « envoyer un retour » qui exporte l'état de la partie
- Score de fin (temps, discrétion, collègues sortis) et classement local
- Employés qui réagissent aux cris et objets qui tombent
- Sprites et animations plus soignés
- Sortir les cartes et les rondes dans des fichiers de données modifiables sans toucher au code
- Tests automatiques de chaque état de l'IA des gardes
- Passer les tests de bout en bout en TypeScript pour un simple `npm test`
