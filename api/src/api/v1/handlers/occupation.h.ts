import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import occupationTypes from '../types/occupation.t'

export default class occupationHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année en paramètres
  static async occupationMonthly(request: FastifyRequest<occupationTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT * FROM monthly_occupation
      WHERE year = '${request.query.year}' AND month = '${request.query.month}' AND type = '${request.query.t}'
      ${(request.query.t2 && request.query.code) ? 
        `AND territory IN (
          SELECT ${request.query.t} FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.year}) t 
          WHERE ${request.query.t2} = '${request.query.code}'
        )`
        : ''
      };`
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

  static async occupationEvolMonthly(request: FastifyRequest<occupationTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT year,month,type,territory,l_territory,journeys,has_incentive,occupation_rate FROM monthly_occupation
      WHERE concat(year::varchar,TO_CHAR(month, 'fm00'))::integer <= ${request.query.year+String(request.query.month).padStart(2, '0')} 
      AND type = '${request.query.t}'
      AND territory = '${request.query.code}'
      ORDER BY (year,month) DESC
      LIMIT 12;`
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
  
