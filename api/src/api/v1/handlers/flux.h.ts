import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import fluxTypes from '../types/flux.t'

export default class fluxHandler {
  
  static pg: FastifyInstance["pg"]  
   // Retourne les données de la vue matérialisée covoiturage.monthly_flux pour le mois et l'année en paramètres
  static async monthly(request: FastifyRequest<fluxTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT com1,l_com1,com1_lng,com1_lat,com2,l_com2,com2_lng,com2_lat,vehicles,passengers,reserved_seats FROM covoiturage.monthly_flux
        WHERE year = '${request.query.year}' and month = '${request.query.month}'
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
  // Retourne l'année et le mois du dernier enregistrement de la vue matérialisée covoiturage.monthly_flux
  static async lastRecordMonthly(request: FastifyRequest, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT month,year FROM covoiturage.monthly_flux ORDER BY id DESC LIMIT 1;`
      const {rows} = await client.query(sql)
      if (!rows) {
        throw reply.code(404).send(new Error('error'))
      }
      client.release()
      return reply.send(rows[0])
    } catch (err) {
      return reply.send(err)
    }
  }
}
  
