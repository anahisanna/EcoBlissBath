# Installation du projet
1. Téléchargez ou clonez le dépôt
2. Depuis un terminal ouert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`
3. Ouvrez le site depuis la page http://localhost:8080 

Nb : à l'étape 2, ne pas ajouter le `sudo` si vous êtes sous Windows (sauf dernière version de Windows 11) (PowerShell ou Shell) : sudo n'existant pas et Docker Desktop configurant automatiquement Docker pour ne pas avoir besoin des droits administrateur.
README

🛒 EcoBlissBath - Tests Automatisés 🧜
Ce projet contient des tests automatisés pour l'application EcoBlissBath, un site e-commerce spécialisé dans la vente de produits de beauté écoresponsables.
📌 Prérequis
Avant d’exécuter les tests, assurez-vous d’avoir :
Docker & Docker Compose installés sur votre machine
Node.js (version 14 ou supérieure)
npm ou yarn
Cypress installé (npm install cypress)
🚀 Installation & Lancement du Projet
1️⃣ Cloner le dépôt
git clone https://github.com/anahisanna/EcoBlissBath.git
cd EcoBlissBath

2️⃣ Lancer l’application avec Docker
sudo docker-compose up --build

➡️ Ouvrir l’application sur http://localhost:8080
🧪 Exécution des Tests Automatisés
3️⃣ Installer les dépendances Cypress
npm install

4️⃣ Lancer les tests en mode interface graphique
npx cypress open

➡️ Sélectionner E2E Testing puis Chrome ou Electron pour exécuter les tests.
5️⃣ Lancer les tests en mode headless (console)
npx cypress run

💡 Cette commande exécute tous les tests sans ouvrir l'interface graphique.
🌜 Structure des Tests
cypress/e2e/login_tests.cy.js → Tests de connexion
cypress/e2e/panier_tests.cy.js → Tests du panier
cypress/e2e/api_tests.cy.js → Tests API
cypress/e2e/smoke_tests.cy.js → Smoke tests
🛠 Problèmes & Corrections
Bug : Ajout de produits hors stock possible → Actuellement, il est possible d’ajouter un produit en rupture de stock au panier, ce qui est une anomalie.
Bug : Le panier accepte plus de 20 produits → La limite n'est pas respectée.
Bug UX : Pas de message d'erreur pour quantité négative → L’utilisateur peut entrer une quantité négative sans recevoir d’avertissement.
💡 Contribution
Forker ce dépôt.
Créer une branche pour vos modifications :
git checkout -b feature-nouvelle-fonctionnalite

Ajouter vos changements et pousser :
git push origin feature-nouvelle-fonctionnalite

Ouvrir une Pull Request.

🔎 Vérifie si ce README correspond bien à tes besoins ! 😊🚀

