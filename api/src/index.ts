import 'module-alias/register'
import fastify from 'fastify'
import configServer from './config/server'
import db from './config/db'



const PORT = Number(process.env.PORT) || 3000
const DOMAIN = process.env.DOMAIN || "0.0.0.0"


const server = fastify({
  logger: true
})  

async function start():Promise<void> {
  try { 
    server.register(db)  
    server.register(configServer) 
    server.listen(PORT, DOMAIN, (err, address) => {
      server.log.info(`server listening on ${address}`)
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()