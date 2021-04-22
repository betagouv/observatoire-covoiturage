import { join } from 'path'
import axios from 'axios'
import { downloadFile } from './donwload'
import {PoolClient} from 'pg'
import pgConnection from './database/connection'
import {execQuery, importCSV} from './database/queries'

async function tablesCreation(client:PoolClient){
  const path =join(__dirname, './database/sql/covoiturage/')
  await execQuery(client,path,'create_schema_covoiturage.sql')
  await execQuery(client,path,'create_table_aires.sql')
}

async function geoTreatment(client:PoolClient){
  const path =join(__dirname, './database/sql/covoiturage/')
  await execQuery(client,path,'update_table_aires.sql')
}


export const aire_covoit = async function():Promise<void>{
  const client = await pgConnection()
  try{
    const path =join(__dirname, '../assets/transport_data_gouv/')
    const dataset = await axios.get('https://transport.data.gouv.fr/api/datasets/5d6eaffc8b4c417cdc452ac3')
    await downloadFile(path,dataset.data.resources[0].original_url,'aires.csv')
    if(client){
      await tablesCreation(client)
      // import aires.csv
      const csv={
        tableDef: 'covoiturage.aires(id_lieu,nom_lieu,ad_lieu,com_lieu,insee,type,date_maj,ouvert,source,xlong,ylat,nbre_pl,nbre_pmr,duree,horaires,proprio,lumiere,comm)',
        path: path,
        filename: 'aires.csv',
        separator:','
      }
      await importCSV(client,csv.tableDef,csv.path,csv.filename,csv.separator)
      await geoTreatment(client)
    }else{
      throw console.log('No connection to DB')
    }
      
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}