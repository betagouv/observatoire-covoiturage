import { FastifyPluginAsync } from 'fastify'
import territoryHandler from '../handlers/territory.h'
import territorySchema from '../schemas/territory.s'
import territoryTypes from '../types/territory.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<territoryTypes.list>('/territories',{schema:territorySchema.territoriesList}, territoryHandler.territoriesList)
  server.get<territoryTypes.indicators>('/indicators',{schema:territorySchema.territoryIndicators}, territoryHandler.indicators)
  server.get<territoryTypes.indicators>('/best_journeys',{schema:territorySchema.territoryBestJourneys}, territoryHandler.BestJourneys)
}

export default routes