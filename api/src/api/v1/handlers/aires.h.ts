import { FastifyInstance,FastifyRequest, FastifyReply} from 'fastify'
import airesTypes from '../types/aires.t'

export default class airesHandler {
  
  static pg: FastifyInstance["pg"]  
  // Retourne les données de la vue matérialisée covoiturage.journeys_monthly_flux pour le mois et l'année en paramètres
  static async all(request: FastifyRequest<airesTypes.byTerritory>, reply: FastifyReply):Promise<void>{
    try {
      const client = await this.pg.connect()
      const sql = `SELECT id_lieu, 
        nom_lieu, 
        com_lieu, 
        type, 
        date_maj, 
        nbre_pl, 
        nbre_pmr, 
        duree, 
        horaires, 
        proprio, 
        lumiere, 
        comm, 
        ST_AsGeoJSON(geom,6)::json as geom
        FROM aires_covoiturage
        ${(request.query.t && request.query.code) ? 
          `WHERE
            insee IN (
              SELECT com FROM (
                SELECT com,epci,aom,dep,reg,country 
                FROM territories_code 
                GROUP BY year,com,epci,aom,dep,reg,country
                HAVING year = (SELECT max(year) FROM territories_code
              )
            ) t 
            WHERE ${request.query.t} = '${request.query.code}'
          )`
          : ''
        };`
      const {rows} = await client.query(sql)
      if (!rows || rows.length === 0) {
        reply.code(404).send(new Error('data not found'))
      }
      reply.send(rows)
      client.release()
    } catch (err) {
      reply.send(err)
    }
  }
}
  
