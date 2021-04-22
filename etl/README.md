# Observatoire du covoiturage au quotidien

Programme d'ETL (Extract-Transform-Load) permettant de construire l'entrepôt de données de l'observatoire du covoiturage au quotidien

## Prérequis
- Une base de données PostgreSQL 9 et + et son extension PostGIS version 2 et +
- 7zip doit être installé sur la machine exécutant le programme
- Node.js 10 et +

## Installation et utilisation
1. Cloner le repository :
```
  git clone https://github.com/betagouv/observatoire-covoiturage.git
```
2. Installer les dépendances :
```
  npm install
```
3. Créer le fichier de configuration .env :
```
  cp .env.example .env
```
4. Modifier les paramètres de connection à la base de données dans le fichier .env

5. Exécuter le programme :
```
  npm run start
```

## Données de l'entrepôt
### Programme perimeters.ts
Ce programme permet de construire le référentiel territorial de l'observatoire qui nécessite les subdivisions administratives suivantes :
 - Communes et arrondissements municipaux
 - Intercommunalités
 - Autorités organisatrices de la mobilité
 - Départements 
 - Régions
 - Pays
 Les données sont millésimés depuis 2019 et une table de passage entre les millésimes communaux a été construite afin de faciliter l'appariement de données alphanumériques avec les données géographiques

 Les données sources sont:
  - le [Code officiel géographique de l'Insee](https://www.insee.fr/fr/information/2560452)
  - la base [Admin-Express de l'IGN](https://www.data.gouv.fr/fr/datasets/admin-express/)
  - [la liste et composition des Autorités Organisatrices de la Mobilité du CEREMA](https://www.data.gouv.fr/fr/datasets/liste-et-composition-des-autorites-organisatrices-de-la-mobilite-aom/)
  - [la base des pays du monde de la commission européenne](https://gisco-services.ec.europa.eu/distribution/v2/countries/)

  Pour l'exploitation statistique, les données géographiques de la base admin-express ont été resimplifié.
  Le millésime 2021 a été construit par fusion des communes du millésime 2020 et prenant compte du cog 2021 de l'INSEE.

### Programme registre_covoit.ts
Ce programme récupére et compile en une seule table toutes les [données ouverte en open-data du registre de preuve de covoiturage](https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/)

### Programme aire_covoit.ts
Ce programme récupére la [base nationale consolidée des lieux de covoiturage](https://transport.data.gouv.fr/datasets/base-nationale-des-lieux-de-covoiturage/)

# License

DINUM, 2020-2021.

The source code is published under [Apache license 2.0](https://github.com/betagouv/observatoire-covoiturage/LICENSE).
