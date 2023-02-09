# Observatoire du covoiturage au quotidien

L'observatoire du covoiturage est l'un des outils du registre de preuve de covoiturage qui a pour but de certifier qu'un covoiturage a bien eu lieu.
Cet outil permettra de suivre l’évolution des pratiques du covoiturage courte-distance et d'évaluer l'impact des mesures prises afin d’adapter de façon agile les politiques publiques. Les collectivités et les entreprises pourront ainsi mieux piloter leurs stratégies de mobilités durables, notamment en faveur du covoiturage.

- Plus d'informations sur le [registre de preuve de covoiturage](https://covoiturage.beta.gouv.fr/)

## Prérequis
- `docker` et `docker-compose`

## Installation et utilisation
1. Cloner le repository :
```
  git clone https://github.com/betagouv/observatoire-covoiturage.git
```

2. Créer le fichier de configuration  de l'etl :
```
  cp etl/.env.example etl/.env
  
```
3. Modifier les paramètres de connection à la base de données dans le fichier .env

4. monter les containers :
```
  docker-compose up
```

## Services
| Service     | slug       | URL                        | Folder     |
| ----------- | ---------- | -------------------------- | ---------- |
| ETL         | `etl`      |                            | /etl       |
| Postgres    | `postgres` | postgresql://postgres:5432 | -          |

Vous pouvez utilisez pgAdmin 4 localement pour interagir avec les données de la base de données. 

# License

DINUM, 2020-2023.

The source code is published under [Apache license 2.0](https://github.com/betagouv/observatoire-covoiturage/LICENSE).
