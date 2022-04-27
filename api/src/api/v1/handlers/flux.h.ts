import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import fluxTypes from '../types/flux.t'

export default class fluxHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la table monthly_flux pour le mois et l'année et le type de territoire en paramètres
  static async passengersMonthly(request: FastifyRequest<fluxTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT l_territory_1 as ter_1, lng_1, lat_1,
      l_territory_2 as ter_2, lng_2, lat_2,
      passengers,distance,duration 
      FROM monthly_flux
      WHERE year = '${request.query.year}' 
      AND month = '${request.query.month}' 
      AND type = '${request.query.t}'
      ${request.query.code ? 
        `AND (territory_1 IN (
          SELECT ${request.query.t} FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.year}) t 
          WHERE ${request.query.t2} = '${request.query.code}'
        ) OR territory_2 IN (
          SELECT ${request.query.t} FROM (SELECT com,epci,aom,dep,reg,country FROM territories_code WHERE year = ${request.query.year}) t 
          WHERE ${request.query.t2} = '${request.query.code}'
        ))`
        : ''
      } 
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
  }
  // Retourne l'année et le mois du dernier enregistrement de la table monthly_flux
  static async lastRecordMonthlyFlux(request: FastifyRequest, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT distinct year,month FROM monthly_flux WHERE type ='com' ORDER BY year DESC,month desc LIMIT 1;`
      const {rows} = await client.query(sql)
      if (!rows) {
        reply.code(404).send(new Error('page not found'))
      }
      reply.send(rows[0])
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }
}
  
