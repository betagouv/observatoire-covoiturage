import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import occupationTypes from '../types/occupation.t'

export default class occupationHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année en paramètres
  static async occupationMonthly(request: FastifyRequest<occupationTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT a.territory, b.l_territory, a.journeys, a.occupation_rate, ST_AsGeoJSON(b.geom,6)::json as geom 
      FROM covoiturage.journeys_monthly_occupation_rate a
      LEFT JOIN perimeters.territories_points b on a.territory = b.territory AND a.type = b.type AND a.year = b.year
      WHERE a.year = '${request.query.year}' AND a.month = '${request.query.month}' AND a.type = '${request.query.t}';`
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
  
