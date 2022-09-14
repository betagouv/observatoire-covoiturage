import { FastifyPluginAsync } from 'fastify'
import evolutionHandler from '../handlers/evolution.h'
import evolutionSchema from '../schemas/evolution.s'
import evolutionTypes from '../types/evolution.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<evolutionTypes.monthly>('/evolution/monthly',{schema:evolutionSchema.evolMonthly}, evolutionHandler.EvolMonthly)
}

export default routes
