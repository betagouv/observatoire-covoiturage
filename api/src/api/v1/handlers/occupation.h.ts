import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import occupationTypes from '../types/occupation.t'

export default class occupationHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année en paramètres
  static async monthly(request: FastifyRequest<occupationTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT territory, l_territory, journeys, passengers, occupation_rate, ST_AsGeoJSON(geom,6)::json as geom 
      FROM covoiturage.journeys_monthly_occupation_rate_${request.query.type}
      WHERE year = '${request.query.year}' and month = '${request.query.month}';`
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
  
