import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import locationTypes from '../types/location.t'

export default class fluxHandler {
  
  static pg: FastifyInstance["pg"]  

  static async location(request: FastifyRequest<locationTypes.periode>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `
      SELECT journey_start_lon as lon, 
      journey_start_lat as lat 
      FROM rpc WHERE journey_start_date BETWEEN '${request.query.date_1}' AND '${request.query.date_2}'
      UNION ALL 
      SELECT journey_end_lon as lon, 
      journey_end_lat as lat 
      FROM rpc WHERE journey_start_date BETWEEN '${request.query.date_1}' AND '${request.query.date_2}';`
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
  

