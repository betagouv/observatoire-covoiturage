import { FastifyPluginAsync } from 'fastify'
import fluxHandler from '../handlers/flux.h'
import fluxSchema from '../schemas/flux.s'
import fluxTypes from '../types/flux.t'


const routes:FastifyPluginAsync = async (server) => {
  
  server.get<fluxTypes.monthly>('/monthly_flux',{schema:fluxSchema.monthly}, fluxHandler.monthly)
}

export default routes
