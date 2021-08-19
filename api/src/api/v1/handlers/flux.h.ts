import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import fluxTypes from '../types/flux.t'

export default class fluxHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année en paramètres
  static async journeysMonthly(request: FastifyRequest<fluxTypes.monthly>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT a.territory_1, b.l_territory AS l_territory_1, st_x(b.geom) AS territory_1_lng, st_y(b.geom) AS territory_1_lat, a.territory_2, c.l_territory AS l_territory_2, st_x(c.geom) AS territory_2_lng, st_y(c.geom) AS territory_2_lat, journeys, passengers 
      FROM covoiturage.journeys_monthly_flux a
      LEFT JOIN perimeters.territories_points b on a.territory_1 = b.territory AND a.type = b.type AND a.year = b.year
      LEFT JOIN perimeters.territories_points c on a.territory_2 = c.territory AND a.type = c.type AND a.year = c.year
      WHERE a.year = '${request.query.year}' AND a.month = '${request.query.month}' AND a.type = '${request.query.t}' AND a.territory_1 <> a.territory_2
      ORDER BY a.territory_1,a.territory_2;`
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
      const sql = `SELECT month,year FROM covoiturage.journeys_monthly_flux ORDER BY id DESC LIMIT 1;`
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
  
