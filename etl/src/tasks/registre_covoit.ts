import fs from 'fs'
import { join } from 'path'
import axios from 'axios'
import csv from 'csv-parser'
import ora from 'ora'
import { downloadFile } from '../extract'
import {PoolClient} from 'pg'
import pgConnection from '../database/connection'
import {execQuery} from '../load'

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

export const importFile = function(client:PoolClient,path:string, file:string):Promise<void>{
  const spinner = ora()
  return new Promise((resolve, reject) => {
    let table:String
    let columns:String
    let tableDef:String
    let dataset:Array<object> = []
    const chunkSize = 100000
    spinner.start('Start importing '+file)
    fs.createReadStream(path+file)
    .pipe(csv({separator:';'}))
    .on('headers', async (headers) => {
      const csvHeaders = headers.map((header:string) => {
        return header.replace(/﻿/g,'')
      }).join(';')
      table = 'covoiturage.temp_'+file.slice(0,-4).replace(/-/g,'_')
      columns = csvHeaders.replace(/;/g,' varchar,')+' varchar'
      tableDef = csvHeaders.replace(/;/g,',')
      if(client){
        await client.query(`DROP TABLE IF EXISTS ${table};`)
        await client.query(`CREATE TABLE IF NOT EXISTS ${table}(id serial,${columns});`)
      }else{
        throw console.log('No connection to DB')
      }
    })
    .on('data', (data) => dataset.push(data))
    .on('end', async () => {
      if(client){
        for (let i = 0; i < dataset.length; i+= chunkSize){
          await client.query(`INSERT INTO ${table}(${tableDef})
          SELECT * FROM json_to_recordset('${JSON.stringify(dataset.slice(i,i+chunkSize)).replace(/'/g, "''")}')
          as temp(${columns});`)
        }
        spinner.succeed(file+' imported')
        resolve()
      }else{
        throw console.log('No connection to DB')
      }
    })
    .on('error', (err) => {
      spinner.fail('Error during importinf '+file)
      console.log(err)
      reject()
    })
  })
}

async function tempTables(client:PoolClient,files:Array<File>):Promise<void>{
  try{
    const path =join(__dirname, '../../assets/registre_covoiturage/')
    for(const file of files){
      await downloadFile(path,file.url,file.name)
      await importFile(client,path,file.name)
    }
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