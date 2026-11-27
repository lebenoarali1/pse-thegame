# PLAN SOCIAL

Jeu d'infiltration isométrique humoristique (esprit Desperados / Commandos), dans un open space. Quatre collègues virés à 18h doivent récupérer la clé du coffre du DG et sortir ensemble par l'ascenseur de service.

## Utilisation

```
npm install       # une seule fois
npm run dev       # jeu sur localhost, rechargement automatique
npm run build     # construit dist/
npm run typecheck # vérification TypeScript
npm test          # lance tous les scénarios (npm run build avant ; Chrome + Playwright Python requis)
python3 tests/run_all.py chaine   # un seul scénario (filtre sur le nom)
```

Ajouter `#novid` à l'URL pour sauter la vidéo d'intro. Le déploiement sur GitHub Pages est automatique à chaque push sur `main` (workflow `.github/workflows/pages.yml`).

## Documents

- `docs/GAME_DESIGN.md` : histoire, personnages, pouvoirs, règles, étages, solutions, backlog. C'est la référence à modifier pour piloter le projet.
- `docs/ARCHITECTURE.md` : carte des fichiers et marche à suivre pour ajouter un pouvoir, un PNJ, un étage ou un texte.
Les docs sont aussi publiées en ligne : https://lebenoarali1.github.io/pse-thegame/docs/

- `docs/MCO.md` : maintien en condition opérationnelle, paramétrage, mode opératoire avec Claude.
- `CHANGELOG.md` : historique des versions.

## Debug en jeu

- Bouton 🐞 ou touche D : timers (horloge, caméras, portes, recharges, état de chaque garde).
- Bouton ∞ (visible en debug) : supprime la limite de 18h.
- Bouton 📋 : exporte l'état exact de la partie (à envoyer pour rejouer une situation) ou en charge un.
