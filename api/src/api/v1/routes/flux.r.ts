import { FastifyPluginAsync } from 'fastify'
import fluxHandler from '../handlers/flux.h'
import fluxSchema from '../schemas/flux.s'
import fluxTypes from '../types/flux.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<fluxTypes.monthly>('/passengers_monthly_flux',{schema:fluxSchema.passengersMonthly}, fluxHandler.passengersMonthly)
  server.get('/monthly_flux/last',{schema:fluxSchema.lastRecordJourneysMonthly}, fluxHandler.lastRecordMonthlyFlux)
}

export default routes
