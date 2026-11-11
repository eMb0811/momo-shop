# 🚀 Guide de Mise en Production — momoShop

Ce guide vous explique pas à pas comment déployer **momoShop** en production sur un serveur VPS avec un **nom de domaine gratuit DuckDNS**, **HTTPS automatique Let's Encrypt**, et **déploiement automatique GitHub Actions**.

---

## 1. Obtenir votre nom de domaine gratuit DuckDNS (2 minutes)

1. Rendez-vous sur [https://www.duckdns.org](https://www.duckdns.org).
2. Connectez-vous avec votre compte Google, GitHub ou Reddit.
3. Dans la section **domains**, choisissez un sous-domaine pour votre boutique (ex: `momoshop` pour obtenir `momoshop.duckdns.org`).
4. Dans le champ **current ip**, renseignez l'adresse IP publique de votre serveur VPS.
5. Cliquez sur **update ip**.
   👉 *Votre nom de domaine `momoshop.duckdns.org` pointe désormais directement vers votre serveur !*

---

## 2. Préparer votre serveur VPS (Ubuntu / Debian)

Connectez-vous à votre serveur VPS en SSH :
```bash
ssh root@<IP_DE_VOTRE_VPS>
```

### A. Installer Docker & Docker Compose (commande officielle rapide)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### B. Cloner le projet sur le VPS
```bash
mkdir -p /opt/momo-shop
cd /opt/momo-shop
git clone <URL_DE_VOTRE_DEPOT_GITHUB> .
```

### C. Configurer les variables d'environnement
Créez le fichier `.env` sur le serveur :
```bash
cp .env.example .env
nano .env
```
Modifiez les valeurs avec votre domaine DuckDNS, votre email et vos paramètres de monitoring :
```env
DOMAIN=momoshop.duckdns.org
ACME_EMAIL=votre-email@gmail.com
MONITORING_PASSWORD=votre-mot-de-passe-secret
ALERT_WEBHOOK_URL=https://discord.com/api/webhooks/...
```
*(Sauvegardez avec `Ctrl + O` puis quittez avec `Ctrl + X`)*

### D. Ouvrir les ports pare-feu (si UFW est actif)
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
```

### E. Lancer l'application
```bash
docker compose up -d --build
```

🎉 **C'est tout !**
Caddy va automatiquement contacter Let's Encrypt, générer le certificat SSL, et votre site sera immédiatement accessible et sécurisé en HTTPS sur :
`https://momoshop.duckdns.org`

---

## 3. Configuration du Déploiement Automatique (GitHub Actions CI/CD)

Pour que chaque `git push` sur la branche `main` déploie automatiquement le site sur votre serveur :

1. Sur votre dépôt GitHub, allez dans **Settings** > **Secrets and variables** > **Actions**.
2. Ajoutez les **Repository secrets** suivants :
   - `VPS_HOST` : L'adresse IP publique de votre VPS.
   - `VPS_USER` : Votre utilisateur SSH (ex: `root` ou `ubuntu`).
   - `VPS_SSH_KEY` : Votre clé privée SSH (`id_rsa` ou `id_ed25519`).
   - `VPS_APP_DIR` : Le dossier de l'application sur le VPS (`/opt/momo-shop`).

Dès que vous poussez du code sur `main`, GitHub Actions vérifie le TypeScript, compile le projet, se connecte au VPS et redémarre les conteneurs sans coupure de service !

---

## 4. Modifier les Prix ou les Photos en Direct sur le VPS

Grâce aux volumes Docker montés (`./src/data` et `./public/images`) :

- **Changer un prix ou un stock :**
  ```bash
  nano /opt/momo-shop/src/data/products.json
  ```
  Le site lit le fichier dynamiquement : dès la sauvegarde, les nouveaux prix sont visibles immédiatement au rechargement de la page, **sans devoir reconstruire l'image Docker**.

- **Ajouter ou remplacer une photo :**
  Déposez simplement votre nouvelle image dans `/opt/momo-shop/public/images/`.

---

## 5. Commandes utiles au quotidien

- **Voir les logs en direct :**
  ```bash
  docker compose logs -f
  ```
- **Redémarrer les conteneurs :**
  ```bash
  docker compose restart
  ```
- **Mettre à jour manuellement :**
  ```bash
  git pull
  docker compose up -d --build
  ```
- **Vérifier l'état de santé :**
  ```bash
  docker compose ps
  ```

---

## 6. Console de Monitoring, Analytics & Alertes (`/monitoring`)

Une console de supervision complète est intégrée directement dans **momoShop** sur la route `/monitoring` :

1. **Audience & Conversions (Sans Cookie)** :
   - Suivi respectueux de la vie privée (hash SHA-256 quotidien sans bandeau cookie).
   - Entonnoir complet : Visites → Ouvertures fiches produit → Ajouts au panier → Clics commandes WhatsApp (avec volume en FCFA, répartition des tailles `XS` à `XXL`, appareils Mobile/Desktop et sources de trafic).
2. **Santé Serveur & Docker (`/api/health`)** :
   - Surveillance de la RAM (OS et Node.js RSS/Heap), charge CPU, uptime du conteneur, intégrité de `src/data/products.json` et présence des images dans `public/images/`.
3. **Gestion des Stocks & Prix en Direct** :
   - Éditez les stocks par taille et les prix FCFA directement depuis l'onglet **Stocks & Prix** sur `/monitoring` sans avoir besoin de vous connecter en SSH.
4. **Alertes Temps Réel & Sonde Uptime Externe** :
   - Renseignez `ALERT_WEBHOOK_URL` dans `.env` (compatible **Discord**, **Slack**, **Telegram** ou Webhook JSON) pour être alerté immédiatement lors d'une intention de commande WhatsApp, d'un stock bas/épuisé ou d'une erreur critique.
   - Le workflow `.github/workflows/uptime-monitor.yml` interroge `/api/health` de l'extérieur toutes les 15 minutes (vous pouvez ajouter `PRODUCTION_URL` et `ALERT_WEBHOOK_URL` dans vos secrets GitHub Actions) et compatible avec UptimeRobot.
