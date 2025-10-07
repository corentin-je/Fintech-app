# Fullstack Starter (FastAPI + React)

## Lancer en local

Prérequis: Docker + Docker Compose

```bash
docker compose up --build
```

- Backend: http://localhost:8000 (FastAPI)
- Frontend: http://localhost:3000 (Vite dev server)
- Le frontend utilise `VITE_API_URL=http://localhost:8000` (passé via docker-compose) pour joindre le backend.

## Configuration des Secrets GitHub

Dans Settings → Secrets and variables → Actions, ajouter:

- `GCP_PROJECT_ID`: ID du projet GCP (ex: `my-gcp-project`)
- `GCP_CREDENTIALS`: contenu JSON de la clé du compte de service ayant droits Artifact Registry + Cloud Run
- (Frontend) `BACKEND_URL`: URL publique Cloud Run du backend (ex: `https://backend-xxxx-ew.a.run.app`)

## Déploiements Cloud Run via GitHub Actions

Deux workflows déploient séparément backend et frontend (Europe, port 8080):

- Backend: `.github/workflows/deploy-backend.yml`
  - Se déclenche uniquement si des fichiers dans `backend/**` changent sur la branche `main`
  - Build + push de l'image sur Artifact Registry `europe-west1`
  - Déploiement Cloud Run service `backend` (port 8080)

- Frontend: `.github/workflows/deploy-frontend.yml`
  - Se déclenche uniquement si des fichiers dans `frontend/**` changent sur la branche `main`
  - Build + push de l'image sur Artifact Registry `europe-west1`
  - `VITE_API_URL` injecté au build via le secret `BACKEND_URL`
  - Déploiement Cloud Run service `frontend` (port 8080)

Déclenchement: poussez un commit sur `main` contenant des changements dans le dossier correspondant.

## Exemples d'URLs Cloud Run

- Backend (Europe West 1): `https://backend-xxxxxxxx-ew.a.run.app`
- Frontend (Europe West 1): `https://frontend-xxxxxxxx-ew.a.run.app`

Selon le nom du service et la région, l'URL peut varier (ex: `europe-west1`).

Exemples de design
https://www.revolut.com/blog/post/introducing-the-revolut-web-app/