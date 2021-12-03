import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import fluxTypes from '../types/flux.t'

export default class fluxHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année et le type de territoire en paramètres
  static async journeysMonthly(request: FastifyRequest<fluxTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT territory_1, l_territory_1, lng_1, lat_1,
      territory_2, l_territory_2, lng_2, lat_2,
      journeys, passengers,distance,duration 
      FROM monthly_flux
      WHERE year = '${request.query.year}' 
      AND month = '${request.query.month}' 
      AND type = '${request.query.t}' 
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
  // Retourne l'année et le mois du dernier enregistrement de la vue matérialisée covoiturage.journeys_monthly_flux
  static async lastRecordJourneysMonthly(request: FastifyRequest, reply: FastifyReply):Promise<void>{
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
  
