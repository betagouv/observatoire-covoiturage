import { join } from 'path'
import {PoolClient} from 'pg'
import pgConnection from '../database/connection'
import {execQuery} from '../load'

async function createMaterializedViews(client:PoolClient){
  const path =join(__dirname, '../database/sql/covoiturage/')
  await Promise.all([
    execQuery(client,path,'refresh_m_view_territories_points.sql'),
    execQuery(client,path,'refresh_m_view_journeys_monthly_flux.sql'),
    execQuery(client,path,'refresh_m_view_journeys_monthly_occupation_rate.sql'),
  ])
}

export const main = async function():Promise<void>{
  const client = await pgConnection()
  try{
    if(client){
      await createMaterializedViews(client)
    }else{
      throw console.log('No connection to DB')
    }
    console.log("All done")
    process.exit() 
  }
  catch(err){
    console.log(err)
    process.exit(1)
  }  
}

main()