import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import evolutionTypes from '../types/evolution.t'

export default class evolutionHandler {
  static pg: FastifyInstance["pg"]  

  static async EvolMonthly(request: FastifyRequest<evolutionTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT b.year,
        b.month,
        sum(a.journeys) AS journeys,
        sum(a.passengers) AS passengers,
        sum(a.distance) AS distance,
        sum(a.duration) AS duration,
        b.journeys AS trips,
        b.has_incentive,
        b.occupation_rate
        FROM monthly_flux a
        LEFT JOIN monthly_occupation b ON (a.territory_1 = b.territory OR a.territory_2 = b.territory) 
        AND a.type = b.type AND a.year = b.year AND a.month = b.month
        WHERE concat(b.year::varchar,TO_CHAR(b.month, 'fm00'))::integer <= ${request.query.year+String(request.query.month).padStart(2, '0')} 
        AND b.type = '${request.query.t}'
        AND b.territory = '${request.query.code}'
        GROUP BY b.year,b.month,b.journeys,b.has_incentive,b.occupation_rate
        ORDER BY (b.year,b.month) DESC
        LIMIT 25;
      `
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
  }
}
