import 'module-alias/register'
import fastify from 'fastify'
import configServer from '@/config/server'
import db from '@/config/db'



const PORT = Number(process.env.PORT) || 3000
const DOMAIN = process.env.DOMAIN || "http://127.0.0.1"


const server = fastify()  
const init = async () => {
  try { 
    server.register(db)  
    server.register(configServer) 
    server.listen(PORT, DOMAIN, (err, address) => {
      if (err) throw err
      console.log(`server listening on ${address}`)
    })
  } catch (err) {
    console.log(err)
    server.log.error(err)
    process.exit(1)
  }
}
init()