import { FastifyPluginAsync } from 'fastify'
import territoryHandler from '../handlers/territory.h'
import territorySchema from '../schemas/territory.s'
import territoryTypes from '../types/territory.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<territoryTypes.list>('/territories',{schema:territorySchema.territoriesList}, territoryHandler.territoriesList)
  server.get<territoryTypes.single>('/territory',{schema:territorySchema.territoriesList}, territoryHandler.singleTerritory)
  server.get<territoryTypes.indicators>('/indicators',{schema:territorySchema.territoryIndicators}, territoryHandler.indicators)
  server.get<territoryTypes.indicators>('/best_journeys',{schema:territorySchema.territoryBestJourneys}, territoryHandler.BestJourneys)
  server.get<territoryTypes.indicators>('/journeys_by_hours',{schema:territorySchema.territoryJourneysByHours}, territoryHandler.JourneysByHours)
  server.get<territoryTypes.indicators>('/journeys_by_distance',{schema:territorySchema.territoryJourneysByDistance}, territoryHandler.JourneysByDistance)
  server.get<territoryTypes.list>('/aom',{schema:territorySchema.territoryAom}, territoryHandler.getAom)
}

export default routes