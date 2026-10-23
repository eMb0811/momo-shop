# 👕 momoShop — Boutique Urbaine & Pop (Sénégal 🇸🇳)

> Boutique e-commerce moderne spécialisée dans les t-shirts à **col rond structuré** et **coupe ajustée athlétique (Tailored Fit)** en pur **coton peigné mercerisé**.

---

## ⚡ Stack Technique

- **Framework :** [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Langage :** [TypeScript](https://www.typescriptlang.org/) (Mode strict, typage complet)
- **Style :** [Tailwind CSS v4](https://tailwindcss.com/) + Typographies Google (`Syne`, `Plus Jakarta Sans`, `Space Grotesk`)
- **Animation :** CSS natif accéléré matériellement & transitions fluides
- **Commandes :** Intégration WhatsApp directe (bouton 1-clic par produit + commande groupée du panier)
- **Conteneurisation :** Docker multi-stage (Node.js 22 Alpine, mode standalone ~130 Mo)
- **Reverse Proxy & SSL :** Caddy avec HTTPS / Let's Encrypt 100% automatique
- **CI/CD :** Pipeline GitHub Actions automatisé sur push `main`

---

## 🚀 Démarrage Rapide

### 1. Installation en local
```bash
# Cloner le projet
git clone https://github.com/eMb0811/momo-shop.git
cd momo-shop

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```
Rendez-vous sur [http://localhost:3001](http://localhost:3001).

### 2. Compilation de production
```bash
npm run build
npm run start
```

### 3. Déploiement avec Docker & Docker Compose
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Lancer la stack avec Caddy (HTTPS automatique)
docker compose up -d --build
```

Consultez [DEPLOYMENT.md](DEPLOYMENT.md) pour le guide complet de mise en production (nom de domaine gratuit DuckDNS, VPS Ubuntu et CI/CD).

---

## 📂 Structure du Projet

```text
├── .github/workflows/    # Pipeline CI/CD GitHub Actions
├── public/images/        # Photographies e-commerce haute définition
├── src/
│   ├── app/              # Routes Next.js (App Router, API, Pages légales)
│   ├── components/       # Composants UI (Hero, Catalogue, Modal, Panier, Bulle WhatsApp)
│   ├── context/          # Contexte React pour le panier persistant
│   ├── data/             # Catalogue produits (products.json)
│   └── lib/              # Types, helpers WhatsApp et formatage des prix
├── Caddyfile             # Configuration Caddy (SSL automatique Let's Encrypt)
├── Dockerfile            # Multi-stage build léger et sécurisé
├── docker-compose.yml    # Orchestration Docker pour la production
└── next.config.ts        # Configuration Next.js (output standalone)
```

---

## 📄 Licence

Projet développé pour **momoShop Sénégal** 🇸🇳.
