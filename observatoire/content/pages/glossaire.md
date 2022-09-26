---
title: "Glossaire des indicateurs"
description: "Ce document présente les méthodes de calcul utilisées pour les indicateurs de l'observatoire."
img:
alt:
---
<div class="glossaire">

### <a id="operateur"></a>Opérateurs
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : opérateur(s) actif(s)</p>
</div>
Un opérateur désigne une personne morale opérant un service de covoiturage pour mettre en relation les covoitureurs. Le nombre d'opérateur correspond à la somme des services de covoiturage différents actifs dans le <a href="https://covoiturage.beta.gouv.fr/operateurs/">Registre de Preuve de Covoiturage</a>. Un service est considéré comme actif à partir du moment où un trajet a été remonté dans le registre. A titre d'exemple sur une période donnée, si l'opérateur A fait remonter 5 trajets, que l'opérateur B fait remonter 1 trajet et que l'opérateur C a fait remonter 0 trajet, alors l'indicateur sera de "2 opérateur(s)".

### <a id="covoitureur"></a>Covoitureurs
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : covoitureur⸱euses</p>
</div>
Un covoitureur est un passager ou un conducteur qui a réalisé un trajet de covoiturage enregistré  dans le <a href="https://covoiturage.beta.gouv.fr">Registre de Preuve de Covoiturage</a>. Cet indicateur se base sur l'identifiant unique communiqué par l'opérateur utilisé et a pour objectif d'estimer le nombre de personne touchée par le covoiturage. Il vaut pour 1 à compter de son premier voyage avec un opérateur donné.

### <a id="trajet"></a>Trajets réalisés 
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : trajets réalisés</p>
</div>
Un trajet enregistré  dans le <a href="https://covoiturage.beta.gouv.fr">Registre de Preuve de Covoiturage</a> correspond à un couple passager / conducteur. A chaque passager est donc affecté un trajet.
Exemple : un conducteur réalise un déplacement avec deux passagers différents au sein de son véhicule, le nombre de trajets réalisés est de 2.

### <a id="passager"></a>Passagers transportés
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : nombre de personne(s) transporté(s)</p>
</div>
Un passager transporté est une personne ayant réalisé un trajet de covoiturage sans conduire de véhicules. Cet indicateur est calculé à partir du jeu de données <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> du Registre de Preuve de Covoiturage et tient compte du nombre de sièges réservés par le passager. Il se base sur le champ 'passenger_seats' du jeu de données qui est le nombre de sièges réservés par l'occupant passager. Il est soumis à une anonymisation concernant les mailles géographiques "solitaires" (suppression des trajets sur les communes dont la somme des trajets à l'arrivé ou au départ de cette commune est < 6.)

### <a id="vehicule"></a>Véhicules partagés
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : nombre de véhicule(s) partagé(s)</p>
</div>
Un véhicule partagé est un véhicule motorisé ayant réalisé un trajet de covoiturage avec au moins 2 covoitureurs transportés  (1 conducteur et au minimum 1 passager). Cet indicateur est calculé à partir du jeu de données <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> du Registre de Preuve de Covoiturage. Il se base sur le champ 'trip_id' du jeu de données qui est l'identifiant permettant de recouper plusieurs couples passager/conducteur dans un même véhicule.

### <a id="occupation"></a>Taux d'occupation des véhicules partagés
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : Taux d'occupation des véhicules partagés</p>
</div>
Cet indicateur représente le taux d'occupation des véhicules partagés à l'arrivé ou au départ d'un territoire. Il est calculé à partir du jeu de données <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> du Registre de Preuve de Covoiturage.<br/> 
Sa formule de calcul est : (somme des distances des passagers + somme des distances des conducteurs ) / somme des distances des conducteurs.<br/>
La distance du conducteur est approximé en sélectionnant la distance du trajet (journey) réalisé par le passager s’étant déplacé sur la distance la plus longue, pour un voyage (trip) donné.

### <a id="aire"></a>Aires de covoiturage
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : lieu de covoiturage</p>
</div>
Cet indicateur représente les lieux de covoiturage classés par type suivant la nomenclature établie par le Point d’Accès National aux données de transport <a href="https://transport.data.gouv.fr/datasets/base-nationale-des-lieux-de-covoiturage">"transport.data.gouv.fr"</a>.

### <a id="km_parcourus"></a>Distance parcouru
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : km parcourus</p>
</div>
Cet indicateur représente la somme des distances parcourues par chacun des couples passager / conducteur des jeux de données <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> sur le territoire sélectionné.

### <a id="distance_moyenne"></a>Distance moyenne
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : km</p>
</div>
Cet indicateur représente la moyenne des distances parcourues par les couples passager / conducteur des jeux de données <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a> sur le territoire sélectionné.

### <a id="co2"></a>CO₂ économisé
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : tonnes de CO₂ économisées</p>
</div>
Cet indicateur représente la quantité de CO₂ économisée par les trajets issuent des jeux de données <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a>.
Les économies de CO2 sont calculées en partant du principe que si le passager s’est déplacé en covoiturage, alors il n’a pas utilisé son véhicule personnel. Ceci représente donc un déplacement en moins réalisé par une voiture et autant de CO2 économisé. Les caractéristiques spécifiques des véhicules ne sont pas connues par le service. De ce fait, nous utilisons la moyenne des rejets de l’ensemble des voitures particulières immatriculées en France. Selon, l’ADEME (Agence de l’Environnement et de la Maîtrise de l'Énergie), les émissions moyennes de Gaz à Effet de Serre (GES) par véhicule et par kilomètre (du puits à la roue) sont de +195 g CO2 équivalent par véhicule-kilomètre (chiffres de 2016).

### <a id="petrole"></a>Pétrole économisé
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Unité : litres de pétrole économisés</p>
</div>
Cet indicateur représente la quantité de pétrole économisé par les trajets issuent des jeux de données <a href="https://www.data.gouv.fr/fr/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/">"Trajets réalisés en covoiturage"</a>.
Les économies d’énergie en kilogramme équivalent pétrole (kep) sont calculées en partant du principe que si le passager s’est déplacé en covoiturage, alors il n’a pas utilisé son véhicule personnel. Ceci représente donc un déplacement en moins réalisé par une voiture et autant de kep économisé. Les caractéristiques spécifiques des véhicules ne sont pas connues par le service. De ce fait, nous utilisons la moyenne kep des voitures particulières immatriculées en France. Selon, l’ADEME (Agence de l’Environnement et de la Maîtrise de l'Énergie), les chiffres clés 2015 - Climat, air et énergie, les kep par véhicule particulier et par kilomètre (du puits à la roue) sont de 0,0636 kep / km / véhicule particulier en moyenne.
</div>

### <a id="new_covoit"></a>Primo covoitureurs
<div role="alert" class="fr-alert fr-alert--info">
    <p class="fr-alert__title">Nouveaux covoitureurs</p>
</div>
Cet indicateur représente une estimation des nouveaux covoitureurs  dans le <a href="https://covoiturage.beta.gouv.fr">Registre de Preuve de Covoiturage</a>. 
Cet indicateur est calculé chaque mois et donne un ordre de grandeur mais il comporte un biais non négligeable. Nous additionnons les primo-conducteurs ou primo-passagers de chaque opérateur, les utilisateurs ayant un compte chez plusieurs opérateurs sont donc compter plusieurs fois.
</div>