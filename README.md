# PLAN SOCIAL

Jeu d'infiltration isométrique humoristique (esprit Desperados / Commandos), dans un open space. Quatre collègues virés à 18h doivent récupérer la clé du coffre du DG et sortir ensemble par l'ascenseur de service.

## Utilisation

```
npm run build   # assemble src/ en dist/index.html (un seul fichier)
npm test        # lance tous les scénarios (Chrome + Playwright Python requis)
python3 tests/run_all.py chaine   # un seul scénario (filtre sur le nom)
```

Ouvrir `dist/index.html` dans un navigateur. Ajouter `#novid` à l'URL pour sauter la vidéo d'intro.

## Documents

- `docs/GAME_DESIGN.md` : histoire, personnages, pouvoirs, règles, étages, solutions, backlog. C'est la référence à modifier pour piloter le projet.
- `docs/ARCHITECTURE.md` : carte des fichiers et marche à suivre pour ajouter un pouvoir, un PNJ, un étage ou un texte.
- `CHANGELOG.md` : historique des versions.

## Debug en jeu

- Bouton 🐞 ou touche D : timers (horloge, caméras, portes, recharges, état de chaque garde).
- Bouton ∞ (visible en debug) : supprime la limite de 18h.
- Bouton 📋 : exporte l'état exact de la partie (à envoyer pour rejouer une situation) ou en charge un.
