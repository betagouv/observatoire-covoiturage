import {Pool, PoolClient} from 'pg'
import ora from 'ora'

async function pgConnection(): Promise<PoolClient | undefined> {
  const spinner = ora()
  try {
    spinner.start('Connecting database')
    const pool = new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: Number(process.env.PGPORT)
    })
    spinner.succeed("Database connected")
    return pool.connect()
  }
  catch(err){
    spinner.fail('Error during connection...')
    console.log(err)
  }
}

export default pgConnection