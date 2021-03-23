import { join } from 'path'
import { downloadFile } from './donwload'
import {PoolClient} from 'pg'
import pgConnection from './database/connection'
import {execQuery, importCSV, importXLSX, importGeojson} from './database/queries'


async function inseeDownload(){
  const path =join(__dirname, '../assets/insee/')
  await Promise.all([
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/5057840/mvtcommune2021-csv.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2019.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2020.zip'),
    downloadFile(path,'https://www.insee.fr/fr/statistiques/fichier/2510634/Intercommunalite_Metropole_au_01-01-2021.zip')
  ])
}
async function geoDownload(){
  const path =join(__dirname, '../assets/etalab/')
  await downloadFile(path,'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2019/geojson/communes-100m.geojson.gz','communes-100m.geojson.gz')
  await downloadFile(path,'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2019/geojson/communes-1000m.geojson.gz','communes-1000m.geojson.gz')
}
async function tablesCreation(client:PoolClient){
  const path =join(__dirname, './database/sql/perimeters/')
  await execQuery(client,path,'create_schema_perimeters.sql')
  await Promise.all([
    execQuery(client,path,'create_table_insee_perim_2019.sql'),
    execQuery(client,path,'create_table_insee_perim_2020.sql'),
    execQuery(client,path,'create_table_insee_perim_2021.sql'),
    execQuery(client,path,'create_table_insee_mvt_communes.sql')
  ])
}
async function tablesGeoCreation(client:PoolClient){
  const path =join(__dirname, './database/sql/perimeters/')
  await Promise.all([
    execQuery(client,path,'create_table_etalab_com_100m_2019.sql'),
    execQuery(client,path,'create_table_etalab_com_1000m_2019.sql')
  ])
}

async function importData(client:PoolClient){
  // import Intercommunalite_Metropole_au_01-01-2019.xls
  const xls = {
    path: join(__dirname, '../assets/insee/'),
    filename:'Intercommunalite_Metropole_au_01-01-2019.xls',
    sheet: 'Composition_communale',
    startRow: 5
  }
  const sql = {
    path: join(__dirname, './database/sql/perimeters/'),
    filename:'insert_table_insee_perim_2019.sql',
  }
  await importXLSX(client,xls,sql)
  
  // import Intercommunalite_Metropole_au_01-01-2020.xlsx
  xls.filename = 'Intercommunalite_Metropole_au_01-01-2020.xlsx'
  sql.filename = 'insert_table_insee_perim_2020.sql'
  await importXLSX(client,xls,sql)

  // import Intercommunalite_Metropole_au_01-01-2021.xlsx
  xls.filename = 'Intercommunalite-Metropole_au_01-01-2021.xlsx'
  sql.filename = 'insert_table_insee_perim_2021.sql'
  await importXLSX(client,xls,sql)
  
  // import mvtcommune2021.csv
  const csv={
    tableDef: 'perimeters.insee_mvt_communes(mod, date_eff, typecom_av, com_av, tncc_av, ncc_av, nccenr_av, libelle_av, typecom_ap, com_ap, tncc_ap, ncc_ap, nccenr_ap, libelle_ap)',
    path: join(__dirname, '../assets/insee/'),
    filename: 'mvtcommune2021.csv',
    separator:','
  }
  await importCSV(client,csv.tableDef,csv.path,csv.filename,csv.separator)
}

async function importGeo(client:PoolClient){
  // import communes-100m.geojson
  const geojson={
    path: join(__dirname, '../assets/etalab/'),
    filename:'communes-100m.geojson',
  }
  const sql = {
    path: join(__dirname, './database/sql/perimeters/'),
    filename:'insert_table_etalab_com_100m_2019.sql',
  }
  await importGeojson(client,geojson,sql)
  // import communes-1000m.geojson
  geojson.filename='communes-1000m.geojson'
  sql.filename='insert_table_etalab_com_1000m_2019.sql'
  await importGeojson(client,geojson,sql)
}

async function treatments(client:PoolClient){
  const path =join(__dirname, './database/sql/perimeters/')
  await Promise.all([
    execQuery(client,path,'create_view_evolution_com.sql'),
    execQuery(client,path,'create_table_passage_com.sql'),
    execQuery(client,path,'create_table_epci_2019.sql'),
    execQuery(client,path,'create_table_epci_2020.sql'),
    execQuery(client,path,'create_table_epci_2021.sql')
  ])
  await execQuery(client,path,'insert_table_passage_com.sql')
  await Promise.all([
    execQuery(client,path,'insert_table_epci_2019.sql'),
    execQuery(client,path,'insert_table_epci_2020.sql'),
    execQuery(client,path,'insert_table_epci_2021.sql')
  ])
}

export const perimeters = async function():Promise<void>{
  const client = await pgConnection()
  try{
    await inseeDownload()
    await geoDownload()
    if(client){
      await tablesCreation(client)
      await tablesGeoCreation(client)
      await importData(client)
      await importGeo(client)
      await treatments(client)
    }else{
      throw console.log('No connection to DB')
    }
      
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}






