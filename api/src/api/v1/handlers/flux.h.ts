import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'

export default class fluxHandler {
  
  static pg: FastifyInstance["pg"]  
  
  static async monthly(request: FastifyRequest, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT com1,l_com1,com1_lng,com1_lat,com2,l_com2,com2_lng,com2_lat,vehicles,passengers,reserved_seats from covoiturage.monthly_flux
        WHERE year = '2021' and month = '03'
        ORDER BY com1,com2;`
      const {rows} = await client.query(sql)
      if (!rows) {
        throw reply.code(404).send(new Error('error'))
      }
      client.release()
      return reply.send(rows)
    } catch (err) {
      return reply.send(err)
    }
  }
}
  
