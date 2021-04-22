CREATE OR REPLACE VIEW perimeters.evolution_com as
SELECT date_part('year',date_eff::date)::int as annee,com_av,libelle_av, com_ap,libelle_ap,mod,
CASE WHEN mod = 20 THEN 'création'
WHEN mod = 21 THEN 'rétablissement'
WHEN mod = 30 THEN 'suppression'
WHEN mod = 31 THEN 'fusion simple'
WHEN mod = 32 THEN 'création de commune nouvelle'
WHEN mod = 33 THEN 'fusion association'
WHEN mod = 41 THEN 'Changement de code dû à un changement de département'
WHEN mod = 50 THEN 'Changement de code dû à un transfert de chef-lieu'
END::varchar as libelle_mod
from perimeters.insee_mvt_communes 
where (date_eff::date >= '2019-01-01')
and mod in (20,21,30,31,32,33,41,50)
and typecom_ap = 'COM'
and typecom_av = 'COM'
order by date_eff,com_ap;