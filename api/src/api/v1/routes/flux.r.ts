import { FastifyPluginAsync } from 'fastify'
import fluxHandler from '../handlers/flux.h'
import fluxSchema from '../schemas/flux.s'
import fluxTypes from '../types/flux.t'


const routes:FastifyPluginAsync = async (server) => {
  server.get<fluxTypes.monthly>('/passengers_monthly_flux',{schema:fluxSchema.passengersMonthly}, fluxHandler.passengersMonthly)
  server.get('/monthly_flux/last',{schema:fluxSchema.lastRecordJourneysMonthly}, fluxHandler.lastRecordMonthlyFlux)
  server.get<fluxTypes.monthly>('/test',{schema:fluxSchema.passengersMonthly},async (req, reply) => {
    try {
      const client = await server.pg.connect()
      const sql = `SELECT l_territory_1 as ter_1, lng_1, lat_1,
      l_territory_2 as ter_2, lng_2, lat_2,
      passengers,distance,duration 
      FROM monthly_flux
      WHERE year = '${req.query.year}' 
      AND month = '${req.query.month}' 
      AND type = '${req.query.t}' 
      AND territory_1 <> territory_2;`
      const result = await client.query(sql)
      if (!result.rows) {
        reply.code(404).send(new Error('page not found'))
      }
      else if (result.rows.length === 0) {
        reply.code(404).send(new Error('Pas de données disponibles'))
      }
      reply.send(result.rows)
      client.release()
    } catch (err) {
      reply.send(err)
    }
  })
}

export default routes
