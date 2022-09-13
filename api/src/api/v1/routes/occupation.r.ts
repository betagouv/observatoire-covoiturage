import { FastifyPluginAsync } from 'fastify'
import occupationHandler from '../handlers/occupation.h'
import occupationSchema from '../schemas/occupation.s'
import occupationTypes from '../types/occupation.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<occupationTypes.monthly>('/journeys_monthly_occupation',{schema:occupationSchema.occupationMonthly}, occupationHandler.occupationMonthly)
  server.get<occupationTypes.monthly>('/evolution/journeys_monthly_occupation',{schema:occupationSchema.occupationEvolMonthly}, occupationHandler.occupationEvolMonthly)
}

export default routes
