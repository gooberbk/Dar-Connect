# Dar-Connect - Plateforme Immobilière (Projet Build & Ship)

**Thème Choisi : Immobilier ("Dar-Connect")**

## Binôme
- **[Nom de l'étudiant 1]**
- **[Nom de l'étudiant 2]**

## Liens du Projet
- **URL de Production (Vercel) :** [URL_VERCEL_A_AJOUTER]
- **Dépôt GitHub :** [URL_GITHUB_A_AJOUTER]

## Identifiants de Test
- **Utilisateur (Client) :** `user@test.com` / `password123`
- **Administrateur :** `admin@test.com` / `password123`

---

## Mission 4 : Le README "Architecte"

### 1. Le Mapping de notre Thème
Dans le cadre de notre projet immobilier "Dar-Connect", voici comment l'architecture a été modélisée selon les exigences :
*   **Table A (Utilisateurs) :** La table `profiles` (liée à Supabase Auth) qui représente les **Locataires/Clients**.
*   **Table B (Ressources) :** La table `properties` qui représente les **Maisons/Appartements** disponibles à la location.
*   **Table C (Interactions) :** La table `reservations` qui lie un locataire et une maison avec une date et un statut (En attente, Confirmé, Annulé).
*   **Storage (Fichiers) :** Un bucket Supabase `id_cards` pour stocker le **Scan de la carte d'identité (PDF/Image)** uploadé lors de la réservation.

### 2. L'Analyse d'Architecture

**Pourquoi l'utilisation de Vercel + Supabase est financièrement plus logique pour lancer ce projet qu'un serveur classique ?**
Lancer ce projet avec un serveur classique impliquerait d'importants coûts d'investissement initial (**CAPEX** - Capital Expenditure) : achat de serveurs physiques, routeurs, installation d'une salle climatisée, etc. À cela s'ajoutent les coûts de maintenance fixes, même si l'application n'a aucun utilisateur.
En utilisant une architecture Cloud Serverless (Vercel + Supabase), nous basculons sur un modèle de dépenses opérationnelles (**OPEX** - Operational Expenditure). Nous ne payons que ce que nous consommons ("Pay-as-you-go"). Pour le lancement, le coût est quasiment nul grâce aux "Free Tiers". Ce modèle réduit drastiquement le risque financier et permet de tester le marché avant d'investir massivement.

**Comment Vercel gère-t-il la scalabilité par rapport à un Data Center physique local ?**
Dans un Data Center physique, gérer un pic soudain de trafic nécessite d'anticiper la charge en achetant et configurant de nouveaux serveurs (Scale-up/Scale-out manuel). C'est lent et coûteux. 
Vercel, couplé à Next.js, gère la scalabilité de manière automatique et instantanée via le Serverless et un réseau CDN (Content Delivery Network) global. Si l'application passe de 10 à 10 000 utilisateurs simultanés, Vercel provisionne instantanément des fonctions Serverless pour exécuter le code backend à la demande et distribue les assets statiques depuis le serveur le plus proche géographiquement du visiteur, sans aucune intervention de notre part.

**Dans notre application, qu'est-ce qui représente la donnée Structurée et la donnée Non-structurée ?**
*   **Données Structurées :** Elles sont stockées dans notre base de données relationnelle PostgreSQL (Supabase). Il s'agit des informations avec un schéma strict : les profils utilisateurs (ID, email, rôle), les détails des maisons (prix, localisation, nombre de chambres), et les réservations (dates, statuts).
*   **Données Non-structurées :** Ce sont les fichiers bruts qui n'ont pas de schéma de base de données fixe. Dans notre projet, il s'agit des images des propriétés et, surtout, des **scans des cartes d'identité (fichiers PDF ou images)** uploadés par les utilisateurs lors de la réservation, qui sont stockés de manière brute dans Supabase Storage.

---

## Guide d'Installation Locale

1. **Cloner le dépôt et installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer Supabase :**
   - Créez un projet sur [Supabase](https://supabase.com).
   - Exécutez le script SQL présent dans `supabase.sql` pour créer les tables, le bucket Storage et les règles de sécurité RLS.
   - Renommez `.env.local.example` (ou créez `.env.local`) et ajoutez vos clés :
     ```env
     NEXT_PUBLIC_SUPABASE_URL=votre_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_publique
     ```

3. **Lancer le serveur :**
   ```bash
   npm run dev
   ```
