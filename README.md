# 🛍️ E-commerce Bracelet Tunisie

Une plateforme e-commerce moderne et élégante dédiée à la vente de bracelets en Tunisie, développée avec React et Firebase.

🔗 **Démo en ligne**: [ecommerce-bracelet.vercel.app](https://ecommerce-bracelet.vercel.app)

## 📋 Description du projet

E-commerce Bracelet Tunisie est une application web complète permettant aux utilisateurs de parcourir, sélectionner et acheter des bracelets en ligne. Le projet offre une expérience utilisateur fluide avec gestion de panier, profil utilisateur personnalisable, et un système de commandes intégré.

## 🚀 Technologies utilisées

### Frontend
- **React.js** - Bibliothèque JavaScript pour l'interface utilisateur
- **Vite** - Outil de build moderne et rapide
- **Tailwind CSS** - Framework CSS utilitaire pour le styling
- **Context API** - Gestion d'état globale de l'application

### Backend & Base de données
- **Firebase Firestore** - Base de données NoSQL en temps réel
- **Firebase Authentication** - Système d'authentification sécurisé

### Autres
- **UUID** - Génération d'identifiants uniques
- **localStorage** - Stockage local pour la persistance de session
- **Vercel** - Plateforme de déploiement

## 📦 Prérequis

- **Node.js** (dernière version LTS recommandée)
- **npm** ou **yarn**
- Un navigateur web moderne

## 🔧 Installation et lancement

### 1. Cloner le repository
```bash
git clone https://github.com/mstpha/Ecommerce-Bracelet-Tunisie.git
cd Ecommerce-Bracelet-Tunisie
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer l'application en mode développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### 4. Build pour la production
```bash
npm run build
```

## 📁 Structure du projet

```
Ecommerce-Bracelet-Tunisie/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants React réutilisables
│   ├── context/         # Context API pour la gestion d'état
│   ├── services/        # Services Firebase (userService)
│   ├── data/            # Fichier JSON des produits
│   ├── pages/           # Pages de l'application
│   ├── App.jsx          # Composant principal
│   └── main.jsx         # Point d'entrée de l'application
├── package.json         # Dépendances et scripts
└── README.md           # Documentation
```

## ✨ Fonctionnalités implémentées

### 🔐 Authentification
- **Inscription** - Création de nouveau compte utilisateur
- **Connexion** - Authentification sécurisée via Firebase
- **Gestion de session** - Persistance avec UUID et localStorage

[Ici mettre l'image de la page de connexion/inscription]

### 👤 Profil utilisateur
- Modification du nom
- Modification de l'email
- Modification du numéro de téléphone
- Modification de l'adresse
- Historique des commandes

[Ici mettre l'image de la page de profil]

### 🛒 Catalogue de produits
- **Affichage des produits** - Liste complète des bracelets disponibles
- **Produits recommandés** - Section dédiée aux articles mis en avant
- **Stockage JSON** - Données des produits organisées et facilement modifiables

[Ici mettre l'image de la page catalogue avec la section produits recommandés]

### 📦 Page détail produit
- Informations complètes sur le produit
- **Achat instantané** - Redirection directe vers le checkout
- **Ajout au panier** - Option pour continuer le shopping

[Ici mettre l'image de la page détail produit]

### 🛍️ Gestion du panier
- **Menu latéral** - Affichage du panier en sidebar
- Visualisation des articles ajoutés
- Calcul du total en temps réel
- Modification des quantités
- Suppression d'articles

[Ici mettre l'image du menu panier latéral]

### 💳 Processus de commande
- **Page de checkout** - Formulaire de finalisation d'achat
- **Paiement simulé** - Formulaire de saisie de carte bancaire (données fictives)
- Confirmation de commande
- Enregistrement dans l'historique utilisateur

[Ici mettre l'image de la page de checkout]

### 🎨 Interface utilisateur
- Design responsive adapté à tous les écrans
- Navigation intuitive
- Animations et transitions fluides avec Tailwind CSS
- Expérience utilisateur optimisée

## 🎓 Contexte

Ce projet a été développé dans le cadre d'un projet universitaire, démontrant les compétences en développement web full-stack avec les technologies modernes React et Firebase.

## 👨‍💻 Auteur

**Mustapha** - [GitHub](https://github.com/mstpha)

## 📝 Licence

Ce projet est un projet universitaire à des fins éducatives.

---

⭐ Si vous aimez ce projet, n'hésitez pas à lui donner une étoile sur GitHub !