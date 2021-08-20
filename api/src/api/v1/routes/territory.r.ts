import { FastifyPluginAsync } from 'fastify'
import territoryHandler from '../handlers/territory.h'
import territorySchema from '../schemas/territory.s'
import territoryTypes from '../types/territory.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<territoryTypes.list>('/territories',{schema:territorySchema.territoriesList}, territoryHandler.territoriesList)
}

export default routes