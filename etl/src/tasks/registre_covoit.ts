import fs from 'fs'
import { join } from 'path'
import axios from 'axios'
import csv from 'csv-parser'
import { downloadFile } from '../extract'
import {PoolClient} from 'pg'
import pgConnection from '../database/connection'
import {execQuery, importCSV} from '../load'

interface File{
  url: string,
  name:string,
  table: string
}

async function filesToImport(url:string){
  try{
    const dataset = await axios.get(url)
    const files:Array<File>= []
    for(const resource of dataset.data.resources){
      const file={
        url:resource.url,
        name: resource.title,
        table: 'covoiturage.temp_'+resource.title.slice(0,-4).replace(/-/g,'_')
      }
      files.push(file)
    }
    return files
  }
  catch(err){
    console.log(err)
  }
}

export const importFile = function(client:PoolClient,path:string, file:File):Promise<void>{
  return new Promise((resolve, reject) => {
    fs.createReadStream(path+file.name)
    .pipe(csv())
    .on('headers', async (headers) => {
      const csvHeaders = headers[0].substring(1)
      const table = 'covoiturage.temp_'+file.name.slice(0,-4).replace(/-/g,'_')
      const columns = 'id serial,'+csvHeaders.replace(/;/g,' varchar,')+' varchar'
      const csv={
        tableDef: table+'('+csvHeaders.replace(/;/g,',')+')',
        path: path,
        filename: file.name,
        separator:';'
      }
      if(client){
        await client.query(`DROP TABLE IF EXISTS ${table};`)
        await client.query(`CREATE TABLE IF NOT EXISTS ${table}(${columns});`)
        await importCSV(client,csv.tableDef,csv.path,csv.filename,csv.separator)
        resolve()
      }else{
        throw console.log('No connection to DB')
      }
    })
    .on('error',  reject)
  })
}

async function tempTables(client:PoolClient,files:Array<File>):Promise<void>{
  try{
    const path =join(__dirname, '../../assets/registre_covoiturage/')
    await Promise.all(files.map(async (file) =>{
        await downloadFile(path,file.url,file.name)
        await importFile(client,path,file)
      })
    )    
  }
  catch(err){
    console.log(err)
  }
}
async function treatments(client:PoolClient,files:Array<File>):Promise<void>{
  const path =join(__dirname, '../database/sql/covoiturage/')
  await execQuery(client,path,'create_table_registre.sql')
  await execQuery(client,path,'insert_table_registre.sql')
  for(const file of files){
    await client.query(`DROP TABLE IF EXISTS ${file.table};`) 
  }
}

export const registre_covoit = async function():Promise<void>{
  try{
    const client = await pgConnection()
    const files = await filesToImport('https://www.data.gouv.fr/api/1/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/')
    if(client && files){
      await tempTables(client,files)
      await treatments(client,files)
    }else{
      throw console.log('No connection to DB')
    }    
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}