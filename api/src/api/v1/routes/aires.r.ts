import { FastifyPluginAsync } from 'fastify'
import airesHandler from '../handlers/aires.h'
import airesSchema from '../schemas/aires.s'
import airesTypes from '../types/aires.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<airesTypes.byTerritory>('/aires_covoiturage',{schema:airesSchema.all}, airesHandler.all)
}

export default routes
