import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import fluxTypes from '../types/flux.t'

export default class fluxHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année en paramètres
  static async journeysMonthly(request: FastifyRequest<fluxTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT com1,l_com1,com1_lng,com1_lat,com2,l_com2,com2_lng,com2_lat,journeys,passengers FROM covoiturage.journeys_monthly_flux_com
        WHERE year = '${request.query.year}' and month = '${request.query.month}'
        ORDER BY com1,com2;`
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
      const sql = `SELECT month,year FROM covoiturage.journeys_monthly_flux_com ORDER BY id DESC LIMIT 1;`
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
  
