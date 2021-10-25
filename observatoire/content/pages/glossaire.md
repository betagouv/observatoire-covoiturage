---
title: "Glossaire des indicateurs"
description: "Ce document présente les méthodes de calcul utilisées pour les indicateurs de l'observatoire."
img:
alt:
---
### <a name="operateur"></a>Opérateurs
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : opérateur(s) actif(s)</p>
</div>
Un opérateur désigne une personne morale opérant un service de covoiturage pour mettre en relation les covoitureurs. Le nombre d'opérateur correspond à la somme des services de covoiturage différents actifs dans le <a href="https://covoiturage.beta.gouv.fr/operateurs/">Registre de Preuve de Covoiturage</a>. Un service est considéré comme actif à partir du moment où un trajet a été remonté dans le registre. A titre d'exemple sur une période donnée, si l'opérateur A fait remonter 5 trajets, que l'opérateur B fait remonter 1 trajet et que l'opérateur C a fait remonter 0 trajet, alors l'indicateur sera de "2 opérateur(s)".

### <a name="covoitureur"></a>Covoitureurs
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : covoitureur⸱euses</p>
</div>
Un covoitureur est un passager ou un conducteur qui a réalisé un trajet de covoiturage enregistré  dans le <a href="https://covoiturage.beta.gouv.fr">Registre de Preuve de Covoiturage</a>. Cet indicateur se base sur l'identifiant unique communiqué par l'opérateur utilisé et a pour objectif d'estimer le nombre de personne touchée par le covoiturage. Il vaut pour 1 à compter de son premier voyage avec un opérateur donné.

### <a name="trajet"></a>Trajets réalisés 
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : trajets réalisés</p>
</div>
Un trajet enregistré  dans le <a href="https://covoiturage.beta.gouv.fr">Registre de Preuve de Covoiturage</a> correspond à un couple passager / conducteur. A chaque passager est donc affecté un trajet.
Exemple : un conducteur réalise un déplacement avec deux passagers différents au sein de son véhicule, le nombre de trajets réalisés est de 2.

### <a name="passager"></a>Passagers transportés
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : nombre de personne(s) transporté(s)</p>
</div>
Un passager transporté est une personne ayant réalisé un trajet de covoiturage sans conduire de véhicules. Cet indicateur est calculé à partir du jeux de donnée <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> du Registre de Preuve de Covoiturage et tient compte du nombre de sièges réservés par le passager. Il se base sur le champ 'passenger_seats' du jeux de données qui est le nombre de sièges réservés par l'occupant passager. Il est donc soumis à une anonymisation concernant les maille géographique "solitaire" (suppression des trajets sur les communes dont la somme des trajets à l'arrivé ou au départ du territoire est < 6)

### <a name="vehicule"></a>Véhicules partagés
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : nombre de véhicule(s) partagé(s)</p>
</div>
Un véhicule partagé est un véhicule motorisé ayant réalisé un trajet de covoiturage avec au moins 2 covoitureurs transportés. Cet indicateur est calculé à partir du jeux de donnée <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> du Registre de Preuve de Covoiturage. Il se base sur le champ 'trip_id' du jeux de données qui est l'identifiant permettant de recouper plusieurs couples passager/conducteur dans un même véhicule.

### <a name="occupation"></a>Occupation moyenne des véhicules partagés
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : nombre de personne(s) par véhicule</p>
</div>
Cet indicateur représente le nombre de personnes moyen par véhicule partagés à l'arrivé ou au départ d'un territoire. Il est calculé à partir du jeux de donnée <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> du Registre de Preuve de Covoiturage. Sa formule de calcul est : (somme des sièges réservés (champ 'passenger_seats') à l'arrivé ou au départ d'un territoire / nombre des véhicules partagés (champ 'trip_id') ayant transité sur le territoire) + 1 (afin d'inclure le conducteur du véhicule)

### <a name="aire"></a>Aires de covoiturage
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : lieu de covoiturage</p>
</div>
Cet indicateur représente les lieux de covoiturage classés par type suivant la nomenclature établie par le Point d’Accès National aux données de transport <a href="https://transport.data.gouv.fr/datasets/base-nationale-des-lieux-de-covoiturage">"transport.data.gouv.fr"</a>