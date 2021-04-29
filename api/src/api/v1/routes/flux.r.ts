import { FastifyPluginAsync } from 'fastify'
import fluxHandler from '../handlers/flux.h'
import fluxSchema from '../schemas/flux.s'


const routes:FastifyPluginAsync = async (server) => {
  
  server.get('/monthly_flux',{schema:fluxSchema.monthly}, fluxHandler.monthly)
}

export default routes
