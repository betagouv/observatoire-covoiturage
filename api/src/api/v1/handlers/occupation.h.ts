import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import occupationTypes from '../types/occupation.t'

export default class occupationHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année en paramètres
  static async occupationMonthly(request: FastifyRequest<occupationTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT * FROM monthly_occupation
      WHERE year = '${request.query.year}' AND month = '${request.query.month}' AND type = '${request.query.t}';`
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
  
