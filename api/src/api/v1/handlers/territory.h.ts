import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import territoryTypes from '../types/territory.t'

export default class territoryHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée perimeters.territories_points pour l'année en paramètres
  static async territoriesList(request: FastifyRequest<territoryTypes.list>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT territory, l_territory, type 
      FROM perimeters.territories_points
      WHERE year = '${request.query.year}'
      ORDER BY type,territory;`
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
  
