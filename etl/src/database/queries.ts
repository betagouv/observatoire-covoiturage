import fs from 'fs'
import { PoolClient } from 'pg'
import ora from 'ora'
import {readXlsx} from './../transform'

interface Xls{
  path: string,
  filename:string,
  sheet: string,
  startRow: number
}

interface Sql{
  path: string,
  filename:string
}

export const execQuery = async function (client:PoolClient,path:string,filename: string,values?:string[]):Promise<void> {
  const spinner = ora()
  try{
    spinner.start('Executing script '+filename)
    const sql = fs.readFileSync(path+filename).toString()
    if(Array(values)){
      const val = values
      await client.query(sql,val)
      spinner.succeed(filename+' executed')
    }
  }
  catch(err){
    spinner.fail('Error during script '+filename)
    console.log(err)
  }
}

export const importCSV = async function (client:PoolClient,tableDef:string, path:string, filename: string,delimiter:string):Promise<void> {
  const spinner = ora()
  try{
    spinner.start('Importing '+filename)
    const sql = `COPY ${tableDef}
    FROM '${path+filename}'
    DELIMITER '${delimiter}'
    ENCODING 'UTF8'
    CSV HEADER;`
    await client.query(sql)
    spinner.succeed(filename+' imported')
  }
  catch(err){
    spinner.fail('Error during import of '+filename)
    console.log(err)
  }
}

export const importXLSX = async function(client:PoolClient, xls:Xls,sql:Sql):Promise<void>{
  try{
    const sheet = await readXlsx(xls.path,xls.filename,xls.sheet,xls.startRow) 
    if (typeof sheet === "object" && sheet) {
      const data = JSON.stringify(sheet).replace(/'/g, "''")
      await execQuery(client,sql.path,sql.filename,[data])
    }
  }
  catch(err){
    console.log(err)
  }
}

export const importGeojson = async function name(client:PoolClient, geojson:Sql,sql:Sql):Promise<void>{
  try{
    const data = JSON.parse(fs.readFileSync(geojson.path+geojson.filename).toString()) 
    await execQuery(client,sql.path,sql.filename,[JSON.stringify(data.features)])
  }
  catch(err){
    console.log(err)
  }
}
