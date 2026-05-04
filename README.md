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

### 1. Mapping du Thème : Dar-Connect (Immobilier)
*   **Table A (Utilisateurs) :** Locataires (gérés via Supabase Auth).
*   **Table B (Ressources) :** Maisons (liste des biens disponibles à la location).
*   **Table C (Interactions) :** Visites (jointure entre un Locataire et une Maison avec date et statut).
*   **Storage (Fichiers) :** Scan de la carte d'identité du locataire (obligatoire pour valider une visite).

### 2. Analyse d'Architecture (Le "Pourquoi")

**A. Logique financière : CAPEX vs OPEX**
L'utilisation de Vercel et Supabase permet de passer d'un modèle CAPEX (Capital Expenditure) à un modèle OPEX (Operating Expenditure) :
*   **CAPEX (Serveur classique) :** L'achat de serveurs physiques, d'armoires (racks) et de matériel réseau représente un investissement initial lourd et risqué pour un nouveau projet.
*   **OPEX (Vercel/Supabase) :** On utilise le modèle du Cloud (SaaS/BaaS). Il n'y a aucun coût d'infrastructure au démarrage. Comme vu dans le Chapitre 2 (p. 166), l'économie se fait par la mutualisation des ressources. On ne paie que ce que l'on consomme, ce qui est stratégiquement plus logique pour "Dar-Connect".

**B. Scalabilité : Vercel vs Data Center Physique**
Dans un Data Center local, la scalabilité est limitée par le matériel (climatisation, espace, électricité). Si le trafic de notre site explose, un serveur physique sature.
Vercel gère la scalabilité de manière Serverless :
*   Il utilise l'allocation dynamique de la puissance (concept abordé dans le Chapitre 2 sur la virtualisation).
*   À l'image d'un orchestrateur (type Kubernetes), Vercel multiplie les instances de notre application instantanément en fonction de la demande, sans que nous ayons à gérer la "couche d'abstraction matérielle" (HAL).

**C. Données Structurées vs Non-structurées**
Dans notre SI "Dar-Connect", nous gérons les deux types de données mentionnés dans le Chapitre 1 :
*   **Données Structurées :** Ce sont les informations stockées dans nos tables SQL (Noms, adresses des maisons, dates de visites). Elles sont organisées, liées par des clés étrangères et faciles à requêter.
*   **Données Non-structurées :** Ce sont les scans de cartes d'identité (fichiers images/PDF) stockés dans le Storage. Ces données n'ont pas de format fixe prédéfini et nécessitent un stockage d'objets (Bucket) plutôt qu'une table classique.

---

## 🎥 Conseils pour la Vidéo (Script "Vibe Coding")

**L'Introduction (Le "Vibe") :** 
"On a voulu créer Dar-Connect en mode agile. Pas de temps perdu à configurer des serveurs Linux, on s'est concentrés sur l'expérience locataire."

**La Démo Technique :**
*   *Montrez l'Auth :* "Le locataire se connecte, c'est la Table A."
*   *Montrez la Réservation :* "Il choisit sa maison (Table B) et planifie une visite. Cela crée une ligne dans la Table C."
*   *Le point fort (Sécurité/RLS) :* "Grâce aux règles RLS de Supabase, même si je connais l'ID d'un autre locataire, je ne peux pas voir ses scans de cartes d'identité. La donnée est isolée au niveau de la ligne SQL."

**La Conclusion "Architecte" :** 
"On a choisi une architecture Serverless car c'est la seule qui permet d'avoir un SI robuste sans les contraintes de maintenance d'un Data Center physique (climatisation, pannes matérielles)."

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
