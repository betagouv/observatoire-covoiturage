import { FastifyPluginAsync } from 'fastify'
import fluxHandler from '../handlers/flux.h'
import fluxSchema from '../schemas/flux.s'
import fluxTypes from '../types/flux.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<fluxTypes.monthly>('/journeys_monthly_flux',{schema:fluxSchema.journeysMonthly}, fluxHandler.journeysMonthly)
  server.get('/journeys_monthly_flux/last',{schema:fluxSchema.lastRecordJourneysMonthly}, fluxHandler.lastRecordJourneysMonthly)
}

export default routes
